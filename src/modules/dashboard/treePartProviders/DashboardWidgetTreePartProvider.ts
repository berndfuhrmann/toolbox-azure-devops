import { inject } from "inversify";
import { map, Observable, switchMap } from "rxjs";
import { Constructor } from "../../../common/constructor";
import { Exception } from "../../../common/Exception";
import { mapX } from "../../../common/exceptionOperators";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { fromArrayWithItemInformation } from "../../../common/treePartProvider/fromArray";
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
            map((items) => ({ items, refreshObservables })),
          );
      }),
      // outside of switchMap, so that the items of the previous context are removed or updated, not added a second time
      fromArrayWithItemInformation((item: DashboardWidgetItem) => item.widget.id ?? ""),
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
