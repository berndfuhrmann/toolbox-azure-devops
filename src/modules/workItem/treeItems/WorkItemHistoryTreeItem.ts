import vscode from "vscode";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { WorkItemItem } from "../items/WorkItemItem";

export class WorkItemHistoryTreeItem<Data extends WorkItemItem = WorkItemItem> extends AbstractTreeItem<Data> {
  constructor(data?: Data) {
    super();
    this.label = "History";
    this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
    this.setIcon("history");
    if (data) {
      this.data = data;
    }
  }

  public updateFrom(data: Data) {
    return [super.updateFrom(data), this.updateTooltip("Work item revision history")].includes(true);
  }
}
