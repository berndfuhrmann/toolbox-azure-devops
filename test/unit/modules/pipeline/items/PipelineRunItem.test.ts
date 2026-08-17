import {
  comparePipelineRunItem,
  comparePipelineRunContext,
  createPipelineRunItem,
  PipelineRunContext,
} from "../../../../../src/modules/pipeline/items/PipelineRunItem";
import { Build, BuildDefinitionReference } from "azure-devops-node-api/interfaces/BuildInterfaces";

vi.mock("../../../../../src/modules/pipeline/items/PipelineItem", async (importOriginal) => ({
  ...(await importOriginal()),
  comparePipelineContext: vi.fn(),
}));
import { comparePipelineContext, createPipelineItem } from "../../../../../src/modules/pipeline/items/PipelineItem";
import { ProjectContext } from "../../../../../src/modules/core/items/ProjectItem";

const pipelineBase = createPipelineItem({} as ProjectContext, {} as BuildDefinitionReference, {});
const build1: Build = { id: 1 };
const build2: Build = { id: 2 };

describe("comparePipelineRunItem", () => {
  test("returns true if both pipeline and build are equal", () => {
    (comparePipelineContext as ReturnType<typeof vi.fn>).mockReturnValue(true);
    const a = createPipelineRunItem(pipelineBase, build1, {});
    const b = createPipelineRunItem(pipelineBase, build1, {});
    expect(comparePipelineRunItem(a, b)).toBe(true);
  });

  test("returns false if comparePipelineContext is false", () => {
    (comparePipelineContext as ReturnType<typeof vi.fn>).mockReturnValue(false);
    const a = createPipelineRunItem(pipelineBase, build1, {});
    const b = createPipelineRunItem(pipelineBase, build2, {});
    expect(comparePipelineRunItem(a, b)).toBe(false);
  });

  test("returns false if build is not deep equal", () => {
    (comparePipelineContext as ReturnType<typeof vi.fn>).mockReturnValue(true);
    const a = createPipelineRunItem(pipelineBase, build1, {});
    const b = createPipelineRunItem(pipelineBase, build2, {});
    expect(comparePipelineRunItem(a, b)).toBe(false);
  });
});

describe("comparePipelineRunContext", () => {
  test("returns true if buildId is equal", () => {
    (comparePipelineContext as ReturnType<typeof vi.fn>).mockReturnValue(true);
    const a: PipelineRunContext = { ...pipelineBase, buildId: 1 };
    const b: PipelineRunContext = { ...pipelineBase, buildId: 1 };
    expect(comparePipelineRunContext(a, b)).toBe(true);
  });

  test("returns false if buildId differs", () => {
    (comparePipelineContext as ReturnType<typeof vi.fn>).mockReturnValue(true);
    const a: PipelineRunContext = { ...pipelineBase, buildId: 1 };
    const b: PipelineRunContext = { ...pipelineBase, buildId: 2 };
    expect(comparePipelineRunContext(a, b)).toBe(false);
  });

  test("returns false if comparePipelineContext is false", () => {
    (comparePipelineContext as ReturnType<typeof vi.fn>).mockReturnValue(false);
    const a: PipelineRunContext = { ...pipelineBase, buildId: 1 };
    const b: PipelineRunContext = { ...pipelineBase, buildId: 1 };
    expect(comparePipelineRunContext(a, b)).toBe(false);
  });
});
