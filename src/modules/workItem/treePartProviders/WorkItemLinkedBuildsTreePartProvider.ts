import { inject } from "inversify";
import { finalize, map, Observable, of, pipe, switchMap } from "rxjs";
import { Constructor } from "../../../common/constructor";
import { Exception, isException } from "../../../common/Exception";
import { mapX, switchMapX } from "../../../common/exceptionOperators";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { fromArray } from "../../../common/treePartProvider/fromArray";
import {
  ItemInformation,
  createOrUpdateTreeItem,
  TreePartProvider,
} from "../../../common/treePartProvider/TreePartProvider";
import { updateExceptionTreeItem } from "../../../common/treePartProvider/updateExceptionTreeItem";
import { withItemObservable } from "../../../common/treePartProvider/withItemObservable";
import { BuildService } from "../../../generated/services";
import { types } from "../../../generated/types";
import { parseBuildUrl } from "../WorkItemArtifactLink";
import { WorkItemLinkedItemItem, createWorkItemLinkedItemItem } from "../items/WorkItemLinkedItemItem";
import { WorkItemItem } from "../items/WorkItemItem";
import { isBuildRelation } from "../WorkItemArtifactLink";
import type { WorkItemLinkedBuildTreeItem } from "../treeItems/WorkItemLinkedBuildTreeItem";

function loadBuildData<Data extends WorkItemLinkedItemItem>(
  appendRefreshObservable: (item: Data) => {
    refreshObservables: Record<string, import("rxjs").Subject<number>>;
    refreshObservable: import("rxjs").Subject<number>;
  },
) {
  return pipe(
    mapX((item: Data) => {
      const { refreshObservables, refreshObservable } = appendRefreshObservable(item);
      const buildId = parseBuildUrl(item.relation.url ?? "");
      if (buildId === undefined) {
        return of({ ...item, refreshObservables });
      }
      return item.container
        .get<BuildService>(types.BuildService)
        .build(buildId, item.projectId, refreshObservable)
        .pipe(
          map((build) => ({
            ...item,
            build: isException(build) ? undefined : build,
            refreshObservables,
          })),
          finalize(() => refreshObservable.complete()),
        );
    }),
    switchMapX((x) => x),
  );
}

export class WorkItemLinkedBuildsTreePartProvider extends TreePartProvider<
  WorkItemLinkedItemItem | Exception,
  WorkItemItem
> {
  #treeItemConstructor: Constructor<WorkItemLinkedBuildTreeItem>;

  constructor(
    @inject(types.WorkItemLinkedBuildTreeItem)
    treeItemConstructor: Constructor<WorkItemLinkedBuildTreeItem>,
  ) {
    super();
    this.#treeItemConstructor = treeItemConstructor;
  }

  getItems(context: Observable<WorkItemItem>): Observable<ItemInformation<WorkItemLinkedItemItem | Exception>> {
    return context.pipe(
      switchMap((context) => {
        const workItem = context.workItem;
        const relations = workItem?.relations?.filter((relation) => isBuildRelation(relation)) ?? [];
        return of(relations.map((relation) => createWorkItemLinkedItemItem(context, relation))).pipe(
          fromArray((item: WorkItemLinkedItemItem) => item.relation.url ?? `linked-build-${item.workItemId}`, {}),
          withItemObservable((inputObservable) =>
            inputObservable.pipe(loadBuildData((item) => this.appendRefreshObservable(item, "build"))),
          ),
        );
      }),
    );
  }

  override updateTreeItem(
    item: WorkItemLinkedItemItem | Exception,
    key: string,
    oldTreeItem: AbstractTreeItem<any> | undefined,
  ) {
    return (
      updateExceptionTreeItem(item, oldTreeItem) ??
      this.updateTreeItemImpl(item as WorkItemLinkedItemItem, key, oldTreeItem)
    );
  }

  updateTreeItemImpl(item: WorkItemLinkedItemItem, key: string, oldTreeItem: AbstractTreeItem<any> | undefined) {
    return createOrUpdateTreeItem(oldTreeItem, this.#treeItemConstructor, item);
  }
}
