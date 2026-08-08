import { inject } from "inversify";
import { Observable, switchMap } from "rxjs";
import { Constructor } from "../../../common/constructor";
import { Exception, isException } from "../../../common/Exception";
import { mapX } from "../../../common/exceptionOperators";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { ExceptionTreeItem } from "../../../common/treeItems/ExceptionTreeItem";
import { fromArray } from "../../../common/treePartProvider/fromArray";
import {
  ItemInformation,
  createOrUpdateTreeItem,
  TreePartProvider,
} from "../../../common/treePartProvider/TreePartProvider";
import { updateExceptionTreeItem } from "../../../common/treePartProvider/updateExceptionTreeItem";
import { BuildService } from "../../../generated/services";
import { types } from "../../../generated/types";
import { SettingsService } from "../../../common/SettingsService";
import { createPipelineRunArtifactItem, PipelineRunArtifactItem } from "../items/PipelineRunArtifactItem";
import type { PipelineRunContext } from "../items/PipelineRunItem";
import { PipelineRunArtifactTreeItem } from "../treeItems/PipelineRunArtifactTreeItem";

export class PipelineRunArtifactTreePartProvider extends TreePartProvider<
  PipelineRunArtifactItem | Exception,
  PipelineRunContext
> {
  getItems(context: Observable<PipelineRunContext>): Observable<ItemInformation<PipelineRunArtifactItem | Exception>> {
    return context.pipe(
      switchMap((context) => {
        const { refreshObservables, refreshObservable } = this.createRefreshObservables("pipelineRunArtifact");
        return context.container
          .get<BuildService>(types.BuildService)
          .artifacts(context.projectId, context.buildId, refreshObservable)
          .pipe(
            mapX((artifacts) =>
              artifacts.map((artifact) => createPipelineRunArtifactItem(context, artifact, refreshObservables)),
            ),
            fromArray((item: PipelineRunArtifactItem) => `${item.artifact.id}`, { refreshObservables }),
          );
      }),
    );
  }

  #pipelineRunArtifactTreeItemConstructor: Constructor<PipelineRunArtifactTreeItem>;
  #settingsSettings: SettingsService;
  constructor(
    @inject(types.PipelineRunArtifactTreeItem)
    PipelineRunArtifactTreeItemConstructor: Constructor<PipelineRunArtifactTreeItem>,
    @inject(types.SettingsService)
    SettingsService: SettingsService,
  ) {
    super();
    this.#pipelineRunArtifactTreeItemConstructor = PipelineRunArtifactTreeItemConstructor;
    this.#settingsSettings = SettingsService;
  }

  override updateTreeItem(
    item: PipelineRunArtifactItem | Exception,
    key: string,
    oldTreeItem: AbstractTreeItem<any> | undefined,
  ) {
    return (
      updateExceptionTreeItem(item, oldTreeItem) ??
      this.updateTreeItemImpl(item as PipelineRunArtifactItem, key, oldTreeItem)
    );
  }

  updateTreeItemImpl(
    item: PipelineRunArtifactItem | Exception,
    key: string,
    oldTreeItem: AbstractTreeItem<any> | undefined,
  ) {
    if (isException(item)) {
      return createOrUpdateTreeItem(oldTreeItem, ExceptionTreeItem, item);
    }
    return createOrUpdateTreeItem(oldTreeItem, this.#pipelineRunArtifactTreeItemConstructor, item);
  }
}
