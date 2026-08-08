import { describe, test, expect, vi } from "vitest";
import {
  compareGitRepositoryTagItem,
  createGitRepositoryTagItem,
} from "../../../../../src/modules/repository/items/GitRepositoryTagItem";

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

describe("compareGitRepositoryTagItem", () => {
  test("returns true if both repo and ref are equal", () => {
    const a = createGitRepositoryTagItem(repoBase, { name: "v1.0" }, {});
    const b = createGitRepositoryTagItem(repoBase, { name: "v1.0" }, {});
    (compareGitRepositoryItem as ReturnType<typeof vi.fn>).mockReturnValue(true);
    expect(compareGitRepositoryTagItem(a, b)).toBe(true);
  });

  test("returns false if compareGitRepositoryItem is false", () => {
    const a = createGitRepositoryTagItem(repoBase, { name: "v1.0" }, {});
    const b = createGitRepositoryTagItem(repoBase, { name: "v2.0" }, {});
    (compareGitRepositoryItem as ReturnType<typeof vi.fn>).mockReturnValue(false);
    expect(compareGitRepositoryTagItem(a, b)).toBe(false);
  });

  test("returns false if ref is not deep equal", () => {
    const a = createGitRepositoryTagItem(repoBase, { name: "v1.0" }, {});
    const b = createGitRepositoryTagItem(repoBase, { name: "v2.0" }, {});
    (compareGitRepositoryItem as ReturnType<typeof vi.fn>).mockReturnValue(true);
    expect(compareGitRepositoryTagItem(a, b)).toBe(false);
  });
});
