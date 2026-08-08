import { Folder } from "azure-devops-node-api/interfaces/BuildInterfaces";
import { isDeepStrictEqual } from "node:util";
import { Subject } from "rxjs";
import { compareProjectContext, ProjectContext } from "../../core/items/ProjectItem";

export function isPipelineFolderItem(item: { type: string }): item is PipelineFolderItem {
  return item.type === "pipelineFolder";
}

export function comparePipelineFolderItem(a: PipelineFolderItem, b: PipelineFolderItem) {
  if (!compareProjectContext(a, b)) {
    return false;
  }
  return isDeepStrictEqual(a.folder, b.folder);
}

export function getPipelineFolderItemKey(item: PipelineFolderItem): string {
  return item.account.accountId + "/" + item.folder.path;
}

export interface PipelineFolderItem extends ProjectContext {
  readonly type: "pipelineFolder";
  folder: Folder;
  isEqual(other: PipelineFolderItem): boolean;
}

export function createPipelineFolderItem(
  parent: ProjectContext,
  folder: Folder,
  refreshObservables: Record<string, Subject<number>>,
): PipelineFolderItem {
  return {
    type: "pipelineFolder",
    account: parent.account,
    container: parent.container,
    projectId: parent.projectId,
    refreshObservables,
    folder,
    isEqual(other) {
      return comparePipelineFolderItem(this, other);
    },
  };
}
