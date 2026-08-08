import vscode from "vscode";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { WorkItemCurrentSprintByAssigneeScopeItem } from "../items/WorkItemCurrentSprintByAssigneeScopeItem";

export class WorkItemCurrentSprintByAssigneeScopeTreeItem<
  Data extends WorkItemCurrentSprintByAssigneeScopeItem = WorkItemCurrentSprintByAssigneeScopeItem,
> extends AbstractTreeItem<Data> {
  constructor() {
    super();
    this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
    this.setIcon("users");
  }

  public override updateFrom(data: Data) {
    return [
      super.updateFrom(data),
      this.updateLabel("By Assignee"),
      this.updateTooltip("Group current sprint items by assignee"),
    ].includes(true);
  }
}
