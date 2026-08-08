import { inject } from "inversify";
import { Observable, of, switchMap } from "rxjs";
import { Constructor } from "../../../common/constructor";
import { Exception } from "../../../common/Exception";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { fromArray } from "../../../common/treePartProvider/fromArray";
import {
  ItemInformation,
  createOrUpdateTreeItem,
  TreePartProvider,
} from "../../../common/treePartProvider/TreePartProvider";
import { updateExceptionTreeItem } from "../../../common/treePartProvider/updateExceptionTreeItem";
import { types } from "../../../generated/types";
import { SettingsService } from "../../../common/SettingsService";
import type { GitRepositoryPullRequestItem } from "../items/GitRepositoryPullRequestItem";
import {
  createGitRepositoryPullRequestReviewerItem,
  GitRepositoryPullRequestReviewerItem,
} from "../items/GitRepositoryPullRequestReviewerItem";
import type { GitRepositoryPullRequestReviewerTreeItem } from "../treeItems/GitRepositoryPullRequestReviewerTreeItem";

export class GitRepositoryPullRequestReviewerTreePartProvider extends TreePartProvider<
  GitRepositoryPullRequestReviewerItem | Exception,
  GitRepositoryPullRequestItem
> {
  #repositoryPullRequestReviewerTreeItemConstructor: Constructor<
    GitRepositoryPullRequestReviewerTreeItem<GitRepositoryPullRequestReviewerItem>
  >;
  #settingsSettings: SettingsService;

  constructor(
    @inject(types.GitRepositoryPullRequestReviewerTreeItem)
    GitRepositoryPullRequestReviewerTreeItemConstructor: Constructor<
      GitRepositoryPullRequestReviewerTreeItem<GitRepositoryPullRequestReviewerItem>
    >,
    @inject(types.SettingsService)
    SettingsService: SettingsService,
  ) {
    super();
    this.#repositoryPullRequestReviewerTreeItemConstructor = GitRepositoryPullRequestReviewerTreeItemConstructor;
    this.#settingsSettings = SettingsService;
  }

  getItems(
    context: Observable<GitRepositoryPullRequestItem>,
  ): Observable<ItemInformation<GitRepositoryPullRequestReviewerItem | Exception>> {
    return context.pipe(
      switchMap((context) => {
        return of(
          context.pullRequest.reviewers?.map((identityRef) =>
            createGitRepositoryPullRequestReviewerItem(context, identityRef),
          ) ?? [],
        ).pipe(fromArray((item: GitRepositoryPullRequestReviewerItem) => `${item.identityRef.id!}`, {}));
      }),
    );
  }

  override updateTreeItem(
    item: GitRepositoryPullRequestReviewerItem | Exception,
    key: string,
    oldTreeItem: AbstractTreeItem<any> | undefined,
  ) {
    return (
      updateExceptionTreeItem(item, oldTreeItem) ??
      this.updateTreeItemImpl(item as GitRepositoryPullRequestReviewerItem, key, oldTreeItem)
    );
  }

  updateTreeItemImpl(
    item: GitRepositoryPullRequestReviewerItem,
    key: string,
    oldTreeItem: AbstractTreeItem<any> | undefined,
  ) {
    return createOrUpdateTreeItem(oldTreeItem, this.#repositoryPullRequestReviewerTreeItemConstructor, item);
  }
}
