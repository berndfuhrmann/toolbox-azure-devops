import { WorkItemUpdate } from "azure-devops-node-api/interfaces/WorkItemTrackingInterfaces";
import { isDeepStrictEqual } from "node:util";
import { WorkItemContext, compareWorkItemContext } from "./WorkItemItem";

export function isWorkItemRevisionItem(item: { type: string }): item is WorkItemRevisionItem {
  return item.type === "workItemRevision";
}

export interface WorkItemRevisionContext extends WorkItemContext {
  rev: number;
}

export function compareWorkItemRevisionContext(a: WorkItemRevisionContext, b: WorkItemRevisionContext) {
  if (!compareWorkItemContext(a, b)) {
    return false;
  }
  return a.rev === b.rev;
}

export function compareWorkItemRevisionItem(a: WorkItemRevisionItem, b: WorkItemRevisionItem) {
  if (!compareWorkItemRevisionContext(a, b)) {
    return false;
  }
  return isDeepStrictEqual(a.update, b.update);
}

export interface WorkItemRevisionItem extends WorkItemRevisionContext {
  readonly type: "workItemRevision";
  update: WorkItemUpdate;
  isEqual(other: WorkItemRevisionItem): boolean;
}

export function createWorkItemRevisionItem(parent: WorkItemContext, update: WorkItemUpdate): WorkItemRevisionItem {
  return {
    type: "workItemRevision",
    account: parent.account,
    container: parent.container,
    projectId: parent.projectId,
    refreshObservables: parent.refreshObservables,
    workItemId: parent.workItemId,
    rev: update.rev ?? 0,
    update,
    isEqual(other) {
      return compareWorkItemRevisionItem(this, other);
    },
  };
}
