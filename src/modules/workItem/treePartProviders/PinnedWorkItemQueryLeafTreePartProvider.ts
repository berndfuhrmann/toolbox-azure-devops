import { Type } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import { QueryExpand } from "azure-devops-node-api/interfaces/WorkItemTrackingInterfaces";
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
import { WorkItemTrackingService } from "../../../generated/services";
import { types } from "../../../generated/types";
import { createWorkItemQueryItem, WorkItemQueryItem } from "../items/WorkItemQueryItem";
import type { WorkItemQueryLeafTreeItem } from "../treeItems/WorkItemQueryLeafTreeItem";

type PinnedWorkItemQueryData = {
  projectId: string;
  queryId: string;
};

const pinnedWorkItemQuerySchema = Type.Object({
  projectId: Type.String(),
  queryId: Type.String(),
});

@injectable()
@injectFromHierarchy({
  extendConstructorArguments: false,
  extendProperties: true,
})
export class PinnedWorkItemQueryLeafTreePartProvider extends PinnedItemTreePartProvider<
  WorkItemQueryItem & PinnedItem
> {
  #workItemQueryLeafTreeItemConstructor: Constructor<WorkItemQueryLeafTreeItem<WorkItemQueryItem & PinnedItem>>;
  #settingsService: SettingsService;

  constructor(
    @inject(types.PinnableWorkItemQueryLeafTreeItem)
    WorkItemQueryLeafTreeItemConstructor: Constructor<WorkItemQueryLeafTreeItem<WorkItemQueryItem & PinnedItem>>,
    @inject(types.SettingsService) SettingsService: SettingsService,
  ) {
    super("workItemQuery");
    this.#workItemQueryLeafTreeItemConstructor = WorkItemQueryLeafTreeItemConstructor;
    this.#settingsService = SettingsService;
  }

  updateTreeItemImpl(
    item: WorkItemQueryItem & PinnedItem,
    _key: string,
    oldTreeItem: AbstractTreeItem<any> | undefined,
  ) {
    return createOrUpdateTreeItem(oldTreeItem, this.#workItemQueryLeafTreeItemConstructor, item);
  }

  public retrievePinned(container: Container, pinInfo: PinInfo) {
    const { accountContainer, account } = this.getAccountContext(container, pinInfo);
    const refreshObservable = this.createRefreshObservable();
    const workItemTrackingService = accountContainer.get<WorkItemTrackingService>(types.WorkItemTrackingService);
    const parsed = this.#parseAndVerify(pinInfo.object);

    return combineLatestX([
      workItemTrackingService.query(
        parsed.projectId,
        parsed.queryId,
        QueryExpand.Wiql,
        1,
        false,
        false,
        refreshObservable,
      ),
      account,
    ]).pipe(
      autoRefresh(refreshObservable, this.#settingsService.autoRefreshInterval()),
      mapX(([queryItem, account]) => {
        if (!queryItem) {
          return createMissingItem(pinInfo.name, "list-details", pinInfo);
        }
        return createPinnedItem(
          createWorkItemQueryItem(
            { account, container: accountContainer, projectId: parsed.projectId, refreshObservables: {} },
            queryItem,
            {},
          ),
        );
      }),
    );
  }

  #parseAndVerify(input: string) {
    const parsed = JSON.parse(input);
    return Value.Parse(pinnedWorkItemQuerySchema, parsed);
  }

  #serialize(data: PinnedWorkItemQueryData): string {
    return JSON.stringify(data);
  }

  public getPinInfo = (data: WorkItemQueryItem | MissingItem) =>
    missingSymbol in data
      ? data.pinInfo
      : {
          accountId: data.account.accountId,
          name: data.queryItem.name ?? "Unknown Query",
          object: this.#serialize({
            projectId: data.projectId,
            queryId: data.queryItem.id ?? "",
          }),
          type: this.type,
        };
}
