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
import {
  WorkItemRevisionFieldChangeItem,
  createWorkItemRevisionFieldChangeItem,
} from "../items/WorkItemRevisionFieldChangeItem";
import { WorkItemRevisionItem } from "../items/WorkItemRevisionItem";
import type { WorkItemRevisionFieldChangeTreeItem } from "../treeItems/WorkItemRevisionFieldChangeTreeItem";

const noiseFields = new Set([
  "System.Watermark",
  "System.ChangedDate",
  "System.ChangedBy",
  "System.Rev",
  "System.AuthorizedDate",
  "System.RevisedDate",
  "System.AuthorizedAs",
]);

export class WorkItemRevisionFieldsTreePartProvider extends TreePartProvider<
  WorkItemRevisionFieldChangeItem | Exception,
  WorkItemRevisionItem
> {
  #treeItemConstructor: Constructor<WorkItemRevisionFieldChangeTreeItem>;

  constructor(
    @inject(types.WorkItemRevisionFieldChangeTreeItem)
    treeItemConstructor: Constructor<WorkItemRevisionFieldChangeTreeItem>,
  ) {
    super();
    this.#treeItemConstructor = treeItemConstructor;
  }

  getItems(
    context: Observable<WorkItemRevisionItem>,
  ): Observable<ItemInformation<WorkItemRevisionFieldChangeItem | Exception>> {
    return context.pipe(
      switchMap((revisionContext) => {
        const fields = revisionContext.update.fields ?? {};
        const items = Object.entries(fields)
          .filter(([fieldName]) => !noiseFields.has(fieldName))
          .map(([fieldName, change]) =>
            createWorkItemRevisionFieldChangeItem(revisionContext, fieldName, change.oldValue, change.newValue),
          );
        return of(items).pipe(
          fromArray((item: WorkItemRevisionFieldChangeItem) => `${item.rev}-${item.fieldReferenceName}`, {}),
        );
      }),
    );
  }

  override updateTreeItem(
    item: WorkItemRevisionFieldChangeItem | Exception,
    key: string,
    oldTreeItem: AbstractTreeItem<any> | undefined,
  ) {
    return (
      updateExceptionTreeItem(item, oldTreeItem) ??
      this.updateTreeItemImpl(item as WorkItemRevisionFieldChangeItem, key, oldTreeItem)
    );
  }

  updateTreeItemImpl(
    item: WorkItemRevisionFieldChangeItem,
    key: string,
    oldTreeItem: AbstractTreeItem<any> | undefined,
  ) {
    return createOrUpdateTreeItem(oldTreeItem, this.#treeItemConstructor, item);
  }
}
