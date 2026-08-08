import { Build } from "azure-devops-node-api/interfaces/BuildInterfaces";
import { isDeepStrictEqual } from "node:util";
import { Subject } from "rxjs";
import { comparePipelineContext, PipelineContext } from "./PipelineItem";

export function isPipelineRunItem(item: { type: string }): item is PipelineRunItem {
  return item.type === "pipelineRun";
}

export function comparePipelineRunContext(a: PipelineRunContext, b: PipelineRunContext) {
  if (!comparePipelineContext(a, b)) {
    return false;
  }
  return a.buildId === b.buildId;
}

export function comparePipelineRunItem(a: PipelineRunItem, b: PipelineRunItem) {
  if (!comparePipelineContext(a, b)) {
    return false;
  }
  return isDeepStrictEqual(a.build, b.build);
}

export interface PipelineRunContext extends PipelineContext {
  buildId: number;
}

export interface PipelineRunItem extends PipelineRunContext {
  readonly type: "pipelineRun";
  build: Build;
  isEqual(other: PipelineRunItem): boolean;
}

export function createPipelineRunItem(
  parent: PipelineContext,
  build: Build,
  refreshObservables: Record<string, Subject<number>>,
): PipelineRunItem {
  return {
    type: "pipelineRun",
    account: parent.account,
    container: parent.container,
    projectId: parent.projectId,
    pipelineId: parent.pipelineId,
    buildId: build.id!,
    refreshObservables,
    build,
    isEqual(other) {
      return comparePipelineRunItem(this, other);
    },
  };
}
