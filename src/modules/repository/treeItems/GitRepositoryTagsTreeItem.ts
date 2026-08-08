import vscode from "vscode";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { GitRepositoryItem } from "../items/GitRepositoryItem";

export class GitRepositoryTagsTreeItem<
  Data extends GitRepositoryItem = GitRepositoryItem,
> extends AbstractTreeItem<Data> {
  constructor() {
    super();
    this.label = "Tags";
    this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
    this.setIcon("tags");
  }

  public updateFrom(data: Data) {
    return [super.updateFrom(data), this.updateTooltip("Tags")].includes(true);
  }
}
