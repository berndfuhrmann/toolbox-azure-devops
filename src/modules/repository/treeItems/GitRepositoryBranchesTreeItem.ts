import vscode, { MarkdownString } from "vscode";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { GitRepositoryItem, refToDisplayString } from "../items/GitRepositoryItem";

export class GitRepositoryBranchesTreeItem<
  Data extends GitRepositoryItem = GitRepositoryItem,
> extends AbstractTreeItem<Data> {
  constructor() {
    super();
    this.label = "Branches";
    this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
    this.setIcon("git-branch");
  }

  public updateFrom(data: Data) {
    const tooltip = new MarkdownString();
    tooltip.appendMarkdown("Default branch: `");
    tooltip.appendText(refToDisplayString(data.gitRepository.defaultBranch));
    tooltip.appendMarkdown("`");
    return [super.updateFrom(data), this.updateTooltip(tooltip)].includes(true);
  }
}
