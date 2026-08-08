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
import { BuildService } from "../../../generated/services";
import { types } from "../../../generated/types";
import { createPipelineItem, PipelineItem } from "../items/PipelineItem";
import type { PipelineTreeItem } from "../treeItems/PipelineTreeItem";

type PinnedPipelineData = {
  projectId: string;
  definitionId: number;
};

const pinnedPipelineTreePartProviderSchema = Type.Object({
  projectId: Type.String(),
  definitionId: Type.Number(),
});

@injectable()
@injectFromHierarchy({
  extendConstructorArguments: false,
  extendProperties: true,
})
export class PinnedPipelineTreePartProvider extends PinnedItemTreePartProvider<PipelineItem & PinnedItem> {
  #pipelineTreeItemConstructor: Constructor<PipelineTreeItem<PipelineItem & PinnedItem>>;
  #settingsSettings: SettingsService;
  constructor(
    @inject(types.PinnablePipelineTreeItem)
    PipelineTreeItemConstructor: Constructor<PipelineTreeItem<PipelineItem & PinnedItem>>,
    @inject(types.SettingsService) SettingsService: SettingsService,
  ) {
    super("pipeline");
    this.#pipelineTreeItemConstructor = PipelineTreeItemConstructor;
    this.#settingsSettings = SettingsService;
  }

  updateTreeItemImpl(item: PipelineItem & PinnedItem, _key: string, oldTreeItem: AbstractTreeItem<any> | undefined) {
    return createOrUpdateTreeItem(oldTreeItem, this.#pipelineTreeItemConstructor, item);
  }

  public retrievePinned(container: Container, pinInfo: PinInfo) {
    const { accountContainer, account } = this.getAccountContext(container, pinInfo);
    const refreshObservable = this.createRefreshObservable();
    const buildService = accountContainer.get<BuildService>(types.BuildService);
    const parsed = this.#parseAndVerify(pinInfo.object);
    return combineLatestX([
      buildService.definition(parsed.projectId, parsed.definitionId, refreshObservable),
      account,
    ]).pipe(
      autoRefresh(refreshObservable, this.#settingsSettings.autoRefreshInterval()),
      mapX(([pipeline, account]) => {
        if (!pipeline) {
          return createMissingItem(pinInfo.name, "pipeline", pinInfo);
        }
        return createPinnedItem(
          createPipelineItem(
            {
              projectId: pipeline.project!.id!,
              account,
              container: accountContainer,
              refreshObservables: {},
            },
            pipeline,
            { pipeline: refreshObservable },
          ),
        );
      }),
    );
  }

  #parseAndVerify(input: string) {
    const parsed = JSON.parse(input);
    return Value.Parse(pinnedPipelineTreePartProviderSchema, parsed);
  }

  #serialize(data: PinnedPipelineData): string {
    return JSON.stringify(data);
  }

  public getPinInfo = (data: PipelineItem | MissingItem) =>
    missingSymbol in data
      ? data.pinInfo
      : {
          accountId: data.account.accountId,
          name: data.pipeline.name ?? "unknown",
          object: this.#serialize({
            projectId: data.projectId,
            definitionId: data.pipelineId,
          }),
          type: this.type,
        };
}
