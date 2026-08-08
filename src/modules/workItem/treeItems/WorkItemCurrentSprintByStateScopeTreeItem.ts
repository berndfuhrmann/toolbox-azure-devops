import vscode from "vscode";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { WorkItemCurrentSprintByStateScopeItem } from "../items/WorkItemCurrentSprintByStateScopeItem";

export class WorkItemCurrentSprintByStateScopeTreeItem<
  Data extends WorkItemCurrentSprintByStateScopeItem = WorkItemCurrentSprintByStateScopeItem,
> extends AbstractTreeItem<Data> {
  constructor() {
    super();
    this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
    this.setIcon("flag");
  }

  public override updateFrom(data: Data) {
    return [
      super.updateFrom(data),
      this.updateLabel("By State"),
      this.updateTooltip("Group current sprint items by state"),
    ].includes(true);
  }
}
