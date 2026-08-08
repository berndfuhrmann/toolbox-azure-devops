import type * as GitInterfaces from "azure-devops-node-api/interfaces/GitInterfaces";
import type * as CoreInterfaces from "azure-devops-node-api/interfaces/CoreInterfaces";
import type * as PipelinesInterfaces from "azure-devops-node-api/interfaces/PipelinesInterfaces";

// Sample data for testing
export const sampleGitRepositories: GitInterfaces.GitRepository[] = [
  {
    id: "repo-1",
    name: "sample-repo-1",
    url: "https://dev.azure.com/org/project/_git/sample-repo-1",
    webUrl: "https://dev.azure.com/org/project/_git/sample-repo-1",
    project: {
      id: "project-1",
      name: "Sample Project",
      url: "https://dev.azure.com/org/_apis/projects/project-1",
      state: 1,
      revision: 1,
      visibility: 1,
      lastUpdateTime: new Date("2024-01-01T00:00:00Z"),
    },
    defaultBranch: "refs/heads/main",
    size: 1024,
    remoteUrl: "https://dev.azure.com/org/project/_git/sample-repo-1",
    sshUrl: "git@ssh.dev.azure.com:v3/org/project/sample-repo-1",
    isDisabled: false,
    isInMaintenance: false,
  },
  {
    id: "repo-2",
    name: "sample-repo-2",
    url: "https://dev.azure.com/org/project/_git/sample-repo-2",
    webUrl: "https://dev.azure.com/org/project/_git/sample-repo-2",
    project: {
      id: "project-1",
      name: "Sample Project",
      url: "https://dev.azure.com/org/_apis/projects/project-1",
      state: 1,
      revision: 1,
      visibility: 1,
      lastUpdateTime: new Date("2024-01-01T00:00:00Z"),
    },
    defaultBranch: "refs/heads/develop",
    size: 2048,
    remoteUrl: "https://dev.azure.com/org/project/_git/sample-repo-2",
    sshUrl: "git@ssh.dev.azure.com:v3/org/project/sample-repo-2",
    isDisabled: false,
    isInMaintenance: false,
  },
];

export const sampleGitBranches: GitInterfaces.GitBranchStats[] = [
  {
    name: "refs/heads/main",
    aheadCount: 0,
    behindCount: 0,
    commit: {
      commitId: "commit-1",
      author: {
        name: "John Doe",
        email: "john.doe@example.com",
        date: new Date("2024-01-01T10:00:00Z"),
      },
      committer: {
        name: "John Doe",
        email: "john.doe@example.com",
        date: new Date("2024-01-01T10:00:00Z"),
      },
      comment: "Initial commit",
      url: "https://dev.azure.com/org/project/_apis/git/repositories/repo-1/commits/commit-1",
    },
    isBaseVersion: true,
  },
  {
    name: "refs/heads/develop",
    aheadCount: 2,
    behindCount: 1,
    commit: {
      commitId: "commit-2",
      author: {
        name: "Jane Smith",
        email: "jane.smith@example.com",
        date: new Date("2024-01-02T15:30:00Z"),
      },
      committer: {
        name: "Jane Smith",
        email: "jane.smith@example.com",
        date: new Date("2024-01-02T15:30:00Z"),
      },
      comment: "Add new feature",
      url: "https://dev.azure.com/org/project/_apis/git/repositories/repo-1/commits/commit-2",
    },
    isBaseVersion: false,
  },
];

export const sampleGitCommits: GitInterfaces.GitCommitRef[] = [
  {
    commitId: "commit-1",
    author: {
      name: "John Doe",
      email: "john.doe@example.com",
      date: new Date("2024-01-01T10:00:00Z"),
    },
    committer: {
      name: "John Doe",
      email: "john.doe@example.com",
      date: new Date("2024-01-01T10:00:00Z"),
    },
    comment: "Initial commit",
    url: "https://dev.azure.com/org/project/_apis/git/repositories/repo-1/commits/commit-1",
    remoteUrl: "https://dev.azure.com/org/project/_git/sample-repo-1/commit/commit-1",
  },
  {
    commitId: "commit-2",
    author: {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      date: new Date("2024-01-02T15:30:00Z"),
    },
    committer: {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      date: new Date("2024-01-02T15:30:00Z"),
    },
    comment: "Add new feature",
    url: "https://dev.azure.com/org/project/_apis/git/repositories/repo-1/commits/commit-2",
    remoteUrl: "https://dev.azure.com/org/project/_git/sample-repo-1/commit/commit-2",
  },
];

export const sampleGitPullRequests: GitInterfaces.GitPullRequest[] = [
  {
    pullRequestId: 1,
    codeReviewId: 1,
    status: 1, // Active
    createdBy: {
      id: "user-1",
      displayName: "John Doe",
      uniqueName: "john.doe@example.com",
      url: "https://dev.azure.com/org/_apis/graph/users/user-1",
      imageUrl: "https://dev.azure.com/org/_apis/graph/users/user-1/avatar",
    },
    creationDate: new Date("2024-01-03T09:00:00Z"),
    title: "Add new feature",
    description: "This PR adds a new feature to the application",
    sourceRefName: "refs/heads/feature/new-feature",
    targetRefName: "refs/heads/main",
    mergeStatus: 1, // Succeeded
    isDraft: false,
    mergeId: "merge-1",
    lastMergeSourceCommit: {
      commitId: "commit-3",
      url: "https://dev.azure.com/org/project/_apis/git/repositories/repo-1/commits/commit-3",
    },
    lastMergeTargetCommit: {
      commitId: "commit-1",
      url: "https://dev.azure.com/org/project/_apis/git/repositories/repo-1/commits/commit-1",
    },
    lastMergeCommit: {
      commitId: "commit-4",
      url: "https://dev.azure.com/org/project/_apis/git/repositories/repo-1/commits/commit-4",
    },
    reviewers: [
      {
        reviewerUrl: "https://dev.azure.com/org/project/_apis/git/repositories/repo-1/pullRequests/1/reviewers/user-2",
        vote: 10, // Approved
        hasDeclined: false,
        isFlagged: false,
        displayName: "Jane Smith",
        url: "https://dev.azure.com/org/_apis/graph/users/user-2",
        id: "user-2",
        uniqueName: "jane.smith@example.com",
        imageUrl: "https://dev.azure.com/org/_apis/graph/users/user-2/avatar",
      },
    ],
    url: "https://dev.azure.com/org/project/_apis/git/repositories/repo-1/pullRequests/1",
    supportsIterations: true,
    repository: sampleGitRepositories[0],
  },
];

export const sampleProjects: CoreInterfaces.TeamProjectReference[] = [
  {
    id: "project-1",
    name: "Sample Project",
    url: "https://dev.azure.com/org/_apis/projects/project-1",
    state: 1, // WellFormed
    revision: 1,
    visibility: 1, // Private
    lastUpdateTime: new Date("2024-01-01T00:00:00Z"),
  },
  {
    id: "project-2",
    name: "Another Project",
    url: "https://dev.azure.com/org/_apis/projects/project-2",
    state: 1,
    revision: 1,
    visibility: 1,
    lastUpdateTime: new Date("2024-01-01T00:00:00Z"),
  },
];

export const samplePipelineRuns: PipelinesInterfaces.Run[] = [
  {
    id: 1,
    name: "Build #1",
    _links: {
      self: {
        href: "https://dev.azure.com/org/project/_apis/pipelines/runs/1",
      },
    },
    pipeline: {
      url: "https://dev.azure.com/org/project/_apis/pipelines/1",
      id: 1,
      revision: 1,
      name: "Sample Pipeline",
      folder: "\\",
    },
    state: 2, // completed
    result: 2, // succeeded
    createdDate: new Date("2024-01-01T10:00:00Z"),
    finishedDate: new Date("2024-01-01T10:05:00Z"),
    url: "https://dev.azure.com/org/project/_apis/pipelines/runs/1",
  },
];
