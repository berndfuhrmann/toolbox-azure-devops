import { WorkItem } from "azure-devops-node-api/interfaces/WorkItemTrackingInterfaces";
import { isDeepStrictEqual } from "node:util";
import { Subject } from "rxjs";
import { ProjectContext, compareProjectContext } from "../../core/items/ProjectItem";

export function isWorkItemItem(item: { type: string }): item is WorkItemItem {
  return item.type === "workItem";
}

export function compareWorkItemItem(a: WorkItemItem, b: WorkItemItem) {
  if (!compareWorkItemContext(a, b)) {
    return false;
  }
  return isDeepStrictEqual(a.workItem, b.workItem);
}

export function canOpenInWeb(item: WorkItemItem) {
  return typeof item.workItem?._links?.["html"]?.href === "string";
}

export function openInWebGetUrl(item: WorkItemItem) {
  // workItem should always be defined when this function is called.
  // the tag for calling openInWeb is only added when canOpenInWeb returns true.
  const workItemWebUrl = item.workItem!._links?.["html"]?.href;
  if (typeof workItemWebUrl === "string") {
    return workItemWebUrl;
  } else {
    return undefined;
  }
}

export interface WorkItemContext extends ProjectContext {
  workItemId: number;
}

export function compareWorkItemContext(a: WorkItemContext, b: WorkItemContext) {
  if (!compareProjectContext(a, b)) {
    return false;
  }
  return a.workItemId === b.workItemId;
}

export interface WorkItemItem extends WorkItemContext {
  readonly type: "workItem";
  workItem?: WorkItem;
  iconSvg?: string;
  isEqual(other: WorkItemItem): boolean;
}

export function createWorkItemItem(
  parent: ProjectContext,
  workItemId: number,
  workItem: WorkItem | undefined,
  iconSvg: string | undefined,
  refreshObservables: Record<string, Subject<number>>,
): WorkItemItem {
  return {
    type: "workItem",
    account: parent.account,
    container: parent.container,
    projectId: parent.projectId,
    refreshObservables,
    workItemId: workItemId,
    workItem,
    iconSvg,
    isEqual(other) {
      return compareWorkItemItem(this, other);
    },
  };
}
