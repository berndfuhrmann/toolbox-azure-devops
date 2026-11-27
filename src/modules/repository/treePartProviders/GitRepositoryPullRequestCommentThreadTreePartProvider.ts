import { inject } from "inversify";
import { distinctUntilChanged, finalize, map, Observable, switchMap } from "rxjs";
import { Constructor } from "../../../common/constructor";
import { Exception } from "../../../common/Exception";
import { combineLatestX, mapX } from "../../../common/exceptionOperators";
import { autoRefresh } from "../../../common/operators";
import { SettingsService } from "../../../common/SettingsService";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { fromArrayWithItemInformation } from "../../../common/treePartProvider/fromArray";
import {
  ItemInformation,
  createOrUpdateTreeItem,
  TreePartProvider,
} from "../../../common/treePartProvider/TreePartProvider";
import { updateExceptionTreeItem } from "../../../common/treePartProvider/updateExceptionTreeItem";
import { GitService, LocationsService } from "../../../generated/services";
import { types } from "../../../generated/types";
import { getAuthenticatedUserId } from "../../core/services/authenticatedUser";
import {
  createGitRepositoryPullRequestCommentThreadItem,
  getPullRequestWebUrl,
  GitRepositoryPullRequestCommentThreadItem,
} from "../items/GitRepositoryPullRequestCommentThreadItem";
import {
  compareGitRepositoryPullRequestContext,
  type GitRepositoryPullRequestItem,
} from "../items/GitRepositoryPullRequestItem";
import type { GitRepositoryPullRequestCommentThreadTreeItem } from "../treeItems/GitRepositoryPullRequestCommentThreadTreeItem";

export class GitRepositoryPullRequestCommentThreadTreePartProvider extends TreePartProvider<
  GitRepositoryPullRequestCommentThreadItem | Exception,
  GitRepositoryPullRequestItem
> {
  #treeItemConstructor: Constructor<GitRepositoryPullRequestCommentThreadTreeItem>;
  #settingsService: SettingsService;

  constructor(
    @inject(types.GitRepositoryPullRequestCommentThreadTreeItem)
    treeItemConstructor: Constructor<GitRepositoryPullRequestCommentThreadTreeItem>,
    @inject(types.SettingsService)
    settingsService: SettingsService,
  ) {
    super();
    this.#treeItemConstructor = treeItemConstructor;
    this.#settingsService = settingsService;
  }

  getItems(
    context: Observable<GitRepositoryPullRequestItem>,
  ): Observable<ItemInformation<GitRepositoryPullRequestCommentThreadItem | Exception>> {
    return context.pipe(
      // do not load the threads again when something else about the pull request changes, e.g. its title
      distinctUntilChanged(
        (a, b) => compareGitRepositoryPullRequestContext(a, b) && getPullRequestWebUrl(a) === getPullRequestWebUrl(b),
      ),
      switchMap((context) => {
        const { refreshObservables, refreshObservable } = this.createRefreshObservables("pullRequestCommentThread");
        return combineLatestX([
          context.container
            .get<GitService>(types.GitService)
            .threads(context.gitRepositoryId, context.pullRequestId, context.projectId, refreshObservable),
          context.container
            .get<LocationsService>(types.LocationsService)
            .connectionData(refreshObservable)
            .pipe(mapX(getAuthenticatedUserId)),
        ]).pipe(
          autoRefresh(refreshObservable, this.#settingsService.autoRefreshInterval()),
          mapX(([threads, userId]) =>
            (threads ?? [])
              .map((thread) =>
                createGitRepositoryPullRequestCommentThreadItem(context, thread, userId, refreshObservables),
              )
              .filter((item) => item !== undefined),
          ),
          map((items) => ({ items, refreshObservables })),
          finalize(() => refreshObservable.complete()),
        );
      }),
      // outside of switchMap, so that the items of the previous context are removed or updated, not added a second time
      fromArrayWithItemInformation((item: GitRepositoryPullRequestCommentThreadItem) => `${item.threadId}`),
    );
  }

  override updateTreeItem(
    item: GitRepositoryPullRequestCommentThreadItem | Exception,
    key: string,
    oldTreeItem: AbstractTreeItem<any> | undefined,
  ) {
    return (
      updateExceptionTreeItem(item, oldTreeItem) ??
      this.updateTreeItemImpl(item as GitRepositoryPullRequestCommentThreadItem, key, oldTreeItem)
    );
  }

  updateTreeItemImpl(
    item: GitRepositoryPullRequestCommentThreadItem,
    key: string,
    oldTreeItem: AbstractTreeItem<any> | undefined,
  ) {
    return createOrUpdateTreeItem(oldTreeItem, this.#treeItemConstructor, item);
  }
}
