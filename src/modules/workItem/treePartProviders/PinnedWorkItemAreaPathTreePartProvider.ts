import { Type } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import {
  TreeStructureGroup,
  WorkItemClassificationNode,
} from "azure-devops-node-api/interfaces/WorkItemTrackingInterfaces";
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
import { createWorkItemAreaPathItem, WorkItemAreaPathItem } from "../items/WorkItemAreaPathItem";
import type { WorkItemAreaPathTreeItem } from "../treeItems/WorkItemAreaPathTreeItem";

const TaskCategoryReferenceName = "Microsoft.TaskCategory";
const areaPathDepth = 20;

type PinnedWorkItemAreaPathData = {
  projectId: string;
  classificationNodeId: number;
};

const pinnedWorkItemAreaPathSchema = Type.Object({
  projectId: Type.String(),
  classificationNodeId: Type.Number(),
});

function findClassificationNodeById(
  node: WorkItemClassificationNode,
  id: number,
): WorkItemClassificationNode | undefined {
  if (node.id === id) {
    return node;
  }
  for (const child of node.children ?? []) {
    const found = findClassificationNodeById(child, id);
    if (found) {
      return found;
    }
  }
  return undefined;
}

@injectable()
@injectFromHierarchy({
  extendConstructorArguments: false,
  extendProperties: true,
})
export class PinnedWorkItemAreaPathTreePartProvider extends PinnedItemTreePartProvider<
  WorkItemAreaPathItem & PinnedItem
> {
  #workItemAreaPathTreeItemConstructor: Constructor<WorkItemAreaPathTreeItem<WorkItemAreaPathItem & PinnedItem>>;
  #settingsService: SettingsService;

  constructor(
    @inject(types.PinnableWorkItemAreaPathTreeItem)
    WorkItemAreaPathTreeItemConstructor: Constructor<WorkItemAreaPathTreeItem<WorkItemAreaPathItem & PinnedItem>>,
    @inject(types.SettingsService) SettingsService: SettingsService,
  ) {
    super("workItemAreaPath");
    this.#workItemAreaPathTreeItemConstructor = WorkItemAreaPathTreeItemConstructor;
    this.#settingsService = SettingsService;
  }

  updateTreeItemImpl(
    item: WorkItemAreaPathItem & PinnedItem,
    _key: string,
    oldTreeItem: AbstractTreeItem<any> | undefined,
  ) {
    return createOrUpdateTreeItem(oldTreeItem, this.#workItemAreaPathTreeItemConstructor, item);
  }

  public retrievePinned(container: Container, pinInfo: PinInfo) {
    const { accountContainer, account } = this.getAccountContext(container, pinInfo);
    const refreshObservable = this.createRefreshObservable();
    const workItemTrackingService = accountContainer.get<WorkItemTrackingService>(types.WorkItemTrackingService);
    const parsed = this.#parseAndVerify(pinInfo.object);

    return combineLatestX([
      workItemTrackingService.workItemTypeCategories(parsed.projectId, refreshObservable),
      workItemTrackingService.classificationNode(
        parsed.projectId,
        TreeStructureGroup.Areas,
        undefined,
        areaPathDepth,
        refreshObservable,
      ),
      account,
    ]).pipe(
      autoRefresh(refreshObservable, this.#settingsService.autoRefreshInterval()),
      mapX(([categories, rootNode, account]) => {
        const leafTypeNames = new Set<string>(
          (categories.find((c) => c.referenceName === TaskCategoryReferenceName)?.workItemTypes ?? [])
            .map((t) => t.name)
            .filter((name): name is string => typeof name === "string"),
        );
        const listValue = (rootNode as any).value as WorkItemClassificationNode[] | undefined;
        const containerNode = listValue?.[0] ?? rootNode;
        const node = findClassificationNodeById(containerNode, parsed.classificationNodeId);
        if (!node) {
          return createMissingItem(pinInfo.name, "folder", pinInfo);
        }
        return createPinnedItem(
          createWorkItemAreaPathItem(
            { account, container: accountContainer, projectId: parsed.projectId, refreshObservables: {} },
            node,
            leafTypeNames,
            {},
          ),
        );
      }),
    );
  }

  #parseAndVerify(input: string) {
    const parsed = JSON.parse(input);
    return Value.Parse(pinnedWorkItemAreaPathSchema, parsed);
  }

  #serialize(data: PinnedWorkItemAreaPathData): string {
    return JSON.stringify(data);
  }

  public getPinInfo = (data: WorkItemAreaPathItem | MissingItem) =>
    missingSymbol in data
      ? data.pinInfo
      : {
          accountId: data.account.accountId,
          name: data.classificationNode.name ?? "Unknown Area Path",
          object: this.#serialize({
            projectId: data.projectId,
            classificationNodeId: data.classificationNode.id!,
          }),
          type: this.type,
        };
}
