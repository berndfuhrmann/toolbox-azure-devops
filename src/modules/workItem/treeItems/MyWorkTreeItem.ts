import vscode from "vscode";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { MyWorkItem } from "../items/WorkItemProjectRootItem";

export class MyWorkTreeItem<Data extends MyWorkItem = MyWorkItem> extends AbstractTreeItem<Data> {
  constructor() {
    super();
    this.label = "My Work";
    this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
    this.setIcon("user");
  }

  public updateFrom(data: Data) {
    return [super.updateFrom(data), this.updateTooltip("Work item views focused on you")].includes(true);
  }
}
