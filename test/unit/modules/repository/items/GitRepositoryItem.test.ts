import { describe, test, expect, vi } from "vitest";
import {
  compareGitRepositoryItem,
  GitRepositoryItem,
  compareGitRepositoryContext,
  GitRepositoryContext,
} from "../../../../../src/modules/repository/items/GitRepositoryItem";

vi.mock("../../../../../src/modules/core/items/ProjectItem", () => ({
  compareProjectContext: vi.fn(),
}));
import { compareProjectContext } from "../../../../../src/modules/core/items/ProjectItem";

const projectBase = {} as any;

describe("compareGitRepositoryItem", () => {
  test("returns true if both project and gitRepository are equal", () => {
    const a: GitRepositoryItem = {
      ...projectBase,
      gitRepositoryId: "1",
      gitRepository: { id: "1", name: "repo" },
    };
    const b: GitRepositoryItem = {
      ...projectBase,
      gitRepositoryId: "1",
      gitRepository: { id: "1", name: "repo" },
    };
    (compareProjectContext as ReturnType<typeof vi.fn>).mockReturnValue(true);
    expect(compareGitRepositoryItem(a, b)).toBe(true);
  });

  test("returns false if compareProjectContext is false", () => {
    const a: GitRepositoryItem = {
      ...projectBase,
      gitRepositoryId: "1",
      gitRepository: { id: "1", name: "repo" },
    };
    const b: GitRepositoryItem = {
      ...projectBase,
      gitRepositoryId: "2",
      gitRepository: { id: "2", name: "other" },
    };
    (compareProjectContext as ReturnType<typeof vi.fn>).mockReturnValue(false);
    expect(compareGitRepositoryItem(a, b)).toBe(false);
  });

  test("returns false if gitRepository is not deep equal", () => {
    const a: GitRepositoryItem = {
      ...projectBase,
      gitRepositoryId: "1",
      gitRepository: { id: "1", name: "repo" },
    };
    const b: GitRepositoryItem = {
      ...projectBase,
      gitRepositoryId: "2",
      gitRepository: { id: "2", name: "other" },
    };
    (compareProjectContext as ReturnType<typeof vi.fn>).mockReturnValue(true);
    expect(compareGitRepositoryItem(a, b)).toBe(false);
  });
});

describe("compareGitRepositoryContext", () => {
  test("returns true if gitRepositoryId is equal", () => {
    const a: GitRepositoryContext = { ...projectBase, gitRepositoryId: "1" };
    const b: GitRepositoryContext = { ...projectBase, gitRepositoryId: "1" };
    (compareProjectContext as ReturnType<typeof vi.fn>).mockReturnValue(true);
    expect(compareGitRepositoryContext(a, b)).toBe(true);
  });

  test("returns false if gitRepositoryId differs", () => {
    const a: GitRepositoryContext = { ...projectBase, gitRepositoryId: "1" };
    const b: GitRepositoryContext = { ...projectBase, gitRepositoryId: "2" };
    (compareProjectContext as ReturnType<typeof vi.fn>).mockReturnValue(true);
    expect(compareGitRepositoryContext(a, b)).toBe(false);
  });

  test("returns false if compareProjectContext is false", () => {
    const a: GitRepositoryContext = { ...projectBase, gitRepositoryId: "1" };
    const b: GitRepositoryContext = { ...projectBase, gitRepositoryId: "1" };
    (compareProjectContext as ReturnType<typeof vi.fn>).mockReturnValue(false);
    expect(compareGitRepositoryContext(a, b)).toBe(false);
  });
});
