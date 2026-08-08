import { inject } from "inversify";
import { map, Observable, of, switchMap } from "rxjs";
import { Constructor } from "../../../common/constructor";
import { Exception } from "../../../common/Exception";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { fromArray } from "../../../common/treePartProvider/fromArray";
import { withItemObservable } from "../../../common/treePartProvider/withItemObservable";
import {
  ItemInformation,
  createOrUpdateTreeItem,
  TreePartProvider,
} from "../../../common/treePartProvider/TreePartProvider";
import { updateExceptionTreeItem } from "../../../common/treePartProvider/updateExceptionTreeItem";
import { types } from "../../../generated/types";
import { WorkItemCurrentSprintGroupItem } from "../items/WorkItemCurrentSprintGroupItem";
import { WorkItemItem } from "../items/WorkItemItem";
import { loadWorkItemIcon } from "../services/WorkItemTypeIconService";
import { WorkItemTreeItem } from "../treeItems/WorkItemTreeItem";

export class CurrentSprintGroupWorkItemTreePartProvider extends TreePartProvider<
  WorkItemItem | Exception,
  WorkItemCurrentSprintGroupItem
> {
  getItems(context: Observable<WorkItemCurrentSprintGroupItem>): Observable<ItemInformation<WorkItemItem | Exception>> {
    return context.pipe(
      switchMap((context) => {
        return of(context.workItems).pipe(
          fromArray((item: WorkItemItem) => `${item.workItemId}`, {}),
          withItemObservable((inputObservable) =>
            inputObservable.pipe(loadWorkItemIcon((item) => this.appendRefreshObservable(item, "workItemIcons"))),
          ),
        );
      }),
    );
  }

  #workItemTreeItemConstructor: Constructor<WorkItemTreeItem>;
  constructor(
    @inject(types.PinnableWorkItemTreeItem)
    WorkItemTreeItemConstructor: Constructor<WorkItemTreeItem>,
  ) {
    super();
    this.#workItemTreeItemConstructor = WorkItemTreeItemConstructor;
  }

  override updateTreeItem(item: WorkItemItem | Exception, key: string, oldTreeItem: AbstractTreeItem<any> | undefined) {
    return (
      updateExceptionTreeItem(item, oldTreeItem) ??
      createOrUpdateTreeItem(oldTreeItem, this.#workItemTreeItemConstructor, item)
    );
  }
}
