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
import type { PipelineContext } from "../items/PipelineItem";
import { createPipelineRunItem, PipelineRunItem } from "../items/PipelineRunItem";
import type { PipelineRunTreeItem } from "../treeItems/PipelineRunTreeItem";

export class PipelineRunTreePartProvider extends TreePartProvider<PipelineRunItem | Exception, PipelineContext> {
  getItems(context: Observable<PipelineContext>): Observable<ItemInformation<PipelineRunItem | Exception>> {
    return context.pipe(
      switchMap((context) => {
        const { refreshObservables, refreshObservable } = this.createRefreshObservables("pipelineRun");
        return context.container
          .get<BuildService>(types.BuildService)
          .builds(context.projectId, [context.pipelineId], refreshObservable)
          .pipe(
            mapX((builds) => builds.map((build) => createPipelineRunItem(context, build, refreshObservables))),
            fromArray((item: PipelineRunItem) => `${item.buildId}`, { refreshObservables }),
          );
      }),
    );
  }

  #pipelineRunTreeItemConstructor: Constructor<PipelineRunTreeItem>;
  #settingsSettings: SettingsService;
  constructor(
    @inject(types.PipelineRunTreeItem)
    PipelineRunTreeItemConstructor: Constructor<PipelineRunTreeItem>,
    @inject(types.SettingsService)
    SettingsService: SettingsService,
  ) {
    super();
    this.#pipelineRunTreeItemConstructor = PipelineRunTreeItemConstructor;
    this.#settingsSettings = SettingsService;
  }

  override updateTreeItem(
    item: PipelineRunItem | Exception,
    key: string,
    oldTreeItem: AbstractTreeItem<any> | undefined,
  ) {
    return (
      updateExceptionTreeItem(item, oldTreeItem) ?? this.updateTreeItemImpl(item as PipelineRunItem, key, oldTreeItem)
    );
  }

  updateTreeItemImpl(item: PipelineRunItem | Exception, key: string, oldTreeItem: AbstractTreeItem<any> | undefined) {
    if (isException(item)) {
      return createOrUpdateTreeItem(oldTreeItem, ExceptionTreeItem, item);
    }
    return createOrUpdateTreeItem(oldTreeItem, this.#pipelineRunTreeItemConstructor, item);
  }
}
