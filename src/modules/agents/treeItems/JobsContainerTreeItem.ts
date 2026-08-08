import vscode from "vscode";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { AgentPoolItem } from "../items/AgentPoolItem";

export class JobsContainerTreeItem<Data extends AgentPoolItem = AgentPoolItem> extends AbstractTreeItem<Data> {
  public constructor() {
    super();
    this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
    this.setIcon("run");
    this.addContextTag("agents.jobsContainer");
  }

  public override updateFrom(data: Data) {
    return [super.updateFrom(data), this.updateLabel("Jobs"), this.updateTooltip("Jobs in this pool")].includes(true);
  }
}
