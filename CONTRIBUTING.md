# Development Guide

This guide is for developers working on this VS Code Azure DevOps extension. For user-facing docs, see `README.md`.

## Prerequisites

- `Node.js` 24+
- `pnpm` 10+
- `Visual Studio Code` compatible with extension engine `^1.107.0`

For code generation only:

- `Java JDK` 11+
- `Maven` 3.9+

Optional for recording a demo:

- `Hyper-V` (for Windows)
- `Vagrant`
- `gifski` on `PATH` (fallback to ffmpeg palette mode if missing)

## Getting Started

```bash
pnpm install
```

Bootstrap generated artifacts and `dist/` metadata once (or whenever generation/templates change):

```bash
pnpm run vscode:prepare
```

Run the extension in development mode:

1. Open the workspace in VS Code.
2. Press `F5` (`Run Extension` launch configuration).
3. A new Extension Development Host window opens with the built extension from `dist/`.

## Project Structure

```text
src/                 Extension source
src/generated/       Generated TypeScript (do not edit manually)
src-gen/             Epsilon model/templates + Maven generator
test/unit/           Vitest unit tests
test/integration/    vscode-test integration tests
test/demo/           Playwright demo recording scripts
demos/output/        Demo artifacts
resources/           Icons and static resources
```

## Development Workflow

### Build and reload

- `F5` starts the extension host and runs the default watch tasks (`watch:tsc` + `watch:esbuild`).
- After source changes, reload the dev host with `Developer: Restart Extension Host`.
- If you changed contribution points in `package.json` (commands, menus, views), restart the extension host session.

### Formatting and linting

- Format all supported files: `pnpm run fix`
- Format PowerShell only: `pnpm run format:ps1`
- Lint source: `pnpm run lint`
- Type-check extension and integration test projects: `pnpm run check-types`

If `PSScriptAnalyzer` is missing, install once:

```powershell
Install-Module -Name PSScriptAnalyzer -Scope CurrentUser
```

### Build outputs

- Production JS bundle only: `pnpm run package`
- Build `.vsix` package into `build/`: `pnpm run vscode:package`

## Testing

### Unit tests (Vitest)

- Run once: `pnpm test`
- Watch mode (direct vitest): `pnpm exec vitest`
- Coverage (direct vitest): `pnpm exec vitest --coverage`

Notes:

- Unit tests live in `test/unit/`.
- Use `test()` instead of `it()`.

### Integration tests (vscode-test)

- Run integration tests: `pnpm run inttest`

Examples are in:

- `test/integration/extension.test.ts`
- `test/integration/storage.test.ts`

## Demo Recording

Demo automation lives in `test/demo/` and artifacts are written to `demos/output/`.

### Commands

- Record demos: `pnpm run demo:record`
- Record specific demos: `pnpm run demo:record add-organization`
- Convert all recordings: `pnpm run demo:convert`
- Convert one recording: `pnpm run demo:convert:single demos/output/add-organization.webm`
- Record + convert: `pnpm run demo:generate`
- Clean artifacts: `pnpm run demo:clean`

### Creating a new demo

1. Add `test/demo/<name>.demo.ts`.
2. Implement the scenario using `runDemoSession(...)` from `test/demo/demoRunner.ts`.
3. Add `<name>` to `allDemos` in `test/demo/recordDemos.ts` so `demo:record` includes it.
4. Compile and run:

```bash
pnpm run compile
pnpm run compile-tests
node out/test/demo/<name>.demo.js
```

### Config

Demo conversion config is read from `test/demo/demo.config.json`.

## Code Generation

Generated files in `src/generated/` are produced from `src-gen/` and should not be edited manually.

- Run generator: `pnpm run src-gen`
- Main model: `src-gen/model.flexmi`
- Meta-model: `src-gen/meta-model.emf`
- Templates: `src-gen/*.egl`
- Helper operations: `src-gen/*.eol`

After generation, implement feature-specific logic in `src/modules/`.

## Debugging

### Extension runtime

1. Set breakpoints in `src/`.
2. Press `F5` (`Run Extension`).
3. Reproduce behavior in the Extension Development Host.

### Tests

- Unit tests: run `pnpm exec vitest` in a JavaScript Debug Terminal.
- Integration tests: run `pnpm run inttest` and debug failing test paths in `test/integration/`.

### Demo scripts

```bash
pnpm run compile-tests
node --inspect-brk out/test/demo/add-organization.demo.js
```

Then attach VS Code's Node debugger to the process.

## Common Issues

### Demo shows VS Code but no extension behavior

Ensure extension and test outputs are built before recording:

```bash
pnpm run compile
pnpm run compile-tests
```

### `pnpm run src-gen` fails

Check toolchain availability:

- `java -version`
- `mvn -version`

### Unit tests fail on `vscode` imports

Unit tests should mock VS Code APIs. Use `vscode-test` only in integration tests.

## Resources

- [VS Code Extension API](https://code.visualstudio.com/api)
- [Azure DevOps REST API](https://learn.microsoft.com/en-us/rest/api/azure/devops/)
- [Playwright](https://playwright.dev/)
- [Vitest](https://vitest.dev/)
- [Eclipse Epsilon](https://www.eclipse.org/epsilon/)
