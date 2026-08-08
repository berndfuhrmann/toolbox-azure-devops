import vscode from "vscode";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { WorkItemItem } from "../items/WorkItemItem";

export class WorkItemLinkedBranchesTreeItem<Data extends WorkItemItem = WorkItemItem> extends AbstractTreeItem<Data> {
  constructor(data?: Data) {
    super();
    this.label = "Linked Branches";
    this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
    this.setIcon("git-branch");
    if (data) {
      this.data = data;
    }
  }

  public updateFrom(data: Data) {
    return [super.updateFrom(data), this.updateTooltip("Linked branches")].includes(true);
  }
}
