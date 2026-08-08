import { MarkdownString } from "vscode";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { GitRepositoryPullRequestStatusItem } from "../items/GitRepositoryPullRequestStatusItem";

export class GitRepositoryPullRequestStatusTreeItem<
  Data extends GitRepositoryPullRequestStatusItem = GitRepositoryPullRequestStatusItem,
> extends AbstractTreeItem<Data> {
  constructor() {
    super();
    this.setIcon("user");
  }

  public updateFrom(data: Data) {
    const tooltip = new MarkdownString();
    const contextParts = [data.status.context?.genre, data.status.context?.name].filter(Boolean);
    if (contextParts.length > 0) {
      tooltip.appendMarkdown("`");
      tooltip.appendText(contextParts.join("/"));
      tooltip.appendMarkdown("`");
    }
    return [
      super.updateFrom(data),
      this.updateLabel(`${data.status.description ?? "unknown"}`),
      this.updateTooltip(tooltip),
    ].includes(true);
  }
}
