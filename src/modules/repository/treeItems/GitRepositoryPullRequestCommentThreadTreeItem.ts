import { CommentThreadStatus } from "azure-devops-node-api/interfaces/GitInterfaces";
import { TreeItemCollapsibleState } from "vscode";
import { getStatus } from "../../../common/fileDecorator/StatusFileDecorationProvider";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { GitRepositoryPullRequestCommentThreadItem } from "../items/GitRepositoryPullRequestCommentThreadItem";
import {
  commentThreadStatuses,
  getCommentLabel,
  getLikesDescription,
  getLikesTooltip,
  getLikeTags,
  joinParts,
} from "../services/pullRequestComments";

export class GitRepositoryPullRequestCommentThreadTreeItem<
  Data extends GitRepositoryPullRequestCommentThreadItem = GitRepositoryPullRequestCommentThreadItem,
> extends AbstractTreeItem<Data> {
  constructor() {
    super();
    this.setIcon("comments");
    this.addContextTag("inWebContextMenu");
    this.addContextTag("gitRepository.pullRequest.commentThread");
  }

  public updateFrom(data: Data) {
    const { commentThread, firstComment, replies } = data;
    const threadContext = commentThread.threadContext;
    const line = threadContext?.rightFileStart?.line ?? threadContext?.leftFileStart?.line;
    const location =
      threadContext?.filePath && line ? `${threadContext.filePath}:${line}` : (threadContext?.filePath ?? undefined);
    super.updateFrom(data);
    this.updateLabel(getCommentLabel(firstComment));
    this.updateDescription(
      joinParts(" · ", [
        location?.split("/").at(-1),
        replies.length > 0 ? `${replies.length} ${replies.length === 1 ? "reply" : "replies"}` : undefined,
        getLikesDescription(firstComment),
      ]),
    );
    this.updateTooltip(
      joinParts("\n", [
        commentThreadStatuses.find(({ status }) => status === commentThread.status)?.label,
        location,
        getLikesTooltip(firstComment),
      ]),
    );
    this.updateCollapsibleState(
      replies.length > 0 ? TreeItemCollapsibleState.Collapsed : TreeItemCollapsibleState.None,
    );
    Object.entries(getLikeTags(firstComment, data.userId)).forEach(([tag, present]) => this.updateTag(tag, present));
    // The badge, the replies and the order depend on the data, too.
    return true;
  }

  public [getStatus]() {
    switch (this.data.commentThread.status) {
      case CommentThreadStatus.Pending:
        return "⏳";
      case CommentThreadStatus.Fixed:
      case CommentThreadStatus.Closed:
        return "✅";
      case CommentThreadStatus.WontFix:
      case CommentThreadStatus.ByDesign:
        return "🚫";
      default:
        return "";
    }
  }
}
