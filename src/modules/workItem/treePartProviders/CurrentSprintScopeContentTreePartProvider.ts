import { inject } from "inversify";
import { map, Observable, of, switchMap } from "rxjs";
import { Constructor } from "../../../common/constructor";
import { Exception, isException } from "../../../common/Exception";
import { mapX, switchMapX } from "../../../common/exceptionOperators";
import { autoRefresh } from "../../../common/operators";
import { SettingsService } from "../../../common/SettingsService";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { fromArray } from "../../../common/treePartProvider/fromArray";
import { withItemObservable } from "../../../common/treePartProvider/withItemObservable";
import {
  ItemInformation,
  createOrUpdateTreeItem,
  TreePartProvider,
} from "../../../common/treePartProvider/TreePartProvider";
import { updateExceptionTreeItem } from "../../../common/treePartProvider/updateExceptionTreeItem";
import { WorkItemTrackingService } from "../../../generated/services";
import { fetchWorkItemsInBatches } from "../workItemFetch";
import { types } from "../../../generated/types";
import { getAssignedTo, getState } from "../../workItemTracking/fields";
import {
  createWorkItemCurrentSprintGroupItem,
  WorkItemCurrentSprintGroupItem,
  WorkItemCurrentSprintGroupType,
} from "../items/WorkItemCurrentSprintGroupItem";
import { WorkItemCurrentSprintScopeItem } from "../items/WorkItemCurrentSprintItem";
import { createWorkItemItem, isWorkItemItem, WorkItemItem } from "../items/WorkItemItem";
import { WorkItemCurrentSprintGroupTreeItem } from "../treeItems/WorkItemCurrentSprintGroupTreeItem";
import { WorkItemTreeItem } from "../treeItems/WorkItemTreeItem";
import { loadWorkItemIcon } from "../services/WorkItemTypeIconService";

type CurrentSprintScopeContentItem = WorkItemCurrentSprintGroupItem | WorkItemItem;

export class CurrentSprintScopeContentTreePartProvider extends TreePartProvider<
  CurrentSprintScopeContentItem | Exception,
  WorkItemCurrentSprintScopeItem
> {
  static #createWorkItemQuery(iterationPath: string) {
    const escapedIterationPath = iterationPath.replace(/'/g, "''");
    return {
      query: `SELECT [System.Id], [System.Title], [System.State], [System.WorkItemType], [System.AssignedTo], [System.IterationPath]
            FROM WorkItems
            WHERE [System.TeamProject] = @project
            AND [System.IterationPath] UNDER '${escapedIterationPath}'
            AND [System.State] <> 'Done'
            AND [System.State] <> 'Removed'
            ORDER BY [System.ChangedDate] DESC`,
    };
  }

  getItems(
    context: Observable<WorkItemCurrentSprintScopeItem>,
  ): Observable<ItemInformation<CurrentSprintScopeContentItem | Exception>> {
    return context.pipe(
      switchMap((context) => {
        const { refreshObservables, refreshObservable } = this.createRefreshObservables(
          "workItemCurrentSprintScopeContent",
        );

        const workItemTrackingService = context.container.get<WorkItemTrackingService>(types.WorkItemTrackingService);

        return workItemTrackingService
          .queryByWiql(
            CurrentSprintScopeContentTreePartProvider.#createWorkItemQuery(context.sprint.path ?? ""),
            { project: context.projectId },
            undefined,
            undefined,
            refreshObservable,
          )
          .pipe(
            switchMapX((queryResult) => {
              if (!queryResult.workItems || queryResult.workItems.length === 0) {
                return of([]);
              }

              const workItemIds = queryResult.workItems.map((workItem) => workItem.id!);
              return fetchWorkItemsInBatches(
                workItemIds,
                context.projectId,
                workItemTrackingService,
                refreshObservable,
              ).pipe(
                mapX((workItems) => {
                  if (!workItems.length) {
                    return [];
                  }
                  return this.#toScopeItems(
                    context,
                    workItems.map((workItem) =>
                      createWorkItemItem(context, workItem.id!, workItem, undefined, refreshObservables),
                    ),
                  );
                }),
              );
            }),
            autoRefresh(refreshObservable, this.#settingsSettings.autoRefreshInterval()),
            fromArray(
              (item: CurrentSprintScopeContentItem) => {
                if (isWorkItemItem(item)) {
                  return `${item.workItemId}`;
                }
                return `${item.grouping}/${item.groupName}`;
              },
              { refreshObservables },
            ),
            withItemObservable((inputObservable: Observable<CurrentSprintScopeContentItem | Exception>) =>
              inputObservable.pipe(
                switchMap((item): Observable<CurrentSprintScopeContentItem | Exception> => {
                  if (isException(item) || !isWorkItemItem(item)) {
                    return of(item);
                  }
                  return (of(item) as Observable<WorkItemItem>).pipe(
                    loadWorkItemIcon((i) => this.appendRefreshObservable(i, "workItemIcons")),
                  );
                }),
              ),
            ),
            map((info) => ({ ...info, refreshObservables })),
          );
      }),
    );
  }

  #toScopeItems(context: WorkItemCurrentSprintScopeItem, workItems: WorkItemItem[]): CurrentSprintScopeContentItem[] {
    switch (context.scope) {
      case "unassigned":
        return workItems.filter((workItem) => getAssignedTo(workItem.workItem!) === undefined); //FIXME: handle undefined workItem
      case "byAssignee":
        return this.#groupItems(context, workItems, "assignee", (workItem) => getAssignedTo(workItem.workItem!)); //FIXME: handle undefined workItem
      case "byState":
        return this.#groupItems(context, workItems, "state", (workItem) => getState(workItem.workItem!)); //FIXME: handle undefined workItem
    }
  }

  #groupItems(
    context: WorkItemCurrentSprintScopeItem,
    workItems: WorkItemItem[],
    grouping: WorkItemCurrentSprintGroupType,
    groupingSelector: (workItem: WorkItemItem) => string | undefined,
  ) {
    const grouped = new Map<string, WorkItemItem[]>();
    for (const workItem of workItems) {
      const groupName = groupingSelector(workItem);
      if (!groupName) {
        continue;
      }
      const existing = grouped.get(groupName);
      if (existing) {
        existing.push(workItem);
      } else {
        grouped.set(groupName, [workItem]);
      }
    }

    return [...grouped.entries()].map(([groupName, groupedWorkItems]) =>
      createWorkItemCurrentSprintGroupItem(context, grouping, groupName, groupedWorkItems, context.refreshObservables),
    );
  }

  #workItemTreeItemConstructor: Constructor<WorkItemTreeItem>;
  #workItemCurrentSprintGroupTreeItemConstructor: Constructor<WorkItemCurrentSprintGroupTreeItem>;
  #settingsSettings: SettingsService;
  constructor(
    @inject(types.PinnableWorkItemTreeItem)
    WorkItemTreeItemConstructor: Constructor<WorkItemTreeItem>,
    @inject(types.WorkItemCurrentSprintGroupTreeItem)
    WorkItemCurrentSprintGroupTreeItemConstructor: Constructor<WorkItemCurrentSprintGroupTreeItem>,
    @inject(types.SettingsService)
    SettingsService: SettingsService,
  ) {
    super();
    this.#workItemTreeItemConstructor = WorkItemTreeItemConstructor;
    this.#workItemCurrentSprintGroupTreeItemConstructor = WorkItemCurrentSprintGroupTreeItemConstructor;
    this.#settingsSettings = SettingsService;
  }

  override updateTreeItem(
    item: CurrentSprintScopeContentItem | Exception,
    key: string,
    oldTreeItem: AbstractTreeItem<any> | undefined,
  ) {
    if (isException(item)) {
      return updateExceptionTreeItem(item, oldTreeItem)!;
    }

    if (isWorkItemItem(item)) {
      return createOrUpdateTreeItem(oldTreeItem, this.#workItemTreeItemConstructor, item);
    }

    return createOrUpdateTreeItem(oldTreeItem, this.#workItemCurrentSprintGroupTreeItemConstructor, item);
  }
}
