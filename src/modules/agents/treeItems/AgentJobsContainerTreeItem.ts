import vscode from "vscode";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { AgentItem } from "../items/AgentItem";

export class AgentJobsContainerTreeItem<Data extends AgentItem = AgentItem> extends AbstractTreeItem<Data> {
  public constructor() {
    super();
    this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
    this.setIcon("run");
    this.addContextTag("agents.agentJobsContainer");
  }

  public override updateFrom(data: Data) {
    return [
      super.updateFrom(data),
      this.updateLabel("Jobs"),
      this.updateTooltip("Jobs assigned to this agent"),
    ].includes(true);
  }
}
