import { inject } from "inversify";
import { Observable, switchMap } from "rxjs";
import { QueryExpand, QueryHierarchyItem } from "azure-devops-node-api/interfaces/WorkItemTrackingInterfaces";
import { Constructor } from "../../../common/constructor";
import { Exception } from "../../../common/Exception";
import { mapX } from "../../../common/exceptionOperators";
import { autoRefresh } from "../../../common/operators";
import { SettingsService } from "../../../common/SettingsService";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { fromArray } from "../../../common/treePartProvider/fromArray";
import {
  ItemInformation,
  createOrUpdateTreeItem,
  TreePartProvider,
} from "../../../common/treePartProvider/TreePartProvider";
import { updateExceptionTreeItem } from "../../../common/treePartProvider/updateExceptionTreeItem";
import { WorkItemTrackingService } from "../../../generated/services";
import { types } from "../../../generated/types";
import { createWorkItemQueryItem, WorkItemQueryItem } from "../items/WorkItemQueryItem";
import type { ProjectContext } from "../../core/items/ProjectItem";
import { WorkItemQueryFolderTreeItem } from "../treeItems/WorkItemQueryFolderTreeItem";

export class QueriesContentTreePartProvider extends TreePartProvider<WorkItemQueryItem | Exception, ProjectContext> {
  #folderTreeItemConstructor: Constructor<WorkItemQueryFolderTreeItem>;
  #settingsService: SettingsService;

  constructor(
    @inject(types.WorkItemQueryFolderTreeItem)
    folderTreeItemConstructor: Constructor<WorkItemQueryFolderTreeItem>,
    @inject(types.SettingsService)
    settingsService: SettingsService,
  ) {
    super();
    this.#folderTreeItemConstructor = folderTreeItemConstructor;
    this.#settingsService = settingsService;
  }

  getItems(context: Observable<ProjectContext>): Observable<ItemInformation<WorkItemQueryItem | Exception>> {
    return context.pipe(
      switchMap((context) => {
        const { refreshObservables, refreshObservable } = this.createRefreshObservables("queriesContent");
        const workItemTrackingService = context.container.get<WorkItemTrackingService>(types.WorkItemTrackingService);

        return workItemTrackingService.queries(context.projectId, QueryExpand.None, 0, false, refreshObservable).pipe(
          mapX((rootFolders) => {
            const folders =
              ((rootFolders as any).value as QueryHierarchyItem[] | undefined) ??
              (Array.isArray(rootFolders) ? rootFolders : []);
            return folders.map((folder) => createWorkItemQueryItem(context, folder, refreshObservables));
          }),
          autoRefresh(refreshObservable, this.#settingsService.autoRefreshInterval()),
          fromArray((item: WorkItemQueryItem) => item.queryItem.id ?? item.queryItem.name ?? "", {
            refreshObservables,
          }),
        );
      }),
    );
  }

  override updateTreeItem(
    item: WorkItemQueryItem | Exception,
    _key: string,
    oldTreeItem: AbstractTreeItem<any> | undefined,
  ) {
    return (
      updateExceptionTreeItem(item, oldTreeItem) ??
      createOrUpdateTreeItem(oldTreeItem, this.#folderTreeItemConstructor, item as WorkItemQueryItem)
    );
  }
}
