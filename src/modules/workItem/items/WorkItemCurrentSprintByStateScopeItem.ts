import { Subject } from "rxjs";
import type { WorkItemCurrentSprintScopeItem } from "./WorkItemCurrentSprintItem";
import { compareWorkItemCurrentSprintScopeItem, WorkItemCurrentSprintContext } from "./WorkItemCurrentSprintItem";

export interface WorkItemCurrentSprintByStateScopeItem extends WorkItemCurrentSprintContext {
  readonly type: "workItemCurrentSprintScope";
  readonly scope: "byState";
  isEqual(other: WorkItemCurrentSprintScopeItem): boolean;
}

export function createWorkItemCurrentSprintByStateScopeItem(
  parent: WorkItemCurrentSprintContext,
  refreshObservables: Record<string, Subject<number>>,
): WorkItemCurrentSprintByStateScopeItem {
  return {
    type: "workItemCurrentSprintScope",
    account: parent.account,
    container: parent.container,
    projectId: parent.projectId,
    team: parent.team,
    sprint: parent.sprint,
    scope: "byState",
    refreshObservables,
    isEqual(other) {
      return compareWorkItemCurrentSprintScopeItem(this, other);
    },
  };
}
