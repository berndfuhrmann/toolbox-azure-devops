import * as assert from "assert";
import * as vscode from "vscode";

suite("Extension Integration Tests", () => {
  suiteSetup(async () => {
    // Ensure extension is activated before running tests
    const extension = vscode.extensions.getExtension("test-publisher.toolbox-azure-devops");
    if (!extension) {
      throw new Error("Extension not found");
    }
    if (!extension.isActive) {
      await extension.activate();
    }
    vscode.window.showInformationMessage("Extension activated for integration tests");
  });

  test("Extension should be present", () => {
    assert.ok(vscode.extensions.getExtension("test-publisher.toolbox-azure-devops"));
  });

  test("Extension should activate", async () => {
    const extension = vscode.extensions.getExtension("test-publisher.toolbox-azure-devops");
    const activated = extension?.isActive;
    assert.strictEqual(activated, true);

    // Debug: check what container exports
    const container = extension?.exports;
    console.log("Container type:", typeof container);
    console.log("Container has get method:", typeof container?.get === "function");
  });
});
