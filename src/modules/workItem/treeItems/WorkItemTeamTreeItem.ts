import vscode from "vscode";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { WorkItemTeamItem } from "../items/WorkItemTeamItem";

export class WorkItemTeamTreeItem<Data extends WorkItemTeamItem = WorkItemTeamItem> extends AbstractTreeItem<Data> {
  constructor() {
    super();
    this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
    this.setIcon("users");
  }

  public updateFrom(data: Data) {
    return [
      super.updateFrom(data),
      this.updateLabel(data.team.name),
      this.updateTooltip(data.team.description ?? `Team ${data.team.name}`),
    ].includes(true);
  }
}
