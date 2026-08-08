import { MarkdownString, TreeItemCollapsibleState } from "vscode";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { GitRepositoryItem, refToDisplayString } from "../items/GitRepositoryItem";

export class GitRepositoryCommitsTreeItem<
  Data extends GitRepositoryItem = GitRepositoryItem,
> extends AbstractTreeItem<Data> {
  constructor() {
    super();
    this.label = "Commits";
    this.collapsibleState = TreeItemCollapsibleState.Collapsed;
    this.setIcon("git-commit");
  }

  public updateFrom(data: Data) {
    const tooltip = new MarkdownString();
    tooltip.appendMarkdown("Commits on `");
    tooltip.appendText(refToDisplayString(data.gitRepository.defaultBranch));
    tooltip.appendMarkdown("`");
    return [super.updateFrom(data), this.updateTooltip(tooltip)].includes(true);
  }
}
