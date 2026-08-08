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
import { GitRepositoryCommitItem, createGitRepositoryCommitItem } from "../items/GitRepositoryCommitItem";
import type { GitRepositoryContext } from "../items/GitRepositoryItem";
import type { GitRepositoryCommitTreeItem } from "../treeItems/GitRepositoryCommitTreeItem";
import { Constructor } from "../../../common/constructor";
import { GitRepositoryBranchItem } from "../items/GitRepositoryBranchItem";
import { GitQueryCommitsCriteria, GitVersionType } from "azure-devops-node-api/interfaces/GitInterfaces";
import { autoRefresh } from "../../../common/operators";

export class GitRepositoryCommitTreePartProvider extends TreePartProvider<
  GitRepositoryCommitItem | Exception,
  GitRepositoryContext | GitRepositoryBranchItem
> {
  #repositoryCommitTreeItemConstructor: Constructor<GitRepositoryCommitTreeItem>;
  #settingsSettings: SettingsService;

  constructor(
    @inject(types.GitRepositoryCommitTreeItem)
    GitRepositoryCommitTreeItemConstructor: Constructor<GitRepositoryCommitTreeItem>,
    @inject(types.SettingsService)
    SettingsService: SettingsService,
  ) {
    super();
    this.#repositoryCommitTreeItemConstructor = GitRepositoryCommitTreeItemConstructor;
    this.#settingsSettings = SettingsService;
  }

  getItems(
    context: Observable<GitRepositoryContext | GitRepositoryBranchItem>,
  ): Observable<ItemInformation<GitRepositoryCommitItem | Exception>> {
    return context.pipe(
      switchMap((context) => {
        const { refreshObservables, refreshObservable } = this.createRefreshObservables("gitRepositoryCommit");
        let searchCriteria: GitQueryCommitsCriteria = {};
        if ("branch" in context) {
          searchCriteria = {
            itemVersion: {
              versionType: GitVersionType.Branch,
              version: context.branch.name!,
            },
          };
        }
        return context.container
          .get<GitService>(types.GitService)
          .commits(context.gitRepositoryId, searchCriteria, context.projectId, refreshObservable)
          .pipe(
            autoRefresh(refreshObservable, this.#settingsSettings.autoRefreshInterval()),
            mapX((gitRepositoryCommit) =>
              gitRepositoryCommit.map((gitRepositoryCommit2) =>
                createGitRepositoryCommitItem(context, gitRepositoryCommit2, refreshObservables),
              ),
            ),
            fromArray((item: GitRepositoryCommitItem) => item.commit.commitId!, { refreshObservables }),
          );
      }),
    );
  }

  override updateTreeItem(
    item: GitRepositoryCommitItem | Exception,
    key: string,
    oldTreeItem: AbstractTreeItem<any> | undefined,
  ) {
    return (
      updateExceptionTreeItem(item, oldTreeItem) ??
      this.updateTreeItemImpl(item as GitRepositoryCommitItem, key, oldTreeItem)
    );
  }

  updateTreeItemImpl(item: GitRepositoryCommitItem, key: string, oldTreeItem: AbstractTreeItem<any> | undefined) {
    return createOrUpdateTreeItem(oldTreeItem, this.#repositoryCommitTreeItemConstructor, item);
  }
}
