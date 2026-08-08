import { isDeepStrictEqual } from "node:util";
import { WorkItemContext, compareWorkItemContext, WorkItemItem } from "./WorkItemItem";

export function isWorkItemRelationGroupItem(item: { type: string }): item is WorkItemRelationGroupItem {
  return item.type === "workItemRelationGroup";
}

export function compareWorkItemRelationGroupItem(a: WorkItemRelationGroupItem, b: WorkItemRelationGroupItem) {
  if (!compareWorkItemContext(a, b)) {
    return false;
  }
  return a.relationType === b.relationType && isDeepStrictEqual(a.relatedWorkItemIds, b.relatedWorkItemIds);
}

export interface WorkItemRelationGroupItem extends WorkItemContext {
  readonly type: "workItemRelationGroup";
  relationType: string;
  displayName: string;
  relatedWorkItemIds: number[];
  isEqual(other: WorkItemRelationGroupItem): boolean;
}

export function createWorkItemRelationGroupItem(
  parent: WorkItemItem,
  relationType: string,
  displayName: string,
  relatedWorkItemIds: number[],
): WorkItemRelationGroupItem {
  return {
    type: "workItemRelationGroup",
    account: parent.account,
    container: parent.container,
    projectId: parent.projectId,
    workItemId: parent.workItemId,
    refreshObservables: parent.refreshObservables,
    relationType,
    displayName,
    relatedWorkItemIds,
    isEqual(other) {
      return compareWorkItemRelationGroupItem(this, other);
    },
  };
}
