import { resolve } from "path";
import { defineConfig } from "vitest/config";
export default defineConfig({
  test: {
    alias: {
      vscode: resolve(__dirname, "test/unit/mocks/vscode.cjs"),
    },
    include: ["test/unit/**/*test.ts"],
  },
});
