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
import { CoreService } from "../../../generated/services";
import { types } from "../../../generated/types";
import { ProjectContext } from "../../core/items/ProjectItem";
import { createWorkItemTeamItem, WorkItemTeamItem } from "../items/WorkItemTeamItem";
import { WorkItemTeamTreeItem } from "../treeItems/WorkItemTeamTreeItem";

export abstract class TeamsTreePartProviderBase<Context extends ProjectContext> extends TreePartProvider<
  WorkItemTeamItem | Exception,
  Context
> {
  #workItemTeamTreeItemConstructor: Constructor<WorkItemTeamTreeItem>;
  #settingsSettings: SettingsService;
  #mine: boolean | undefined;

  constructor(
    workItemTeamTreeItemConstructor: Constructor<WorkItemTeamTreeItem>,
    settingsService: SettingsService,
    mine: boolean | undefined,
  ) {
    super();
    this.#workItemTeamTreeItemConstructor = workItemTeamTreeItemConstructor;
    this.#settingsSettings = settingsService;
    this.#mine = mine;
  }

  getItems(context: Observable<Context>): Observable<ItemInformation<WorkItemTeamItem | Exception>> {
    return context.pipe(
      switchMap((context) => {
        const { refreshObservables, refreshObservable } = this.createRefreshObservables("workItemTeam");
        return context.container
          .get<CoreService>(types.CoreService)
          .teams(context.projectId, this.#mine, refreshObservable)
          .pipe(
            mapX((teams) =>
              teams
                .filter((team) => team.projectId === context.projectId)
                .map((team) => createWorkItemTeamItem(context, team, refreshObservables)),
            ),
            fromArray((item: WorkItemTeamItem) => item.team.id ?? item.team.name ?? "", { refreshObservables }),
          );
      }),
    );
  }

  override updateTreeItem(
    item: WorkItemTeamItem | Exception,
    key: string,
    oldTreeItem: AbstractTreeItem<any> | undefined,
  ) {
    return (
      updateExceptionTreeItem(item, oldTreeItem) ?? this.updateTreeItemImpl(item as WorkItemTeamItem, key, oldTreeItem)
    );
  }

  updateTreeItemImpl(item: WorkItemTeamItem, _key: string, oldTreeItem: AbstractTreeItem<any> | undefined) {
    return createOrUpdateTreeItem(oldTreeItem, this.#workItemTeamTreeItemConstructor, item);
  }
}
