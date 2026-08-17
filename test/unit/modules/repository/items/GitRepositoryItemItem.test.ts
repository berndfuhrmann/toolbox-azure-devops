import {
  compareGitRepositoryItemItem,
  createGitRepositoryItemItem,
} from "../../../../../src/modules/repository/items/GitRepositoryItemItem";

vi.mock("../../../../../src/modules/repository/items/GitRepositoryItem", async (importOriginal) => ({
  ...(await importOriginal()),
  compareGitRepositoryItem: vi.fn(),
}));
import {
  compareGitRepositoryItem,
  createGitRepositoryItem,
} from "../../../../../src/modules/repository/items/GitRepositoryItem";
import { GitItem, GitRepository, GitVersionDescriptor } from "azure-devops-node-api/interfaces/GitInterfaces";
import { ProjectContext } from "../../../../../src/modules/core/items/ProjectItem";

const repoBase = createGitRepositoryItem({} as ProjectContext, {} as GitRepository, {});

describe("compareGitRepositoryItemItem", () => {
  test("returns true if both repo, versionDescriptor, and item are equal", () => {
    const a = createGitRepositoryItemItem(
      repoBase,
      { path: "/foo" } as GitItem,
      { version: "v1" } as GitVersionDescriptor,
      {},
    );
    const b = createGitRepositoryItemItem(
      repoBase,
      { path: "/foo" } as GitItem,
      { version: "v1" } as GitVersionDescriptor,
      {},
    );
    (compareGitRepositoryItem as ReturnType<typeof vi.fn>).mockReturnValue(true);
    expect(compareGitRepositoryItemItem(a, b)).toBe(true);
  });

  test("returns false if compareGitRepositoryItem is false", () => {
    const a = createGitRepositoryItemItem(
      repoBase,
      { path: "/foo" } as GitItem,
      { version: "v1" } as GitVersionDescriptor,
      {},
    );
    const b = createGitRepositoryItemItem(
      repoBase,
      { path: "/bar" } as GitItem,
      { version: "v2" } as GitVersionDescriptor,
      {},
    );
    (compareGitRepositoryItem as ReturnType<typeof vi.fn>).mockReturnValue(false);
    expect(compareGitRepositoryItemItem(a, b)).toBe(false);
  });

  test("returns false if versionDescriptor or item is not deep equal", () => {
    const a = createGitRepositoryItemItem(
      repoBase,
      { path: "/foo" } as GitItem,
      { version: "v1" } as GitVersionDescriptor,
      {},
    );
    const b = createGitRepositoryItemItem(
      repoBase,
      { path: "/bar" } as GitItem,
      { version: "v2" } as GitVersionDescriptor,
      {},
    );
    (compareGitRepositoryItem as ReturnType<typeof vi.fn>).mockReturnValue(true);
    expect(compareGitRepositoryItemItem(a, b)).toBe(false);
  });
});
