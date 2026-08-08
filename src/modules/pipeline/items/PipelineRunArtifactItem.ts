import { BuildArtifact } from "azure-devops-node-api/interfaces/BuildInterfaces";
import { isDeepStrictEqual } from "node:util";
import { Subject } from "rxjs";
import { PipelineRunContext, comparePipelineRunContext } from "./PipelineRunItem";

export function isPipelineRunArtifactItem(item: { type: string }): item is PipelineRunArtifactItem {
  return item.type === "pipelineRunArtifact";
}

export function comparePipelineRunArtifactItem(a: PipelineRunArtifactItem, b: PipelineRunArtifactItem) {
  if (!comparePipelineRunContext(a, b)) {
    return false;
  }
  return isDeepStrictEqual(a.artifact, b.artifact);
}

export interface PipelineRunArtifactItem extends PipelineRunContext {
  readonly type: "pipelineRunArtifact";
  artifact: BuildArtifact;
  isEqual(other: PipelineRunArtifactItem): boolean;
}

export function createPipelineRunArtifactItem(
  parent: PipelineRunContext,
  artifact: BuildArtifact,
  refreshObservables: Record<string, Subject<number>>,
): PipelineRunArtifactItem {
  return {
    type: "pipelineRunArtifact",
    account: parent.account,
    container: parent.container,
    projectId: parent.projectId,
    pipelineId: parent.pipelineId,
    buildId: parent.buildId,
    refreshObservables,
    artifact,
    isEqual(other) {
      return comparePipelineRunArtifactItem(this, other);
    },
  };
}
