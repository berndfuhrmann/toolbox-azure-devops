import { AccountTreeItem } from "../../../../../src/modules/core/treeItems/AccountTreeItem";
import { createAccountItem } from "../../../../../src/modules/core/items/AccountItem";
import { Account } from "../../../../../src/modules/core/account";
import { Container } from "inversify";
import { TreeItemCollapsibleState, Uri } from "vscode";
import { IconService } from "../../../../../src/common/icons/IconService";
import type { SignInStatus } from "../../../../../src/modules/core/authentication/AuthenticationMethod";

const sampleAccount: Account = {
  accountId: "acc-123",
  url: "https://dev.azure.com/org",
  organization: "TestOrg",
  authentication: { type: "personalAccessToken" },
  secrets: { personalAccessToken: "token123" },
};

const createTestAccountItem = (status: SignInStatus = "signedIn") =>
  createAccountItem(sampleAccount, new Container(), status);

let subject: AccountTreeItem;

beforeEach(() => {
  subject = new AccountTreeItem();
  (subject as any).setIconService(new IconService(Uri.file("/test/extension")));
});

test("constructor sets defaults", () => {
  expect(subject.collapsibleState).toBe(TreeItemCollapsibleState.Collapsed);
  expect(subject.contextValue).toContain("account");
  expect(subject.iconPath).toBeDefined();
});

test("updateFrom sets label from account.organization", () => {
  const data = createTestAccountItem();
  subject.updateFrom(data);
  expect(subject.label).toBe("TestOrg");
});

test("updateFrom returns true if label changes", () => {
  const data = createTestAccountItem();
  // First call sets label
  subject.updateFrom(data);
  // Supply a new data object with a different organization
  const newData = createTestAccountItem();
  newData.account = { ...data.account, organization: "AnotherOrg" };
  const result = subject.updateFrom(newData);
  expect(result).toBeTruthy();
  expect(subject.label).toBe("AnotherOrg");
});

test("updateFrom returns false if nothing changes", () => {
  const data = createTestAccountItem();
  subject.updateFrom(data);
  const result = subject.updateFrom(data);
  expect(result).toBeFalsy();
});

test("shows signed-out accounts", () => {
  expect(subject.updateFrom(createTestAccountItem("signedOut"))).toBe(true);
  expect(subject.description).toBe("Signed out");
  expect(subject.contextValue).toContain(",signed-out,");
  expect(subject.collapsibleState).toBe(TreeItemCollapsibleState.None);
  expect(subject.command).toMatchObject({ command: expect.stringMatching(/\.signIn$/), arguments: [subject] });
});

test("removes the signed-out state after signing in", () => {
  subject.updateFrom(createTestAccountItem("signedOut"));

  expect(subject.updateFrom(createTestAccountItem("signedIn"))).toBe(true);
  expect(subject.description).toBeUndefined();
  expect(subject.contextValue).not.toContain(",signed-out,");
  expect(subject.collapsibleState).toBe(TreeItemCollapsibleState.Collapsed);
  expect(subject.command).toBeUndefined();
});
