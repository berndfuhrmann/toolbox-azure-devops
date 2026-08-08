import vscode from "vscode";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { WorkItemItem } from "../items/WorkItemItem";

export class WorkItemLinkedCommitsTreeItem<Data extends WorkItemItem = WorkItemItem> extends AbstractTreeItem<Data> {
  constructor(data?: Data) {
    super();
    this.label = "Linked Commits";
    this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
    this.setIcon("git-commit");
    if (data) {
      this.data = data;
    }
  }

  public updateFrom(data: Data) {
    return [super.updateFrom(data), this.updateTooltip("Linked commits")].includes(true);
  }
}
