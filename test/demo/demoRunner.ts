import * as path from "path";
import * as fs from "fs";
import { spawnSync } from "child_process";
import { _electron as electron, type ElectronApplication, type Page } from "playwright";
import { DemoLogger, DemoTiming } from "./helpers";

const DemoConfigPath = path.join(process.cwd(), "test", "demo", "demo.config.json");

/**
 * Default VSCode settings applied to every demo session to suppress popups and distractions.
 */
export const DefaultDemoSettings: Record<string, unknown> = {
  "workbench.startupEditor": "none",
  "workbench.welcomePage.walkthroughs.openOnInstall": false,
  "extensions.ignoreRecommendations": true,
  "workbench.secondarySideBar.defaultVisibility": "hidden",
  "security.workspace.trust.banner": "never",
  "security.workspace.trust.emptyWindow": true,
  "security.workspace.trust.startupPrompt": "never",
  "github.accounts.guest": true,
  "workbench.welcomePage.experimentalOnboarding": false,
};

/**
 * Click the Azure DevOps activity bar icon, trying multiple selectors as fallback.
 */
export async function clickAzureDevOpsIcon(window: Page, logger: DemoLogger): Promise<void> {
  const onboardingOverlay = window.locator('div[role="dialog"].onboarding-a-overlay');
  if (
    await onboardingOverlay
      .first()
      .isVisible({ timeout: 1500 })
      .catch(() => false)
  ) {
    logger.step("Dismiss onboarding overlay");
    await window.keyboard.press("Escape");
    await DemoTiming.sleep(DemoTiming.SHORT);
  }

  try {
    await window.click('[aria-label*="Azure"]', { timeout: 10000 });
  } catch {
    await window.keyboard.press("Escape");
    await DemoTiming.sleep(DemoTiming.SHORT);
    await window.click('[aria-label*="Azure"]', { timeout: 10000 });
  }

  logger.step("Clicked Azure DevOps icon by aria-label");
}

/**
 * Controls exposed to demo scenarios.
 */
export interface DemoSessionControls {
  /**
   * Mark this moment as the intended beginning of the final video.
   * Setup footage before this mark will be trimmed from the output if ffmpeg is available.
   */
  markRecordingStart(): void;
}

/**
 * Run a demo scenario: handles recorder lifecycle, VSCode startup wait, and window retrieval.
 * The scenario callback receives the Playwright Page, DemoLogger, and session controls.
 */
export async function runDemoSession(
  demoName: string,
  scenario: (window: Page, logger: DemoLogger, controls: DemoSessionControls) => Promise<void>,
  options: { width?: number; height?: number; settings?: Record<string, unknown> } = {},
): Promise<void> {
  const { width = 1400, height = 860, settings = DefaultDemoSettings } = options;
  const outputPath = path.join(process.cwd(), "demos", "output", `${demoName}.webm`);
  const logger = new DemoLogger();
  const recorder = new SimpleRecorder(outputPath);
  let recordingStartTimeMs = 0;
  let trimStartSeconds = 0;

  try {
    logger.step("Starting VSCode and recording");
    await recorder.start(width, height, settings);
    recordingStartTimeMs = Date.now();

    logger.step("Waiting for VSCode to load");
    await DemoTiming.sleep(DemoTiming.EXTRA_LONG);

    const window = await recorder.getWindow();
    logger.step("Got VSCode window reference");
    await DemoTiming.sleep(DemoTiming.MEDIUM);

    const controls: DemoSessionControls = {
      markRecordingStart: () => {
        trimStartSeconds = Math.max(0, (Date.now() - recordingStartTimeMs) / 1000);
        logger.action(`Marked recording start at +${trimStartSeconds.toFixed(2)}s`);
      },
    };

    await scenario(window, logger, controls);
  } finally {
    await recorder.stop(trimStartSeconds);
  }
}

/**
 * Configuration for demo recording
 */
export interface DemoConfig {
  /** Output directory for recordings */
  outputDir: string;
  /** Width of recording window */
  width: number;
  /** Height of recording window */
  height: number;
  /** Frames per second */
  fps: number;
  /** Demo name (used for output filename) */
  name: string;
}

interface DemoGifConfig {
  width: number;
  fps: number;
}

/**
 * Playwright-based VSCode recorder
 * Launches VSCode via Electron and records the window
 */
export class SimpleRecorder {
  private electronApp: ElectronApplication | null = null;
  private outputPath: string;
  private vscodeExecutable: string;
  private userDataDir: string | null = null;

  constructor(outputPath: string) {
    this.outputPath = outputPath;

    // Detect VSCode executable path
    this.vscodeExecutable = this.getVSCodePath();
  }

  private getVSCodePath(): string {
    const platform = process.platform;

    if (platform === "win32") {
      // Windows - try common locations
      const possiblePaths = [
        process.env.VSCODE_CLI_PATH,
        "C:\\Program Files\\Microsoft VS Code\\Code.exe",
        "C:\\Program Files (x86)\\Microsoft VS Code\\Code.exe",
        path.join(process.env.LOCALAPPDATA || "", "Programs", "Microsoft VS Code", "Code.exe"),
      ];

      for (const p of possiblePaths) {
        if (p && fs.existsSync(p)) {
          return p;
        }
      }
    } else if (platform === "darwin") {
      // macOS
      return "/Applications/Visual Studio Code.app/Contents/MacOS/Electron";
    } else {
      // Linux
      return "/usr/share/code/code";
    }

    throw new Error("VSCode executable not found. Set VSCODE_CLI_PATH environment variable.");
  }

  async start(width: number, height: number, settings: Record<string, unknown>) {
    const outputDir = path.dirname(this.outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const extraArgs: string[] = [];

    if (Object.keys(settings).length > 0) {
      this.userDataDir = path.join(outputDir, `.vscode-demo-userdata-${Date.now()}`);
      const userSettingsDir = path.join(this.userDataDir, "User");
      fs.mkdirSync(userSettingsDir, { recursive: true });
      fs.writeFileSync(path.join(userSettingsDir, "settings.json"), JSON.stringify(settings, null, 2));
      extraArgs.push("--user-data-dir=" + this.userDataDir);
    }

    console.log("Launching VSCode with Playwright Electron...");
    console.log(`VSCode path: ${this.vscodeExecutable}`);

    // Extension development path is dist/, so this folder must already contain a valid
    // extension manifest and bundle produced by the build/package process.
    const distDir = path.join(process.cwd(), "dist");
    const distPackagePath = path.join(distDir, "package.json");
    if (!fs.existsSync(distPackagePath)) {
      throw new Error("Missing dist/package.json. Run the extension build/package step before recording demos.");
    }

    const distExtensionPath = path.join(distDir, "extension.js");
    if (!fs.existsSync(distExtensionPath)) {
      throw new Error("Missing dist/extension.js. Run the extension build step before recording demos.");
    }

    // Launch VSCode as Electron app with video recording
    this.electronApp = await electron.launch({
      executablePath: this.vscodeExecutable,
      args: [
        "--extensionDevelopmentPath=" + distDir,
        process.cwd(), // Open workspace
        ...extraArgs,
      ],
      recordVideo: {
        dir: outputDir,
        size: { width, height },
      },
    });

    console.log("VSCode launched and recording started...");

    // Wait for the main window to exist before resizing
    await this.electronApp.firstWindow();

    // Resize the BrowserWindow to match the desired recording dimensions
    await this.electronApp.evaluate(
      ({ BrowserWindow }, [w, h]) => {
        const win = BrowserWindow.getFocusedWindow() ?? BrowserWindow.getAllWindows()[0];
        if (win) {
          win.setSize(w, h);
          win.center();
        }
      },
      [width, height],
    );

    // Wait for VSCode to be ready
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }

  async stop(trimStartSeconds: number = 0): Promise<void> {
    if (!this.electronApp) {
      return;
    }

    console.log("Stopping recording and closing VSCode...");

    // Close VSCode - this will save the recording
    await this.electronApp.close();

    // Find the recorded video and rename it
    const outputDir = path.dirname(this.outputPath);
    const files = fs
      .readdirSync(outputDir)
      .filter((f) => f.endsWith(".webm"))
      .sort((a, b) => {
        const statA = fs.statSync(path.join(outputDir, a));
        const statB = fs.statSync(path.join(outputDir, b));
        return statB.mtimeMs - statA.mtimeMs; // Most recent first
      });

    if (files.length > 0) {
      const latestVideo = path.join(outputDir, files[0]);
      if (latestVideo !== this.outputPath) {
        fs.renameSync(latestVideo, this.outputPath);
      }

      this.createGif(trimStartSeconds);

      console.log(`Recording saved: ${this.outputPath}`);
    } else {
      console.warn("No video file found after recording");
    }

    this.electronApp = null;

    if (this.userDataDir && fs.existsSync(this.userDataDir)) {
      fs.rmSync(this.userDataDir, { recursive: true, force: true });
      this.userDataDir = null;
    }
  }

  /**
   * Get the first VSCode window for automation
   */
  async getWindow(): Promise<Page> {
    if (!this.electronApp) {
      throw new Error("VSCode not launched. Call start() first.");
    }

    return await this.electronApp.firstWindow();
  }

  private loadGifConfig(): DemoGifConfig {
    const defaultConfig: DemoGifConfig = { width: 1200, fps: 15 };
    if (!fs.existsSync(DemoConfigPath)) {
      return defaultConfig;
    }

    try {
      const config = JSON.parse(fs.readFileSync(DemoConfigPath, "utf-8"));
      const width = Number(config?.gif?.width);
      const fps = Number(config?.gif?.fps);
      return {
        width: Number.isFinite(width) && width > 0 ? width : defaultConfig.width,
        fps: Number.isFinite(fps) && fps > 0 ? fps : defaultConfig.fps,
      };
    } catch {
      return defaultConfig;
    }
  }

  private createGif(trimStartSeconds: number): void {
    const ffmpegCheck = spawnSync("ffmpeg", ["-version"], { stdio: "ignore" });
    if (ffmpegCheck.status !== 0) {
      console.warn("ffmpeg not found. Skipping GIF creation.");
      return;
    }

    const gifConfig = this.loadGifConfig();
    const gifOutputPath = this.outputPath.replace(/\.webm$/i, ".gif");
    const filterComplex =
      `fps=${gifConfig.fps},scale=${gifConfig.width}:-1:flags=lanczos,` +
      "split[s0][s1];[s0]palettegen=stats_mode=diff[p];" +
      "[s1][p]paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle";

    const args = ["-y", "-i", this.outputPath];
    if (trimStartSeconds > 0.05) {
      args.push("-ss", trimStartSeconds.toFixed(3));
    }
    args.push("-filter_complex", filterComplex, "-loop", "0", gifOutputPath);

    const gifResult = spawnSync("ffmpeg", args, { stdio: "pipe" });

    if (gifResult.status !== 0 || !fs.existsSync(gifOutputPath)) {
      console.warn("GIF creation failed.");
      return;
    }

    console.log(`GIF saved: ${gifOutputPath}`);
  }
}
