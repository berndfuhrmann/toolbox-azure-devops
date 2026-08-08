import { Type } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import { Container, inject, injectable, injectFromHierarchy } from "inversify";
import { Constructor } from "../../../common/constructor";
import { combineLatestX, mapX } from "../../../common/exceptionOperators";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { createMissingItem, MissingItem, missingSymbol } from "../../../common/items/MissingItem";
import { createPinnedItem, PinnedItem } from "../../../common/items/PinnedItem";
import { PinInfo } from "../../../common/items/PinnedTreeItemMixin";
import { autoRefresh } from "../../../common/operators";
import { PinnedItemTreePartProvider } from "../../../common/treePartProvider/PinnedTreePartProvider";
import { createOrUpdateTreeItem } from "../../../common/treePartProvider/TreePartProvider";
import { BuildService } from "../../../generated/services";
import { types } from "../../../generated/types";
import { SettingsService } from "../../../common/SettingsService";
import { comparePipelineFolderItem, PipelineFolderItem } from "../items/PipelineFolderItem";
import { PipelineFolderTreeItem, getFolderName } from "../treeItems/PipelineFolderTreeItem";

type PinnedPipelineFolderData = {
  path: string | undefined;
  projectId: string;
};

const pinnedPipelineFolderTreePartProviderSchema = Type.Object({
  path: Type.String(),
  projectId: Type.String(),
});
@injectable()
@injectFromHierarchy({
  extendConstructorArguments: false,
  extendProperties: true,
})
export class PinnedPipelineFolderTreePartProvider extends PinnedItemTreePartProvider<PipelineFolderItem & PinnedItem> {
  #pipelineFolderTreeItemConstructor: Constructor<PipelineFolderTreeItem<PipelineFolderItem & PinnedItem>>;
  #settingsSettings: SettingsService;

  constructor(
    @inject(types.PinnablePipelineFolderTreeItem)
    PipelineFolderTreeItemConstructor: Constructor<PipelineFolderTreeItem<PipelineFolderItem & PinnedItem>>,
    @inject(types.SettingsService) SettingsService: SettingsService,
  ) {
    super("pipelinefolder");
    this.#pipelineFolderTreeItemConstructor = PipelineFolderTreeItemConstructor;
    this.#settingsSettings = SettingsService;
  }

  updateTreeItemImpl(
    item: PipelineFolderItem & PinnedItem,
    _key: string,
    oldTreeItem: AbstractTreeItem<any> | undefined,
  ) {
    return createOrUpdateTreeItem(oldTreeItem, this.#pipelineFolderTreeItemConstructor, item);
  }

  public retrievePinned(container: Container, pinInfo: PinInfo) {
    const { accountContainer, account } = this.getAccountContext(container, pinInfo);
    const refreshObservable = this.createRefreshObservable();
    const buildService = accountContainer.get<BuildService>(types.BuildService);
    const parsed = this.#parseAndVerify(pinInfo.object);
    return combineLatestX([buildService.folders(parsed.projectId, refreshObservable), account]).pipe(
      autoRefresh(refreshObservable, this.#settingsSettings.autoRefreshInterval()),
      mapX(([folders, account]) => {
        const folder = folders.find((folder) => folder.path === parsed.path);
        if (!folder) {
          return createMissingItem(pinInfo.name, "folder", pinInfo);
        }
        return createPinnedItem({
          type: "pipelineFolder" as const,
          folder,
          account,
          container: accountContainer,
          projectId: folders[0].project!.id!,
          refreshObservables: { pipelineFolder: refreshObservable },
          isEqual(this: PipelineFolderItem, other: PipelineFolderItem) {
            return comparePipelineFolderItem(this, other);
          },
        });
      }),
    );
  }

  #parseAndVerify(input: string) {
    const parsed = JSON.parse(input);
    return Value.Parse(pinnedPipelineFolderTreePartProviderSchema, parsed);
  }

  #serialize(data: PinnedPipelineFolderData): string {
    return JSON.stringify(data);
  }

  public getPinInfo = (data: PipelineFolderItem | MissingItem) =>
    missingSymbol in data
      ? data.pinInfo
      : {
          accountId: data.account.accountId,
          name: getFolderName(data),
          object: this.#serialize({
            path: data.folder.path,
            projectId: data.projectId,
          }),
          type: this.type,
        };
}
