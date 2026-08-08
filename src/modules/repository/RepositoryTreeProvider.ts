import { inject, injectable, injectFromHierarchy, postConstruct } from "inversify";
import { map } from "rxjs";
import vscode from "vscode";
import { AbstractTreeProvider } from "../../common/AbstractTreeProvider";
import { AbstractTreeItem } from "../../common/treeItems/AbstractTreeItem";
import { sortByBoolean, sortByDate, sortByNumber, sortByString, sortByType, sorter } from "../../common/sorting";
import { ExceptionTreeItem } from "../../common/treeItems/ExceptionTreeItem";
import { MissingTreeItem } from "../../common/treeItems/MissingTreeItem";
import { TreePartProvider } from "../../common/treePartProvider/TreePartProvider";
import { UnwrappingTreePartProvider } from "../../common/treePartProvider/UnwrappingTreePartProvider";
import { types } from "../../generated/types";
import { AccountItem } from "../core/items/AccountItem";
import { AccountTreeItem } from "../core/treeItems/AccountTreeItem";
import { ProjectTreeItem } from "../core/treeItems/ProjectTreeItem";
import { GitRepositoryBranchTreeItem } from "./treeItems/GitRepositoryBranchTreeItem";
import { GitRepositoryBranchesTreeItem } from "./treeItems/GitRepositoryBranchesTreeItem";
import { GitRepositoryCommitTreeItem } from "./treeItems/GitRepositoryCommitTreeItem";
import { GitRepositoryCommitsTreeItem } from "./treeItems/GitRepositoryCommitsTreeItem";
import { GitRepositoryItemTreeItem } from "./treeItems/GitRepositoryItemTreeItem";
import { GitRepositoryItemsTreeItem } from "./treeItems/GitRepositoryItemsTreeItem";
import { GitRepositoryPullRequestCommentThreadTreeItem } from "./treeItems/GitRepositoryPullRequestCommentThreadTreeItem";
import { GitRepositoryPullRequestReviewerTreeItem } from "./treeItems/GitRepositoryPullRequestReviewerTreeItem";
import { GitRepositoryPullRequestStatusTreeItem } from "./treeItems/GitRepositoryPullRequestStatusTreeItem";
import { GitRepositoryPullRequestTreeItem } from "./treeItems/GitRepositoryPullRequestTreeItem";
import { GitRepositoryTagsTreeItem } from "./treeItems/GitRepositoryTagsTreeItem";
import { GitRepositoryTreeItem } from "./treeItems/GitRepositoryTreeItem";
import { RepositoryTreeProviderResolver } from "../../generated/treeProviderResolvers";

@injectable()
@injectFromHierarchy({
  extendConstructorArguments: false,
  extendProperties: true,
})
export class RepositoryTreeProvider extends AbstractTreeProvider {
  #resolver: RepositoryTreeProviderResolver;

  constructor(
    @inject(types.RepositoryTreeProviderResolver)
    resolver: RepositoryTreeProviderResolver,
  ) {
    super();
    this.#resolver = resolver;
  }

  #sorter = sorter(
    sortByBoolean((a: any) => !("pinnedInstance" in a.data)),
    sortByType([
      [ExceptionTreeItem, undefined],
      [MissingTreeItem, undefined],
      [
        GitRepositoryItemTreeItem,
        sorter(
          sortByBoolean((a: GitRepositoryItemTreeItem) => Boolean(!a.data.item.isFolder)),
          sortByString((a: GitRepositoryItemTreeItem) => String(a.data.item.path)),
        ),
      ],
      [
        GitRepositoryPullRequestReviewerTreeItem,
        sortByString((a: GitRepositoryPullRequestReviewerTreeItem) => a.data.identityRef.displayName!),
      ],
      [
        GitRepositoryPullRequestStatusTreeItem,
        sortByDate((a: GitRepositoryPullRequestStatusTreeItem) => a.data.status.creationDate!),
      ],
      [
        GitRepositoryPullRequestCommentThreadTreeItem,
        sortByDate((a: GitRepositoryPullRequestCommentThreadTreeItem) => a.data.commentThread.publishedDate!),
      ],
      [GitRepositoryCommitTreeItem, sortByString((a: GitRepositoryCommitTreeItem) => a.data.commit.comment!)],
      [GitRepositoryBranchTreeItem, sortByString((a: GitRepositoryBranchTreeItem) => a.data.branch.name!)],
      [
        GitRepositoryPullRequestTreeItem,
        sorter(
          sortByBoolean((a: any) => !a.data.pinned),
          sortByNumber((a: GitRepositoryPullRequestTreeItem) => -a.data.pullRequestId),
        ),
      ],
      [
        GitRepositoryTreeItem,
        sorter(
          sortByBoolean((a: any) => !a.data.pinned),
          sortByString((a: GitRepositoryTreeItem) => a.data.gitRepository.name!),
        ),
      ],
      [GitRepositoryItemsTreeItem, undefined],
      [GitRepositoryCommitsTreeItem, undefined],
      [GitRepositoryBranchesTreeItem, undefined],
      [GitRepositoryTagsTreeItem, undefined],
      [ProjectTreeItem, sortByString((a: ProjectTreeItem) => a.data.project.name!)],
    ]),
  ).bind(this);

  protected sortTreeItems(treeItems: AbstractTreeItem<any>[], _parent: AbstractTreeItem<any> | undefined): void {
    treeItems.sort(this.#sorter);
  }

  protected override getTreePartProvider(
    element: AbstractTreeItem<any> | undefined,
  ): TreePartProvider<any, any> | undefined {
    return this.#resolver.getTreePartProvider(element);
  }

  @postConstruct()
  private initializeRepositoryTreeProvider() {
    (
      this.#resolver.accountRootUnwrappingTreePartProvider as UnwrappingTreePartProvider<
        any,
        AccountItem,
        undefined,
        TreePartProvider<any, AccountItem>
      >
    ).unwrapObservable
      .pipe(map((x) => x.unwrap))
      .subscribe((unwrap) => {
        vscode.commands.executeCommand("setContext", "toolbox-azure-devops-by-bf.accounts-unwrapped", unwrap);
      });
  }

  /**
   * Find and reveal a repository by its ID
   */
  async findAndRevealRepository(repositoryId: string, accountId: string, projectId: string): Promise<boolean> {
    const accountItem = await this.#findAccountItem(accountId);
    if (!accountItem) {
      return false;
    }

    const projectItem = await this.#findProjectItem(accountItem, projectId);
    if (!projectItem) {
      return false;
    }

    const repositoryItem = await this.#findRepositoryItem(projectItem, repositoryId);
    if (!repositoryItem) {
      return false;
    }

    await this.reveal(repositoryItem, {
      select: true,
      focus: true,
      expand: true,
    });
    return true;
  }

  async #findAccountItem(accountId: string): Promise<AccountTreeItem | undefined> {
    const children = await this.getChildren();
    return children?.find(
      (child): child is AccountTreeItem =>
        child instanceof AccountTreeItem && child.data.account.accountId === accountId,
    );
  }

  async #findProjectItem(accountItem: AccountTreeItem, projectId: string): Promise<ProjectTreeItem | undefined> {
    const children = await this.getChildren(accountItem);
    return children?.find(
      (child): child is ProjectTreeItem => child instanceof ProjectTreeItem && child.data.projectId === projectId,
    );
  }

  async #findRepositoryItem(
    projectItem: ProjectTreeItem,
    repositoryId: string,
  ): Promise<GitRepositoryTreeItem | undefined> {
    const children = await this.getChildren(projectItem);
    return children?.find(
      (child): child is GitRepositoryTreeItem =>
        child instanceof GitRepositoryTreeItem && child.data.gitRepositoryId === repositoryId,
    );
  }
}
