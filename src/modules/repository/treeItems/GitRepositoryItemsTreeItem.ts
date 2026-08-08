import vscode, { MarkdownString } from "vscode";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { GitRepositoryItem, refToDisplayString } from "../items/GitRepositoryItem";

export class GitRepositoryItemsTreeItem<
  Data extends GitRepositoryItem = GitRepositoryItem,
> extends AbstractTreeItem<Data> {
  constructor(data?: Data) {
    super();
    this.label = "Files";
    this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
    this.setIcon("folder");
    if (data) {
      this.data = data;
    }
  }

  public updateFrom(data: Data) {
    const tooltip = new MarkdownString();
    tooltip.appendMarkdown("Branch: `");
    tooltip.appendText(refToDisplayString(data.gitRepository.defaultBranch));
    tooltip.appendMarkdown("`");
    return [super.updateFrom(data), this.updateTooltip(tooltip)].includes(true);
  }
}
