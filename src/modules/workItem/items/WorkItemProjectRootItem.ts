import { Subject } from "rxjs";
import { compareProjectContext, ProjectContext } from "../../core/items/ProjectItem";

export type WorkItemProjectRootItemType =
  | "myWork"
  | "myTeams"
  | "allTeams"
  | "workItemHierarchy"
  | "areaPaths"
  | "queries";

export interface WorkItemProjectRootItem extends ProjectContext {
  readonly type: WorkItemProjectRootItemType;
  isEqual(other: WorkItemProjectRootItem): boolean;
}

export interface MyWorkItem extends WorkItemProjectRootItem {
  readonly type: "myWork";
}

export interface MyTeamsItem extends WorkItemProjectRootItem {
  readonly type: "myTeams";
}

export interface AllTeamsItem extends WorkItemProjectRootItem {
  readonly type: "allTeams";
}

export interface WorkItemHierarchyItem extends WorkItemProjectRootItem {
  readonly type: "workItemHierarchy";
}

export interface AreaPathsItem extends WorkItemProjectRootItem {
  readonly type: "areaPaths";
}

export interface QueriesItem extends WorkItemProjectRootItem {
  readonly type: "queries";
}

function createWorkItemProjectRootItem(
  parent: ProjectContext,
  type: WorkItemProjectRootItemType,
  refreshObservables: Record<string, Subject<number>> = {},
): WorkItemProjectRootItem {
  return {
    type,
    account: parent.account,
    container: parent.container,
    projectId: parent.projectId,
    refreshObservables,
    isEqual(other) {
      return compareProjectContext(this, other) && this.type === other.type;
    },
  };
}

export function createMyWorkItem(
  parent: ProjectContext,
  refreshObservables?: Record<string, Subject<number>>,
): MyWorkItem {
  return createWorkItemProjectRootItem(parent, "myWork", refreshObservables) as MyWorkItem;
}

export function createMyTeamsItem(
  parent: ProjectContext,
  refreshObservables?: Record<string, Subject<number>>,
): MyTeamsItem {
  return createWorkItemProjectRootItem(parent, "myTeams", refreshObservables) as MyTeamsItem;
}

export function createAllTeamsItem(
  parent: ProjectContext,
  refreshObservables?: Record<string, Subject<number>>,
): AllTeamsItem {
  return createWorkItemProjectRootItem(parent, "allTeams", refreshObservables) as AllTeamsItem;
}

export function createWorkItemHierarchyItem(
  parent: ProjectContext,
  refreshObservables?: Record<string, Subject<number>>,
): WorkItemHierarchyItem {
  return createWorkItemProjectRootItem(parent, "workItemHierarchy", refreshObservables) as WorkItemHierarchyItem;
}

export function createAreaPathsItem(
  parent: ProjectContext,
  refreshObservables?: Record<string, Subject<number>>,
): AreaPathsItem {
  return createWorkItemProjectRootItem(parent, "areaPaths", refreshObservables) as AreaPathsItem;
}

export function createQueriesItem(
  parent: ProjectContext,
  refreshObservables?: Record<string, Subject<number>>,
): QueriesItem {
  return createWorkItemProjectRootItem(parent, "queries", refreshObservables) as QueriesItem;
}
