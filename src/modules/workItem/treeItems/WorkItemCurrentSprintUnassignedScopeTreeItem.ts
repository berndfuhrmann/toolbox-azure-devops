import vscode from "vscode";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { WorkItemCurrentSprintUnassignedScopeItem } from "../items/WorkItemCurrentSprintUnassignedScopeItem";

export class WorkItemCurrentSprintUnassignedScopeTreeItem<
  Data extends WorkItemCurrentSprintUnassignedScopeItem = WorkItemCurrentSprintUnassignedScopeItem,
> extends AbstractTreeItem<Data> {
  constructor() {
    super();
    this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
    this.setIcon("user-question");
  }

  public override updateFrom(data: Data) {
    return [
      super.updateFrom(data),
      this.updateLabel("Unassigned"),
      this.updateTooltip("Show unassigned items in current sprint"),
    ].includes(true);
  }
}
