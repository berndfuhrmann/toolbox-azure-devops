import vscode from "vscode";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { WorkItemCurrentSprintScopeItem } from "../items/WorkItemCurrentSprintItem";

export class WorkItemCurrentSprintScopeTreeItem<
  Data extends WorkItemCurrentSprintScopeItem = WorkItemCurrentSprintScopeItem,
> extends AbstractTreeItem<Data> {
  constructor() {
    super();
    this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
  }
}
