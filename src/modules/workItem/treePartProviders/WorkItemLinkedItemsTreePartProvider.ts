import { inject } from "inversify";
import { Observable, of, switchMap } from "rxjs";
import { Constructor } from "../../../common/constructor";
import { Exception } from "../../../common/Exception";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { fromArrayWithItemInformation } from "../../../common/treePartProvider/fromArray";
import {
  ItemInformation,
  createOrUpdateTreeItem,
  TreePartProvider,
} from "../../../common/treePartProvider/TreePartProvider";
import { updateExceptionTreeItem } from "../../../common/treePartProvider/updateExceptionTreeItem";
import { types } from "../../../generated/types";
import { WorkItemLinkedItemItem, createWorkItemLinkedItemItem } from "../items/WorkItemLinkedItemItem";
import { WorkItemItem } from "../items/WorkItemItem";
import { isCategorizedArtifactLink } from "../WorkItemArtifactLink";
import type { WorkItemLinkedItemTreeItem } from "../treeItems/WorkItemLinkedItemTreeItem";

const AttachedFileRelationType = "AttachedFile";

export class WorkItemLinkedItemsTreePartProvider extends TreePartProvider<
  WorkItemLinkedItemItem | Exception,
  WorkItemItem
> {
  #treeItemConstructor: Constructor<WorkItemLinkedItemTreeItem>;

  constructor(
    @inject(types.WorkItemLinkedItemTreeItem)
    treeItemConstructor: Constructor<WorkItemLinkedItemTreeItem>,
  ) {
    super();
    this.#treeItemConstructor = treeItemConstructor;
  }

  getItems(context: Observable<WorkItemItem>): Observable<ItemInformation<WorkItemLinkedItemItem | Exception>> {
    return context.pipe(
      switchMap((context) => {
        const workItem = context.workItem;
        const relations =
          workItem?.relations?.filter(
            (relation) => relation.rel !== AttachedFileRelationType && !isCategorizedArtifactLink(relation),
          ) ?? [];
        return of({ items: relations.map((relation) => createWorkItemLinkedItemItem(context, relation)) });
      }),
      // outside of switchMap, so that the items of the previous context are removed or updated, not added a second time
      fromArrayWithItemInformation((item: WorkItemLinkedItemItem) => item.relation.url ?? `linked-${item.workItemId}`),
    );
  }

  override updateTreeItem(
    item: WorkItemLinkedItemItem | Exception,
    key: string,
    oldTreeItem: AbstractTreeItem<any> | undefined,
  ) {
    return (
      updateExceptionTreeItem(item, oldTreeItem) ??
      this.updateTreeItemImpl(item as WorkItemLinkedItemItem, key, oldTreeItem)
    );
  }

  updateTreeItemImpl(item: WorkItemLinkedItemItem, key: string, oldTreeItem: AbstractTreeItem<any> | undefined) {
    return createOrUpdateTreeItem(oldTreeItem, this.#treeItemConstructor, item);
  }
}
