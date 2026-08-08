import { inject } from "inversify";
import { Observable, switchMap } from "rxjs";
import { Exception } from "../../../common/Exception";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { mapX } from "../../../common/exceptionOperators";
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
import { GitRepositoryTagItem, createGitRepositoryTagItem } from "../items/GitRepositoryTagItem";
import type { GitRepositoryContext } from "../items/GitRepositoryItem";
import type { GitRepositoryTagTreeItem } from "../treeItems/GitRepositoryTagTreeItem";
import { Constructor } from "../../../common/constructor";
import { autoRefresh } from "../../../common/operators";

export class GitRepositoryTagTreePartProvider extends TreePartProvider<
  GitRepositoryTagItem | Exception,
  GitRepositoryContext
> {
  #repositoryTagTreeItemConstructor: Constructor<GitRepositoryTagTreeItem>;
  #settingsSettings: SettingsService;

  constructor(
    @inject(types.GitRepositoryTagTreeItem)
    GitRepositoryTagTreeItemConstructor: Constructor<GitRepositoryTagTreeItem>,
    @inject(types.SettingsService)
    SettingsService: SettingsService,
  ) {
    super();
    this.#repositoryTagTreeItemConstructor = GitRepositoryTagTreeItemConstructor;
    this.#settingsSettings = SettingsService;
  }

  getItems(context: Observable<GitRepositoryContext>): Observable<ItemInformation<GitRepositoryTagItem | Exception>> {
    return context.pipe(
      switchMap((context) => {
        const { refreshObservables, refreshObservable } = this.createRefreshObservables("gitRepositoryTag");
        return context.container
          .get<GitService>(types.GitService)
          .refs(
            context.gitRepositoryId,
            context.projectId,
            "tags/",
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            refreshObservable,
          )
          .pipe(
            autoRefresh(refreshObservable, this.#settingsSettings.autoRefreshInterval()),
            mapX((gitRepositoryRef) =>
              gitRepositoryRef.map((gitRepositoryRef2) =>
                createGitRepositoryTagItem(context, gitRepositoryRef2, refreshObservables),
              ),
            ),
            fromArray((item: GitRepositoryTagItem) => item.ref.name!, { refreshObservables }),
          );
      }),
    );
  }

  override updateTreeItem(
    item: GitRepositoryTagItem | Exception,
    key: string,
    oldTreeItem: AbstractTreeItem<any> | undefined,
  ) {
    return (
      updateExceptionTreeItem(item, oldTreeItem) ??
      this.updateTreeItemImpl(item as GitRepositoryTagItem, key, oldTreeItem)
    );
  }

  updateTreeItemImpl(item: GitRepositoryTagItem, key: string, oldTreeItem: AbstractTreeItem<any> | undefined) {
    return createOrUpdateTreeItem(oldTreeItem, this.#repositoryTagTreeItemConstructor, item);
  }
}
