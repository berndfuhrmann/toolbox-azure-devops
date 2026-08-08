import vscode from "vscode";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { AgentPoolItem } from "../items/AgentPoolItem";

export class AgentsContainerTreeItem<Data extends AgentPoolItem = AgentPoolItem> extends AbstractTreeItem<Data> {
  public constructor() {
    super();
    this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
    this.setIcon("users");
    this.addContextTag("agents.agentsContainer");
  }

  public override updateFrom(data: Data) {
    return [super.updateFrom(data), this.updateLabel("Agents"), this.updateTooltip("Agents in this pool")].includes(
      true,
    );
  }
}
