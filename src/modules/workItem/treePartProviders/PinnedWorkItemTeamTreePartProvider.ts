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
import { CoreService } from "../../../generated/services";
import { types } from "../../../generated/types";
import { createWorkItemTeamItem, WorkItemTeamItem } from "../items/WorkItemTeamItem";
import type { WorkItemTeamTreeItem } from "../treeItems/WorkItemTeamTreeItem";

type PinnedWorkItemTeamData = {
  projectId: string;
  teamId: string;
};

const pinnedWorkItemTeamSchema = Type.Object({
  projectId: Type.String(),
  teamId: Type.String(),
});

@injectable()
@injectFromHierarchy({
  extendConstructorArguments: false,
  extendProperties: true,
})
export class PinnedWorkItemTeamTreePartProvider extends PinnedItemTreePartProvider<WorkItemTeamItem & PinnedItem> {
  #workItemTeamTreeItemConstructor: Constructor<WorkItemTeamTreeItem<WorkItemTeamItem & PinnedItem>>;
  #settingsService: SettingsService;

  constructor(
    @inject(types.PinnableWorkItemTeamTreeItem)
    WorkItemTeamTreeItemConstructor: Constructor<WorkItemTeamTreeItem<WorkItemTeamItem & PinnedItem>>,
    @inject(types.SettingsService) SettingsService: SettingsService,
  ) {
    super("workItemTeam");
    this.#workItemTeamTreeItemConstructor = WorkItemTeamTreeItemConstructor;
    this.#settingsService = SettingsService;
  }

  updateTreeItemImpl(
    item: WorkItemTeamItem & PinnedItem,
    _key: string,
    oldTreeItem: AbstractTreeItem<any> | undefined,
  ) {
    return createOrUpdateTreeItem(oldTreeItem, this.#workItemTeamTreeItemConstructor, item);
  }

  public retrievePinned(container: Container, pinInfo: PinInfo) {
    const { accountContainer, account } = this.getAccountContext(container, pinInfo);
    const refreshObservable = this.createRefreshObservable();
    const coreService = accountContainer.get<CoreService>(types.CoreService);
    const parsed = this.#parseAndVerify(pinInfo.object);

    return combineLatestX([coreService.teams(parsed.projectId, undefined, refreshObservable), account]).pipe(
      autoRefresh(refreshObservable, this.#settingsService.autoRefreshInterval()),
      mapX(([teams, account]) => {
        const team = teams.find((team) => team.id === parsed.teamId);
        if (!team) {
          return createMissingItem(pinInfo.name, "users", pinInfo);
        }
        return createPinnedItem(
          createWorkItemTeamItem(
            { account, container: accountContainer, projectId: parsed.projectId, refreshObservables: {} },
            team,
            {},
          ),
        );
      }),
    );
  }

  #parseAndVerify(input: string) {
    const parsed = JSON.parse(input);
    return Value.Parse(pinnedWorkItemTeamSchema, parsed);
  }

  #serialize(data: PinnedWorkItemTeamData): string {
    return JSON.stringify(data);
  }

  public getPinInfo = (data: WorkItemTeamItem | MissingItem) =>
    missingSymbol in data
      ? data.pinInfo
      : {
          accountId: data.account.accountId,
          name: data.team.name ?? "Unknown Team",
          object: this.#serialize({
            projectId: data.projectId,
            teamId: data.team.id ?? "",
          }),
          type: this.type,
        };
}
