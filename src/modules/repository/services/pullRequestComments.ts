import {
  Comment,
  CommentThreadStatus,
  CommentType,
  GitPullRequestCommentThread,
} from "azure-devops-node-api/interfaces/GitInterfaces";
import { formatDateTime } from "../../../common/date/dateFormat";

export const commentThreadStatuses: readonly { status: CommentThreadStatus; label: string }[] = [
  { status: CommentThreadStatus.Active, label: "Active" },
  { status: CommentThreadStatus.Pending, label: "Pending" },
  { status: CommentThreadStatus.Fixed, label: "Fixed" },
  { status: CommentThreadStatus.WontFix, label: "Won't Fix" },
  { status: CommentThreadStatus.Closed, label: "Closed" },
  { status: CommentThreadStatus.ByDesign, label: "By Design" },
];

const resolvedStatuses: readonly (CommentThreadStatus | undefined)[] = [
  CommentThreadStatus.Fixed,
  CommentThreadStatus.WontFix,
  CommentThreadStatus.Closed,
  CommentThreadStatus.ByDesign,
];

export function isResolved(thread: GitPullRequestCommentThread) {
  return resolvedStatuses.includes(thread.status);
}

/**
 * @returns the first comment and its replies, or undefined if the thread should not be displayed, because it was
 * created by the system or deleted
 */
export function getThreadComments(
  thread: GitPullRequestCommentThread,
): { firstComment: Comment; replies: Comment[] } | undefined {
  if (thread.isDeleted || thread.properties?.CodeReviewThreadType !== undefined) {
    return undefined;
  }
  const [firstComment, ...others] = [...(thread.comments ?? [])].sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
  if (!firstComment || firstComment.commentType === CommentType.System) {
    return undefined;
  }
  const replies = others.filter((comment) => !comment.isDeleted && comment.commentType !== CommentType.System);
  if (firstComment.isDeleted && replies.length === 0) {
    return undefined;
  }
  return { firstComment, replies };
}

export function getCommentTime(comment: Comment) {
  return comment.publishedDate ? new Date(comment.publishedDate).getTime() : 0;
}

export function getCommentLabel(comment: Comment) {
  const author = comment.isDeleted ? "(deleted)" : (comment.author?.displayName ?? "Unknown");
  return comment.publishedDate ? `${author} - ${formatDateTime(comment.publishedDate)}` : author;
}

export function getLikesDescription(comment: Comment) {
  const count = comment.usersLiked?.length ?? 0;
  return !comment.isDeleted && count > 0 ? `👍 ${count}` : undefined;
}

export function getLikesTooltip(comment: Comment) {
  if (comment.isDeleted || !comment.usersLiked?.length) {
    return undefined;
  }
  return `Liked by ${comment.usersLiked.map((user) => user.displayName ?? "Unknown").join(", ")}`;
}

/** Context tags that decide which of the commands for liking a comment is shown */
export function getLikeTags(comment: Comment, userId: string) {
  const liked = comment.usersLiked?.some((user) => user.id?.toLowerCase() === userId.toLowerCase()) ?? false;
  return {
    "gitRepository.pullRequest.likeableComment": !comment.isDeleted && !liked,
    "gitRepository.pullRequest.likedComment": !comment.isDeleted && liked,
  };
}

export function joinParts(separator: string, parts: readonly (string | undefined)[]) {
  return parts.filter(Boolean).join(separator) || undefined;
}
