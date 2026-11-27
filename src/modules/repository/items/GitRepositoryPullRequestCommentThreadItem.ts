import { Comment, GitPullRequestCommentThread } from "azure-devops-node-api/interfaces/GitInterfaces";
import { isDeepStrictEqual } from "node:util";
import { Subject } from "rxjs";
import { compareRefreshableItem } from "../../../common/items/RefreshableItem";
import { buildAccountUrl } from "../../core/account";
import { getThreadComments } from "../services/pullRequestComments";
import {
  compareGitRepositoryPullRequestContext,
  GitRepositoryPullRequestContext,
  GitRepositoryPullRequestItem,
  openInWebGetUrl as openPullRequestInWebGetUrl,
} from "./GitRepositoryPullRequestItem";

export function compareGitRepositoryPullRequestCommentThreadItem(
  a: GitRepositoryPullRequestCommentThreadItem,
  b: GitRepositoryPullRequestCommentThreadItem,
) {
  if (!compareGitRepositoryPullRequestContext(a, b) || !compareRefreshableItem(a, b)) {
    return false;
  }
  return (
    isDeepStrictEqual(a.commentThread, b.commentThread) &&
    a.userId === b.userId &&
    a.pullRequestWebUrl === b.pullRequestWebUrl
  );
}

export function getPullRequestWebUrl(data: GitRepositoryPullRequestItem) {
  const url = openPullRequestInWebGetUrl(data);
  if (url) {
    return url;
  }
  // lists of pull requests do not necessarily contain the web URL of the repository
  const path = [data.projectId, "_git", data.gitRepositoryId, "pullrequest", `${data.pullRequestId}`];
  return [buildAccountUrl(data.account), ...path.map(encodeURIComponent)].join("/");
}

export function openInWebGetUrl(data: GitRepositoryPullRequestCommentThreadItem) {
  return `${data.pullRequestWebUrl}?discussionId=${data.threadId}`;
}

export interface GitRepositoryPullRequestCommentThreadItem extends GitRepositoryPullRequestContext {
  readonly type: "gitRepositoryPullRequestCommentThread";
  threadId: number;
  commentThread: GitPullRequestCommentThread;
  firstComment: Comment;
  replies: readonly Comment[];
  /** ID of the signed-in user */
  userId: string;
  pullRequestWebUrl: string;
  isEqual(other: GitRepositoryPullRequestCommentThreadItem): boolean;
}

/**
 * @returns undefined, if the thread should not be displayed
 */
export function createGitRepositoryPullRequestCommentThreadItem(
  parent: GitRepositoryPullRequestItem,
  commentThread: GitPullRequestCommentThread,
  userId: string,
  refreshObservables: Record<string, Subject<number>>,
): GitRepositoryPullRequestCommentThreadItem | undefined {
  const comments = getThreadComments(commentThread);
  if (!comments) {
    return undefined;
  }
  return {
    type: "gitRepositoryPullRequestCommentThread",
    account: parent.account,
    container: parent.container,
    projectId: parent.projectId,
    gitRepositoryId: parent.gitRepositoryId,
    pullRequestId: parent.pullRequestId,
    refreshObservables,
    threadId: commentThread.id!,
    commentThread,
    firstComment: comments.firstComment,
    replies: comments.replies,
    userId,
    pullRequestWebUrl: getPullRequestWebUrl(parent),
    isEqual(other) {
      return compareGitRepositoryPullRequestCommentThreadItem(this, other);
    },
  };
}
