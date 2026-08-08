import { inject } from "inversify";
import { Observable, switchMap } from "rxjs";
import { Constructor } from "../../../common/constructor";
import { Exception } from "../../../common/Exception";
import { mapX } from "../../../common/exceptionOperators";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { PinnedItem } from "../../../common/items/PinnedItem";
import { autoRefresh } from "../../../common/operators";
import { fromArray } from "../../../common/treePartProvider/fromArray";
import {
  createOrUpdateTreeItem,
  ItemInformation,
  TreePartProvider,
} from "../../../common/treePartProvider/TreePartProvider";
import { updateExceptionTreeItem } from "../../../common/treePartProvider/updateExceptionTreeItem";
import { GitService } from "../../../generated/services";
import { types } from "../../../generated/types";
import type { ProjectContext } from "../../core/items/ProjectItem";
import { SettingsService } from "../../../common/SettingsService";
import { createGitRepositoryItem, type GitRepositoryItem } from "../items/GitRepositoryItem";
import type { GitRepositoryTreeItem } from "../treeItems/GitRepositoryTreeItem";

export class GitRepositoryTreePartProvider extends TreePartProvider<GitRepositoryItem | Exception, ProjectContext> {
  #repositoryTreeItemConstructor: Constructor<GitRepositoryTreeItem<GitRepositoryItem & PinnedItem>>;
  #settingsSettings: SettingsService;

  constructor(
    @inject(types.PinnableGitRepositoryTreeItem)
    GitRepositoryTreeItemConstructor: Constructor<GitRepositoryTreeItem<GitRepositoryItem & PinnedItem>>,
    @inject(types.SettingsService)
    SettingsService: SettingsService,
  ) {
    super();
    this.#repositoryTreeItemConstructor = GitRepositoryTreeItemConstructor;
    this.#settingsSettings = SettingsService;
  }

  getItems(context: Observable<ProjectContext>): Observable<ItemInformation<GitRepositoryItem | Exception>> {
    return context.pipe(
      switchMap((context) => {
        const { refreshObservables, refreshObservable } = this.createRefreshObservables("gitRepository");
        return context.container
          .get<GitService>(types.GitService)
          .repositories(context.projectId, refreshObservable)
          .pipe(
            autoRefresh(refreshObservable, this.#settingsSettings.autoRefreshInterval()),
            mapX((gitRepositories) =>
              gitRepositories.map((gitRepository) =>
                createGitRepositoryItem(context, gitRepository, refreshObservables),
              ),
            ),
            fromArray((item: GitRepositoryItem) => item.gitRepositoryId, { refreshObservables }),
          );
      }),
    );
  }

  override updateTreeItem(
    item: GitRepositoryItem | Exception,
    key: string,
    oldTreeItem: AbstractTreeItem<any> | undefined,
  ) {
    return (
      updateExceptionTreeItem(item, oldTreeItem) ??
      this.updateTreeItemImpl(item as PinnedItem & GitRepositoryItem, key, oldTreeItem)
    );
  }

  updateTreeItemImpl(
    item: PinnedItem & GitRepositoryItem,
    key: string,
    oldTreeItem: AbstractTreeItem<any> | undefined,
  ) {
    return createOrUpdateTreeItem(oldTreeItem, this.#repositoryTreeItemConstructor, item);
  }
}
