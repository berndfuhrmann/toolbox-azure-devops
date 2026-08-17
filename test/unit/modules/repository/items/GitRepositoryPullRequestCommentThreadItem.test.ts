import {
  compareGitRepositoryPullRequestCommentThreadItem,
  createGitRepositoryPullRequestCommentThreadItem,
} from "../../../../../src/modules/repository/items/GitRepositoryPullRequestCommentThreadItem";
import { GitPullRequest, GitPullRequestCommentThread } from "azure-devops-node-api/interfaces/GitInterfaces";

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
const commentThreadBase: GitPullRequestCommentThread = { id: 1 };
const commentThreadBase2: GitPullRequestCommentThread = { id: 2 };

describe("compareGitRepositoryPullRequestCommentThreadItem", () => {
  test("returns true if both pr and commentThread are equal", () => {
    const a = createGitRepositoryPullRequestCommentThreadItem(prBase, commentThreadBase);
    const b = createGitRepositoryPullRequestCommentThreadItem(prBase, commentThreadBase);
    (compareGitRepositoryPullRequestContext as ReturnType<typeof vi.fn>).mockReturnValue(true);
    expect(compareGitRepositoryPullRequestCommentThreadItem(a, b)).toBe(true);
  });

  test("returns false if compareGitRepositoryPullRequestContext is false", () => {
    const a = createGitRepositoryPullRequestCommentThreadItem(prBase, commentThreadBase);
    const b = createGitRepositoryPullRequestCommentThreadItem(prBase, commentThreadBase2);
    (compareGitRepositoryPullRequestContext as ReturnType<typeof vi.fn>).mockReturnValue(false);
    expect(compareGitRepositoryPullRequestCommentThreadItem(a, b)).toBe(false);
  });

  test("returns false if commentThread is not deep equal", () => {
    const a = createGitRepositoryPullRequestCommentThreadItem(prBase, commentThreadBase);
    const b = createGitRepositoryPullRequestCommentThreadItem(prBase, commentThreadBase2);
    (compareGitRepositoryPullRequestContext as ReturnType<typeof vi.fn>).mockReturnValue(true);
    expect(compareGitRepositoryPullRequestCommentThreadItem(a, b)).toBe(false);
  });
});
