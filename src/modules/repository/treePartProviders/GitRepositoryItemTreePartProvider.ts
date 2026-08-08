import {
  GitVersionDescriptor,
  GitVersionType,
  VersionControlRecursionType,
} from "azure-devops-node-api/interfaces/GitInterfaces";
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
import { GitRepositoryBranchItem } from "../items/GitRepositoryBranchItem";
import { GitRepositoryCommitItem } from "../items/GitRepositoryCommitItem";
import type { GitRepositoryItem } from "../items/GitRepositoryItem";
import { createGitRepositoryItemItem, GitRepositoryItemItem } from "../items/GitRepositoryItemItem";
import { GitRepositoryPullRequestItem } from "../items/GitRepositoryPullRequestItem";
import type { GitRepositoryItemTreeItem } from "../treeItems/GitRepositoryItemTreeItem";
import { autoRefresh } from "../../../common/operators";

export class GitRepositoryItemTreePartProvider extends TreePartProvider<
  GitRepositoryItemItem | Exception,
  | GitRepositoryItem
  | GitRepositoryBranchItem
  | GitRepositoryCommitItem
  | GitRepositoryPullRequestItem
  | GitRepositoryItemItem
> {
  #repositoryItemTreeItemConstructor: Constructor<GitRepositoryItemTreeItem>;
  #settingsSettings: SettingsService;

  constructor(
    @inject(types.GitRepositoryItemTreeItem)
    GitRepositoryItemTreeItemConstructor: Constructor<GitRepositoryItemTreeItem>,
    @inject(types.SettingsService)
    SettingsService: SettingsService,
  ) {
    super();
    this.#repositoryItemTreeItemConstructor = GitRepositoryItemTreeItemConstructor;
    this.#settingsSettings = SettingsService;
  }

  getItems(
    context: Observable<
      | GitRepositoryItem
      | GitRepositoryBranchItem
      | GitRepositoryCommitItem
      | GitRepositoryPullRequestItem
      | GitRepositoryItemItem
    >,
  ): Observable<ItemInformation<GitRepositoryItemItem | Exception>> {
    return context.pipe(
      switchMap((context) => {
        const { refreshObservables, refreshObservable } = this.createRefreshObservables("gitRepositoryItem");
        let path: string | undefined = "/";
        let versionDescriptor: GitVersionDescriptor | undefined = undefined;
        if ("item" in context) {
          path = context.item.path;
          versionDescriptor = context.versionDescriptor;
        } else if ("branch" in context) {
          versionDescriptor = {
            versionType: GitVersionType.Branch,
            version: context.branch.name!,
          };
        } else if ("commit" in context) {
          versionDescriptor = {
            versionType: GitVersionType.Commit,
            version: context.commit.commitId,
          };
        }
        return context.container
          .get<GitService>(types.GitService)
          .items(
            context.gitRepositoryId,
            context.projectId,
            path,
            VersionControlRecursionType.OneLevel,
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
            mapX((gitRepositoryItemItem) =>
              gitRepositoryItemItem
                .filter((gitRepositoryItemItem2) => gitRepositoryItemItem2.path !== path)
                .map((gitRepositoryItemItem2) =>
                  createGitRepositoryItemItem(context, gitRepositoryItemItem2, versionDescriptor, refreshObservables),
                ),
            ),
            fromArray((item: GitRepositoryItemItem) => item.item.objectId!, { refreshObservables }),
          );
      }),
    );
  }

  override updateTreeItem(
    item: GitRepositoryItemItem | Exception,
    key: string,
    oldTreeItem: AbstractTreeItem<any> | undefined,
  ) {
    return (
      updateExceptionTreeItem(item, oldTreeItem) ??
      this.updateTreeItemImpl(item as GitRepositoryItemItem, key, oldTreeItem)
    );
  }

  updateTreeItemImpl(item: GitRepositoryItemItem, key: string, oldTreeItem: AbstractTreeItem<any> | undefined) {
    return createOrUpdateTreeItem(oldTreeItem, this.#repositoryItemTreeItemConstructor, item);
  }
}
