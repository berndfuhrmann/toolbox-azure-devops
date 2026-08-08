import { MarkdownString, TreeItemCollapsibleState } from "vscode";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { GitRepositoryBranchItem } from "../items/GitRepositoryBranchItem";
import { refToDisplayString } from "../items/GitRepositoryItem";

export class GitRepositoryBranchTreeItem<
  Data extends GitRepositoryBranchItem = GitRepositoryBranchItem,
> extends AbstractTreeItem<Data> {
  constructor() {
    super();
    this.setIcon("git-branch");
    this.collapsibleState = TreeItemCollapsibleState.Collapsed;
  }

  public updateFrom(data: Data) {
    const tooltip = new MarkdownString();
    tooltip.appendMarkdown(`**${data.branch.aheadCount ?? 0}** ahead, **${data.branch.behindCount ?? 0}** behind \``);
    tooltip.appendText(refToDisplayString(data.gitRepository.defaultBranch));
    tooltip.appendMarkdown("`");
    if (data.branch.commit?.author?.name) {
      tooltip.appendMarkdown("  \nLast commit by ");
      tooltip.appendText(data.branch.commit.author.name);
      if (data.branch.commit.author.date) {
        tooltip.appendMarkdown(" on ");
        tooltip.appendText(new Date(data.branch.commit.author.date).toLocaleDateString());
      }
    }
    return [
      super.updateFrom(data),
      this.updateLabel(data.branch.name ?? "unknown"),
      this.updateTooltip(tooltip),
    ].includes(true);
  }
}
