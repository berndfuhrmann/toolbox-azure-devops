import { inject } from "inversify";
import { Observable, of, switchMap } from "rxjs";
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
import type { PipelineRunContext } from "../items/PipelineRunItem";
import { createPipelineRunTimelineItem, PipelineRunTimelineItem } from "../items/PipelineRunTimelineItem";
import { PipelineRunTimelineTreeItem } from "../treeItems/PipelineRunTimelineTreeItem";
import { SettingsService } from "../../../common/SettingsService";

export class PipelineRunTimelineTreePartProvider extends TreePartProvider<
  PipelineRunTimelineItem | Exception,
  PipelineRunContext
> {
  getItems(
    context: Observable<PipelineRunContext | PipelineRunTimelineItem>,
  ): Observable<ItemInformation<PipelineRunTimelineItem | Exception>> {
    return context.pipe(
      switchMap((context) => {
        if ("timeline" in context) {
          const timelineContext = context as PipelineRunTimelineItem;
          const records = timelineContext.timeline.records ?? [];
          return of(
            records
              .filter((timelineRecord) => timelineRecord.parentId === timelineContext.timelineRecordId)
              .map((timelineRecord) =>
                createPipelineRunTimelineItem(
                  timelineContext,
                  timelineContext.timeline,
                  timelineRecord.id,
                  timelineContext.refreshObservables,
                ),
              ),
          ).pipe(fromArray((item: PipelineRunTimelineItem) => `${item.timelineRecordId ?? "undefined"}`, {}));
        } else {
          const { refreshObservables, refreshObservable } = this.createRefreshObservables("pipelineRunTimeline");
          return context.container
            .get<BuildService>(types.BuildService)
            .buildTimeline(context.projectId, context.buildId, refreshObservable)
            .pipe(
              mapX(
                (timeline) =>
                  timeline.records
                    ?.filter((timelineRecord) => timelineRecord.parentId === null)
                    .map((timelineRecord) =>
                      createPipelineRunTimelineItem(context, timeline, timelineRecord.id, refreshObservables),
                    ) ?? [],
              ),
              fromArray((item: PipelineRunTimelineItem) => `${item.timelineRecordId ?? "undefined"}`, {
                refreshObservables,
              }),
            );
        }
      }),
    );
  }

  #pipelineRunTimelineTreeItemConstructor: Constructor<PipelineRunTimelineTreeItem>;
  #settingsSettings: SettingsService;
  constructor(
    @inject(types.PipelineRunTimelineTreeItem)
    PipelineRunTimelineTreeItemConstructor: Constructor<PipelineRunTimelineTreeItem>,
    @inject(types.SettingsService)
    SettingsService: SettingsService,
  ) {
    super();
    this.#pipelineRunTimelineTreeItemConstructor = PipelineRunTimelineTreeItemConstructor;
    this.#settingsSettings = SettingsService;
  }

  override updateTreeItem(
    item: PipelineRunTimelineItem | Exception,
    key: string,
    oldTreeItem: AbstractTreeItem<any> | undefined,
  ) {
    return (
      updateExceptionTreeItem(item, oldTreeItem) ??
      this.updateTreeItemImpl(item as PipelineRunTimelineItem, key, oldTreeItem)
    );
  }

  updateTreeItemImpl(
    item: PipelineRunTimelineItem | Exception,
    key: string,
    oldTreeItem: AbstractTreeItem<any> | undefined,
  ) {
    if (isException(item)) {
      return createOrUpdateTreeItem(oldTreeItem, ExceptionTreeItem, item);
    }
    return createOrUpdateTreeItem(oldTreeItem, this.#pipelineRunTimelineTreeItemConstructor, item);
  }
}
