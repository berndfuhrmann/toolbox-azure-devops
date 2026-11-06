import { Container } from "inversify";
import { firstValueFrom } from "rxjs";
import vscode from "vscode";
import { AbstractStorageService } from "../../../../../src/common/storage/AbstractStorageService";
import { types } from "../../../../../src/generated/types";
import { Account } from "../../../../../src/modules/core/account";
import { signInAction, updateCredentialsAction } from "../../../../../src/modules/core/actions/updateCredentialsAction";
import { createAccountItem } from "../../../../../src/modules/core/items/AccountItem";
import { AccountTreeItem } from "../../../../../src/modules/core/treeItems/AccountTreeItem";
import { ExceptionTreeItem } from "../../../../../src/common/treeItems/ExceptionTreeItem";
import { createTestContainer } from "../../../helper/testContainer";

const createAccount = (accountId: string): Account => ({
  accountId,
  url: "https://dev.azure.com/",
  organization: "org-" + accountId,
  authentication: { type: "personalAccessToken" },
  secrets: { personalAccessToken: "old-pat" },
});

let container: Container;
let storageService: AbstractStorageService;

beforeEach(async () => {
  vi.clearAllMocks();
  container = createTestContainer();
  storageService = container.get<AbstractStorageService>(types.StorageService);
  await storageService.addAccount(createAccount("1"));
});

const getSecrets = async () => (await firstValueFrom(storageService.getAccounts())).map((account) => account.secrets);

function createAccountTreeItem(account: Account) {
  const treeItem = new AccountTreeItem();
  (treeItem as any).data = createAccountItem(account, container, "signedIn");
  return treeItem;
}

test("updates the credentials of the account of the tree item", async () => {
  await storageService.addAccount(createAccount("2"));
  vi.mocked(vscode.window.showInputBox).mockResolvedValue("new-pat");

  await updateCredentialsAction(container)(createAccountTreeItem(createAccount("2")));

  expect(await getSecrets()).toEqual([{ personalAccessToken: "old-pat" }, { personalAccessToken: "new-pat" }]);
});

test("keeps the credentials if the user cancels", async () => {
  vi.mocked(vscode.window.showInputBox).mockResolvedValue(undefined);

  await updateCredentialsAction(container)(createAccountTreeItem(createAccount("1")));

  expect(await getSecrets()).toEqual([{ personalAccessToken: "old-pat" }]);
});

test("uses the single account for items that do not know their account", async () => {
  vi.mocked(vscode.window.showInputBox).mockResolvedValue("new-pat");

  await updateCredentialsAction(container)(new ExceptionTreeItem());

  expect(vscode.window.showQuickPick).not.toHaveBeenCalled();
  expect(await getSecrets()).toEqual([{ personalAccessToken: "new-pat" }]);
});

test("asks for the account if there are several and the item does not know its account", async () => {
  const second = createAccount("2");
  await storageService.addAccount(second);
  vi.mocked(vscode.window.showQuickPick).mockImplementation(async (items: any) => (await items)[1]);
  vi.mocked(vscode.window.showInputBox).mockResolvedValue("new-pat");

  await updateCredentialsAction(container)(undefined);

  expect(await getSecrets()).toEqual([{ personalAccessToken: "old-pat" }, { personalAccessToken: "new-pat" }]);
});

test("does nothing if the account picker is cancelled", async () => {
  await storageService.addAccount(createAccount("2"));
  vi.mocked(vscode.window.showQuickPick).mockResolvedValue(undefined);

  await updateCredentialsAction(container)(undefined);

  expect(vscode.window.showInputBox).not.toHaveBeenCalled();
});

test("signs in to the account of the tree item", async () => {
  await storageService.addAccount(createAccount("2"));
  vi.mocked(vscode.window.showInputBox).mockResolvedValue("new-pat");
  const treeItem = new AccountTreeItem();
  (treeItem as any).data = createAccountItem(createAccount("2"), container, "signedOut");

  await signInAction(container)(treeItem);

  expect(vscode.window.showQuickPick).not.toHaveBeenCalled();
  expect(await getSecrets()).toEqual([{ personalAccessToken: "old-pat" }, { personalAccessToken: "new-pat" }]);
});
