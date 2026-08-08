import { TeamSettingsIteration } from "azure-devops-node-api/interfaces/WorkInterfaces";
import { isDeepStrictEqual } from "node:util";
import { Subject } from "rxjs";
import type { WorkItemCurrentSprintByAssigneeScopeItem } from "./WorkItemCurrentSprintByAssigneeScopeItem";
import type { WorkItemCurrentSprintByStateScopeItem } from "./WorkItemCurrentSprintByStateScopeItem";
import type { WorkItemCurrentSprintUnassignedScopeItem } from "./WorkItemCurrentSprintUnassignedScopeItem";
import { compareWorkItemTeamItem, WorkItemTeamContext } from "./WorkItemTeamItem";

export type WorkItemCurrentSprintScopeType = "byAssignee" | "byState" | "unassigned";

export interface WorkItemCurrentSprintContext extends WorkItemTeamContext {
  sprint: TeamSettingsIteration;
}

export interface WorkItemCurrentSprintItem extends WorkItemCurrentSprintContext {
  readonly type: "workItemCurrentSprint";
  isEqual(other: WorkItemCurrentSprintItem): boolean;
}

export type WorkItemCurrentSprintScopeItem =
  | WorkItemCurrentSprintByAssigneeScopeItem
  | WorkItemCurrentSprintByStateScopeItem
  | WorkItemCurrentSprintUnassignedScopeItem;

export function createWorkItemCurrentSprintItem(
  parent: WorkItemTeamContext,
  sprint: TeamSettingsIteration,
  refreshObservables: Record<string, Subject<number>>,
): WorkItemCurrentSprintItem {
  return {
    type: "workItemCurrentSprint",
    account: parent.account,
    container: parent.container,
    projectId: parent.projectId,
    team: parent.team,
    sprint,
    refreshObservables,
    isEqual(other) {
      return compareWorkItemCurrentSprintItem(this, other);
    },
  };
}

export function compareWorkItemCurrentSprintItem(a: WorkItemCurrentSprintContext, b: WorkItemCurrentSprintContext) {
  if (!compareWorkItemTeamItem(a, b)) {
    return false;
  }
  return isDeepStrictEqual(a.sprint, b.sprint);
}

export function compareWorkItemCurrentSprintScopeItem(
  a: WorkItemCurrentSprintScopeItem,
  b: WorkItemCurrentSprintScopeItem,
) {
  return compareWorkItemCurrentSprintItem(a, b) && a.scope === b.scope;
}
