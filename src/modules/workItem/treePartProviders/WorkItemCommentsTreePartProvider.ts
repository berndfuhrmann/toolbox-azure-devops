import { inject } from "inversify";
import { Observable, of, switchMap } from "rxjs";
import { CommentExpandOptions } from "azure-devops-node-api/interfaces/WorkItemTrackingInterfaces";
import { Constructor } from "../../../common/constructor";
import { Exception } from "../../../common/Exception";
import { switchMapX } from "../../../common/exceptionOperators";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { fromArray } from "../../../common/treePartProvider/fromArray";
import {
  ItemInformation,
  createOrUpdateTreeItem,
  TreePartProvider,
} from "../../../common/treePartProvider/TreePartProvider";
import { updateExceptionTreeItem } from "../../../common/treePartProvider/updateExceptionTreeItem";
import { WorkItemTrackingService } from "../../../generated/services";
import { types } from "../../../generated/types";
import { WorkItemCommentItem, createWorkItemCommentItem } from "../items/WorkItemCommentItem";
import type { WorkItemContext } from "../items/WorkItemItem";
import type { WorkItemCommentTreeItem } from "../treeItems/WorkItemCommentTreeItem";

export class WorkItemCommentsTreePartProvider extends TreePartProvider<
  WorkItemCommentItem | Exception,
  WorkItemContext
> {
  #treeItemConstructor: Constructor<WorkItemCommentTreeItem>;

  constructor(
    @inject(types.WorkItemCommentTreeItem)
    treeItemConstructor: Constructor<WorkItemCommentTreeItem>,
  ) {
    super();
    this.#treeItemConstructor = treeItemConstructor;
  }

  getItems(context: Observable<WorkItemContext>): Observable<ItemInformation<WorkItemCommentItem | Exception>> {
    return context.pipe(
      switchMap((context) => {
        const { refreshObservables, refreshObservable } = this.createRefreshObservables("workItemComments");
        const workItemTrackingService = context.container.get<WorkItemTrackingService>(types.WorkItemTrackingService);

        return workItemTrackingService
          .comments(
            context.projectId,
            context.workItemId,
            undefined,
            undefined,
            false,
            CommentExpandOptions.RenderedText,
            undefined,
            refreshObservable,
          )
          .pipe(
            switchMapX((commentList) => {
              const comments = commentList.comments ?? [];
              return of(comments.map((comment) => createWorkItemCommentItem(context, comment, refreshObservables)));
            }),
            fromArray((item: WorkItemCommentItem) => `${item.comment.id!}`, { refreshObservables }),
          );
      }),
    );
  }

  override updateTreeItem(
    item: WorkItemCommentItem | Exception,
    key: string,
    oldTreeItem: AbstractTreeItem<any> | undefined,
  ) {
    return (
      updateExceptionTreeItem(item, oldTreeItem) ??
      this.updateTreeItemImpl(item as WorkItemCommentItem, key, oldTreeItem)
    );
  }

  updateTreeItemImpl(item: WorkItemCommentItem, key: string, oldTreeItem: AbstractTreeItem<any> | undefined) {
    return createOrUpdateTreeItem(oldTreeItem, this.#treeItemConstructor, item);
  }
}
