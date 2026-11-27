import { inject } from "inversify";
import { map, Observable } from "rxjs";
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
import {
  createGitRepositoryPullRequestCommentItem,
  GitRepositoryPullRequestCommentItem,
} from "../items/GitRepositoryPullRequestCommentItem";
import type { GitRepositoryPullRequestCommentThreadItem } from "../items/GitRepositoryPullRequestCommentThreadItem";
import type { GitRepositoryPullRequestCommentTreeItem } from "../treeItems/GitRepositoryPullRequestCommentTreeItem";

export class GitRepositoryPullRequestCommentTreePartProvider extends TreePartProvider<
  GitRepositoryPullRequestCommentItem | Exception,
  GitRepositoryPullRequestCommentThreadItem
> {
  #treeItemConstructor: Constructor<GitRepositoryPullRequestCommentTreeItem>;

  constructor(
    @inject(types.GitRepositoryPullRequestCommentTreeItem)
    treeItemConstructor: Constructor<GitRepositoryPullRequestCommentTreeItem>,
  ) {
    super();
    this.#treeItemConstructor = treeItemConstructor;
  }

  getItems(
    context: Observable<GitRepositoryPullRequestCommentThreadItem>,
  ): Observable<ItemInformation<GitRepositoryPullRequestCommentItem | Exception>> {
    return context.pipe(
      map((context) => ({
        items: context.replies.map((comment) => createGitRepositoryPullRequestCommentItem(context, comment)),
      })),
      fromArrayWithItemInformation((item: GitRepositoryPullRequestCommentItem) => `${item.comment.id!}`),
    );
  }

  override updateTreeItem(
    item: GitRepositoryPullRequestCommentItem | Exception,
    key: string,
    oldTreeItem: AbstractTreeItem<any> | undefined,
  ) {
    return (
      updateExceptionTreeItem(item, oldTreeItem) ??
      this.updateTreeItemImpl(item as GitRepositoryPullRequestCommentItem, key, oldTreeItem)
    );
  }

  updateTreeItemImpl(
    item: GitRepositoryPullRequestCommentItem,
    key: string,
    oldTreeItem: AbstractTreeItem<any> | undefined,
  ) {
    return createOrUpdateTreeItem(oldTreeItem, this.#treeItemConstructor, item);
  }
}
