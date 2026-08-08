import { GitPullRequestCommentThread } from "azure-devops-node-api/interfaces/GitInterfaces";
import {
  compareGitRepositoryPullRequestContext,
  GitRepositoryPullRequestContext,
} from "./GitRepositoryPullRequestItem";
import { isDeepStrictEqual } from "node:util";

export function isGitRepositoryPullRequestCommentThreadItem(item: {
  type: string;
}): item is GitRepositoryPullRequestCommentThreadItem {
  return item.type === "gitRepositoryPullRequestCommentThread";
}

export function compareGitRepositoryPullRequestCommentThreadItem(
  a: GitRepositoryPullRequestCommentThreadItem,
  b: GitRepositoryPullRequestCommentThreadItem,
) {
  if (!compareGitRepositoryPullRequestContext(a, b)) {
    return false;
  }
  return isDeepStrictEqual(a.commentThread, b.commentThread);
}

export interface GitRepositoryPullRequestCommentThreadItem extends GitRepositoryPullRequestContext {
  readonly type: "gitRepositoryPullRequestCommentThread";
  commentThread: GitPullRequestCommentThread;
  isEqual(other: GitRepositoryPullRequestCommentThreadItem): boolean;
}

export function createGitRepositoryPullRequestCommentThreadItem(
  parent: GitRepositoryPullRequestContext,
  commentThread: GitPullRequestCommentThread,
): GitRepositoryPullRequestCommentThreadItem {
  return {
    type: "gitRepositoryPullRequestCommentThread",
    account: parent.account,
    container: parent.container,
    projectId: parent.projectId,
    gitRepositoryId: parent.gitRepositoryId,
    pullRequestId: parent.pullRequestId,
    refreshObservables: parent.refreshObservables,
    commentThread,
    isEqual(other) {
      return compareGitRepositoryPullRequestCommentThreadItem(this, other);
    },
  };
}
