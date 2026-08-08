import type * as GitInterfaces from "azure-devops-node-api/interfaces/GitInterfaces";
import type * as CoreInterfaces from "azure-devops-node-api/interfaces/CoreInterfaces";
import type * as PipelinesInterfaces from "azure-devops-node-api/interfaces/PipelinesInterfaces";
import { randomUUID } from "crypto";
import { Account } from "../../../src/modules/core/account";

/**
 * Shared mock data for integration tests.
 * Re-exported from unit tests for consistency.
 */

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

/**
 * Create a test account with random ID
 */
export const createTestAccount = (): Account => ({
  accountId: randomUUID(),
  organization: "test-org",
  personalAccessToken: "test-token",
  url: "https://dev.azure.com/test-org",
});
