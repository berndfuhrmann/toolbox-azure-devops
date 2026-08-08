import { Type } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import { Container, inject, injectable, injectFromHierarchy } from "inversify";
import { map, of, startWith } from "rxjs";
import { Constructor } from "../../../common/constructor";
import { combineLatestX, switchMapX } from "../../../common/exceptionOperators";
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
import { getWorkItemType } from "../../workItemTracking/fields";
import { createWorkItemItem, WorkItemItem } from "../items/WorkItemItem";
import { getTitle } from "../../workItemTracking/fields";
import { WorkItemTypeIconService } from "../services/WorkItemTypeIconService";
import type { WorkItemTreeItem } from "../treeItems/WorkItemTreeItem";

type PinnedWorkItemData = {
  projectId: string;
  workItemId: number;
};

const pinnedWorkItemTreePartProviderSchema = Type.Object({
  projectId: Type.String(),
  workItemId: Type.Number(),
});

@injectable()
@injectFromHierarchy({
  extendConstructorArguments: false,
  extendProperties: true,
})
export class PinnedWorkItemTreePartProvider extends PinnedItemTreePartProvider<WorkItemItem & PinnedItem> {
  #workItemTreeItemConstructor: Constructor<WorkItemTreeItem<WorkItemItem & PinnedItem>>;
  #settingsSettings: SettingsService;

  constructor(
    @inject(types.PinnableWorkItemTreeItem)
    WorkItemTreeItemConstructor: Constructor<WorkItemTreeItem<WorkItemItem & PinnedItem>>,
    @inject(types.SettingsService) SettingsService: SettingsService,
  ) {
    super("workItem");
    this.#workItemTreeItemConstructor = WorkItemTreeItemConstructor;
    this.#settingsSettings = SettingsService;
  }

  updateTreeItemImpl(item: WorkItemItem & PinnedItem, _key: string, oldTreeItem: AbstractTreeItem<any> | undefined) {
    return createOrUpdateTreeItem(oldTreeItem, this.#workItemTreeItemConstructor, item);
  }

  public retrievePinned(container: Container, pinInfo: PinInfo) {
    const { accountContainer, account } = this.getAccountContext(container, pinInfo);
    const refreshObservable = this.createRefreshObservable();
    const workItemTrackingService = accountContainer.get<WorkItemTrackingService>(types.WorkItemTrackingService);
    const workItemTypeIconService = accountContainer.get<WorkItemTypeIconService>(types.WorkItemTypeIconService);
    const parsed = this.#parseAndVerify(pinInfo.object);

    return combineLatestX([
      workItemTrackingService.workItem(parsed.workItemId, parsed.projectId, refreshObservable),
      account,
    ]).pipe(
      switchMapX(([workItem, account]) => {
        if (!workItem) {
          return of(createMissingItem(pinInfo.name, "work-item", pinInfo));
        }
        return workItemTypeIconService
          .workItemIconByType(parsed.projectId, getWorkItemType(workItem), refreshObservable)
          .pipe(
            startWith(undefined),
            map((iconSvg) =>
              createPinnedItem(
                createWorkItemItem(
                  {
                    account,
                    container: accountContainer,
                    projectId: parsed.projectId,
                    refreshObservables: {},
                  },
                  parsed.workItemId,
                  workItem,
                  iconSvg,
                  { workItem: refreshObservable },
                ),
              ),
            ),
          );
      }),
      autoRefresh(refreshObservable, this.#settingsSettings.autoRefreshInterval()),
    );
  }

  #parseAndVerify(input: string) {
    const parsed = JSON.parse(input);
    return Value.Parse(pinnedWorkItemTreePartProviderSchema, parsed);
  }

  #serialize(data: PinnedWorkItemData): string {
    return JSON.stringify(data);
  }

  public getPinInfo = (data: WorkItemItem | MissingItem) =>
    missingSymbol in data
      ? data.pinInfo
      : {
          accountId: data.account.accountId,
          name: data.workItem ? getTitle(data.workItem) : "missing title",
          object: this.#serialize({
            projectId: data.projectId,
            workItemId: data.workItemId,
          }),
          type: this.type,
        };
}
