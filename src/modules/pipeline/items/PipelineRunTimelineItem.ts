import { Timeline } from "azure-devops-node-api/interfaces/BuildInterfaces";
import { isDeepStrictEqual } from "node:util";
import { Subject } from "rxjs";
import { PipelineRunContext, comparePipelineRunContext } from "./PipelineRunItem";

export function isPipelineRunTimelineItem(item: { type: string }): item is PipelineRunTimelineItem {
  return item.type === "pipelineRunTimeline";
}

export function comparePipelineRunTimelineItem(a: PipelineRunTimelineItem, b: PipelineRunTimelineItem) {
  if (!comparePipelineRunContext(a, b)) {
    return false;
  }
  return isDeepStrictEqual(a.timeline, b.timeline) && a.timelineRecordId === b.timelineRecordId;
}

export interface PipelineRunTimelineItem extends PipelineRunContext {
  readonly type: "pipelineRunTimeline";
  timeline: Timeline;
  timelineRecordId: string | undefined;
  isEqual(other: PipelineRunTimelineItem): boolean;
}

export function createPipelineRunTimelineItem(
  parent: PipelineRunContext,
  timeline: Timeline,
  timelineRecordId: string | undefined,
  refreshObservables: Record<string, Subject<number>>,
): PipelineRunTimelineItem {
  return {
    type: "pipelineRunTimeline",
    account: parent.account,
    container: parent.container,
    projectId: parent.projectId,
    pipelineId: parent.pipelineId,
    buildId: parent.buildId,
    refreshObservables,
    timeline,
    timelineRecordId,
    isEqual(other) {
      return comparePipelineRunTimelineItem(this, other);
    },
  };
}
