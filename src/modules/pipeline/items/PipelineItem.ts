import { BuildDefinitionReference } from "azure-devops-node-api/interfaces/BuildInterfaces";
import { isDeepStrictEqual } from "node:util";
import { Subject } from "rxjs";
import { compareProjectContext, ProjectContext } from "../../core/items/ProjectItem";

export function isPipelineItem(item: { type: string }): item is PipelineItem {
  return item.type === "pipeline";
}

export function comparePipelineContext(a: PipelineContext, b: PipelineContext) {
  if (!compareProjectContext(a, b)) {
    return false;
  }
  return a.pipelineId === b.pipelineId;
}

export function comparePipelineItem(a: PipelineItem, b: PipelineItem) {
  if (!compareProjectContext(a, b)) {
    return false;
  }
  return isDeepStrictEqual(a.pipeline, b.pipeline);
}

export function getPipelineItemKey(item: PipelineContext): string {
  return item.account.accountId + "/" + item.pipelineId;
}

export function openInWebGetUrl(item: PipelineItem) {
  const repositoryWebUrl = item.pipeline._links?.web?.href;
  if (typeof repositoryWebUrl === "string") {
    return repositoryWebUrl;
  } else {
    return undefined;
  }
}

export interface PipelineContext extends ProjectContext {
  pipelineId: number;
}

export interface PipelineItem extends PipelineContext {
  readonly type: "pipeline";
  pipeline: BuildDefinitionReference;
  isEqual(other: PipelineItem): boolean;
}

export function createPipelineItem(
  parent: ProjectContext,
  pipeline: BuildDefinitionReference,
  refreshObservables: Record<string, Subject<number>>,
): PipelineItem {
  return {
    type: "pipeline",
    account: parent.account,
    container: parent.container,
    projectId: parent.projectId,
    pipelineId: pipeline.id!,
    refreshObservables,
    pipeline,
    isEqual(other) {
      return comparePipelineItem(this, other);
    },
  };
}
