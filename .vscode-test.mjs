import { defineConfig } from "@vscode/test-cli";

export default defineConfig({
  files: "out/test/integration/**/*.test.js",
  workspaceFolder: ".",
  extensionDevelopmentPath: ".",
  launchArgs: ["--disable-extensions"],
});
