import { describe, test, expect, vi } from "vitest";
import {
  comparePipelineFolderItem,
  createPipelineFolderItem,
} from "../../../../../src/modules/pipeline/items/PipelineFolderItem";
import { Folder } from "azure-devops-node-api/interfaces/BuildInterfaces";
import { TeamProjectReference } from "azure-devops-node-api/interfaces/CoreInterfaces";

vi.mock("../../../../../src/modules/core/items/ProjectItem", async (importOriginal) => ({
  ...(await importOriginal()),
  compareProjectContext: vi.fn(),
}));
import { compareProjectContext, createProjectItem } from "../../../../../src/modules/core/items/ProjectItem";
import { AccountContext } from "../../../../../src/modules/core/items/AccountItem";

const projectBase = createProjectItem({} as AccountContext, {} as TeamProjectReference, {});
const folder1: Folder = { path: "folder1" };
const folder2: Folder = { path: "folder2" };

describe("comparePipelineFolderItem", () => {
  test("returns true if both project and folder are equal", () => {
    (compareProjectContext as ReturnType<typeof vi.fn>).mockReturnValue(true);
    const a = createPipelineFolderItem(projectBase, folder1, {});
    const b = createPipelineFolderItem(projectBase, folder1, {});
    expect(comparePipelineFolderItem(a, b)).toBe(true);
  });

  test("returns false if compareProjectContext is false", () => {
    (compareProjectContext as ReturnType<typeof vi.fn>).mockReturnValue(false);
    const a = createPipelineFolderItem(projectBase, folder1, {});
    const b = createPipelineFolderItem(projectBase, folder2, {});
    expect(comparePipelineFolderItem(a, b)).toBe(false);
  });

  test("returns false if folder is not deep equal", () => {
    (compareProjectContext as ReturnType<typeof vi.fn>).mockReturnValue(true);
    const a = createPipelineFolderItem(projectBase, folder1, {});
    const b = createPipelineFolderItem(projectBase, folder2, {});
    expect(comparePipelineFolderItem(a, b)).toBe(false);
  });
});
