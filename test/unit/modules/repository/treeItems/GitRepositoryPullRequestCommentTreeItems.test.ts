import { CommentThreadStatus } from "azure-devops-node-api/interfaces/GitInterfaces";
import { TreeItemCollapsibleState } from "vscode";
import { formatDateTime } from "../../../../../src/common/date/dateFormat";
import { getStatus } from "../../../../../src/common/fileDecorator/StatusFileDecorationProvider";
import {
  createGitRepositoryPullRequestCommentItem,
  openInWebGetUrl as openCommentInWebGetUrl,
} from "../../../../../src/modules/repository/items/GitRepositoryPullRequestCommentItem";
import {
  getPullRequestWebUrl,
  openInWebGetUrl,
} from "../../../../../src/modules/repository/items/GitRepositoryPullRequestCommentThreadItem";
import { GitRepositoryPullRequestCommentThreadTreeItem } from "../../../../../src/modules/repository/treeItems/GitRepositoryPullRequestCommentThreadTreeItem";
import { GitRepositoryPullRequestCommentTreeItem } from "../../../../../src/modules/repository/treeItems/GitRepositoryPullRequestCommentTreeItem";
import { createCommentThreadItem, createPullRequestItem } from "../createCommentThreadItem";

const publishedDate = new Date("2026-11-25T14:05:00Z");
const firstComment = { id: 1, content: "secret", author: { displayName: "Alex" }, publishedDate };
const usersLiked = [
  { id: "me", displayName: "Me" },
  { id: "other", displayName: "Sam" },
];

describe("GitRepositoryPullRequestCommentThreadTreeItem", () => {
  test("shows a minimal thread", () => {
    const treeItem = new GitRepositoryPullRequestCommentThreadTreeItem();
    treeItem.updateFrom(createCommentThreadItem({ comments: [firstComment] }));
    expect(treeItem.label).toBe(`Alex - ${formatDateTime(publishedDate)}`);
    expect(treeItem.description).toBeUndefined();
    expect(treeItem.tooltip).toBeUndefined();
    expect(treeItem.collapsibleState).toBe(TreeItemCollapsibleState.None);
    expect(treeItem.hasTag("gitRepository.pullRequest.likeableComment")).toBe(true);
    expect(treeItem.hasTag("inWeb")).toBe(false);
  });

  test("shows all details, but not the comment", () => {
    const treeItem = new GitRepositoryPullRequestCommentThreadTreeItem();
    treeItem.updateFrom(
      createCommentThreadItem({
        status: CommentThreadStatus.WontFix,
        threadContext: { filePath: "/src/main.ts", rightFileStart: { line: 12 } },
        comments: [{ ...firstComment, usersLiked }, { id: 2 }],
      }),
    );
    expect(treeItem.description).toBe("main.ts:12 · 1 reply · 👍 2");
    expect(treeItem.tooltip).toBe("Won't Fix\n/src/main.ts:12\nLiked by Me, Sam");
    expect(treeItem.collapsibleState).toBe(TreeItemCollapsibleState.Collapsed);
    expect(treeItem.hasTag("gitRepository.pullRequest.likedComment")).toBe(true);
  });

  test("updates tags and collapsible state", () => {
    const treeItem = new GitRepositoryPullRequestCommentThreadTreeItem();
    treeItem.updateFrom(createCommentThreadItem({ comments: [{ ...firstComment, usersLiked }, { id: 2 }, { id: 3 }] }));
    expect(treeItem.description).toBe("2 replies · 👍 2");
    expect(treeItem.updateFrom(createCommentThreadItem({ comments: [firstComment] }))).toBe(true);
    expect(treeItem.collapsibleState).toBe(TreeItemCollapsibleState.None);
    expect(treeItem.hasTag("gitRepository.pullRequest.likedComment")).toBe(false);
    expect(treeItem.hasTag("gitRepository.pullRequest.likeableComment")).toBe(true);
  });

  test.each([
    [undefined, ""],
    [CommentThreadStatus.Active, ""],
    [CommentThreadStatus.Pending, "⏳"],
    [CommentThreadStatus.Fixed, "✅"],
    [CommentThreadStatus.Closed, "✅"],
    [CommentThreadStatus.WontFix, "🚫"],
    [CommentThreadStatus.ByDesign, "🚫"],
  ])("badge of status %s: %s", (status, badge) => {
    const treeItem = new GitRepositoryPullRequestCommentThreadTreeItem();
    treeItem.updateFrom(createCommentThreadItem({ status, comments: [firstComment] }));
    expect(treeItem[getStatus]()).toBe(badge);
  });
});

test("GitRepositoryPullRequestCommentTreeItem", () => {
  const treeItem = new GitRepositoryPullRequestCommentTreeItem();
  const thread = createCommentThreadItem({ comments: [firstComment] });
  const item = createGitRepositoryPullRequestCommentItem(thread, { ...firstComment, usersLiked });
  treeItem.updateFrom(item);
  expect(treeItem.label).toBe(`Alex - ${formatDateTime(publishedDate)}`);
  expect(treeItem.description).toBe("👍 2");
  expect(treeItem.tooltip).toBe("Liked by Me, Sam");
  expect(treeItem.updateFrom(item)).toBe(false);
  expect(treeItem.updateFrom(createGitRepositoryPullRequestCommentItem(thread, firstComment))).toBe(true);
});

describe("web URLs", () => {
  test("link to the thread, even if the web URL of the repository is unknown", () => {
    const thread = createCommentThreadItem({ comments: [firstComment] });
    const expected = "https://dev.azure.com/org/project-1/_git/repository-1/pullrequest/7?discussionId=5";
    expect(openInWebGetUrl(thread)).toBe(expected);
    expect(openCommentInWebGetUrl(createGitRepositoryPullRequestCommentItem(thread, firstComment))).toBe(expected);
  });

  test("use the web URL of the repository", () => {
    expect(getPullRequestWebUrl(createPullRequestItem(undefined, "https://server/repository"))).toBe(
      "https://server/repository/pullrequest/7",
    );
  });
});
