import vscode from "vscode";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { WorkItemHierarchyItem } from "../items/WorkItemProjectRootItem";

export class WorkItemHierarchyTreeItem<
  Data extends WorkItemHierarchyItem = WorkItemHierarchyItem,
> extends AbstractTreeItem<Data> {
  constructor() {
    super();
    this.label = "Work Item Hierarchy";
    this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
    this.setIcon("folder");
  }

  public updateFrom(data: Data) {
    return [super.updateFrom(data), this.updateTooltip("Browse work items by parent-child hierarchy")].includes(true);
  }
}
