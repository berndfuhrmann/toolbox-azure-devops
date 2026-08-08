# Automated Demo Recording

This directory contains infrastructure for automatically recording and generating demo animations of the VSCode extension's features.

## Overview

The demo system allows you to:

- **Record** extension features in action using automated test scenarios
- **Convert** recordings to optimized GIFs and WebM videos
- **Regenerate** demos automatically when the extension changes

This eliminates the need to manually record demos every time you update a feature.

## Quick Start

### Prerequisites

1. **Node.js dependencies** (already installed via pnpm):
   - `playwright` - for screen recording
   - `ffmpeg-static` - for video conversion
   - `gifski` (optional) - for high-quality GIF generation

2. **System dependencies**:
   - For best results, install [gifski](https://gif.ski/) globally:

     ```bash
     # Windows (via Scoop)
     scoop install gifski

     # macOS (via Homebrew)
     brew install gifski

     # Or use npm
     npm install -g gifski-cli
     ```

### Recording Demos

Run all demo scenarios and record them:

```bash
pnpm run demo:record
```

This will:

1. Compile the extension
2. Run all test files matching `Demo:` prefix
3. Record each demo to `demos/output/*.webm`

### Converting to GIF/WebM

Convert all recorded demos to optimized formats:

```bash
pnpm run demo:convert
```

Or convert a single file:

```bash
pnpm run demo:convert:single demos/output/new-user-setup.webm
```

### Generate Everything

Record and convert in one command:

```bash
pnpm run demo:generate
```

## Demo Scenarios

### Current Demos

1. **new-user-setup.demo.ts** - Shows:
   - Adding an Azure DevOps organization
   - Entering PAT credentials
   - Browsing the repository tree
   - Expanding projects and repositories

2. **pipeline-management.demo.ts** - Shows:
   - Opening the Pipelines view
   - Creating and renaming pipeline folders
   - Running a pipeline
   - Viewing pipeline runs
   - Pinning items

### Creating New Demos

1. Create a new file in `test/demo/` with `.demo.ts` extension
2. Use the structure:

```typescript
import { describe, test, beforeEach, afterEach } from "mocha";
import { DemoLogger, DemoTiming, DemoInteractions } from "./helpers";
import { SimpleRecorder } from "./demoRunner";

describe("Demo: Your Feature Name", () => {
  let recorder: SimpleRecorder | null = null;
  let logger: DemoLogger;
  const demoName = "your-feature-name";

  beforeEach(function () {
    if (!process.env.RECORD_DEMO) {
      this.skip();
    }
    logger = new DemoLogger();
  });

  afterEach(async () => {
    if (recorder) {
      await recorder.stop();
      recorder = null;
    }
  });

  test("should demonstrate your feature", async function () {
    this.timeout(120000);

    const outputPath = path.join(
      vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || process.cwd(),
      "demos",
      "output",
      `${demoName}.webm`,
    );

    recorder = new SimpleRecorder(outputPath);
    await recorder.start(1920, 1080);

    logger.step("Describe what happens here");
    await DemoTiming.sleep(DemoTiming.MEDIUM);

    // Your demo steps...

    logger.complete();
  });
});
```

## Utilities

### DemoTiming

Provides consistent timing for demo pacing:

```typescript
import { DemoTiming } from "./helpers";

await DemoTiming.sleep(DemoTiming.SHORT); // 500ms
await DemoTiming.sleep(DemoTiming.MEDIUM); // 1500ms
await DemoTiming.sleep(DemoTiming.LONG); // 3000ms
await DemoTiming.sleep(DemoTiming.EXTRA_LONG); // 5000ms
```

### DemoLogger

Tracks and logs demo progress:

```typescript
import { DemoLogger } from "./helpers";

const logger = new DemoLogger();
logger.step("Opening repository view");
logger.action("Clicking on organization");
logger.complete();
```

### DemoInteractions

Simulates user interactions with timing:

```typescript
import { DemoInteractions } from "./helpers";

await DemoInteractions.enterText("my-organization", 50); // 50ms per char
await DemoInteractions.click();
await DemoInteractions.executeCommand("toolbox-azure-devops-by-bf.refresh");
```

## Configuration

Edit [demo.config.json](./demo.config.json) to customize output:

```json
{
  "outputDir": "demos/output",
  "recording": {
    "width": 1920,
    "height": 1080,
    "fps": 30
  },
  "gif": {
    "width": 1200,
    "fps": 15,
    "quality": 90
  },
  "webm": {
    "crf": 30,
    "scale": 1.0
  }
}
```

### Configuration Options

- **recording.width/height**: Resolution for recording (default: 1920x1080)
- **recording.fps**: Frames per second during recording (default: 30)
- **gif.width**: Width of output GIF in pixels (height auto-calculated)
- **gif.fps**: Frame rate for GIF (lower = smaller file, default: 15)
- **gif.quality**: Quality 1-100 for gifski (default: 90)
- **webm.crf**: Constant Rate Factor 0-63 (lower = better quality, default: 30)
- **webm.scale**: Scale factor for WebM (0.5 = half size, 1.0 = original)

## Output Files

After running `pnpm run demo:generate`, you'll find in `demos/output/`:

```text
new-user-setup.webm              # Original recording
new-user-setup.gif               # Optimized GIF (for README)
new-user-setup-optimized.webm    # Optimized WebM (smaller)

pipeline-management.webm
pipeline-management.gif
pipeline-management-optimized.webm
```

## Using in README

Include the GIFs in your README:

```markdown
## Features

### Adding an Organization

![Add Organization Demo](demos/output/new-user-setup.gif)

### Managing Pipelines

![Pipeline Management](demos/output/pipeline-management.gif)
```

Or use HTML for more control:

```html
<img src="demos/output/new-user-setup.gif" width="800" alt="Add Organization Demo" />
```

## Troubleshooting

### Recording doesn't start

- Ensure Playwright is installed: `pnpm install`
- Check that the extension compiles: `pnpm run compile`

### GIF quality is poor

- Install `gifski` for better quality (see Prerequisites)
- Increase `gif.quality` in demo.config.json
- Reduce `gif.fps` to lower file size while maintaining quality

### Files are too large

- Reduce `gif.width` (try 800 or 1000 instead of 1200)
- Lower `gif.fps` (try 10 or 12 instead of 15)
- Increase `webm.crf` (higher = smaller file)
- Use `webm.scale` to reduce dimensions (try 0.75 or 0.5)

### Demo timing is off

Adjust timing constants in your demo files:

```typescript
await DemoTiming.sleep(2000); // Custom 2 second pause
```

## CI/CD Integration

To integrate with GitHub Actions or other CI/CD:

```yaml
- name: Generate demos
  run: pnpm run demo:generate

- name: Upload demo artifacts
  uses: actions/upload-artifact@v3
  with:
    name: demos
    path: demos/output/*.gif
```

## Notes

- Demos run in the context of VSCode integration tests
- The extension must be working correctly for demos to record properly
- Recording happens in a real VSCode window, so demos show actual functionality
- Keep demo scenarios focused (30-60 seconds each)
- Use consistent timing to make demos flow naturally
