import { inject } from "inversify";
import { from, map, Observable, switchMap } from "rxjs";
import { Constructor } from "../../../common/constructor";
import { Exception } from "../../../common/Exception";
import { switchMapX } from "../../../common/exceptionOperators";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { fromArray } from "../../../common/treePartProvider/fromArray";
import {
  ItemInformation,
  createOrUpdateTreeItem,
  TreePartProvider,
} from "../../../common/treePartProvider/TreePartProvider";
import { updateExceptionTreeItem } from "../../../common/treePartProvider/updateExceptionTreeItem";
import { ApiService } from "../../../generated/ApiService";
import { types } from "../../../generated/types";
import { WorkItemRevisionItem, createWorkItemRevisionItem } from "../items/WorkItemRevisionItem";
import type { WorkItemContext } from "../items/WorkItemItem";
import type { WorkItemRevisionTreeItem } from "../treeItems/WorkItemRevisionTreeItem";

export class WorkItemHistoryTreePartProvider extends TreePartProvider<
  WorkItemRevisionItem | Exception,
  WorkItemContext
> {
  #treeItemConstructor: Constructor<WorkItemRevisionTreeItem>;

  constructor(
    @inject(types.WorkItemRevisionTreeItem)
    treeItemConstructor: Constructor<WorkItemRevisionTreeItem>,
  ) {
    super();
    this.#treeItemConstructor = treeItemConstructor;
  }

  getItems(context: Observable<WorkItemContext>): Observable<ItemInformation<WorkItemRevisionItem | Exception>> {
    return context.pipe(
      switchMap((workItemContext) => {
        const apiService = workItemContext.container.get<ApiService>(types.ApiService);
        return apiService.workItemTrackingApi().pipe(
          switchMapX((api) =>
            from(api.getUpdates(workItemContext.workItemId, 200, 0, workItemContext.projectId)).pipe(
              map((updates) =>
                [...updates]
                  .sort((a, b) => (b.rev ?? 0) - (a.rev ?? 0))
                  .map((update) => createWorkItemRevisionItem(workItemContext, update)),
              ),
            ),
          ),
          fromArray((item: WorkItemRevisionItem) => `rev-${item.update.rev ?? item.update.id ?? 0}`, {}),
        );
      }),
    );
  }

  override updateTreeItem(
    item: WorkItemRevisionItem | Exception,
    key: string,
    oldTreeItem: AbstractTreeItem<any> | undefined,
  ) {
    return (
      updateExceptionTreeItem(item, oldTreeItem) ??
      this.updateTreeItemImpl(item as WorkItemRevisionItem, key, oldTreeItem)
    );
  }

  updateTreeItemImpl(item: WorkItemRevisionItem, key: string, oldTreeItem: AbstractTreeItem<any> | undefined) {
    return createOrUpdateTreeItem(oldTreeItem, this.#treeItemConstructor, item);
  }
}
