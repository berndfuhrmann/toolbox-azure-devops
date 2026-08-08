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
import type { AgentPoolContext } from "../items/AgentPoolItem";
import { createAgentItem, type AgentItem } from "../items/AgentItem";
import type { AgentTreeItem } from "../treeItems/AgentTreeItem";
import { Constructor } from "../../../common/constructor";

export class AgentTreePartProvider extends TreePartProvider<AgentItem | Exception, AgentPoolContext> {
  getItems(context: Observable<AgentPoolContext>): Observable<ItemInformation<AgentItem | Exception>> {
    return context.pipe(
      switchMap((context) => {
        const { refreshObservables, refreshObservable } = this.createRefreshObservables("agent");
        return context.container
          .get<TaskAgentService>(types.TaskAgentService)
          .agents(context.agentPoolId, true, true, refreshObservable)
          .pipe(
            mapX((agents) => agents.map((agent) => createAgentItem(context, agent, refreshObservables))),
            fromArray((item: AgentItem) => item.agent.id!.toString(), { refreshObservables }),
          );
      }),
    );
  }

  #agentTreeItemConstructor: Constructor<AgentTreeItem>;
  constructor(
    @inject(types.PinnableAgentTreeItem)
    AgentTreeItemConstructor: Constructor<AgentTreeItem>,
  ) {
    super();
    this.#agentTreeItemConstructor = AgentTreeItemConstructor;
  }

  override updateTreeItem(item: AgentItem | Exception, key: string, oldTreeItem: AbstractTreeItem<any> | undefined) {
    return updateExceptionTreeItem(item, oldTreeItem) ?? this.updateTreeItemImpl(item as AgentItem, key, oldTreeItem);
  }

  updateTreeItemImpl(item: AgentItem, key: string, oldTreeItem: AbstractTreeItem<any> | undefined) {
    return createOrUpdateTreeItem(oldTreeItem, this.#agentTreeItemConstructor, item);
  }
}
