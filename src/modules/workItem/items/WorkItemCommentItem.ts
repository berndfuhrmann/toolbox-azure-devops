import { Comment } from "azure-devops-node-api/interfaces/WorkItemTrackingInterfaces";
import { isDeepStrictEqual } from "node:util";
import { Subject } from "rxjs";
import { WorkItemContext, compareWorkItemContext } from "./WorkItemItem";

export function isWorkItemCommentItem(item: { type: string }): item is WorkItemCommentItem {
  return item.type === "workItemComment";
}

export function compareWorkItemCommentItem(a: WorkItemCommentItem, b: WorkItemCommentItem) {
  if (!compareWorkItemContext(a, b)) {
    return false;
  }
  return isDeepStrictEqual(a.comment, b.comment);
}

export interface WorkItemCommentItem extends WorkItemContext {
  readonly type: "workItemComment";
  comment: Comment;
  isEqual(other: WorkItemCommentItem): boolean;
}

export function createWorkItemCommentItem(
  parent: WorkItemContext,
  comment: Comment,
  refreshObservables?: Record<string, Subject<number>>,
): WorkItemCommentItem {
  return {
    type: "workItemComment",
    account: parent.account,
    container: parent.container,
    projectId: parent.projectId,
    refreshObservables: refreshObservables ?? parent.refreshObservables,
    workItemId: parent.workItemId,
    comment,
    isEqual(other) {
      return compareWorkItemCommentItem(this, other);
    },
  };
}
