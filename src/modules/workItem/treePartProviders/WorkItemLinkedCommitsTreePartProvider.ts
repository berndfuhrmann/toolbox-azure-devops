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
import { parseCommitUrl } from "../WorkItemArtifactLink";
import { WorkItemLinkedItemItem, createWorkItemLinkedItemItem } from "../items/WorkItemLinkedItemItem";
import { WorkItemItem } from "../items/WorkItemItem";
import { isCommitRelation } from "../WorkItemArtifactLink";
import type { WorkItemLinkedCommitTreeItem } from "../treeItems/WorkItemLinkedCommitTreeItem";

function loadCommitData<Data extends WorkItemLinkedItemItem>(
  appendRefreshObservable: (item: Data) => {
    refreshObservables: Record<string, import("rxjs").Subject<number>>;
    refreshObservable: import("rxjs").Subject<number>;
  },
) {
  return pipe(
    mapX((item: Data) => {
      const { refreshObservables, refreshObservable } = appendRefreshObservable(item);
      const parsed = parseCommitUrl(item.relation.url ?? "");
      if (!parsed) {
        return of({ ...item, refreshObservables });
      }
      return item.container
        .get<GitService>(types.GitService)
        .commit(parsed.commitId, parsed.repositoryId, item.projectId, refreshObservable)
        .pipe(
          map((commit) => ({
            ...item,
            commit: isException(commit) ? undefined : commit,
            refreshObservables,
          })),
          finalize(() => refreshObservable.complete()),
        );
    }),
    switchMapX((x) => x),
  );
}

export class WorkItemLinkedCommitsTreePartProvider extends TreePartProvider<
  WorkItemLinkedItemItem | Exception,
  WorkItemItem
> {
  #treeItemConstructor: Constructor<WorkItemLinkedCommitTreeItem>;

  constructor(
    @inject(types.WorkItemLinkedCommitTreeItem)
    treeItemConstructor: Constructor<WorkItemLinkedCommitTreeItem>,
  ) {
    super();
    this.#treeItemConstructor = treeItemConstructor;
  }

  getItems(context: Observable<WorkItemItem>): Observable<ItemInformation<WorkItemLinkedItemItem | Exception>> {
    return context.pipe(
      switchMap((context) => {
        const workItem = context.workItem;
        const relations = workItem?.relations?.filter((relation) => isCommitRelation(relation)) ?? [];
        return of(relations.map((relation) => createWorkItemLinkedItemItem(context, relation))).pipe(
          fromArray((item: WorkItemLinkedItemItem) => item.relation.url ?? `linked-commit-${item.workItemId}`, {}),
          withItemObservable((inputObservable) =>
            inputObservable.pipe(loadCommitData((item) => this.appendRefreshObservable(item, "commit"))),
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
