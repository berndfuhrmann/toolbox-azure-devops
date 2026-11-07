import { inject } from "inversify";
import { Observable, of, switchMap } from "rxjs";
import { Constructor } from "../../../common/constructor";
import { Exception } from "../../../common/Exception";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { fromArrayWithItemInformation } from "../../../common/treePartProvider/fromArray";
import {
  ItemInformation,
  createOrUpdateTreeItem,
  TreePartProvider,
} from "../../../common/treePartProvider/TreePartProvider";
import { updateExceptionTreeItem } from "../../../common/treePartProvider/updateExceptionTreeItem";
import { types } from "../../../generated/types";
import { SettingsService } from "../../../common/SettingsService";
import {
  createGitRepositoryPullRequestCommentThreadItem,
  GitRepositoryPullRequestCommentThreadItem,
} from "../items/GitRepositoryPullRequestCommentThreadItem";
import type { GitRepositoryPullRequestItem } from "../items/GitRepositoryPullRequestItem";
import type { GitRepositoryPullRequestCommentThreadTreeItem } from "../treeItems/GitRepositoryPullRequestCommentThreadTreeItem";

export class GitRepositoryPullRequestCommentThreadTreePartProvider extends TreePartProvider<
  GitRepositoryPullRequestCommentThreadItem | Exception,
  GitRepositoryPullRequestItem
> {
  #repositoryPullRequestCommentThreadTreeItemConstructor: Constructor<GitRepositoryPullRequestCommentThreadTreeItem>;
  #settingsSettings: SettingsService;

  constructor(
    @inject(types.GitRepositoryPullRequestCommentThreadTreeItem)
    GitRepositoryPullRequestCommentThreadTreeItemConstructor: Constructor<GitRepositoryPullRequestCommentThreadTreeItem>,
    @inject(types.SettingsService)
    SettingsService: SettingsService,
  ) {
    super();
    this.#repositoryPullRequestCommentThreadTreeItemConstructor =
      GitRepositoryPullRequestCommentThreadTreeItemConstructor;
    this.#settingsSettings = SettingsService;
  }
  getItems(
    context: Observable<GitRepositoryPullRequestItem>,
  ): Observable<ItemInformation<GitRepositoryPullRequestCommentThreadItem | Exception>> {
    return context.pipe(
      switchMap((context) => {
        return of({
          items:
            context.pullRequestStatusses?.map((commentThread) =>
              createGitRepositoryPullRequestCommentThreadItem(context, commentThread),
            ) ?? [],
        });
      }),
      // outside of switchMap, so that the items of the previous context are removed or updated, not added a second time
      fromArrayWithItemInformation((item: GitRepositoryPullRequestCommentThreadItem) => `${item.commentThread.id!}`),
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
    return createOrUpdateTreeItem(oldTreeItem, this.#repositoryPullRequestCommentThreadTreeItemConstructor, item);
  }
}
