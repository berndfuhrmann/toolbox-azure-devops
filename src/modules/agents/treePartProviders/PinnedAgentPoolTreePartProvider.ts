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
import { createAgentPoolItem, AgentPoolItem } from "../items/AgentPoolItem";
import type { AgentPoolTreeItem } from "../treeItems/AgentPoolTreeItem";

type PinnedAgentPoolData = {
  agentPoolId: number;
  projectId: string;
};

const pinnedAgentPoolSchema = Type.Object({
  agentPoolId: Type.Number(),
  projectId: Type.String(),
});

@injectable()
@injectFromHierarchy({
  extendConstructorArguments: false,
  extendProperties: true,
})
export class PinnedAgentPoolTreePartProvider extends PinnedItemTreePartProvider<AgentPoolItem & PinnedItem> {
  #agentPoolTreeItemConstructor: Constructor<AgentPoolTreeItem<AgentPoolItem & PinnedItem>>;
  #settingsService: SettingsService;

  constructor(
    @inject(types.PinnableAgentPoolTreeItem)
    AgentPoolTreeItemConstructor: Constructor<AgentPoolTreeItem<AgentPoolItem & PinnedItem>>,
    @inject(types.SettingsService) SettingsService: SettingsService,
  ) {
    super("agentPool");
    this.#agentPoolTreeItemConstructor = AgentPoolTreeItemConstructor;
    this.#settingsService = SettingsService;
  }

  updateTreeItemImpl(item: AgentPoolItem & PinnedItem, _key: string, oldTreeItem: AbstractTreeItem<any> | undefined) {
    return createOrUpdateTreeItem(oldTreeItem, this.#agentPoolTreeItemConstructor, item);
  }

  public retrievePinned(container: Container, pinInfo: PinInfo) {
    const { accountContainer, account } = this.getAccountContext(container, pinInfo);
    const refreshObservable = this.createRefreshObservable();
    const taskAgentService = accountContainer.get<TaskAgentService>(types.TaskAgentService);
    const parsed = this.#parseAndVerify(pinInfo.object);

    return combineLatestX([taskAgentService.agentPools(refreshObservable), account]).pipe(
      autoRefresh(refreshObservable, this.#settingsService.autoRefreshInterval()),
      mapX(([agentPools, account]) => {
        const agentPool = agentPools.find((pool) => pool.id === parsed.agentPoolId);
        if (!agentPool) {
          return createMissingItem(pinInfo.name, "server", pinInfo);
        }
        return createPinnedItem(
          createAgentPoolItem(
            { account, container: accountContainer, projectId: parsed.projectId, refreshObservables: {} },
            agentPool,
            {},
          ),
        );
      }),
    );
  }

  #parseAndVerify(input: string) {
    const parsed = JSON.parse(input);
    return Value.Parse(pinnedAgentPoolSchema, parsed);
  }

  #serialize(data: PinnedAgentPoolData): string {
    return JSON.stringify(data);
  }

  public getPinInfo = (data: AgentPoolItem | MissingItem) =>
    missingSymbol in data
      ? data.pinInfo
      : {
          accountId: data.account.accountId,
          name: data.agentPool.name ?? "Unknown Agent Pool",
          object: this.#serialize({
            agentPoolId: data.agentPoolId,
            projectId: data.projectId,
          }),
          type: this.type,
        };
}
