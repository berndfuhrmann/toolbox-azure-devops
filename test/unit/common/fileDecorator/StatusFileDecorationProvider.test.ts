import * as vscode from "vscode";
import {
  StatusFileDecorationProvider,
  getStatus,
  StatusProvider,
} from "../../../../src/common/fileDecorator/StatusFileDecorationProvider";
import { TreeItemRegistry } from "../../../../src/common/TreeItemRegistry";
import { GitRepositoryPullRequestTreeItem } from "../../../../src/modules/repository/treeItems/GitRepositoryPullRequestTreeItem";
import { createGitRepositoryPullRequestItem } from "../../../../src/modules/repository/items/GitRepositoryPullRequestItem";
import { GitRepositoryContext } from "../../../../src/modules/repository/items/GitRepositoryItem";
import { AbstractTreeItem } from "../../../../src/common/treeItems/AbstractTreeItem";
import { extensionUrlScheme } from "../../../../src/config";

// Helper to create a mock pull request item with status
function createPullRequestTreeItem(statuses: any[]): GitRepositoryPullRequestTreeItem {
  const data = createGitRepositoryPullRequestItem(
    { gitRepositoryId: "repo-id" } as GitRepositoryContext,
    { isDraft: false, title: "Test PR", pullRequestId: 1 },
    {},
  );
  data.pullRequestStatusses = statuses;
  const item = new GitRepositoryPullRequestTreeItem();
  item.updateFrom(data);
  return item;
}

let registry: TreeItemRegistry<AbstractTreeItem<any>>;
let provider: StatusFileDecorationProvider;

beforeEach(() => {
  registry = new TreeItemRegistry<AbstractTreeItem<any>>();
  provider = new StatusFileDecorationProvider(registry);
});

test("returns badge for PR TreeItem with status", async () => {
  const statuses = [{ state: 2 }]; // 2 = Succeeded
  const treeItem = createPullRequestTreeItem(statuses);
  registry.register(treeItem);
  const uri = treeItem.resourceUri!;
  const result = await provider.provideFileDecoration(uri, {} as any);
  expect(result).toBeTruthy();
  expect(result!.badge).toBe((treeItem as StatusProvider)[getStatus]());
});

test("returns undefined if getById returns undefined", () => {
  const uri = vscode.Uri.parse(extensionUrlScheme + ":missing");
  const result = provider.provideFileDecoration(uri, {} as any);
  expect(result).toBeUndefined();
});

test("fires onDidChangeFileDecorations event when notifyChange is called", () => {
  const statuses = [{ state: 2 }];
  const treeItem = createPullRequestTreeItem(statuses);
  registry.register(treeItem);
  const uri = treeItem.resourceUri!;
  // Ensure the provider registers its listener for this item
  provider.provideFileDecoration(uri, {} as any);
  let firedUri: vscode.Uri | undefined;
  provider.onDidChangeFileDecorations?.((u) => (firedUri = u as vscode.Uri));
  // This should trigger the event
  registry.notifyChange(treeItem);
  expect(firedUri).toEqual(uri);
});

test("returns badge for different PR status states", async () => {
  const treeItem = createPullRequestTreeItem([{ state: 0 }]);
  registry.register(treeItem);
  const uri = treeItem.resourceUri!;
  const result = await provider.provideFileDecoration(uri, {} as any);
  expect(result!.badge).toBeDefined();
});
