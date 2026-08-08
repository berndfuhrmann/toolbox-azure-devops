import { inject } from "inversify";
import { Observable, switchMap } from "rxjs";
import { QueryExpand } from "azure-devops-node-api/interfaces/WorkItemTrackingInterfaces";
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
import { WorkItemQueryFolderTreeItem } from "../treeItems/WorkItemQueryFolderTreeItem";
import { WorkItemQueryLeafTreeItem } from "../treeItems/WorkItemQueryLeafTreeItem";

export class QueryFolderChildrenTreePartProvider extends TreePartProvider<
  WorkItemQueryItem | Exception,
  WorkItemQueryItem
> {
  #folderTreeItemConstructor: Constructor<WorkItemQueryFolderTreeItem>;
  #leafTreeItemConstructor: Constructor<WorkItemQueryLeafTreeItem>;
  #settingsService: SettingsService;

  constructor(
    @inject(types.WorkItemQueryFolderTreeItem)
    folderTreeItemConstructor: Constructor<WorkItemQueryFolderTreeItem>,
    @inject(types.PinnableWorkItemQueryLeafTreeItem)
    leafTreeItemConstructor: Constructor<WorkItemQueryLeafTreeItem>,
    @inject(types.SettingsService)
    settingsService: SettingsService,
  ) {
    super();
    this.#folderTreeItemConstructor = folderTreeItemConstructor;
    this.#leafTreeItemConstructor = leafTreeItemConstructor;
    this.#settingsService = settingsService;
  }

  getItems(context: Observable<WorkItemQueryItem>): Observable<ItemInformation<WorkItemQueryItem | Exception>> {
    return context.pipe(
      switchMap((context) => {
        const { refreshObservables, refreshObservable } = this.createRefreshObservables("queryFolderChildren");
        const workItemTrackingService = context.container.get<WorkItemTrackingService>(types.WorkItemTrackingService);
        const queryId = context.queryItem.id ?? "";

        return workItemTrackingService
          .query(context.projectId, queryId, QueryExpand.Wiql, 1, false, false, refreshObservable)
          .pipe(
            mapX((folderItem) => {
              const children = folderItem.children ?? [];
              return children.map((child) => createWorkItemQueryItem(context, child, refreshObservables));
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
    if (updateExceptionTreeItem(item, oldTreeItem)) {
      return updateExceptionTreeItem(item, oldTreeItem)!;
    }
    const queryItem = item as WorkItemQueryItem;
    const constructor = queryItem.queryItem.isFolder ? this.#folderTreeItemConstructor : this.#leafTreeItemConstructor;
    return createOrUpdateTreeItem(oldTreeItem, constructor, queryItem);
  }
}
