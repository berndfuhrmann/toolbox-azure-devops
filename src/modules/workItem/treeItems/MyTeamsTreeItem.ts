import vscode from "vscode";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { MyTeamsItem } from "../items/WorkItemProjectRootItem";

export class MyTeamsTreeItem<Data extends MyTeamsItem = MyTeamsItem> extends AbstractTreeItem<Data> {
  constructor() {
    super();
    this.label = "My Teams";
    this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
    this.setIcon("users");
  }

  public updateFrom(data: Data) {
    return [super.updateFrom(data), this.updateTooltip("Teams you are a member of")].includes(true);
  }
}
