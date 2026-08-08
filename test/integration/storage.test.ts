import * as assert from "assert";
import * as vscode from "vscode";
import { firstValueFrom } from "rxjs";
import { getExtensionContainer, clearAccounts } from "./helpers";
import { createTestAccount } from "./mocks/MockData";
import { types } from "../../src/generated/types";
import { AbstractStorageService } from "../../src/common/storage/AbstractStorageService";

suite("Storage Service Integration Tests", () => {
  suiteSetup(async () => {
    // Activate extension before all tests in this suite
    const extension = vscode.extensions.getExtension("test-publisher.toolbox-azure-devops");
    if (extension && !extension.isActive) {
      await extension.activate();
    }
  });

  setup(async () => {
    const container = getExtensionContainer();
    // Clear any existing accounts from storage
    await clearAccounts(container);
  });

  teardown(() => {
    // Cleanup not needed for storage tests
  });

  test("should have empty accounts initially", async () => {
    const container = getExtensionContainer();
    const storageService = container.get<AbstractStorageService>(types.StorageService);

    const accounts = await firstValueFrom(storageService.getAccounts());

    assert.strictEqual(accounts.length, 0, "Expected no accounts");
  });

  test("should add account to storage", async () => {
    const container = getExtensionContainer();
    const storageService = container.get<AbstractStorageService>(types.StorageService);

    const account = createTestAccount();
    await storageService.addAccount(account);

    const accounts = await firstValueFrom(storageService.getAccounts());

    assert.strictEqual(accounts.length, 1, "Expected one account");
    assert.strictEqual(accounts[0].organization, account.organization);
  });

  test("should remove account from storage", async () => {
    const container = getExtensionContainer();
    const storageService = container.get<AbstractStorageService>(types.StorageService);

    const account = createTestAccount();
    await storageService.addAccount(account);
    await storageService.deleteAccount(account.accountId);

    const accounts = await firstValueFrom(storageService.getAccounts());

    assert.strictEqual(accounts.length, 0, "Expected no accounts after deletion");
  });

  test("should update account PAT", async () => {
    const container = getExtensionContainer();
    const storageService = container.get<AbstractStorageService>(types.StorageService);

    const account = createTestAccount();
    await storageService.addAccount(account);

    const newPat = "new-token-value";
    await storageService.updateAccountPersonalAccessToken(account.accountId, newPat);

    const accounts = await firstValueFrom(storageService.getAccounts());

    assert.strictEqual(accounts[0].personalAccessToken, newPat, "PAT should be updated");
  });
});
