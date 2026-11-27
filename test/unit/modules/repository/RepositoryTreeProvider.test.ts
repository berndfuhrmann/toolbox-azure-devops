import { CommentThreadStatus, GitPullRequestCommentThread } from "azure-devops-node-api/interfaces/GitInterfaces";
import { RepositoryTreeProvider } from "../../../../src/modules/repository/RepositoryTreeProvider";
import { createGitRepositoryPullRequestCommentItem } from "../../../../src/modules/repository/items/GitRepositoryPullRequestCommentItem";
import { GitRepositoryPullRequestCommentThreadTreeItem } from "../../../../src/modules/repository/treeItems/GitRepositoryPullRequestCommentThreadTreeItem";
import { GitRepositoryPullRequestCommentTreeItem } from "../../../../src/modules/repository/treeItems/GitRepositoryPullRequestCommentTreeItem";
import { GitRepositoryPullRequestReviewersTreeItem } from "../../../../src/modules/repository/treeItems/GitRepositoryPullRequestReviewersTreeItem";
import { WorkItemTreeItem } from "../../../../src/modules/workItem/treeItems/WorkItemTreeItem";
import { createCommentThreadItem } from "./createCommentThreadItem";

function sort(treeItems: any[]) {
  const provider = new RepositoryTreeProvider({} as any) as any;
  provider.sortTreeItems(treeItems, undefined);
  return treeItems;
}

function day(value: number) {
  return new Date(Date.UTC(2026, 10, value));
}

function createThread(thread: GitPullRequestCommentThread) {
  const treeItem = new GitRepositoryPullRequestCommentThreadTreeItem();
  treeItem.updateFrom(createCommentThreadItem(thread));
  return treeItem;
}

test("sorts comment threads: below other items, open ones first, then by the latest comment", () => {
  const { Active, Fixed, Pending } = CommentThreadStatus;
  const reviewers = new GitRepositoryPullRequestReviewersTreeItem();
  reviewers.data = {} as any;
  const workItem = new WorkItemTreeItem();
  workItem.data = {} as any;
  const resolvedNew = createThread({ id: 1, status: Fixed, comments: [{ id: 1, publishedDate: day(20) }] });
  const resolvedOld = createThread({ id: 2, status: Fixed, comments: [{ id: 1, publishedDate: day(2) }] });
  const open = createThread({ id: 3, status: Active, comments: [{ id: 1, publishedDate: day(5) }] });
  const openWithNewReply = createThread({
    id: 4,
    status: Pending,
    comments: [
      { id: 1, publishedDate: day(1) },
      { id: 2, publishedDate: day(10) },
    ],
  });
  expect(sort([resolvedOld, open, resolvedNew, workItem, openWithNewReply, reviewers])).toEqual([
    reviewers,
    workItem,
    openWithNewReply,
    open,
    resolvedNew,
    resolvedOld,
  ]);
});

test("sorts replies: oldest first", () => {
  const thread = createCommentThreadItem({ comments: [{ id: 1 }] });
  const [first, second] = [day(1), day(2)].map((publishedDate, id) => {
    const treeItem = new GitRepositoryPullRequestCommentTreeItem();
    treeItem.updateFrom(createGitRepositoryPullRequestCommentItem(thread, { id, publishedDate }));
    return treeItem;
  });
  expect(sort([second, first])).toEqual([first, second]);
});
