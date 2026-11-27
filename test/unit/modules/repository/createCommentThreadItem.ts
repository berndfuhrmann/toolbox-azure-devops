import type { GitPullRequestCommentThread } from "azure-devops-node-api/interfaces/GitInterfaces";
import { Container } from "inversify";
import { Subject } from "rxjs";
import { createGitRepositoryPullRequestCommentThreadItem } from "../../../../src/modules/repository/items/GitRepositoryPullRequestCommentThreadItem";
import { createGitRepositoryPullRequestItem } from "../../../../src/modules/repository/items/GitRepositoryPullRequestItem";

export function createPullRequestItem(container = new Container(), webUrl?: string) {
  return createGitRepositoryPullRequestItem(
    {
      account: {
        accountId: "account-1",
        url: "https://dev.azure.com",
        organization: "org",
        authentication: { type: "personalAccessToken" },
        secrets: { personalAccessToken: "pat" },
      },
      container,
      projectId: "project-1",
      gitRepositoryId: "repository-1",
      refreshObservables: {},
    },
    { pullRequestId: 7, repository: { webUrl } },
    {},
  );
}

export function createCommentThreadItem(
  thread: GitPullRequestCommentThread,
  refreshObservables: Record<string, Subject<number>> = {},
) {
  return createGitRepositoryPullRequestCommentThreadItem(
    createPullRequestItem(),
    { id: 5, ...thread },
    "me",
    refreshObservables,
  )!;
}
