import { WebApiTeam } from "azure-devops-node-api/interfaces/CoreInterfaces";
import { isDeepStrictEqual } from "node:util";
import { Subject } from "rxjs";
import { compareProjectContext, ProjectContext } from "../../core/items/ProjectItem";

export function isWorkItemTeamItem(item: { type: string }): item is WorkItemTeamItem {
  return item.type === "workItemTeam";
}

export function compareWorkItemTeamItem(a: WorkItemTeamContext, b: WorkItemTeamContext) {
  if (!compareProjectContext(a, b)) {
    return false;
  }
  return isDeepStrictEqual(a.team, b.team);
}

export interface WorkItemTeamContext extends ProjectContext {
  team: WebApiTeam;
}

export interface WorkItemTeamItem extends WorkItemTeamContext {
  readonly type: "workItemTeam";
  isEqual(other: WorkItemTeamItem): boolean;
}

export function createWorkItemTeamItem(
  parent: ProjectContext,
  team: WebApiTeam,
  refreshObservables: Record<string, Subject<number>>,
): WorkItemTeamItem {
  return {
    type: "workItemTeam",
    account: parent.account,
    container: parent.container,
    projectId: parent.projectId,
    refreshObservables,
    team,
    isEqual(other) {
      return compareWorkItemTeamItem(this, other);
    },
  };
}
