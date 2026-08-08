import vscode from "vscode";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { GitRepositoryItem } from "../items/GitRepositoryItem";

export class GitRepositoryPullRequestsTreeItem<
  Data extends GitRepositoryItem = GitRepositoryItem,
> extends AbstractTreeItem<Data> {
  constructor() {
    super();
    this.label = "Pull Requests";
    this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
    this.setIcon("git-pull-request");
  }

  public updateFrom(data: Data) {
    return [super.updateFrom(data), this.updateTooltip("Active pull requests")].includes(true);
  }
}
