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
      switchMap((context) => {
        return of(
          (context.classificationNode.children ?? []).map((child) =>
            createWorkItemAreaPathItem(context, child, context.leafTypeNames, context.refreshObservables),
          ),
        ).pipe(fromArray((item: WorkItemAreaPathItem) => `${item.classificationNode.id}`, {}));
      }),
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
