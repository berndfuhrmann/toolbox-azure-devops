import { isDeepStrictEqual } from "node:util";
import { WorkItemRevisionContext, compareWorkItemRevisionContext, WorkItemRevisionItem } from "./WorkItemRevisionItem";

export function isWorkItemRevisionFieldChangeItem(item: { type: string }): item is WorkItemRevisionFieldChangeItem {
  return item.type === "workItemRevisionFieldChange";
}

export function compareWorkItemRevisionFieldChangeItem(
  a: WorkItemRevisionFieldChangeItem,
  b: WorkItemRevisionFieldChangeItem,
) {
  if (!compareWorkItemRevisionContext(a, b)) {
    return false;
  }
  return (
    a.fieldReferenceName === b.fieldReferenceName &&
    isDeepStrictEqual(a.oldValue, b.oldValue) &&
    isDeepStrictEqual(a.newValue, b.newValue)
  );
}

export interface WorkItemRevisionFieldChangeItem extends WorkItemRevisionContext {
  readonly type: "workItemRevisionFieldChange";
  fieldReferenceName: string;
  oldValue: unknown;
  newValue: unknown;
  isEqual(other: WorkItemRevisionFieldChangeItem): boolean;
}

export function createWorkItemRevisionFieldChangeItem(
  parent: WorkItemRevisionItem,
  fieldReferenceName: string,
  oldValue: unknown,
  newValue: unknown,
): WorkItemRevisionFieldChangeItem {
  return {
    type: "workItemRevisionFieldChange",
    account: parent.account,
    container: parent.container,
    projectId: parent.projectId,
    refreshObservables: parent.refreshObservables,
    workItemId: parent.workItemId,
    rev: parent.update.rev ?? 0,
    fieldReferenceName,
    oldValue,
    newValue,
    isEqual(other) {
      return compareWorkItemRevisionFieldChangeItem(this, other);
    },
  };
}
