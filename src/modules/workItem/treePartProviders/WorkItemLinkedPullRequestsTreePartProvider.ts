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
import { GitService } from "../../../generated/services";
import { types } from "../../../generated/types";
import { parsePullRequestUrl } from "../WorkItemArtifactLink";
import { WorkItemLinkedItemItem, createWorkItemLinkedItemItem } from "../items/WorkItemLinkedItemItem";
import { WorkItemItem } from "../items/WorkItemItem";
import { isPullRequestRelation } from "../WorkItemArtifactLink";
import type { WorkItemLinkedPullRequestTreeItem } from "../treeItems/WorkItemLinkedPullRequestTreeItem";

function loadPullRequestData<Data extends WorkItemLinkedItemItem>(
  appendRefreshObservable: (item: Data) => {
    refreshObservables: Record<string, import("rxjs").Subject<number>>;
    refreshObservable: import("rxjs").Subject<number>;
  },
) {
  return pipe(
    mapX((item: Data) => {
      const { refreshObservables, refreshObservable } = appendRefreshObservable(item);
      const pullRequestId = parsePullRequestUrl(item.relation.url ?? "");
      if (pullRequestId === undefined) {
        return of({ ...item, refreshObservables });
      }
      return item.container
        .get<GitService>(types.GitService)
        .pullRequestById(pullRequestId, item.projectId, refreshObservable)
        .pipe(
          map((pullRequest) => ({
            ...item,
            pullRequest: isException(pullRequest) ? undefined : pullRequest,
            refreshObservables,
          })),
          finalize(() => refreshObservable.complete()),
        );
    }),
    switchMapX((x) => x),
  );
}

export class WorkItemLinkedPullRequestsTreePartProvider extends TreePartProvider<
  WorkItemLinkedItemItem | Exception,
  WorkItemItem
> {
  #treeItemConstructor: Constructor<WorkItemLinkedPullRequestTreeItem>;

  constructor(
    @inject(types.WorkItemLinkedPullRequestTreeItem)
    treeItemConstructor: Constructor<WorkItemLinkedPullRequestTreeItem>,
  ) {
    super();
    this.#treeItemConstructor = treeItemConstructor;
  }

  getItems(context: Observable<WorkItemItem>): Observable<ItemInformation<WorkItemLinkedItemItem | Exception>> {
    return context.pipe(
      switchMap((context) => {
        const workItem = context.workItem;
        const relations = workItem?.relations?.filter((relation) => isPullRequestRelation(relation)) ?? [];
        return of(relations.map((relation) => createWorkItemLinkedItemItem(context, relation))).pipe(
          fromArray((item: WorkItemLinkedItemItem) => item.relation.url ?? `linked-pr-${item.workItemId}`, {}),
          withItemObservable((inputObservable) =>
            inputObservable.pipe(loadPullRequestData((item) => this.appendRefreshObservable(item, "pullRequest"))),
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
