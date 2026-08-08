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
import type { ProjectContext } from "../../core/items/ProjectItem";
import { createDashboardItem, DashboardItem } from "../items/DashboardItem";
import type { DashboardTreeItem } from "../treeItems/DashboardTreeItem";

export class DashboardTreePartProvider extends TreePartProvider<DashboardItem | Exception, ProjectContext> {
  #dashboardTreeItemConstructor: Constructor<DashboardTreeItem>;

  constructor(
    @inject(types.DashboardTreeItem)
    DashboardTreeItemConstructor: Constructor<DashboardTreeItem>,
  ) {
    super();
    this.#dashboardTreeItemConstructor = DashboardTreeItemConstructor;
  }

  getItems(context: Observable<ProjectContext>): Observable<ItemInformation<DashboardItem | Exception>> {
    return context.pipe(
      switchMap((context) => {
        const { refreshObservables, refreshObservable } = this.createRefreshObservables("dashboard");
        return context.container
          .get<DashboardService>(types.DashboardService)
          .dashboards(
            {
              projectId: context.projectId,
            },
            refreshObservable,
          )
          .pipe(
            mapX((dashboards) =>
              dashboards.map((dashboard) => createDashboardItem(context, dashboard, refreshObservables)),
            ),
            fromArray((item: DashboardItem) => item.dashboardId, { refreshObservables }),
          );
      }),
    );
  }

  override updateTreeItem(
    item: DashboardItem | Exception,
    key: string,
    oldTreeItem: AbstractTreeItem<any> | undefined,
  ) {
    return (
      updateExceptionTreeItem(item, oldTreeItem) ?? this.updateTreeItemImpl(item as DashboardItem, key, oldTreeItem)
    );
  }

  updateTreeItemImpl(item: DashboardItem, _key: string, oldTreeItem: AbstractTreeItem<any> | undefined) {
    return createOrUpdateTreeItem(oldTreeItem, this.#dashboardTreeItemConstructor, item);
  }
}
