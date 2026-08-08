import { CommentThreadStatus } from "azure-devops-node-api/interfaces/GitInterfaces";
import { MarkdownString } from "vscode";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { GitRepositoryPullRequestCommentThreadItem } from "../items/GitRepositoryPullRequestCommentThreadItem";

const statusLabels: Partial<Record<CommentThreadStatus, string>> = {
  [CommentThreadStatus.Active]: "Active",
  [CommentThreadStatus.Fixed]: "Fixed",
  [CommentThreadStatus.WontFix]: "Won't fix",
  [CommentThreadStatus.Closed]: "Closed",
  [CommentThreadStatus.ByDesign]: "By design",
  [CommentThreadStatus.Pending]: "Pending",
};

export class GitRepositoryPullRequestCommentThreadTreeItem<
  Data extends GitRepositoryPullRequestCommentThreadItem = GitRepositoryPullRequestCommentThreadItem,
> extends AbstractTreeItem<Data> {
  constructor() {
    super();
    this.setIcon("git-pull-request");
  }

  public updateFrom(data: Data) {
    const tooltip = new MarkdownString();
    const statusLabel =
      data.commentThread.status !== undefined ? (statusLabels[data.commentThread.status] ?? "Unknown") : undefined;
    if (statusLabel) {
      tooltip.appendText(statusLabel);
    }
    const filePath = data.commentThread.threadContext?.filePath;
    if (filePath) {
      if (statusLabel) {
        tooltip.appendMarkdown("  \n");
      }
      tooltip.appendMarkdown("`");
      tooltip.appendText(filePath);
      tooltip.appendMarkdown("`");
    }
    const firstComment = data.commentThread.comments?.[0]?.content;
    if (firstComment) {
      tooltip.appendMarkdown("  \n");
      tooltip.appendText(firstComment.length > 120 ? firstComment.substring(0, 120) + "\u2026" : firstComment);
    }
    return [
      super.updateFrom(data),
      this.updateLabel(`${data.commentThread.publishedDate ?? "unknown"}`),
      this.updateTooltip(tooltip),
    ].includes(true);
  }
}
