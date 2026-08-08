import { MarkdownString, TreeItemCollapsibleState } from "vscode";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { GitRepositoryCommitItem } from "../items/GitRepositoryCommitItem";

export class GitRepositoryCommitTreeItem<
  Data extends GitRepositoryCommitItem = GitRepositoryCommitItem,
> extends AbstractTreeItem<Data> {
  constructor() {
    super();
    this.setIcon("git-commit");
  }

  public updateFrom(data: Data) {
    const tooltip = new MarkdownString();
    const shortHash = data.commit.commitId?.substring(0, 8);
    if (shortHash) {
      tooltip.appendMarkdown("`");
      tooltip.appendText(shortHash);
      tooltip.appendMarkdown("`");
    }
    if (data.commit.author?.name) {
      if (shortHash) {
        tooltip.appendMarkdown("  \n");
      }
      tooltip.appendText(data.commit.author.name);
      if (data.commit.author.date) {
        tooltip.appendMarkdown(" · ");
        tooltip.appendText(new Date(data.commit.author.date).toLocaleDateString());
      }
    }
    return [
      super.updateFrom(data),
      this.updateCollapsibleState(TreeItemCollapsibleState.Collapsed),
      this.updateLabel(data.commit.comment?.split(/\r?\n/)[0] ?? "unknown"),
      this.updateTooltip(tooltip),
    ].includes(true);
  }
}
