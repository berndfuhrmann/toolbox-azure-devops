import {
  comparePipelineItem,
  comparePipelineContext,
  createPipelineItem,
  PipelineContext,
} from "../../../../../src/modules/pipeline/items/PipelineItem";
import { BuildDefinitionReference } from "azure-devops-node-api/interfaces/BuildInterfaces";
import { TeamProjectReference } from "azure-devops-node-api/interfaces/CoreInterfaces";

vi.mock("../../../../../src/modules/core/items/ProjectItem", async (importOriginal) => ({
  ...(await importOriginal()),
  compareProjectContext: vi.fn(),
}));
import { compareProjectContext, createProjectItem } from "../../../../../src/modules/core/items/ProjectItem";
import { AccountContext } from "../../../../../src/modules/core/items/AccountItem";

const projectBase = createProjectItem({} as AccountContext, {} as TeamProjectReference, {});
const pipeline1: BuildDefinitionReference = { id: 1 };
const pipeline2: BuildDefinitionReference = { id: 2 };

describe("comparePipelineItem", () => {
  test("returns true if both project and pipeline are equal", () => {
    (compareProjectContext as ReturnType<typeof vi.fn>).mockReturnValue(true);
    const a = createPipelineItem(projectBase, pipeline1, {});
    const b = createPipelineItem(projectBase, pipeline1, {});
    expect(comparePipelineItem(a, b)).toBe(true);
  });

  test("returns false if compareProjectContext is false", () => {
    (compareProjectContext as ReturnType<typeof vi.fn>).mockReturnValue(false);
    const a = createPipelineItem(projectBase, pipeline1, {});
    const b = createPipelineItem(projectBase, pipeline2, {});
    expect(comparePipelineItem(a, b)).toBe(false);
  });

  test("returns false if pipeline is not deep equal", () => {
    (compareProjectContext as ReturnType<typeof vi.fn>).mockReturnValue(true);
    const a = createPipelineItem(projectBase, pipeline1, {});
    const b = createPipelineItem(projectBase, pipeline2, {});
    expect(comparePipelineItem(a, b)).toBe(false);
  });
});

describe("comparePipelineContext", () => {
  test("returns true if pipelineId is equal", () => {
    (compareProjectContext as ReturnType<typeof vi.fn>).mockReturnValue(true);
    const a: PipelineContext = { ...projectBase, pipelineId: 1 };
    const b: PipelineContext = { ...projectBase, pipelineId: 1 };
    expect(comparePipelineContext(a, b)).toBe(true);
  });

  test("returns false if pipelineId differs", () => {
    (compareProjectContext as ReturnType<typeof vi.fn>).mockReturnValue(true);
    const a: PipelineContext = { ...projectBase, pipelineId: 1 };
    const b: PipelineContext = { ...projectBase, pipelineId: 2 };
    expect(comparePipelineContext(a, b)).toBe(false);
  });

  test("returns false if compareProjectContext is false", () => {
    (compareProjectContext as ReturnType<typeof vi.fn>).mockReturnValue(false);
    const a: PipelineContext = { ...projectBase, pipelineId: 1 };
    const b: PipelineContext = { ...projectBase, pipelineId: 1 };
    expect(comparePipelineContext(a, b)).toBe(false);
  });
});
