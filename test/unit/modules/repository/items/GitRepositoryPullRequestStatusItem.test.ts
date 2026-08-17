import {
  compareGitRepositoryPullRequestStatusItem,
  createGitRepositoryPullRequestStatusItem,
} from "../../../../../src/modules/repository/items/GitRepositoryPullRequestStatusItem";
import { GitPullRequest, GitStatus } from "azure-devops-node-api/interfaces/GitInterfaces";

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
const status1: GitStatus = { context: { name: "status1" } };
const status2: GitStatus = { context: { name: "status2" } };

describe("compareGitRepositoryPullRequestStatusItem", () => {
  test("returns true if both pr and status are equal", () => {
    const a = createGitRepositoryPullRequestStatusItem(prBase, status1);
    const b = createGitRepositoryPullRequestStatusItem(prBase, status1);
    (compareGitRepositoryPullRequestContext as ReturnType<typeof vi.fn>).mockReturnValue(true);
    expect(compareGitRepositoryPullRequestStatusItem(a, b)).toBe(true);
  });

  test("returns false if compareGitRepositoryPullRequestContext is false", () => {
    const a = createGitRepositoryPullRequestStatusItem(prBase, status1);
    const b = createGitRepositoryPullRequestStatusItem(prBase, status2);
    (compareGitRepositoryPullRequestContext as ReturnType<typeof vi.fn>).mockReturnValue(false);
    expect(compareGitRepositoryPullRequestStatusItem(a, b)).toBe(false);
  });

  test("returns false if status is not deep equal", () => {
    const a = createGitRepositoryPullRequestStatusItem(prBase, status1);
    const b = createGitRepositoryPullRequestStatusItem(prBase, status2);
    (compareGitRepositoryPullRequestContext as ReturnType<typeof vi.fn>).mockReturnValue(true);
    expect(compareGitRepositoryPullRequestStatusItem(a, b)).toBe(false);
  });
});
