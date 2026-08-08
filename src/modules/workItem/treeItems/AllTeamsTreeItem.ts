import vscode from "vscode";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { AllTeamsItem } from "../items/WorkItemProjectRootItem";

export class AllTeamsTreeItem<Data extends AllTeamsItem = AllTeamsItem> extends AbstractTreeItem<Data> {
  constructor() {
    super();
    this.label = "All Teams";
    this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
    this.setIcon("users");
  }

  public updateFrom(data: Data) {
    return [super.updateFrom(data), this.updateTooltip("All teams in this project")].includes(true);
  }
}
