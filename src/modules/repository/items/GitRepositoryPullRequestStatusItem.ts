import { GitStatus } from "azure-devops-node-api/interfaces/GitInterfaces";
import {
  compareGitRepositoryPullRequestContext,
  GitRepositoryPullRequestContext,
} from "./GitRepositoryPullRequestItem";
import { isDeepStrictEqual } from "node:util";

export function isGitRepositoryPullRequestStatusItem(item: {
  type: string;
}): item is GitRepositoryPullRequestStatusItem {
  return item.type === "gitRepositoryPullRequestStatus";
}

export function compareGitRepositoryPullRequestStatusItem(
  a: GitRepositoryPullRequestStatusItem,
  b: GitRepositoryPullRequestStatusItem,
) {
  if (!compareGitRepositoryPullRequestContext(a, b)) {
    return false;
  }
  return isDeepStrictEqual(a.status, b.status);
}

export interface GitRepositoryPullRequestStatusItem extends GitRepositoryPullRequestContext {
  readonly type: "gitRepositoryPullRequestStatus";
  status: GitStatus;
  isEqual(other: GitRepositoryPullRequestStatusItem): boolean;
}

export function createGitRepositoryPullRequestStatusItem(
  parent: GitRepositoryPullRequestContext,
  status: GitStatus,
): GitRepositoryPullRequestStatusItem {
  return {
    type: "gitRepositoryPullRequestStatus",
    account: parent.account,
    container: parent.container,
    projectId: parent.projectId,
    gitRepositoryId: parent.gitRepositoryId,
    pullRequestId: parent.pullRequestId,
    refreshObservables: parent.refreshObservables,
    status,
    isEqual(other) {
      return compareGitRepositoryPullRequestStatusItem(this, other);
    },
  };
}
