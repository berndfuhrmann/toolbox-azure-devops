import { inject } from "inversify";
import { Observable, switchMap } from "rxjs";
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
import { GitService } from "../../../generated/services";
import { types } from "../../../generated/types";
import { SettingsService } from "../../../common/SettingsService";
import { createGitRepositoryBranchItem, GitRepositoryBranchItem } from "../items/GitRepositoryBranchItem";
import type { GitRepositoryItem } from "../items/GitRepositoryItem";
import type { GitRepositoryBranchTreeItem } from "../treeItems/GitRepositoryBranchTreeItem";
import { autoRefresh } from "../../../common/operators";

export class GitRepositoryBranchTreePartProvider extends TreePartProvider<
  GitRepositoryBranchItem | Exception,
  GitRepositoryItem
> {
  #repositoryBranchTreeItemConstructor: Constructor<GitRepositoryBranchTreeItem>;
  #settingsSettings: SettingsService;

  constructor(
    @inject(types.GitRepositoryBranchTreeItem)
    GitRepositoryBranchTreeItemConstructor: Constructor<GitRepositoryBranchTreeItem>,
    @inject(types.SettingsService)
    SettingsService: SettingsService,
  ) {
    super();
    this.#repositoryBranchTreeItemConstructor = GitRepositoryBranchTreeItemConstructor;
    this.#settingsSettings = SettingsService;
  }

  getItems(context: Observable<GitRepositoryItem>): Observable<ItemInformation<GitRepositoryBranchItem | Exception>> {
    return context.pipe(
      switchMap((context) => {
        const { refreshObservables, refreshObservable } = this.createRefreshObservables("gitRepositoryBranch");
        return context.container
          .get<GitService>(types.GitService)
          .branches(context.gitRepositoryId, refreshObservable)
          .pipe(
            autoRefresh(refreshObservable, this.#settingsSettings.autoRefreshInterval()),
            mapX((gitRepositoryBranch) =>
              gitRepositoryBranch.map((gitRepositoryBranch2) =>
                createGitRepositoryBranchItem(context, context.gitRepository, gitRepositoryBranch2, refreshObservables),
              ),
            ),
            fromArray((item: GitRepositoryBranchItem) => item.branch.name!, { refreshObservables }),
          );
      }),
    );
  }

  override updateTreeItem(
    item: GitRepositoryBranchItem | Exception,
    key: string,
    oldTreeItem: AbstractTreeItem<any> | undefined,
  ) {
    return (
      updateExceptionTreeItem(item, oldTreeItem) ??
      this.updateTreeItemImpl(item as GitRepositoryBranchItem, key, oldTreeItem)
    );
  }

  updateTreeItemImpl(item: GitRepositoryBranchItem, key: string, oldTreeItem: AbstractTreeItem<any> | undefined) {
    return createOrUpdateTreeItem(oldTreeItem, this.#repositoryBranchTreeItemConstructor, item);
  }
}
