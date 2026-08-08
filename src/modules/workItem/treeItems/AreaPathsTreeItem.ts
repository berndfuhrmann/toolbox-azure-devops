import vscode from "vscode";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { AreaPathsItem } from "../items/WorkItemProjectRootItem";

export class AreaPathsTreeItem<Data extends AreaPathsItem = AreaPathsItem> extends AbstractTreeItem<Data> {
  constructor() {
    super();
    this.label = "Area Paths";
    this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
    this.setIcon("folder");
  }

  public updateFrom(data: Data) {
    return [super.updateFrom(data), this.updateTooltip("Browse work items by area path")].includes(true);
  }
}
