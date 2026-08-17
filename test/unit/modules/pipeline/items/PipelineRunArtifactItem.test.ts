import {
  comparePipelineRunArtifactItem,
  createPipelineRunArtifactItem,
} from "../../../../../src/modules/pipeline/items/PipelineRunArtifactItem";
import { Build, BuildArtifact } from "azure-devops-node-api/interfaces/BuildInterfaces";

vi.mock("../../../../../src/modules/pipeline/items/PipelineRunItem", async (importOriginal) => ({
  ...(await importOriginal()),
  comparePipelineRunContext: vi.fn(),
}));
import {
  comparePipelineRunContext,
  createPipelineRunItem,
} from "../../../../../src/modules/pipeline/items/PipelineRunItem";
import { PipelineContext } from "../../../../../src/modules/pipeline/items/PipelineItem";

const runBase = createPipelineRunItem({} as PipelineContext, {} as Build, {});
const artifact1: BuildArtifact = { name: "a" };
const artifact2: BuildArtifact = { name: "b" };

describe("comparePipelineRunArtifactItem", () => {
  test("returns true if both run and artifact are equal", () => {
    (comparePipelineRunContext as ReturnType<typeof vi.fn>).mockReturnValue(true);
    const a = createPipelineRunArtifactItem(runBase, artifact1, {});
    const b = createPipelineRunArtifactItem(runBase, artifact1, {});
    expect(comparePipelineRunArtifactItem(a, b)).toBe(true);
  });

  test("returns false if comparePipelineRunContext is false", () => {
    (comparePipelineRunContext as ReturnType<typeof vi.fn>).mockReturnValue(false);
    const a = createPipelineRunArtifactItem(runBase, artifact1, {});
    const b = createPipelineRunArtifactItem(runBase, artifact2, {});
    expect(comparePipelineRunArtifactItem(a, b)).toBe(false);
  });

  test("returns false if artifact is not deep equal", () => {
    (comparePipelineRunContext as ReturnType<typeof vi.fn>).mockReturnValue(true);
    const a = createPipelineRunArtifactItem(runBase, artifact1, {});
    const b = createPipelineRunArtifactItem(runBase, artifact2, {});
    expect(comparePipelineRunArtifactItem(a, b)).toBe(false);
  });
});
