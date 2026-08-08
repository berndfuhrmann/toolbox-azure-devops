import { describe, test, expect, vi } from "vitest";
import {
  compareGitRepositoryPullRequestReviewerItem,
  createGitRepositoryPullRequestReviewerItem,
} from "../../../../../src/modules/repository/items/GitRepositoryPullRequestReviewerItem";
import { GitPullRequest, IdentityRefWithVote } from "azure-devops-node-api/interfaces/GitInterfaces";

vi.mock("../../../../../src/modules/repository/items/GitRepositoryPullRequestItem", async (importOriginal) => ({
  ...(await importOriginal()),
  compareGitRepositoryPullRequestContext: vi.fn(),
}));
import {
  compareGitRepositoryPullRequestContext,
  createGitRepositoryPullRequestItem,
} from "../../../../../src/modules/repository/items/GitRepositoryPullRequestItem";
import { GitRepositoryContext } from "../../../../../src/modules/repository/items/GitRepositoryItem";

const prBase = createGitRepositoryPullRequestItem({} as GitRepositoryContext, {} as GitPullRequest, {});
const identityRef1: IdentityRefWithVote = { id: "user-1" };
const identityRef2: IdentityRefWithVote = { id: "user-2" };

describe("compareGitRepositoryPullRequestReviewerItem", () => {
  test("returns true if both pr and identityRef are equal", () => {
    const a = createGitRepositoryPullRequestReviewerItem(prBase, identityRef1);
    const b = createGitRepositoryPullRequestReviewerItem(prBase, identityRef1);
    (compareGitRepositoryPullRequestContext as ReturnType<typeof vi.fn>).mockReturnValue(true);
    expect(compareGitRepositoryPullRequestReviewerItem(a, b)).toBe(true);
  });

  test("returns false if compareGitRepositoryPullRequestContext is false", () => {
    const a = createGitRepositoryPullRequestReviewerItem(prBase, identityRef1);
    const b = createGitRepositoryPullRequestReviewerItem(prBase, identityRef2);
    (compareGitRepositoryPullRequestContext as ReturnType<typeof vi.fn>).mockReturnValue(false);
    expect(compareGitRepositoryPullRequestReviewerItem(a, b)).toBe(false);
  });

  test("returns false if identityRef is not deep equal", () => {
    const a = createGitRepositoryPullRequestReviewerItem(prBase, identityRef1);
    const b = createGitRepositoryPullRequestReviewerItem(prBase, identityRef2);
    (compareGitRepositoryPullRequestContext as ReturnType<typeof vi.fn>).mockReturnValue(true);
    expect(compareGitRepositoryPullRequestReviewerItem(a, b)).toBe(false);
  });
});
