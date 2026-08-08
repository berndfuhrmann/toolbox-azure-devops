import vscode from "vscode";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { QueriesItem } from "../items/WorkItemProjectRootItem";

export class QueriesTreeItem<Data extends QueriesItem = QueriesItem> extends AbstractTreeItem<Data> {
  constructor() {
    super();
    this.label = "Queries";
    this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
    this.setIcon("folder");
  }

  public updateFrom(data: Data) {
    return [super.updateFrom(data), this.updateTooltip("Saved work item queries")].includes(true);
  }
}
