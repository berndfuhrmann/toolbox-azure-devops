import vscode from "vscode";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { WorkItemItem } from "../items/WorkItemItem";

export class WorkItemLinkedPullRequestsTreeItem<
  Data extends WorkItemItem = WorkItemItem,
> extends AbstractTreeItem<Data> {
  constructor(data?: Data) {
    super();
    this.label = "Linked Pull Requests";
    this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
    this.setIcon("git-pull-request");
    if (data) {
      this.data = data;
    }
  }

  public updateFrom(data: Data) {
    return [super.updateFrom(data), this.updateTooltip("Linked pull requests")].includes(true);
  }
}
