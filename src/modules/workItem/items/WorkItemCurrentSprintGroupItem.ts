import { isDeepStrictEqual } from "node:util";
import { Subject } from "rxjs";
import { compareWorkItemCurrentSprintItem, WorkItemCurrentSprintContext } from "./WorkItemCurrentSprintItem";
import { WorkItemItem } from "./WorkItemItem";

export type WorkItemCurrentSprintGroupType = "assignee" | "state";

export interface WorkItemCurrentSprintGroupItem extends WorkItemCurrentSprintContext {
  readonly type: "workItemCurrentSprintGroup";
  grouping: WorkItemCurrentSprintGroupType;
  groupName: string;
  workItems: WorkItemItem[];
  isEqual(other: WorkItemCurrentSprintGroupItem): boolean;
}

export function createWorkItemCurrentSprintGroupItem(
  parent: WorkItemCurrentSprintContext,
  grouping: WorkItemCurrentSprintGroupType,
  groupName: string,
  workItems: WorkItemItem[],
  refreshObservables: Record<string, Subject<number>>,
): WorkItemCurrentSprintGroupItem {
  return {
    type: "workItemCurrentSprintGroup",
    account: parent.account,
    container: parent.container,
    projectId: parent.projectId,
    team: parent.team,
    sprint: parent.sprint,
    grouping,
    groupName,
    workItems,
    refreshObservables,
    isEqual(other) {
      return compareWorkItemCurrentSprintGroupItem(this, other);
    },
  };
}

export function compareWorkItemCurrentSprintGroupItem(
  a: WorkItemCurrentSprintGroupItem,
  b: WorkItemCurrentSprintGroupItem,
) {
  if (!compareWorkItemCurrentSprintItem(a, b)) {
    return false;
  }

  return a.grouping === b.grouping && a.groupName === b.groupName && isDeepStrictEqual(a.workItems, b.workItems);
}
