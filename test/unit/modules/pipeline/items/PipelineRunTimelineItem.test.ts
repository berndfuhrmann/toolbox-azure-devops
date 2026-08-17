import {
  comparePipelineRunTimelineItem,
  createPipelineRunTimelineItem,
} from "../../../../../src/modules/pipeline/items/PipelineRunTimelineItem";
import { Build, Timeline } from "azure-devops-node-api/interfaces/BuildInterfaces";

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
const timeline1: Timeline = { id: "t1" };
const timeline2: Timeline = { id: "t2" };

describe("comparePipelineRunTimelineItem", () => {
  test("returns true if both run, timeline, and timelineRecordId are equal", () => {
    (comparePipelineRunContext as ReturnType<typeof vi.fn>).mockReturnValue(true);
    const a = createPipelineRunTimelineItem(runBase, timeline1, "rec1", {});
    const b = createPipelineRunTimelineItem(runBase, timeline1, "rec1", {});
    expect(comparePipelineRunTimelineItem(a, b)).toBe(true);
  });

  test("returns false if comparePipelineRunContext is false", () => {
    (comparePipelineRunContext as ReturnType<typeof vi.fn>).mockReturnValue(false);
    const a = createPipelineRunTimelineItem(runBase, timeline1, "rec1", {});
    const b = createPipelineRunTimelineItem(runBase, timeline2, "rec2", {});
    expect(comparePipelineRunTimelineItem(a, b)).toBe(false);
  });

  test("returns false if timeline or timelineRecordId are not deep equal", () => {
    (comparePipelineRunContext as ReturnType<typeof vi.fn>).mockReturnValue(true);
    const a = createPipelineRunTimelineItem(runBase, timeline1, "rec1", {});
    const b = createPipelineRunTimelineItem(runBase, timeline2, "rec2", {});
    expect(comparePipelineRunTimelineItem(a, b)).toBe(false);
  });
});
