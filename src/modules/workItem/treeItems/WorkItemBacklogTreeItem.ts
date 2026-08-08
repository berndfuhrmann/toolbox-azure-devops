import vscode from "vscode";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { WorkItemTeamContext } from "../items/WorkItemTeamItem";

export class WorkItemBacklogTreeItem<
  Data extends WorkItemTeamContext = WorkItemTeamContext,
> extends AbstractTreeItem<Data> {
  constructor() {
    super();
    this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
    this.setIcon("list");
  }

  public updateFrom(data: Data) {
    return [
      super.updateFrom(data),
      this.updateLabel("Backlog"),
      this.updateTooltip("Work items not assigned to any sprint"),
    ].includes(true);
  }
}
