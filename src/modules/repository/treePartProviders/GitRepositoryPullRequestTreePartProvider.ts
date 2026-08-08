import { PullRequestStatus } from "azure-devops-node-api/interfaces/GitInterfaces";
import { inject } from "inversify";
import { finalize, map, Observable, pipe, Subject, switchMap } from "rxjs";
import { Constructor } from "../../../common/constructor";
import { Exception, isException } from "../../../common/Exception";
import { mapX, switchMapX } from "../../../common/exceptionOperators";
import { autoRefresh } from "../../../common/operators";
import { SettingsService } from "../../../common/SettingsService";
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
import type { GitRepositoryContext } from "../items/GitRepositoryItem";
import {
  createGitRepositoryPullRequestItem,
  type GitRepositoryPullRequestItem,
} from "../items/GitRepositoryPullRequestItem";
import type { GitRepositoryPullRequestTreeItem } from "../treeItems/GitRepositoryPullRequestTreeItem";

export function loadGitRepositoryPullRequestStatusses<Data extends GitRepositoryPullRequestItem>(
  appendRefreshObservable: (item: Data) => {
    refreshObservables: Record<string, Subject<number>>;
    refreshObservable: Subject<number>;
  },
) {
  return pipe(
    mapX((item: Data) => {
      const { refreshObservables, refreshObservable } = appendRefreshObservable(item);
      return item.container
        .get<GitService>(types.GitService)
        .pullRequestStatuses(
          item.pullRequest.lastMergeCommit?.commitId!,
          item.gitRepositoryId,
          item.projectId,
          true,
          refreshObservable,
        )
        .pipe(
          map((statusses) => ({
            ...item,
            pullRequestStatusses: isException(statusses) ? undefined : statusses,
            refreshObservables,
          })),
          finalize(() => refreshObservable.complete()),
        );
    }),
    switchMapX((x) => x),
  );
}

export class GitRepositoryPullRequestTreePartProvider extends TreePartProvider<
  GitRepositoryPullRequestItem | Exception,
  GitRepositoryContext
> {
  #repositoryPullRequestTreeItemConstructor: Constructor<GitRepositoryPullRequestTreeItem>;
  #settingsSettings: SettingsService;
  constructor(
    @inject(types.PinnableGitRepositoryPullRequestTreeItem)
    GitRepositoryPullRequestTreeItemConstructor: Constructor<GitRepositoryPullRequestTreeItem>,
    @inject(types.SettingsService)
    SettingsService: SettingsService,
  ) {
    super();
    this.#repositoryPullRequestTreeItemConstructor = GitRepositoryPullRequestTreeItemConstructor;
    this.#settingsSettings = SettingsService;
  }

  getItems(
    context: Observable<GitRepositoryContext>,
  ): Observable<ItemInformation<GitRepositoryPullRequestItem | Exception>> {
    return context.pipe(
      switchMap((context) => {
        const { refreshObservables, refreshObservable } = this.createRefreshObservables("pullRequest");
        return context.container
          .get<GitService>(types.GitService)
          .pullRequests(context.gitRepositoryId, PullRequestStatus.Active, refreshObservable)
          .pipe(
            autoRefresh(refreshObservable, this.#settingsSettings.autoRefreshInterval()),
            mapX((gitRepositoryPullRequests) =>
              gitRepositoryPullRequests.map((gitRepositoryPullRequest) =>
                createGitRepositoryPullRequestItem(context, gitRepositoryPullRequest, refreshObservables),
              ),
            ),
            fromArray((item: GitRepositoryPullRequestItem) => `${item.pullRequestId}`, {}),
            withItemObservable((inputObservable) =>
              inputObservable.pipe(
                loadGitRepositoryPullRequestStatusses((item) =>
                  this.appendRefreshObservable(item, "pullRequestStatus"),
                ),
              ),
            ),
          );
      }),
    );
  }

  override updateTreeItem(
    item: GitRepositoryPullRequestItem | Exception,
    key: string,
    oldTreeItem: AbstractTreeItem<any> | undefined,
  ) {
    return (
      updateExceptionTreeItem(item, oldTreeItem) ??
      this.updateTreeItemImpl(item as GitRepositoryPullRequestItem, key, oldTreeItem)
    );
  }

  updateTreeItemImpl(item: GitRepositoryPullRequestItem, key: string, oldTreeItem: AbstractTreeItem<any> | undefined) {
    return createOrUpdateTreeItem(oldTreeItem, this.#repositoryPullRequestTreeItemConstructor, item);
  }
}
