import { Dashboard } from "azure-devops-node-api/interfaces/DashboardInterfaces";
import { isDeepStrictEqual } from "node:util";
import { Subject } from "rxjs";
import { ProjectContext, compareProjectContext } from "../../core/items/ProjectItem";

export function isDashboardItem(item: { type: string }): item is DashboardItem {
  return item.type === "dashboard";
}

export function compareDashboardContext(a: DashboardContext, b: DashboardContext) {
  if (!compareProjectContext(a, b)) {
    return false;
  }
  return a.dashboardId === b.dashboardId;
}

export function compareDashboardItem(a: DashboardItem, b: DashboardItem) {
  if (!compareProjectContext(a, b)) {
    return false;
  }
  return isDeepStrictEqual(a.dashboard, b.dashboard);
}

export function openInWebGetUrl(item: DashboardItem) {
  const dashboardWebUrl = item.dashboard._links?.web?.href;
  if (typeof dashboardWebUrl === "string") {
    return dashboardWebUrl;
  } else {
    return undefined;
  }
}

export interface DashboardContext extends ProjectContext {
  dashboardId: string;
}

export interface DashboardItem extends DashboardContext {
  readonly type: "dashboard";
  dashboard: Dashboard;
  isEqual(other: DashboardItem): boolean;
}

export function createDashboardItem(
  parent: ProjectContext,
  dashboard: Dashboard,
  refreshObservables: Record<string, Subject<number>>,
): DashboardItem {
  return {
    type: "dashboard",
    isEqual(other) {
      return compareDashboardItem(this, other);
    },
    account: parent.account,
    container: parent.container,
    projectId: parent.projectId,
    dashboardId: dashboard.id!,
    refreshObservables,
    dashboard,
  };
}
