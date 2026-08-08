import { inject } from "inversify";
import { Observable, switchMap } from "rxjs";
import { Constructor } from "../../../common/constructor";
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
import { isAgentItem, AgentItem } from "../items/AgentItem";
import { createAgentJobItem, type AgentJobItem } from "../items/AgentJobItem";
import { AgentPoolItem } from "../items/AgentPoolItem";
import type { AgentJobTreeItem } from "../treeItems/AgentJobTreeItem";

export class AgentJobTreePartProvider extends TreePartProvider<AgentJobItem | Exception, AgentItem | AgentPoolItem> {
  getItems(context: Observable<AgentItem | AgentPoolItem>): Observable<ItemInformation<AgentJobItem | Exception>> {
    return context.pipe(
      switchMap((context) => {
        const { refreshObservables, refreshObservable } = this.createRefreshObservables("agentJob");

        const taskAgentService = context.container.get<TaskAgentService>(types.TaskAgentService);
        // FIXME: convert this into setting
        const completedRequestCount = 100;
        const jobRequestsObservable = isAgentItem(context)
          ? taskAgentService.agentJobs(
              context.agentPoolId,
              (context as AgentItem).agent.id!,
              completedRequestCount,
              refreshObservable,
            )
          : taskAgentService.agentPoolJobs(context.agentPoolId, completedRequestCount, undefined, refreshObservable);

        return jobRequestsObservable.pipe(
          mapX((jobRequests) =>
            jobRequests.map((jobRequest) =>
              createAgentJobItem(
                context,
                isAgentItem(context) ? context.agent : undefined,
                jobRequest,
                refreshObservables,
              ),
            ),
          ),
          fromArray((item: AgentJobItem) => item.jobRequest.requestId!.toString(), { refreshObservables }),
        );
      }),
    );
  }

  #agentJobTreeItemConstructor: Constructor<AgentJobTreeItem>;
  constructor(
    @inject(types.AgentJobTreeItem)
    AgentJobTreeItemConstructor: Constructor<AgentJobTreeItem>,
  ) {
    super();
    this.#agentJobTreeItemConstructor = AgentJobTreeItemConstructor;
  }

  override updateTreeItem(item: AgentJobItem | Exception, key: string, oldTreeItem: AbstractTreeItem<any> | undefined) {
    return (
      updateExceptionTreeItem(item, oldTreeItem) ?? this.updateTreeItemImpl(item as AgentJobItem, key, oldTreeItem)
    );
  }

  updateTreeItemImpl(item: AgentJobItem, key: string, oldTreeItem: AbstractTreeItem<any> | undefined) {
    return createOrUpdateTreeItem(oldTreeItem, this.#agentJobTreeItemConstructor, item);
  }
}
