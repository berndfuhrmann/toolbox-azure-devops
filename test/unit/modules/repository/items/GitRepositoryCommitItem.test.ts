import {
  compareGitRepositoryCommitItem,
  createGitRepositoryCommitItem,
} from "../../../../../src/modules/repository/items/GitRepositoryCommitItem";

vi.mock("../../../../../src/modules/repository/items/GitRepositoryItem", async (importOriginal) => ({
  ...(await importOriginal()),
  compareGitRepositoryItem: vi.fn(),
}));
import {
  compareGitRepositoryItem,
  createGitRepositoryItem,
} from "../../../../../src/modules/repository/items/GitRepositoryItem";
import { GitRepository } from "azure-devops-node-api/interfaces/GitInterfaces";
import { ProjectContext } from "../../../../../src/modules/core/items/ProjectItem";

const repoBase = createGitRepositoryItem({} as ProjectContext, {} as GitRepository, {});

describe("compareGitRepositoryCommitItem", () => {
  test("returns true if both repo and commit are equal", () => {
    const a = createGitRepositoryCommitItem(repoBase, { commitId: "abc" }, {});
    const b = createGitRepositoryCommitItem(repoBase, { commitId: "abc" }, {});
    (compareGitRepositoryItem as ReturnType<typeof vi.fn>).mockReturnValue(true);
    expect(compareGitRepositoryCommitItem(a, b)).toBe(true);
  });

  test("returns false if compareGitRepositoryItem is false", () => {
    const a = createGitRepositoryCommitItem(repoBase, { commitId: "abc" }, {});
    const b = createGitRepositoryCommitItem(repoBase, { commitId: "def" }, {});
    (compareGitRepositoryItem as ReturnType<typeof vi.fn>).mockReturnValue(false);
    expect(compareGitRepositoryCommitItem(a, b)).toBe(false);
  });

  test("returns false if commit is not deep equal", () => {
    const a = createGitRepositoryCommitItem(repoBase, { commitId: "abc" }, {});
    const b = createGitRepositoryCommitItem(repoBase, { commitId: "def" }, {});
    (compareGitRepositoryItem as ReturnType<typeof vi.fn>).mockReturnValue(true);
    expect(compareGitRepositoryCommitItem(a, b)).toBe(false);
  });
});
