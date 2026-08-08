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
  createGitRepositoryPullRequestStatusItem,
  GitRepositoryPullRequestStatusItem,
} from "../items/GitRepositoryPullRequestStatusItem";
import type { GitRepositoryPullRequestStatusTreeItem } from "../treeItems/GitRepositoryPullRequestStatusTreeItem";

export class GitRepositoryPullRequestStatusTreePartProvider extends TreePartProvider<
  GitRepositoryPullRequestStatusItem | Exception,
  GitRepositoryPullRequestItem
> {
  #repositoryPullRequestStatusTreeItemConstructor: Constructor<GitRepositoryPullRequestStatusTreeItem>;
  #settingsSettings: SettingsService;

  constructor(
    @inject(types.GitRepositoryPullRequestStatusTreeItem)
    GitRepositoryPullRequestStatusTreeItemConstructor: Constructor<GitRepositoryPullRequestStatusTreeItem>,
    @inject(types.SettingsService)
    SettingsService: SettingsService,
  ) {
    super();
    this.#repositoryPullRequestStatusTreeItemConstructor = GitRepositoryPullRequestStatusTreeItemConstructor;
    this.#settingsSettings = SettingsService;
  }

  getItems(
    context: Observable<GitRepositoryPullRequestItem>,
  ): Observable<ItemInformation<GitRepositoryPullRequestStatusItem | Exception>> {
    return context.pipe(
      switchMap((context) => {
        return of(
          context.pullRequestStatusses?.map((status) => createGitRepositoryPullRequestStatusItem(context, status)) ??
            [],
        ).pipe(fromArray((item: GitRepositoryPullRequestStatusItem) => `${item.status.id!}`, {}));
      }),
    );
  }

  override updateTreeItem(
    item: GitRepositoryPullRequestStatusItem | Exception,
    key: string,
    oldTreeItem: AbstractTreeItem<any> | undefined,
  ) {
    return (
      updateExceptionTreeItem(item, oldTreeItem) ??
      this.updateTreeItemImpl(item as GitRepositoryPullRequestStatusItem, key, oldTreeItem)
    );
  }

  updateTreeItemImpl(
    item: GitRepositoryPullRequestStatusItem,
    key: string,
    oldTreeItem: AbstractTreeItem<any> | undefined,
  ) {
    return createOrUpdateTreeItem(oldTreeItem, this.#repositoryPullRequestStatusTreeItemConstructor, item);
  }
}
