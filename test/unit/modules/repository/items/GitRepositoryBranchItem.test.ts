import {
  compareGitRepositoryBranchItem,
  createGitRepositoryBranchItem,
} from "../../../../../src/modules/repository/items/GitRepositoryBranchItem";

vi.mock("../../../../../src/modules/repository/items/GitRepositoryItem", async (importOriginal) => ({
  ...(await importOriginal()),
  compareGitRepositoryContext: vi.fn(),
}));
import {
  compareGitRepositoryContext,
  createGitRepositoryItem,
} from "../../../../../src/modules/repository/items/GitRepositoryItem";
import { GitRepository } from "azure-devops-node-api/interfaces/GitInterfaces";
import { ProjectContext } from "../../../../../src/modules/core/items/ProjectItem";

const mockGitRepository = { id: "repo-1", defaultBranch: "refs/heads/main" } as GitRepository;
const repoBase = createGitRepositoryItem({} as ProjectContext, mockGitRepository, {});

describe("compareGitRepositoryBranchItem", () => {
  test("returns true if both repo and branch are equal", () => {
    const a = createGitRepositoryBranchItem(repoBase, mockGitRepository, { name: "main" }, {});
    const b = createGitRepositoryBranchItem(repoBase, mockGitRepository, { name: "main" }, {});
    (compareGitRepositoryContext as ReturnType<typeof vi.fn>).mockReturnValue(true);
    expect(compareGitRepositoryBranchItem(a, b)).toBe(true);
  });

  test("returns false if compareGitRepositoryContext is false", () => {
    const a = createGitRepositoryBranchItem(repoBase, mockGitRepository, { name: "main" }, {});
    const b = createGitRepositoryBranchItem(repoBase, mockGitRepository, { name: "dev" }, {});
    (compareGitRepositoryContext as ReturnType<typeof vi.fn>).mockReturnValue(false);
    expect(compareGitRepositoryBranchItem(a, b)).toBe(false);
  });

  test("returns false if branch is not deep equal", () => {
    const a = createGitRepositoryBranchItem(repoBase, mockGitRepository, { name: "main" }, {});
    const b = createGitRepositoryBranchItem(repoBase, mockGitRepository, { name: "dev" }, {});
    (compareGitRepositoryContext as ReturnType<typeof vi.fn>).mockReturnValue(true);
    expect(compareGitRepositoryBranchItem(a, b)).toBe(false);
  });
});
