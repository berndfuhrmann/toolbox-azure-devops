import { inject } from "inversify";
import { Observable, switchMap } from "rxjs";
import { Exception } from "../../../common/Exception";
import { mapX } from "../../../common/exceptionOperators";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { fromArray } from "../../../common/treePartProvider/fromArray";
import {
  ItemInformation,
  createOrUpdateTreeItem,
  TreePartProvider,
} from "../../../common/treePartProvider/TreePartProvider";
import { updateExceptionTreeItem } from "../../../common/treePartProvider/updateExceptionTreeItem";
import { TaskAgentService } from "../../../generated/services";
import { types } from "../../../generated/types";
import { SettingsService } from "../../../common/SettingsService";
import type { ProjectContext } from "../../core/items/ProjectItem";
import { createAgentPoolItem, type AgentPoolItem } from "../items/AgentPoolItem";
import type { AgentPoolTreeItem } from "../treeItems/AgentPoolTreeItem";
import { Constructor } from "../../../common/constructor";

export class AgentPoolTreePartProvider extends TreePartProvider<AgentPoolItem | Exception, ProjectContext> {
  getItems(context: Observable<ProjectContext>): Observable<ItemInformation<AgentPoolItem | Exception>> {
    return context.pipe(
      switchMap((context) => {
        const { refreshObservables, refreshObservable } = this.createRefreshObservables("agentPool");
        return context.container
          .get<TaskAgentService>(types.TaskAgentService)
          .agentPools(refreshObservable)
          .pipe(
            mapX((agentPools) =>
              agentPools.map((agentPool) => createAgentPoolItem(context, agentPool, refreshObservables)),
            ),
            fromArray((item: AgentPoolItem) => item.agentPoolId.toString(), { refreshObservables }),
          );
      }),
    );
  }

  #agentPoolTreeItemConstructor: Constructor<AgentPoolTreeItem>;
  #settingsSettings: SettingsService;
  constructor(
    @inject(types.PinnableAgentPoolTreeItem)
    AgentPoolTreeItemConstructor: Constructor<AgentPoolTreeItem>,
    @inject(types.SettingsService)
    SettingsService: SettingsService,
  ) {
    super();
    this.#agentPoolTreeItemConstructor = AgentPoolTreeItemConstructor;
    this.#settingsSettings = SettingsService;
  }

  override updateTreeItem(
    item: AgentPoolItem | Exception,
    key: string,
    oldTreeItem: AbstractTreeItem<any> | undefined,
  ) {
    return (
      updateExceptionTreeItem(item, oldTreeItem) ?? this.updateTreeItemImpl(item as AgentPoolItem, key, oldTreeItem)
    );
  }

  updateTreeItemImpl(item: AgentPoolItem, key: string, oldTreeItem: AbstractTreeItem<any> | undefined) {
    return createOrUpdateTreeItem(oldTreeItem, this.#agentPoolTreeItemConstructor, item);
  }
}
