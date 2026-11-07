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
import { createWorkItemAreaPathItem, WorkItemAreaPathItem } from "../items/WorkItemAreaPathItem";
import { WorkItemAreaPathTreeItem } from "../treeItems/WorkItemAreaPathTreeItem";

export class AreaPathChildrenTreePartProvider extends TreePartProvider<
  WorkItemAreaPathItem | Exception,
  WorkItemAreaPathItem
> {
  #treeItemConstructor: Constructor<WorkItemAreaPathTreeItem>;

  constructor(
    @inject(types.PinnableWorkItemAreaPathTreeItem)
    treeItemConstructor: Constructor<WorkItemAreaPathTreeItem>,
  ) {
    super();
    this.#treeItemConstructor = treeItemConstructor;
  }

  getItems(context: Observable<WorkItemAreaPathItem>): Observable<ItemInformation<WorkItemAreaPathItem | Exception>> {
    return context.pipe(
      switchMap((context) =>
        of({
          items: (context.classificationNode.children ?? []).map((child) =>
            createWorkItemAreaPathItem(context, child, context.leafTypeNames, context.refreshObservables),
          ),
        }),
      ),
      // outside of switchMap, so that the items of the previous context are removed or updated, not added a second time
      fromArrayWithItemInformation((item: WorkItemAreaPathItem) => `${item.classificationNode.id}`),
    );
  }

  override updateTreeItem(
    item: WorkItemAreaPathItem | Exception,
    _key: string,
    oldTreeItem: AbstractTreeItem<any> | undefined,
  ) {
    return (
      updateExceptionTreeItem(item, oldTreeItem) ??
      createOrUpdateTreeItem(oldTreeItem, this.#treeItemConstructor, item as WorkItemAreaPathItem)
    );
  }
}
