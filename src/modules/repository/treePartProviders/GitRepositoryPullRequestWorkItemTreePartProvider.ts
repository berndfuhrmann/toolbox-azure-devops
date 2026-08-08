import { inject } from "inversify";
import { map, Observable, switchMap } from "rxjs";
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
import { withItemObservable } from "../../../common/treePartProvider/withItemObservable";
import { GitService } from "../../../generated/services";
import { types } from "../../../generated/types";
import { SettingsService } from "../../../common/SettingsService";
import type { GitRepositoryPullRequestContext } from "../items/GitRepositoryPullRequestItem";
import { createWorkItemItem, WorkItemItem } from "../../workItem/items/WorkItemItem";
import { loadWorkItem } from "../../workItem/services/loadWorkItem";
import { loadWorkItemIcon } from "../../workItem/services/WorkItemTypeIconService";
import type { WorkItemTreeItem } from "../../workItem/treeItems/WorkItemTreeItem";
import { autoRefresh } from "../../../common/operators";

export class GitRepositoryPullRequestWorkItemTreePartProvider extends TreePartProvider<
  WorkItemItem | Exception,
  GitRepositoryPullRequestContext
> {
  #workItemTreeItemConstructor: Constructor<WorkItemTreeItem>;
  #settingsService: SettingsService;
  constructor(
    @inject(types.WorkItemTreeItem)
    workItemTreeItemConstructor: Constructor<WorkItemTreeItem>,
    @inject(types.SettingsService)
    settingsService: SettingsService,
  ) {
    super();
    this.#workItemTreeItemConstructor = workItemTreeItemConstructor;
    this.#settingsService = settingsService;
  }

  getItems(
    context: Observable<GitRepositoryPullRequestContext>,
  ): Observable<ItemInformation<WorkItemItem | Exception>> {
    return context.pipe(
      switchMap((context) => {
        const { refreshObservables, refreshObservable } = this.createRefreshObservables("pullRequestWorkItem");
        return context.container
          .get<GitService>(types.GitService)
          .pullRequestWorkItemRefs(context.gitRepositoryId, context.pullRequestId, context.projectId, refreshObservable)
          .pipe(
            autoRefresh(refreshObservable, this.#settingsService.autoRefreshInterval()),
            mapX((workItemRefs) =>
              workItemRefs.map((ref) =>
                createWorkItemItem(context, Number(ref.id!), undefined, undefined, refreshObservables),
              ),
            ),
            fromArray((item: WorkItemItem) => `${item.workItemId}`, {}),
            withItemObservable((inputObservable) =>
              inputObservable.pipe(
                loadWorkItem((item) => this.appendRefreshObservable(item, "workItem")),
                loadWorkItemIcon((item) => this.appendRefreshObservable(item, "workItemIcon")),
              ),
            ),
          );
      }),
    );
  }

  override updateTreeItem(item: WorkItemItem | Exception, key: string, oldTreeItem: AbstractTreeItem<any> | undefined) {
    return (
      updateExceptionTreeItem(item, oldTreeItem) ?? this.updateTreeItemImpl(item as WorkItemItem, key, oldTreeItem)
    );
  }

  updateTreeItemImpl(item: WorkItemItem, key: string, oldTreeItem: AbstractTreeItem<any> | undefined) {
    return createOrUpdateTreeItem(oldTreeItem, this.#workItemTreeItemConstructor, item);
  }
}
