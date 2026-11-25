import vscode, { MarkdownString } from "vscode";
import { formatDate } from "../../../common/date/dateFormat";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { WorkItemCommentItem } from "../items/WorkItemCommentItem";

export class WorkItemCommentTreeItem<
  Data extends WorkItemCommentItem = WorkItemCommentItem,
> extends AbstractTreeItem<Data> {
  public constructor() {
    super();
    this.collapsibleState = vscode.TreeItemCollapsibleState.None;
    this.setIcon("comment");
  }

  public override updateFrom(data: Data) {
    const author = data.comment.createdBy?.displayName ?? "Unknown";
    const createdDate = data.comment.createdDate ? formatDate(data.comment.createdDate) : "";
    const tooltipText = data.comment.renderedText ?? data.comment.text ?? "";
    const tooltipMarkdown = new MarkdownString(tooltipText);
    tooltipMarkdown.supportHtml = true;
    return [
      super.updateFrom(data),
      this.updateLabel(`${author} - ${createdDate}`),
      this.updateTooltip(tooltipMarkdown),
    ].includes(true);
  }
}
