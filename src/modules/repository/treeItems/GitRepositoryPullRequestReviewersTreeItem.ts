import vscode from "vscode";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { GitRepositoryPullRequestItem } from "../items/GitRepositoryPullRequestItem";

export class GitRepositoryPullRequestReviewersTreeItem<
  Data extends GitRepositoryPullRequestItem = GitRepositoryPullRequestItem,
> extends AbstractTreeItem<Data> {
  constructor(data?: Data) {
    super();
    this.label = "Reviewers";
    this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
    this.setIcon("users");
    if (data) {
      this.data = data;
    }
  }

  public updateFrom(data: Data) {
    return [super.updateFrom(data), this.updateTooltip("Pull request reviewers")].includes(true);
  }
}
