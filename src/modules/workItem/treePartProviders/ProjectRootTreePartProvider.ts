import { inject } from "inversify";
import { Observable, of, switchMap } from "rxjs";
import { Constructor } from "../../../common/constructor";
import { Exception } from "../../../common/Exception";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { fromArray } from "../../../common/treePartProvider/fromArray";
import {
  createOrUpdateTreeItem,
  ItemInformation,
  TreePartProvider,
} from "../../../common/treePartProvider/TreePartProvider";
import { updateExceptionTreeItem } from "../../../common/treePartProvider/updateExceptionTreeItem";
import { types } from "../../../generated/types";
import type { ProjectContext } from "../../core/items/ProjectItem";
import {
  createAllTeamsItem,
  createAreaPathsItem,
  createWorkItemHierarchyItem,
  createMyTeamsItem,
  createMyWorkItem,
  createQueriesItem,
  WorkItemProjectRootItem,
} from "../items/WorkItemProjectRootItem";
import { AllTeamsTreeItem } from "../treeItems/AllTeamsTreeItem";
import { AreaPathsTreeItem } from "../treeItems/AreaPathsTreeItem";
import { WorkItemHierarchyTreeItem } from "../treeItems/WorkItemHierarchyTreeItem";
import { MyTeamsTreeItem } from "../treeItems/MyTeamsTreeItem";
import { MyWorkTreeItem } from "../treeItems/MyWorkTreeItem";
import { QueriesTreeItem } from "../treeItems/QueriesTreeItem";

// FIXME: Check if this TreePartProvider is really necessary. We could also work with a StaticTreePartProvider.

export class ProjectRootTreePartProvider extends TreePartProvider<WorkItemProjectRootItem | Exception, ProjectContext> {
  #treeItemConstructors: Record<
    WorkItemProjectRootItem["type"],
    Constructor<
      | MyWorkTreeItem
      | MyTeamsTreeItem
      | AllTeamsTreeItem
      | WorkItemHierarchyTreeItem
      | AreaPathsTreeItem
      | QueriesTreeItem
    >
  >;

  constructor(
    @inject(types.MyWorkTreeItem)
    MyWorkTreeItemConstructor: Constructor<MyWorkTreeItem>,
    @inject(types.MyTeamsTreeItem)
    MyTeamsTreeItemConstructor: Constructor<MyTeamsTreeItem>,
    @inject(types.AllTeamsTreeItem)
    AllTeamsTreeItemConstructor: Constructor<AllTeamsTreeItem>,
    @inject(types.WorkItemHierarchyTreeItem)
    WorkItemHierarchyTreeItemConstructor: Constructor<WorkItemHierarchyTreeItem>,
    @inject(types.AreaPathsTreeItem)
    AreaPathsTreeItemConstructor: Constructor<AreaPathsTreeItem>,
    @inject(types.QueriesTreeItem)
    QueriesTreeItemConstructor: Constructor<QueriesTreeItem>,
  ) {
    super();
    this.#treeItemConstructors = {
      myWork: MyWorkTreeItemConstructor,
      myTeams: MyTeamsTreeItemConstructor,
      allTeams: AllTeamsTreeItemConstructor,
      workItemHierarchy: WorkItemHierarchyTreeItemConstructor,
      areaPaths: AreaPathsTreeItemConstructor,
      queries: QueriesTreeItemConstructor,
    };
  }

  getItems(context: Observable<ProjectContext>): Observable<ItemInformation<WorkItemProjectRootItem | Exception>> {
    return context.pipe(
      switchMap((project) => {
        return of([
          createMyWorkItem(project),
          createMyTeamsItem(project),
          createAllTeamsItem(project),
          createWorkItemHierarchyItem(project),
          createAreaPathsItem(project),
          createQueriesItem(project),
        ]).pipe(fromArray((item) => item.type, {}));
      }),
    );
  }

  override updateTreeItem(
    item: WorkItemProjectRootItem | Exception,
    _key: string,
    oldTreeItem: AbstractTreeItem<any> | undefined,
  ) {
    return (
      updateExceptionTreeItem(item, oldTreeItem) ??
      createOrUpdateTreeItem(oldTreeItem, this.#treeItemConstructors[(item as WorkItemProjectRootItem).type], item)
    );
  }
}
