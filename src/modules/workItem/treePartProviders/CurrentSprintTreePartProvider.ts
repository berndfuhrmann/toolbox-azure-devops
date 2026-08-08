import { inject } from "inversify";
import { Observable, switchMap } from "rxjs";
import { Constructor } from "../../../common/constructor";
import { Exception } from "../../../common/Exception";
import { mapX } from "../../../common/exceptionOperators";
import { SettingsService } from "../../../common/SettingsService";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { fromArray } from "../../../common/treePartProvider/fromArray";
import {
  ItemInformation,
  createOrUpdateTreeItem,
  TreePartProvider,
} from "../../../common/treePartProvider/TreePartProvider";
import { updateExceptionTreeItem } from "../../../common/treePartProvider/updateExceptionTreeItem";
import { WorkService } from "../../../generated/services";
import { types } from "../../../generated/types";
import { createWorkItemCurrentSprintItem, WorkItemCurrentSprintItem } from "../items/WorkItemCurrentSprintItem";
import { WorkItemTeamItem } from "../items/WorkItemTeamItem";
import { WorkItemCurrentSprintTreeItem } from "../treeItems/WorkItemCurrentSprintTreeItem";

export class CurrentSprintTreePartProvider extends TreePartProvider<
  WorkItemCurrentSprintItem | Exception,
  WorkItemTeamItem
> {
  getItems(context: Observable<WorkItemTeamItem>): Observable<ItemInformation<WorkItemCurrentSprintItem | Exception>> {
    return context.pipe(
      switchMap((context) => {
        const { refreshObservables, refreshObservable } = this.createRefreshObservables("workItemCurrentSprint");
        const workService = context.container.get<WorkService>(types.WorkService);
        return workService
          .teamIterations(
            {
              projectId: context.projectId,
              teamId: context.team.id,
            },
            undefined,
            refreshObservable,
          )
          .pipe(
            mapX((iterations) =>
              iterations.map((iteration) => createWorkItemCurrentSprintItem(context, iteration, refreshObservables)),
            ),
            fromArray(
              (item: WorkItemCurrentSprintItem) => item.sprint.id ?? item.sprint.path ?? item.sprint.name ?? "",
              { refreshObservables },
            ),
          );
      }),
    );
  }

  #workItemCurrentSprintTreeItemConstructor: Constructor<WorkItemCurrentSprintTreeItem>;
  #settingsSettings: SettingsService;
  constructor(
    @inject(types.WorkItemCurrentSprintTreeItem)
    WorkItemCurrentSprintTreeItemConstructor: Constructor<WorkItemCurrentSprintTreeItem>,
    @inject(types.SettingsService)
    SettingsService: SettingsService,
  ) {
    super();
    this.#workItemCurrentSprintTreeItemConstructor = WorkItemCurrentSprintTreeItemConstructor;
    this.#settingsSettings = SettingsService;
  }

  override updateTreeItem(
    item: WorkItemCurrentSprintItem | Exception,
    key: string,
    oldTreeItem: AbstractTreeItem<any> | undefined,
  ) {
    return (
      updateExceptionTreeItem(item, oldTreeItem) ??
      this.updateTreeItemImpl(item as WorkItemCurrentSprintItem, key, oldTreeItem)
    );
  }

  updateTreeItemImpl(item: WorkItemCurrentSprintItem, _key: string, oldTreeItem: AbstractTreeItem<any> | undefined) {
    return createOrUpdateTreeItem(oldTreeItem, this.#workItemCurrentSprintTreeItemConstructor, item);
  }
}
