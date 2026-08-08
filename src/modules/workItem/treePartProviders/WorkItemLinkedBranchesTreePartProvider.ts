import { inject } from "inversify";
import { Observable, of, switchMap } from "rxjs";
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
import { types } from "../../../generated/types";
import { parseBranchUrl } from "../WorkItemArtifactLink";
import { WorkItemLinkedItemItem, createWorkItemLinkedItemItem } from "../items/WorkItemLinkedItemItem";
import { WorkItemItem } from "../items/WorkItemItem";
import { isBranchRelation } from "../WorkItemArtifactLink";
import type { WorkItemLinkedBranchTreeItem } from "../treeItems/WorkItemLinkedBranchTreeItem";

export class WorkItemLinkedBranchesTreePartProvider extends TreePartProvider<
  WorkItemLinkedItemItem | Exception,
  WorkItemItem
> {
  #treeItemConstructor: Constructor<WorkItemLinkedBranchTreeItem>;

  constructor(
    @inject(types.WorkItemLinkedBranchTreeItem)
    treeItemConstructor: Constructor<WorkItemLinkedBranchTreeItem>,
  ) {
    super();
    this.#treeItemConstructor = treeItemConstructor;
  }

  getItems(context: Observable<WorkItemItem>): Observable<ItemInformation<WorkItemLinkedItemItem | Exception>> {
    return context.pipe(
      switchMap((context) => {
        const workItem = context.workItem;
        const relations = workItem?.relations?.filter((relation) => isBranchRelation(relation)) ?? [];
        return of(
          relations.map((relation) => {
            const item = createWorkItemLinkedItemItem(context, relation);
            return { ...item, branchName: parseBranchUrl(relation.url ?? "") };
          }),
        ).pipe(
          fromArray((item: WorkItemLinkedItemItem) => item.relation.url ?? `linked-branch-${item.workItemId}`, {}),
        );
      }),
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
