import { Container } from "inversify";
import { BehaviorSubject, firstValueFrom, skip } from "rxjs";
import { Account } from "../../../../../src/modules/core/account";
import { AccountContextProvider } from "../../../../../src/modules/core/AccountContextProvider";
import {
  AuthenticationMethod,
  SignInStatus,
} from "../../../../../src/modules/core/authentication/AuthenticationMethod";
import { AuthenticationMethodRegistry } from "../../../../../src/modules/core/authentication/AuthenticationMethodRegistry";
import { AccountItem } from "../../../../../src/modules/core/items/AccountItem";
import { AccountTreeItem } from "../../../../../src/modules/core/treeItems/AccountTreeItem";
import { AccountTreePartProvider } from "../../../../../src/modules/core/treePartProviders/AccountTreePartProvider";
import { MemoryStorageService } from "../../../helper/MemoryStorageService";

const account: Account = {
  accountId: "acc-123",
  url: "https://dev.azure.com/",
  organization: "TestOrg",
  authentication: { type: "personalAccessToken" },
};

let storageService: MemoryStorageService;
let status: BehaviorSubject<SignInStatus>;
let subject: AccountTreePartProvider;

beforeEach(() => {
  storageService = new MemoryStorageService();
  status = new BehaviorSubject<SignInStatus>("signedIn");
  const method = { type: "personalAccessToken", signInStatus: () => status } as unknown as AuthenticationMethod;
  const container = new Container();
  const accountContextProvider = { getAccountContainer: () => container } as unknown as AccountContextProvider;
  subject = new AccountTreePartProvider(
    storageService,
    accountContextProvider,
    AccountTreeItem,
    new AuthenticationMethodRegistry([method]),
  );
});

test("emits without accounts", async () => {
  const information = await firstValueFrom(subject.getItems(undefined as any));
  expect(information.changes.added.size).toBe(0);
});

test("updates the account item when the sign-in status changes", async () => {
  await storageService.addAccount(account);
  const items = subject.getItems(undefined as any);
  const firstItem = firstValueFrom(items);
  const secondItem = firstValueFrom(items.pipe(skip(1)));

  expect(((await firstItem).changes.added.get("acc-123") as AccountItem).signInStatus).toBe("signedIn");
  status.next("signedOut");
  const changes = (await secondItem).changes;
  expect((changes.added.get("acc-123") as AccountItem).signInStatus).toBe("signedOut");
  expect(changes.removed.has("acc-123")).toBe(true);
});
