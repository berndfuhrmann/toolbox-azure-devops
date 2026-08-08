import { describe, test, expect, vi } from "vitest";
import {
  compareGitRepositoryPullRequestItem,
  compareGitRepositoryPullRequestContext,
  createGitRepositoryPullRequestItem,
  GitRepositoryPullRequestContext,
} from "../../../../../src/modules/repository/items/GitRepositoryPullRequestItem";
import { GitPullRequest, GitPullRequestStatus, GitRepository } from "azure-devops-node-api/interfaces/GitInterfaces";

vi.mock("../../../../../src/modules/repository/items/GitRepositoryItem", async (importOriginal) => ({
  ...(await importOriginal()),
  compareGitRepositoryContext: vi.fn(),
}));
import {
  compareGitRepositoryContext,
  createGitRepositoryItem,
} from "../../../../../src/modules/repository/items/GitRepositoryItem";
import { ProjectContext } from "../../../../../src/modules/core/items/ProjectItem";

const repoBase = createGitRepositoryItem({} as ProjectContext, {} as GitRepository, {});

const pullRequestBase: GitPullRequest = { pullRequestId: 1 };
const pullRequestBase2: GitPullRequest = { pullRequestId: 2 };
const statusBase: GitPullRequestStatus = { context: { name: "status1" } };
const statusBase2: GitPullRequestStatus = { context: { name: "status2" } };

describe("compareGitRepositoryPullRequestItem", () => {
  test("returns true if both repo, pullRequest, and pullRequestStatusses are equal", () => {
    const a = createGitRepositoryPullRequestItem(repoBase, pullRequestBase, {});
    a.pullRequestStatusses = [statusBase];
    const b = createGitRepositoryPullRequestItem(repoBase, pullRequestBase, {});
    b.pullRequestStatusses = [statusBase];
    (compareGitRepositoryContext as ReturnType<typeof vi.fn>).mockReturnValue(true);
    expect(compareGitRepositoryPullRequestItem(a, b)).toBe(true);
  });

  test("returns false if compareGitRepositoryContext is false", () => {
    const a = createGitRepositoryPullRequestItem(repoBase, pullRequestBase, {});
    a.pullRequestStatusses = [statusBase];
    const b = createGitRepositoryPullRequestItem(repoBase, pullRequestBase2, {});
    b.pullRequestStatusses = [statusBase2];
    (compareGitRepositoryContext as ReturnType<typeof vi.fn>).mockReturnValue(false);
    expect(compareGitRepositoryPullRequestItem(a, b)).toBe(false);
  });

  test("returns false if pullRequest or pullRequestStatusses are not deep equal", () => {
    const a = createGitRepositoryPullRequestItem(repoBase, pullRequestBase, {});
    a.pullRequestStatusses = [statusBase];
    const b = createGitRepositoryPullRequestItem(repoBase, pullRequestBase2, {});
    b.pullRequestStatusses = [statusBase2];
    (compareGitRepositoryContext as ReturnType<typeof vi.fn>).mockReturnValue(true);
    expect(compareGitRepositoryPullRequestItem(a, b)).toBe(false);
  });
});

describe("compareGitRepositoryPullRequestContext", () => {
  test("returns true if pullRequestId is equal", () => {
    (compareGitRepositoryContext as ReturnType<typeof vi.fn>).mockReturnValue(true);
    const a: GitRepositoryPullRequestContext = { ...repoBase, pullRequestId: 1 };
    const b: GitRepositoryPullRequestContext = { ...repoBase, pullRequestId: 1 };
    expect(compareGitRepositoryPullRequestContext(a, b)).toBe(true);
  });

  test("returns false if pullRequestId differs", () => {
    (compareGitRepositoryContext as ReturnType<typeof vi.fn>).mockReturnValue(true);
    const a: GitRepositoryPullRequestContext = { ...repoBase, pullRequestId: 1 };
    const b: GitRepositoryPullRequestContext = { ...repoBase, pullRequestId: 2 };
    expect(compareGitRepositoryPullRequestContext(a, b)).toBe(false);
  });

  test("returns false if compareGitRepositoryContext is false", () => {
    (compareGitRepositoryContext as ReturnType<typeof vi.fn>).mockReturnValue(false);
    const a: GitRepositoryPullRequestContext = { ...repoBase, pullRequestId: 1 };
    const b: GitRepositoryPullRequestContext = { ...repoBase, pullRequestId: 1 };
    expect(compareGitRepositoryPullRequestContext(a, b)).toBe(false);
  });
});
