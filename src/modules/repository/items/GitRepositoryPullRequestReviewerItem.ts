import { IdentityRefWithVote } from "azure-devops-node-api/interfaces/GitInterfaces";
import {
  compareGitRepositoryPullRequestContext,
  GitRepositoryPullRequestContext,
} from "./GitRepositoryPullRequestItem";
import { isDeepStrictEqual } from "node:util";

export function isGitRepositoryPullRequestReviewerItem(item: {
  type: string;
}): item is GitRepositoryPullRequestReviewerItem {
  return item.type === "gitRepositoryPullRequestReviewer";
}

export function compareGitRepositoryPullRequestReviewerItem(
  a: GitRepositoryPullRequestReviewerItem,
  b: GitRepositoryPullRequestReviewerItem,
) {
  if (!compareGitRepositoryPullRequestContext(a, b)) {
    return false;
  }
  return isDeepStrictEqual(a.identityRef, b.identityRef);
}

export interface GitRepositoryPullRequestReviewerItem extends GitRepositoryPullRequestContext {
  readonly type: "gitRepositoryPullRequestReviewer";
  identityRef: IdentityRefWithVote;
  isEqual(other: GitRepositoryPullRequestReviewerItem): boolean;
}

export function createGitRepositoryPullRequestReviewerItem(
  parent: GitRepositoryPullRequestContext,
  identityRef: IdentityRefWithVote,
): GitRepositoryPullRequestReviewerItem {
  return {
    type: "gitRepositoryPullRequestReviewer",
    account: parent.account,
    container: parent.container,
    projectId: parent.projectId,
    gitRepositoryId: parent.gitRepositoryId,
    pullRequestId: parent.pullRequestId,
    refreshObservables: parent.refreshObservables,
    identityRef,
    isEqual(other) {
      return compareGitRepositoryPullRequestReviewerItem(this, other);
    },
  };
}
