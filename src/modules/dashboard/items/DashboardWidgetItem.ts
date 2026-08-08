import { Widget } from "azure-devops-node-api/interfaces/DashboardInterfaces";
import { isDeepStrictEqual } from "node:util";
import { Subject } from "rxjs";
import { compareDashboardContext, DashboardContext } from "./DashboardItem";

export function isDashboardWidgetItem(item: { type: string }): item is DashboardWidgetItem {
  return item.type === "dashboardWidget";
}

export function compareDashboardWidgetItem(a: DashboardWidgetItem, b: DashboardWidgetItem) {
  if (!compareDashboardContext(a, b)) {
    return false;
  }
  return isDeepStrictEqual(a.widget, b.widget);
}

export interface DashboardWidgetItem extends DashboardContext {
  readonly type: "dashboardWidget";
  widget: Widget;
  isEqual(other: DashboardWidgetItem): boolean;
}

export function createDashboardWidgetItem(
  parent: DashboardContext,
  widget: Widget,
  refreshObservables: Record<string, Subject<number>>,
): DashboardWidgetItem {
  return {
    type: "dashboardWidget",
    account: parent.account,
    container: parent.container,
    projectId: parent.projectId,
    dashboardId: parent.dashboardId,
    refreshObservables,
    widget,
    isEqual(other) {
      return compareDashboardWidgetItem(this, other);
    },
  };
}
