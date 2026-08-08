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
import { createWorkItemCurrentSprintByAssigneeScopeItem } from "../items/WorkItemCurrentSprintByAssigneeScopeItem";
import { createWorkItemCurrentSprintByStateScopeItem } from "../items/WorkItemCurrentSprintByStateScopeItem";
import { createWorkItemCurrentSprintUnassignedScopeItem } from "../items/WorkItemCurrentSprintUnassignedScopeItem";
import { WorkItemCurrentSprintItem, WorkItemCurrentSprintScopeItem } from "../items/WorkItemCurrentSprintItem";
import { WorkItemCurrentSprintByAssigneeScopeTreeItem } from "../treeItems/WorkItemCurrentSprintByAssigneeScopeTreeItem";
import { WorkItemCurrentSprintByStateScopeTreeItem } from "../treeItems/WorkItemCurrentSprintByStateScopeTreeItem";
import { WorkItemCurrentSprintUnassignedScopeTreeItem } from "../treeItems/WorkItemCurrentSprintUnassignedScopeTreeItem";

//TODO: Consider making this a StaticTreePartProvider
export class CurrentSprintScopeTreePartProvider extends TreePartProvider<
  WorkItemCurrentSprintScopeItem | Exception,
  WorkItemCurrentSprintItem
> {
  getItems(
    context: Observable<WorkItemCurrentSprintItem>,
  ): Observable<ItemInformation<WorkItemCurrentSprintScopeItem | Exception>> {
    return context.pipe(
      switchMap((context) => {
        return of([
          createWorkItemCurrentSprintByAssigneeScopeItem(context, context.refreshObservables),
          createWorkItemCurrentSprintByStateScopeItem(context, context.refreshObservables),
          createWorkItemCurrentSprintUnassignedScopeItem(context, context.refreshObservables),
        ]).pipe(fromArray((item: WorkItemCurrentSprintScopeItem) => item.scope, {}));
      }),
    );
  }

  #byAssigneeTreeItemConstructor: Constructor<WorkItemCurrentSprintByAssigneeScopeTreeItem>;
  #byStateTreeItemConstructor: Constructor<WorkItemCurrentSprintByStateScopeTreeItem>;
  #unassignedTreeItemConstructor: Constructor<WorkItemCurrentSprintUnassignedScopeTreeItem>;
  constructor(
    @inject(types.WorkItemCurrentSprintByAssigneeScopeTreeItem)
    byAssigneeTreeItemConstructor: Constructor<WorkItemCurrentSprintByAssigneeScopeTreeItem>,
    @inject(types.WorkItemCurrentSprintByStateScopeTreeItem)
    byStateTreeItemConstructor: Constructor<WorkItemCurrentSprintByStateScopeTreeItem>,
    @inject(types.WorkItemCurrentSprintUnassignedScopeTreeItem)
    unassignedTreeItemConstructor: Constructor<WorkItemCurrentSprintUnassignedScopeTreeItem>,
  ) {
    super();
    this.#byAssigneeTreeItemConstructor = byAssigneeTreeItemConstructor;
    this.#byStateTreeItemConstructor = byStateTreeItemConstructor;
    this.#unassignedTreeItemConstructor = unassignedTreeItemConstructor;
  }

  override updateTreeItem(
    item: WorkItemCurrentSprintScopeItem | Exception,
    key: string,
    oldTreeItem: AbstractTreeItem<any> | undefined,
  ) {
    return (
      updateExceptionTreeItem(item, oldTreeItem) ??
      this.updateTreeItemImpl(item as WorkItemCurrentSprintScopeItem, key, oldTreeItem)
    );
  }

  updateTreeItemImpl(
    item: WorkItemCurrentSprintScopeItem,
    _key: string,
    oldTreeItem: AbstractTreeItem<any> | undefined,
  ) {
    if (item.scope === "byAssignee") {
      return createOrUpdateTreeItem(oldTreeItem, this.#byAssigneeTreeItemConstructor, item);
    }
    if (item.scope === "byState") {
      return createOrUpdateTreeItem(oldTreeItem, this.#byStateTreeItemConstructor, item);
    }
    return createOrUpdateTreeItem(oldTreeItem, this.#unassignedTreeItemConstructor, item);
  }
}
