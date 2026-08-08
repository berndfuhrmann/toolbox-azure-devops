import vscode from "vscode";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { WorkItemItem } from "../items/WorkItemItem";

export class WorkItemLinkedItemsTreeItem<Data extends WorkItemItem = WorkItemItem> extends AbstractTreeItem<Data> {
  constructor(data?: Data) {
    super();
    this.label = "Linked Items";
    this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
    this.setIcon("link");
    if (data) {
      this.data = data;
    }
  }

  public updateFrom(data: Data) {
    return [super.updateFrom(data), this.updateTooltip("Linked work items")].includes(true);
  }
}
