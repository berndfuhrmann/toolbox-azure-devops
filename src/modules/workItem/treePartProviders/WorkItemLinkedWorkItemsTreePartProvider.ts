import { inject } from "inversify";
import { map, Observable, of, switchMap } from "rxjs";
import { Constructor } from "../../../common/constructor";
import { Exception } from "../../../common/Exception";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { fromArray } from "../../../common/treePartProvider/fromArray";
import {
  ItemInformation,
  createOrUpdateTreeItem,
  TreePartProvider,
} from "../../../common/treePartProvider/TreePartProvider";
import { updateExceptionTreeItem } from "../../../common/treePartProvider/updateExceptionTreeItem";
import { withItemObservable } from "../../../common/treePartProvider/withItemObservable";
import { types } from "../../../generated/types";
import { loadWorkItemIcon } from "../services/WorkItemTypeIconService";
import { createWorkItemItem, WorkItemItem } from "../items/WorkItemItem";
import { WorkItemRelationGroupItem } from "../items/WorkItemRelationGroupItem";
import type { WorkItemTreeItem } from "../treeItems/WorkItemTreeItem";
import { loadWorkItem } from "../services/loadWorkItem";

export class WorkItemLinkedWorkItemsTreePartProvider extends TreePartProvider<
  WorkItemItem | Exception,
  WorkItemRelationGroupItem
> {
  #treeItemConstructor: Constructor<WorkItemTreeItem>;

  constructor(
    @inject(types.WorkItemTreeItem)
    treeItemConstructor: Constructor<WorkItemTreeItem>,
  ) {
    super();
    this.#treeItemConstructor = treeItemConstructor;
  }

  getItems(context: Observable<WorkItemRelationGroupItem>): Observable<ItemInformation<WorkItemItem | Exception>> {
    return context.pipe(
      switchMap((workItemRelationGroup) => {
        return of(
          workItemRelationGroup.relatedWorkItemIds.map((id) =>
            createWorkItemItem(workItemRelationGroup, id, undefined, undefined, {}),
          ),
        ).pipe(
          fromArray((item: WorkItemItem) => `related-${item.workItemId}`, {}),
          withItemObservable((inputObservable) =>
            inputObservable.pipe(
              loadWorkItem((item) => this.appendRefreshObservable(item, "workItem")),
              loadWorkItemIcon((item) => this.appendRefreshObservable(item, "workItemIcon")),
            ),
          ),
        );
      }),
    );
  }

  override updateTreeItem(item: WorkItemItem | Exception, key: string, oldTreeItem: AbstractTreeItem<any> | undefined) {
    return (
      updateExceptionTreeItem(item, oldTreeItem) ?? this.updateTreeItemImpl(item as WorkItemItem, key, oldTreeItem)
    );
  }

  updateTreeItemImpl(item: WorkItemItem, key: string, oldTreeItem: AbstractTreeItem<any> | undefined) {
    return createOrUpdateTreeItem(oldTreeItem, this.#treeItemConstructor, item);
  }
}
