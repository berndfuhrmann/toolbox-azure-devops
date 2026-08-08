import { Subject } from "rxjs";
import type { WorkItemCurrentSprintScopeItem } from "./WorkItemCurrentSprintItem";
import { compareWorkItemCurrentSprintScopeItem, WorkItemCurrentSprintContext } from "./WorkItemCurrentSprintItem";

export interface WorkItemCurrentSprintByAssigneeScopeItem extends WorkItemCurrentSprintContext {
  readonly type: "workItemCurrentSprintScope";
  readonly scope: "byAssignee";
  isEqual(other: WorkItemCurrentSprintScopeItem): boolean;
}

export function createWorkItemCurrentSprintByAssigneeScopeItem(
  parent: WorkItemCurrentSprintContext,
  refreshObservables: Record<string, Subject<number>>,
): WorkItemCurrentSprintByAssigneeScopeItem {
  return {
    type: "workItemCurrentSprintScope",
    account: parent.account,
    container: parent.container,
    projectId: parent.projectId,
    team: parent.team,
    sprint: parent.sprint,
    scope: "byAssignee",
    refreshObservables,
    isEqual(other) {
      return compareWorkItemCurrentSprintScopeItem(this, other);
    },
  };
}
