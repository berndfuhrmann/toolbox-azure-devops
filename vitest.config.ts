import { resolve } from "path";
import { defineConfig } from "vitest/config";
export default defineConfig({
  test: {
    globals: true,
    alias: {
      vscode: resolve(__dirname, "test/unit/mocks/vscode.cjs"),
    },
    include: ["test/unit/**/*test.ts", "test/component/**/*test.ts"],
  },
});
