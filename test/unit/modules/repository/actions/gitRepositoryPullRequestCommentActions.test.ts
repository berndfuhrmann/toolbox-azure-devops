import { CommentThreadStatus } from "azure-devops-node-api/interfaces/GitInterfaces";
import { Container } from "inversify";
import { of, Subject } from "rxjs";
import vscode, { TreeItem } from "vscode";
import { createException } from "../../../../../src/common/Exception";
import { types } from "../../../../../src/generated/types";
import {
  gitRepositoryPullRequestCommentLikeAction,
  gitRepositoryPullRequestCommentRemoveLikeAction,
  gitRepositoryPullRequestCommentThreadSetStatusAction,
} from "../../../../../src/modules/repository/actions/gitRepositoryPullRequestCommentActions";
import { createGitRepositoryPullRequestCommentItem } from "../../../../../src/modules/repository/items/GitRepositoryPullRequestCommentItem";
import { GitRepositoryPullRequestCommentThreadTreeItem } from "../../../../../src/modules/repository/treeItems/GitRepositoryPullRequestCommentThreadTreeItem";
import { GitRepositoryPullRequestCommentTreeItem } from "../../../../../src/modules/repository/treeItems/GitRepositoryPullRequestCommentTreeItem";
import { createCommentThreadItem } from "../createCommentThreadItem";

const gitApi = { updateThread: vi.fn(), createLike: vi.fn(), deleteLike: vi.fn() };
const gitApiObservable = vi.fn();
const refreshed = vi.fn();
let container: Container;
let showQuickPick: ReturnType<typeof vi.fn>;
let showErrorMessage: ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.resetAllMocks();
  gitApiObservable.mockReturnValue(of(gitApi));
  showQuickPick = vi.fn();
  showErrorMessage = vi.fn();
  vscode.window.showQuickPick = showQuickPick as any;
  vscode.window.showErrorMessage = showErrorMessage as any;
  const accountContainer = new Container();
  accountContainer.bind(types.ApiService).toConstantValue({ gitApi: gitApiObservable });
  container = new Container();
  container.bind(types.AccountContextProvider).toConstantValue({ getAccountContainer: () => accountContainer });
});

function createThreadTreeItem(isDeleted = false) {
  const refreshObservable = new Subject<number>();
  refreshObservable.subscribe(refreshed);
  const treeItem = new GitRepositoryPullRequestCommentThreadTreeItem();
  treeItem.updateFrom(
    createCommentThreadItem(
      { status: CommentThreadStatus.Active, comments: [{ id: 1, isDeleted }, { id: 2 }] },
      { threads: refreshObservable },
    ),
  );
  return treeItem;
}

function createReplyTreeItem() {
  const thread = createThreadTreeItem().data;
  const treeItem = new GitRepositoryPullRequestCommentTreeItem();
  treeItem.updateFrom(createGitRepositoryPullRequestCommentItem(thread, thread.replies[0]));
  return treeItem;
}

describe("set status", () => {
  test("offers all statuses and updates the thread", async () => {
    showQuickPick.mockImplementation(async (items: any[]) => items.find(({ label }) => label === "Fixed"));
    await gitRepositoryPullRequestCommentThreadSetStatusAction(container)(createThreadTreeItem());
    const items = showQuickPick.mock.calls[0][0];
    expect(items.map(({ label }: any) => label)).toEqual([
      "Active",
      "Pending",
      "Fixed",
      "Won't Fix",
      "Closed",
      "By Design",
    ]);
    expect(items.filter(({ description }: any) => description === "Current")).toEqual([items[0]]);
    expect(gitApi.updateThread).toHaveBeenCalledWith(
      { status: CommentThreadStatus.Fixed },
      "repository-1",
      7,
      5,
      "project-1",
    );
    expect(refreshed).toHaveBeenCalledOnce();
  });

  test.each([undefined, { status: CommentThreadStatus.Active }])("does nothing when choosing %s", async (choice) => {
    showQuickPick.mockResolvedValue(choice);
    await gitRepositoryPullRequestCommentThreadSetStatusAction(container)(createThreadTreeItem());
    expect(gitApi.updateThread).not.toHaveBeenCalled();
    expect(refreshed).not.toHaveBeenCalled();
  });

  test("shows errors", async () => {
    showQuickPick.mockResolvedValue({ status: CommentThreadStatus.Fixed });
    gitApi.updateThread.mockRejectedValue(new Error("not allowed"));
    await gitRepositoryPullRequestCommentThreadSetStatusAction(container)(createThreadTreeItem());
    expect(showErrorMessage).toHaveBeenCalledWith("Failed to set comment status: not allowed");
    expect(refreshed).not.toHaveBeenCalled();
  });

  test("ignores other tree items", async () => {
    await gitRepositoryPullRequestCommentThreadSetStatusAction(container)(createReplyTreeItem());
    expect(showQuickPick).not.toHaveBeenCalled();
  });
});

describe.each([
  ["createLike", gitRepositoryPullRequestCommentLikeAction, "Failed to like comment"],
  ["deleteLike", gitRepositoryPullRequestCommentRemoveLikeAction, "Failed to remove like"],
] as const)("%s", (method, action, errorMessage) => {
  test("applies to the first comment of a thread", async () => {
    await action(container)(createThreadTreeItem());
    expect(gitApi[method]).toHaveBeenCalledWith("repository-1", 7, 5, 1, "project-1");
    expect(refreshed).toHaveBeenCalledOnce();
  });

  test("applies to a reply", async () => {
    await action(container)(createReplyTreeItem());
    expect(gitApi[method]).toHaveBeenCalledWith("repository-1", 7, 5, 2, "project-1");
    expect(refreshed).toHaveBeenCalledOnce();
  });

  test("ignores deleted comments and other tree items", async () => {
    await action(container)(createThreadTreeItem(true));
    await action(container)(new TreeItem("other"));
    expect(gitApi[method]).not.toHaveBeenCalled();
  });

  test("shows errors", async () => {
    gitApi[method].mockRejectedValue(new Error("offline"));
    await action(container)(createThreadTreeItem());
    gitApiObservable.mockReturnValue(of(createException(new Error("signed out"))));
    await action(container)(createThreadTreeItem());
    expect(showErrorMessage.mock.calls).toEqual([[`${errorMessage}: offline`], [`${errorMessage}: signed out`]]);
    expect(refreshed).not.toHaveBeenCalled();
  });
});
