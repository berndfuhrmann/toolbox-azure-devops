import { Comment } from "azure-devops-node-api/interfaces/GitInterfaces";
import { isDeepStrictEqual } from "node:util";
import { compareRefreshableItem } from "../../../common/items/RefreshableItem";
import { GitRepositoryPullRequestCommentThreadItem } from "./GitRepositoryPullRequestCommentThreadItem";
import {
  compareGitRepositoryPullRequestContext,
  GitRepositoryPullRequestContext,
} from "./GitRepositoryPullRequestItem";

export function compareGitRepositoryPullRequestCommentItem(
  a: GitRepositoryPullRequestCommentItem,
  b: GitRepositoryPullRequestCommentItem,
) {
  if (!compareGitRepositoryPullRequestContext(a, b) || !compareRefreshableItem(a, b)) {
    return false;
  }
  return (
    a.threadId === b.threadId &&
    isDeepStrictEqual(a.comment, b.comment) &&
    a.userId === b.userId &&
    a.pullRequestWebUrl === b.pullRequestWebUrl
  );
}

export function openInWebGetUrl(data: GitRepositoryPullRequestCommentItem) {
  return `${data.pullRequestWebUrl}?discussionId=${data.threadId}`;
}

export interface GitRepositoryPullRequestCommentItem extends GitRepositoryPullRequestContext {
  readonly type: "gitRepositoryPullRequestComment";
  threadId: number;
  comment: Comment;
  /** ID of the signed-in user */
  userId: string;
  pullRequestWebUrl: string;
  isEqual(other: GitRepositoryPullRequestCommentItem): boolean;
}

export function createGitRepositoryPullRequestCommentItem(
  parent: GitRepositoryPullRequestCommentThreadItem,
  comment: Comment,
): GitRepositoryPullRequestCommentItem {
  return {
    type: "gitRepositoryPullRequestComment",
    account: parent.account,
    container: parent.container,
    projectId: parent.projectId,
    gitRepositoryId: parent.gitRepositoryId,
    pullRequestId: parent.pullRequestId,
    refreshObservables: parent.refreshObservables,
    threadId: parent.threadId,
    comment,
    userId: parent.userId,
    pullRequestWebUrl: parent.pullRequestWebUrl,
    isEqual(other) {
      return compareGitRepositoryPullRequestCommentItem(this, other);
    },
  };
}
