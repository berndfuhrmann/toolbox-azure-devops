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
import { BuildService } from "../../../generated/services";
import { types } from "../../../generated/types";
import { SettingsService } from "../../../common/SettingsService";
import type { ProjectContext } from "../../core/items/ProjectItem";
import type { PipelineFolderItem } from "../items/PipelineFolderItem";
import { createPipelineItem, PipelineItem } from "../items/PipelineItem";
import type { PipelineTreeItem } from "../treeItems/PipelineTreeItem";
import { getPath } from "./PipelineFolderTreePartProvider";

export class PipelineTreePartProvider extends TreePartProvider<
  PipelineItem | Exception,
  ProjectContext | PipelineFolderItem
> {
  #pipelineTreeItemConstructor: Constructor<PipelineTreeItem>;
  #settingsSettings: SettingsService;
  constructor(
    @inject(types.PinnablePipelineTreeItem)
    PipelineTreeItemConstructor: Constructor<PipelineTreeItem>,
    @inject(types.SettingsService)
    SettingsService: SettingsService,
  ) {
    super();
    this.#pipelineTreeItemConstructor = PipelineTreeItemConstructor;
    this.#settingsSettings = SettingsService;

    // this.#pinAction = pinActionFactory.pinAction<PipelineTreeItem>(pinGitRepository);
  }
  getItems(
    context: Observable<ProjectContext | PipelineFolderItem>,
  ): Observable<ItemInformation<PipelineItem | Exception>> {
    return context.pipe(
      switchMap((context) => {
        const { refreshObservables, refreshObservable } = this.createRefreshObservables("pipeline");
        return context.container
          .get<BuildService>(types.BuildService)
          .definitions(context.projectId, getPath(context), refreshObservable)
          .pipe(
            mapX((pipelines) => pipelines.map((pipeline) => createPipelineItem(context, pipeline, refreshObservables))),
            fromArray((item: PipelineItem) => `${item.pipeline.id}`, { refreshObservables }),
          );
      }),
    );
  }

  override updateTreeItem(item: PipelineItem | Exception, key: string, oldTreeItem: AbstractTreeItem<any> | undefined) {
    return (
      updateExceptionTreeItem(item, oldTreeItem) ?? this.updateTreeItemImpl(item as PipelineItem, key, oldTreeItem)
    );
  }

  updateTreeItemImpl(item: PipelineItem, _key: string, oldTreeItem: AbstractTreeItem<any> | undefined) {
    return createOrUpdateTreeItem(oldTreeItem, this.#pipelineTreeItemConstructor, item);
  }
}
