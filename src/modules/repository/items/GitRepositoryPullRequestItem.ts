import { GitPullRequest, GitPullRequestStatus } from "azure-devops-node-api/interfaces/GitInterfaces";
import { isDeepStrictEqual } from "node:util";
import { Subject } from "rxjs";
import { compareGitRepositoryContext, GitRepositoryContext } from "./GitRepositoryItem";

export function isGitRepositoryPullRequestItem(item: { type: string }): item is GitRepositoryPullRequestItem {
  return item.type === "gitRepositoryPullRequest";
}

export function compareGitRepositoryPullRequestContext(
  a: GitRepositoryPullRequestContext,
  b: GitRepositoryPullRequestContext,
) {
  if (!compareGitRepositoryContext(a, b)) {
    return false;
  }
  return a.pullRequestId === b.pullRequestId;
}

export function compareGitRepositoryPullRequestItem(a: GitRepositoryPullRequestItem, b: GitRepositoryPullRequestItem) {
  if (!compareGitRepositoryContext(a, b)) {
    return false;
  }
  return (
    isDeepStrictEqual(a.pullRequest, b.pullRequest) && isDeepStrictEqual(a.pullRequestStatusses, b.pullRequestStatusses)
  );
}

export function openInWebGetUrl(data: GitRepositoryPullRequestItem) {
  const repositoryWebUrl = data.pullRequest.repository?.webUrl;
  const pullRequestId = data.pullRequest.pullRequestId;
  if (repositoryWebUrl && pullRequestId) {
    return `${repositoryWebUrl}/pullrequest/${data.pullRequest.pullRequestId}`;
  } else {
    return undefined;
  }
}

export interface GitRepositoryPullRequestContext extends GitRepositoryContext {
  pullRequestId: number;
}

export interface GitRepositoryPullRequestItem extends GitRepositoryPullRequestContext {
  readonly type: "gitRepositoryPullRequest";
  pullRequest: GitPullRequest;
  pullRequestStatusses: GitPullRequestStatus[] | undefined;
  isEqual(other: GitRepositoryPullRequestItem): boolean;
}

export function createGitRepositoryPullRequestItem(
  parent: GitRepositoryContext,
  pullRequest: GitPullRequest,
  refreshObservables: Record<string, Subject<number>>,
): GitRepositoryPullRequestItem {
  return {
    type: "gitRepositoryPullRequest",
    account: parent.account,
    container: parent.container,
    projectId: parent.projectId,
    gitRepositoryId: parent.gitRepositoryId,
    pullRequestId: pullRequest.pullRequestId!,
    refreshObservables,
    pullRequest,
    pullRequestStatusses: undefined,
    isEqual(other) {
      return compareGitRepositoryPullRequestItem(this, other);
    },
  };
}

export function updateGitRepositoryPullRequestItemStatusses(
  item: GitRepositoryPullRequestItem,
  pullRequestStatusses: GitPullRequestStatus[] | undefined,
  refreshObservables: Record<string, Subject<number>>,
): GitRepositoryPullRequestItem {
  return {
    type: "gitRepositoryPullRequest",
    account: item.account,
    container: item.container,
    projectId: item.projectId,
    gitRepositoryId: item.gitRepositoryId,
    pullRequestId: item.pullRequestId,
    pullRequest: item.pullRequest,
    refreshObservables,
    pullRequestStatusses,
    isEqual(other) {
      return compareGitRepositoryPullRequestItem(this, other);
    },
  };
}
