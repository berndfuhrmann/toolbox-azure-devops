import { Container } from "inversify";
import { firstValueFrom, of } from "rxjs";
import vscode from "vscode";
import { AbstractStorageService } from "../../../../../src/common/storage/AbstractStorageService";
import { types } from "../../../../../src/generated/types";
import { Account } from "../../../../../src/modules/core/account";
import { changeSignInMethodAction } from "../../../../../src/modules/core/actions/changeSignInMethodAction";
import { AuthenticationMethod } from "../../../../../src/modules/core/authentication/AuthenticationMethod";
import { AuthenticationMethodRegistry } from "../../../../../src/modules/core/authentication/AuthenticationMethodRegistry";
import { PersonalAccessTokenAuthenticationMethod } from "../../../../../src/modules/core/authentication/PersonalAccessTokenAuthenticationMethod";
import { createAccountItem } from "../../../../../src/modules/core/items/AccountItem";
import { AccountTreeItem } from "../../../../../src/modules/core/treeItems/AccountTreeItem";
import { createTestContainer } from "../../../helper/testContainer";

const createAccount = (accountId: string, url = "https://dev.azure.com/"): Account => ({
  accountId,
  url,
  organization: "org-" + accountId,
  authentication: { type: "personalAccessToken" },
  secrets: { personalAccessToken: "old-pat" },
});

const microsoftAuthentication = {
  type: "microsoft" as const,
  microsoftAccountId: "microsoft-account",
  microsoftAccountLabel: "user@example.com",
};

const microsoftMethod: AuthenticationMethod = {
  type: "microsoft",
  label: "Microsoft Account",
  isAvailableFor: (url) => url.startsWith("https://dev.azure.com"),
  isSuggestedFor: (url) => url.startsWith("https://dev.azure.com"),
  configure: vi.fn(),
  updateCredentials: vi.fn(),
  createRequestHandler: vi.fn(),
  signInStatus: () => of("signedIn"),
};

let container: Container;
let storageService: AbstractStorageService;

beforeEach(() => {
  vi.clearAllMocks();
  container = createTestContainer();
  container
    .rebindSync(types.AuthenticationMethodRegistry)
    .toConstantValue(
      new AuthenticationMethodRegistry([new PersonalAccessTokenAuthenticationMethod(), microsoftMethod]),
    );
  storageService = container.get<AbstractStorageService>(types.StorageService);
});

const getAccounts = () => firstValueFrom(storageService.getAccounts());

function createAccountTreeItem(account: Account) {
  const treeItem = new AccountTreeItem();
  (treeItem as any).data = createAccountItem(account, container, "signedIn");
  return treeItem;
}

const pickMethod = (label: string) =>
  vi
    .mocked(vscode.window.showQuickPick)
    .mockImplementation(async (items: any) => (await items).find((item: any) => item.label === label));

test("switches to the picked method and deletes the secrets of the previous one", async () => {
  const account = createAccount("1");
  await storageService.addAccount(account);
  pickMethod("Microsoft Account");
  vi.mocked(microsoftMethod.configure).mockResolvedValue({ authentication: microsoftAuthentication });

  await changeSignInMethodAction(container)(createAccountTreeItem(account));

  expect(microsoftMethod.configure).toHaveBeenCalledWith("https://dev.azure.com/", "org-1");
  const [stored] = await getAccounts();
  expect(stored.authentication).toEqual(microsoftAuthentication);
  expect(stored.secrets).toBeUndefined();
});

test("switches from Microsoft to a personal access token", async () => {
  const account: Account = { ...createAccount("1"), authentication: microsoftAuthentication, secrets: undefined };
  await storageService.addAccount(account);
  pickMethod("Personal Access Token (PAT)");
  vi.mocked(vscode.window.showInputBox).mockResolvedValue("new-pat");

  await changeSignInMethodAction(container)(createAccountTreeItem(account));

  const [stored] = await getAccounts();
  expect(stored.authentication).toEqual({ type: "personalAccessToken" });
  expect(stored.secrets).toEqual({ personalAccessToken: "new-pat" });
});

test("marks the current and the suggested method in the picker", async () => {
  const account = createAccount("1");
  await storageService.addAccount(account);
  vi.mocked(vscode.window.showQuickPick).mockResolvedValue(undefined);

  await changeSignInMethodAction(container)(createAccountTreeItem(account));

  const items = vi.mocked(vscode.window.showQuickPick).mock.calls[0][0] as vscode.QuickPickItem[];
  expect(items.map((item) => [item.label, item.description])).toEqual([
    ["Microsoft Account", "suggested"],
    ["Personal Access Token (PAT)", "current"],
  ]);
});

test("keeps the account if the method picker is cancelled", async () => {
  const account = createAccount("1");
  await storageService.addAccount(account);
  vi.mocked(vscode.window.showQuickPick).mockResolvedValue(undefined);

  await changeSignInMethodAction(container)(createAccountTreeItem(account));

  expect(microsoftMethod.configure).not.toHaveBeenCalled();
  expect(await getAccounts()).toEqual([expect.objectContaining({ secrets: { personalAccessToken: "old-pat" } })]);
});

test("keeps the account if the steps of the method are cancelled", async () => {
  const account = createAccount("1");
  await storageService.addAccount(account);
  pickMethod("Microsoft Account");
  vi.mocked(microsoftMethod.configure).mockResolvedValue(undefined);

  await changeSignInMethodAction(container)(createAccountTreeItem(account));

  expect(await getAccounts()).toEqual([
    expect.objectContaining({
      authentication: { type: "personalAccessToken" },
      secrets: { personalAccessToken: "old-pat" },
    }),
  ]);
});

test("skips the picker if only one method is available for the URL", async () => {
  const account = createAccount("1", "https://tfs.example.com/tfs/");
  await storageService.addAccount(account);
  vi.mocked(vscode.window.showInputBox).mockResolvedValue("new-pat");

  await changeSignInMethodAction(container)(createAccountTreeItem(account));

  expect(vscode.window.showQuickPick).not.toHaveBeenCalled();
  expect(await getAccounts()).toEqual([expect.objectContaining({ secrets: { personalAccessToken: "new-pat" } })]);
});

test("does nothing without an account", async () => {
  await changeSignInMethodAction(container)(undefined);

  expect(vscode.window.showQuickPick).not.toHaveBeenCalled();
});
