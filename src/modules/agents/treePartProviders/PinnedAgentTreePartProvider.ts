import { Type } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import { Container, inject, injectable, injectFromHierarchy } from "inversify";
import { Constructor } from "../../../common/constructor";
import { combineLatestX, mapX } from "../../../common/exceptionOperators";
import { createMissingItem, MissingItem, missingSymbol } from "../../../common/items/MissingItem";
import { createPinnedItem, PinnedItem } from "../../../common/items/PinnedItem";
import { PinInfo } from "../../../common/items/PinnedTreeItemMixin";
import { autoRefresh } from "../../../common/operators";
import { SettingsService } from "../../../common/SettingsService";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { PinnedItemTreePartProvider } from "../../../common/treePartProvider/PinnedTreePartProvider";
import { createOrUpdateTreeItem } from "../../../common/treePartProvider/TreePartProvider";
import { TaskAgentService } from "../../../generated/services";
import { types } from "../../../generated/types";
import { createAgentItem, AgentItem } from "../items/AgentItem";
import type { AgentTreeItem } from "../treeItems/AgentTreeItem";

type PinnedAgentData = {
  agentPoolId: number;
  agentId: number;
  projectId: string;
};

const pinnedAgentSchema = Type.Object({
  agentPoolId: Type.Number(),
  agentId: Type.Number(),
  projectId: Type.String(),
});

@injectable()
@injectFromHierarchy({
  extendConstructorArguments: false,
  extendProperties: true,
})
export class PinnedAgentTreePartProvider extends PinnedItemTreePartProvider<AgentItem & PinnedItem> {
  #agentTreeItemConstructor: Constructor<AgentTreeItem<AgentItem & PinnedItem>>;
  #settingsService: SettingsService;

  constructor(
    @inject(types.PinnableAgentTreeItem)
    AgentTreeItemConstructor: Constructor<AgentTreeItem<AgentItem & PinnedItem>>,
    @inject(types.SettingsService) SettingsService: SettingsService,
  ) {
    super("agent");
    this.#agentTreeItemConstructor = AgentTreeItemConstructor;
    this.#settingsService = SettingsService;
  }

  updateTreeItemImpl(item: AgentItem & PinnedItem, _key: string, oldTreeItem: AbstractTreeItem<any> | undefined) {
    return createOrUpdateTreeItem(oldTreeItem, this.#agentTreeItemConstructor, item);
  }

  public retrievePinned(container: Container, pinInfo: PinInfo) {
    const { accountContainer, account } = this.getAccountContext(container, pinInfo);
    const refreshObservable = this.createRefreshObservable();
    const taskAgentService = accountContainer.get<TaskAgentService>(types.TaskAgentService);
    const parsed = this.#parseAndVerify(pinInfo.object);

    return combineLatestX([taskAgentService.agents(parsed.agentPoolId, true, true, refreshObservable), account]).pipe(
      autoRefresh(refreshObservable, this.#settingsService.autoRefreshInterval()),
      mapX(([agents, account]) => {
        const agent = agents.find((a) => a.id === parsed.agentId);
        if (!agent) {
          return createMissingItem(pinInfo.name, "user", pinInfo);
        }
        return createPinnedItem(
          createAgentItem(
            {
              account,
              container: accountContainer,
              projectId: parsed.projectId,
              agentPoolId: parsed.agentPoolId,
              refreshObservables: {},
            },
            agent,
            {},
          ),
        );
      }),
    );
  }

  #parseAndVerify(input: string) {
    const parsed = JSON.parse(input);
    return Value.Parse(pinnedAgentSchema, parsed);
  }

  #serialize(data: PinnedAgentData): string {
    return JSON.stringify(data);
  }

  public getPinInfo = (data: AgentItem | MissingItem) =>
    missingSymbol in data
      ? data.pinInfo
      : {
          accountId: data.account.accountId,
          name: data.agent.name ?? "Unknown Agent",
          object: this.#serialize({
            agentPoolId: data.agentPoolId,
            agentId: data.agent.id!,
            projectId: data.projectId,
          }),
          type: this.type,
        };
}
