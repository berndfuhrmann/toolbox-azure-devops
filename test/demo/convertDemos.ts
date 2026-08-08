#!/usr/bin/env node

/**
 * Convert demo recordings to optimized GIFs and WebM files
 *
 * Usage:
 *   node out/test/demo/convertDemos.js [input-file]
 *   node out/test/demo/convertDemos.js --all
 */

import { spawn, type ChildProcess } from "child_process";
import * as fs from "fs";
import * as path from "path";

// Load configuration
const configPath = path.join(process.cwd(), "test", "demo", "demo.config.json");
const userConfig = JSON.parse(fs.readFileSync(configPath, "utf-8"));
const config = {
  outputDir: userConfig.outputDir,
  gifWidth: userConfig.gif.width,
  gifFps: userConfig.gif.fps,
  gifQuality: userConfig.gif.quality,
  webmCrf: userConfig.webm.crf,
  webmScale: userConfig.webm.scale,
};

/**
 * Run a command and return a promise
 */
function runCommand(command: string, args: string[], options: Record<string, any> = {}): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log(`Running: ${command} ${args.join(" ")}`);
    const proc: ChildProcess = spawn(command, args, {
      stdio: "inherit",
      ...options,
    });

    proc.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    proc.on("error", (err) => {
      reject(err);
    });
  });
}

/**
 * Check if ffmpeg is available
 */
async function checkFfmpeg(): Promise<string> {
  try {
    // Try to use ffmpeg-static first
    const ffmpegModule = await import("ffmpeg-static");
    const ffmpegPath = ffmpegModule.default;
    if (typeof ffmpegPath === "string" && fs.existsSync(ffmpegPath)) {
      return ffmpegPath;
    }
  } catch (err) {
    // ffmpeg-static not available
  }

  // Fall back to system ffmpeg
  return "ffmpeg";
}

/**
 * Convert video to optimized GIF using ffmpeg and gifski
 */
async function convertToGif(inputPath: string, outputPath: string): Promise<void> {
  const ffmpeg = await checkFfmpeg();
  const tempPngDir = path.join(path.dirname(outputPath), "temp-frames");

  try {
    // Create temp directory for frames
    if (!fs.existsSync(tempPngDir)) {
      fs.mkdirSync(tempPngDir, { recursive: true });
    }

    console.log(`\nConverting ${path.basename(inputPath)} to GIF...`);

    // Step 1: Extract frames with ffmpeg
    console.log("  Extracting frames...");
    await runCommand(ffmpeg, [
      "-i",
      inputPath,
      "-vf",
      `fps=${config.gifFps},scale=${config.gifWidth}:-1:flags=lanczos`,
      "-pix_fmt",
      "rgba",
      path.join(tempPngDir, "frame-%04d.png"),
    ]);

    // Step 2: Check if gifski is available
    let useGifski = true;
    try {
      await runCommand("gifski", ["--version"]);
    } catch (err) {
      console.warn("  gifski not found, falling back to ffmpeg palette method");
      useGifski = false;
    }

    if (useGifski) {
      // Use gifski for higher quality
      console.log("  Creating GIF with gifski...");
      await runCommand("gifski", [
        "-o",
        outputPath,
        "--fps",
        config.gifFps.toString(),
        "--quality",
        config.gifQuality.toString(),
        path.join(tempPngDir, "frame-*.png"),
      ]);
    } else {
      // Fall back to ffmpeg palette method
      console.log("  Creating GIF with ffmpeg...");
      const palettePath = path.join(tempPngDir, "palette.png");

      // Generate palette
      await runCommand(ffmpeg, [
        "-i",
        inputPath,
        "-vf",
        `fps=${config.gifFps},scale=${config.gifWidth}:-1:flags=lanczos,palettegen=stats_mode=diff`,
        "-y",
        palettePath,
      ]);

      // Create GIF using palette
      await runCommand(ffmpeg, [
        "-i",
        inputPath,
        "-i",
        palettePath,
        "-lavfi",
        `fps=${config.gifFps},scale=${config.gifWidth}:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle`,
        "-y",
        outputPath,
      ]);
    }

    const sizeKB = (fs.statSync(outputPath).size / 1024).toFixed(2);
    console.log(`  ✓ GIF created: ${path.basename(outputPath)} (${sizeKB} KB)`);
  } finally {
    // Clean up temp frames
    if (fs.existsSync(tempPngDir)) {
      fs.rmSync(tempPngDir, { recursive: true, force: true });
    }
  }
}

/**
 * Convert video to optimized WebM
 */
async function convertToWebM(inputPath: string, outputPath: string): Promise<void> {
  const ffmpeg = await checkFfmpeg();

  console.log(`\nOptimizing ${path.basename(inputPath)} to WebM...`);

  const scaleFilter =
    config.webmScale !== 1.0 ? `scale=iw*${config.webmScale}:ih*${config.webmScale}:flags=lanczos` : null;

  const args = ["-i", inputPath, "-c:v", "libvpx-vp9", "-crf", config.webmCrf.toString(), "-b:v", "0", "-row-mt", "1"];

  if (scaleFilter) {
    args.push("-vf", scaleFilter);
  }

  args.push("-y", outputPath);

  await runCommand(ffmpeg, args);

  const sizeKB = (fs.statSync(outputPath).size / 1024).toFixed(2);
  console.log(`  ✓ WebM created: ${path.basename(outputPath)} (${sizeKB} KB)`);
}

/**
 * Process a single demo file
 */
async function processDemo(inputPath: string): Promise<boolean> {
  const basename = path.basename(inputPath, path.extname(inputPath));
  const outputDir = path.dirname(inputPath);

  const gifPath = path.join(outputDir, `${basename}.gif`);
  const webmPath = path.join(outputDir, `${basename}-optimized.webm`);

  try {
    await convertToGif(inputPath, gifPath);
    await convertToWebM(inputPath, webmPath);

    console.log(`\n✓ Successfully processed: ${basename}`);
    return true;
  } catch (err) {
    console.error(`\n✗ Failed to process ${basename}:`, (err as Error).message);
    return false;
  }
}

/**
 * Main function
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === "--help") {
    console.log("Usage:");
    console.log("  node out/test/demo/convertDemos.js [input-file]  # Convert specific file");
    console.log("  node out/test/demo/convertDemos.js --all          # Convert all .webm files in docs/demos");
    process.exit(0);
  }

  const workspaceRoot = process.cwd();
  const outputDir = path.join(workspaceRoot, config.outputDir);

  if (args[0] === "--all") {
    // Process all .webm files
    if (!fs.existsSync(outputDir)) {
      console.error(`Output directory not found: ${outputDir}`);
      process.exit(1);
    }

    const files = fs
      .readdirSync(outputDir)
      .filter((f) => f.endsWith(".webm") && !f.includes("-optimized"))
      .map((f) => path.join(outputDir, f));

    if (files.length === 0) {
      console.log("No demo recordings found to convert.");
      process.exit(0);
    }

    console.log(`Found ${files.length} demo(s) to convert:\n`);
    files.forEach((f) => console.log(`  - ${path.basename(f)}`));
    console.log("");

    let successCount = 0;
    for (const file of files) {
      if (await processDemo(file)) {
        successCount++;
      }
    }

    console.log(`\n\nConversion complete: ${successCount}/${files.length} successful`);
  } else {
    // Process single file
    const inputPath = path.resolve(args[0]);

    if (!fs.existsSync(inputPath)) {
      console.error(`File not found: ${inputPath}`);
      process.exit(1);
    }

    await processDemo(inputPath);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
