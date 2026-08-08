import * as CoreInterfaces from "azure-devops-node-api/interfaces/CoreInterfaces";
import { map, Observable, of, switchMap } from "rxjs";
import { Constructor } from "../../../common/constructor";
import { Exception, isException } from "../../../common/Exception";
import { switchMapX } from "../../../common/exceptionOperators";
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
import { withItemObservable } from "../../../common/treePartProvider/withItemObservable";
import { WorkItemTrackingService } from "../../../generated/services";
import { types } from "../../../generated/types";
import { ProjectContext } from "../../core/items/ProjectItem";
import { createWorkItemItem, type WorkItemItem } from "../items/WorkItemItem";
import { loadWorkItem } from "../services/loadWorkItem";
import { loadWorkItemIcon } from "../services/WorkItemTypeIconService";
import type { WorkItemTreeItem } from "../treeItems/WorkItemTreeItem";

export type WorkItemQueryParams = { query: string; teamContext: CoreInterfaces.TeamContext | undefined; top?: number };

export abstract class AbstractWorkItemQueryTreePartProvider<TContext extends ProjectContext> extends TreePartProvider<
  WorkItemItem | Exception,
  TContext
> {
  #treeItemConstructor: Constructor<WorkItemTreeItem>;
  #settingsService: SettingsService;

  constructor(treeItemConstructor: Constructor<WorkItemTreeItem>, settingsService: SettingsService) {
    super();
    this.#treeItemConstructor = treeItemConstructor;
    this.#settingsService = settingsService;
  }

  protected abstract getRefreshKey(): string;

  protected abstract buildQuery(
    context: TContext,
    refreshObservable: Observable<number>,
  ): Observable<WorkItemQueryParams | Exception | null>;

  getItems(context: Observable<TContext>): Observable<ItemInformation<WorkItemItem | Exception>> {
    return context.pipe(
      switchMap((ctx) => {
        const { refreshObservables, refreshObservable } = this.createRefreshObservables(this.getRefreshKey());
        const workItemTrackingService = ctx.container.get<WorkItemTrackingService>(types.WorkItemTrackingService);

        return this.buildQuery(ctx, refreshObservable).pipe(
          switchMap((queryParams) => {
            if (isException(queryParams) || !queryParams) {
              return of(queryParams ?? []);
            }

            return workItemTrackingService
              .queryByWiql(
                { query: queryParams.query },
                queryParams.teamContext,
                undefined,
                queryParams.top,
                refreshObservable,
              )
              .pipe(
                switchMapX((queryResult) => {
                  if (!queryResult.workItems?.length) {
                    return of([]);
                  }
                  const ids = queryResult.workItems.map((workItem) => workItem.id!);
                  return of(ids.map((id) => createWorkItemItem(ctx, id, undefined, undefined, refreshObservables)));
                }),
              );
          }),
          autoRefresh(refreshObservable, this.#settingsService.autoRefreshInterval()),
          fromArray((item: WorkItemItem) => `${item.workItemId}`, { refreshObservables }),
          withItemObservable((inputObservable) =>
            inputObservable.pipe(
              loadWorkItem((item) => this.appendRefreshObservable(item, "workItem")),
              loadWorkItemIcon((item) => this.appendRefreshObservable(item, "workItemIcons")),
            ),
          ),
        );
      }),
    );
  }

  override updateTreeItem(
    item: WorkItemItem | Exception,
    _key: string,
    oldTreeItem: AbstractTreeItem<any> | undefined,
  ) {
    return (
      updateExceptionTreeItem(item, oldTreeItem) ??
      createOrUpdateTreeItem(oldTreeItem, this.#treeItemConstructor, item as WorkItemItem)
    );
  }
}
