import { Subject } from "rxjs";
import type { WorkItemCurrentSprintScopeItem } from "./WorkItemCurrentSprintItem";
import { compareWorkItemCurrentSprintScopeItem, WorkItemCurrentSprintContext } from "./WorkItemCurrentSprintItem";

export interface WorkItemCurrentSprintUnassignedScopeItem extends WorkItemCurrentSprintContext {
  readonly type: "workItemCurrentSprintScope";
  readonly scope: "unassigned";
  isEqual(other: WorkItemCurrentSprintScopeItem): boolean;
}

export function createWorkItemCurrentSprintUnassignedScopeItem(
  parent: WorkItemCurrentSprintContext,
  refreshObservables: Record<string, Subject<number>>,
): WorkItemCurrentSprintUnassignedScopeItem {
  return {
    type: "workItemCurrentSprintScope",
    account: parent.account,
    container: parent.container,
    projectId: parent.projectId,
    team: parent.team,
    sprint: parent.sprint,
    scope: "unassigned",
    refreshObservables,
    isEqual(other) {
      return compareWorkItemCurrentSprintScopeItem(this, other);
    },
  };
}
