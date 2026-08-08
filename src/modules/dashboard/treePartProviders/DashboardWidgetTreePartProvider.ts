import { inject } from "inversify";
import { Observable, switchMap } from "rxjs";
import { Constructor } from "../../../common/constructor";
import { Exception } from "../../../common/Exception";
import { mapX } from "../../../common/exceptionOperators";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { fromArray } from "../../../common/treePartProvider/fromArray";
import {
  ItemInformation,
  createOrUpdateTreeItem,
  TreePartProvider,
} from "../../../common/treePartProvider/TreePartProvider";
import { updateExceptionTreeItem } from "../../../common/treePartProvider/updateExceptionTreeItem";
import { DashboardService } from "../../../generated/services";
import { types } from "../../../generated/types";
import { createDashboardWidgetItem, DashboardWidgetItem } from "../items/DashboardWidgetItem";
import type { DashboardContext } from "../items/DashboardItem";
import type { DashboardWidgetTreeItem } from "../treeItems/DashboardWidgetTreeItem";

export class DashboardWidgetTreePartProvider extends TreePartProvider<
  DashboardWidgetItem | Exception,
  DashboardContext
> {
  #dashboardWidgetTreeItemConstructor: Constructor<DashboardWidgetTreeItem>;

  constructor(
    @inject(types.DashboardWidgetTreeItem)
    DashboardWidgetTreeItemConstructor: Constructor<DashboardWidgetTreeItem>,
  ) {
    super();
    this.#dashboardWidgetTreeItemConstructor = DashboardWidgetTreeItemConstructor;
  }

  getItems(context: Observable<DashboardContext>): Observable<ItemInformation<DashboardWidgetItem | Exception>> {
    return context.pipe(
      switchMap((context) => {
        const { refreshObservables, refreshObservable } = this.createRefreshObservables("dashboardWidget");
        // Fetch full dashboard to get widgets (getDashboardsByProject doesn't include them)
        return context.container
          .get<DashboardService>(types.DashboardService)
          .dashboard(
            {
              projectId: context.projectId,
            },
            context.dashboardId,
            refreshObservable,
          )
          .pipe(
            mapX((fullDashboard) => {
              const widgets = fullDashboard.widgets ?? [];
              return widgets.map((widget) => createDashboardWidgetItem(context, widget, refreshObservables));
            }),
            fromArray((item: DashboardWidgetItem) => item.widget.id ?? "", { refreshObservables }),
          );
      }),
    );
  }

  override updateTreeItem(
    item: DashboardWidgetItem | Exception,
    key: string,
    oldTreeItem: AbstractTreeItem<any> | undefined,
  ) {
    return (
      updateExceptionTreeItem(item, oldTreeItem) ??
      this.updateTreeItemImpl(item as DashboardWidgetItem, key, oldTreeItem)
    );
  }

  updateTreeItemImpl(item: DashboardWidgetItem, _key: string, oldTreeItem: AbstractTreeItem<any> | undefined) {
    return createOrUpdateTreeItem(oldTreeItem, this.#dashboardWidgetTreeItemConstructor, item);
  }
}
