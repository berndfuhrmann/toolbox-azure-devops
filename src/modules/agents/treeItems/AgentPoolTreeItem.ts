import { TaskAgentPoolType } from "azure-devops-node-api/interfaces/TaskAgentInterfaces";
import { MarkdownString, TreeItemCollapsibleState } from "vscode";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { AgentPoolItem } from "../items/AgentPoolItem";

export class AgentPoolTreeItem<Data extends AgentPoolItem = AgentPoolItem> extends AbstractTreeItem<Data> {
  public constructor() {
    super();
    this.collapsibleState = TreeItemCollapsibleState.Collapsed;
    this.setIcon("pool");
    this.addContextTag("agents.agentPool");
  }

  public override updateFrom(data: Data) {
    const poolTypeLabels: Partial<Record<TaskAgentPoolType, string>> = {
      [TaskAgentPoolType.Automation]: "Automation",
      [TaskAgentPoolType.Deployment]: "Deployment",
    };
    const tooltip = new MarkdownString();
    if (data.agentPool.poolType !== undefined) {
      tooltip.appendText(poolTypeLabels[data.agentPool.poolType] ?? "Unknown");
      tooltip.appendText(data.agentPool.isHosted ? " (Microsoft-hosted)" : " (self-hosted)");
    }
    if (data.agentPool.size !== undefined) {
      tooltip.appendMarkdown("  \n");
      tooltip.appendText(`${data.agentPool.size} agent${data.agentPool.size !== 1 ? "s" : ""}`);
    }
    if (data.agentPool.autoProvision !== undefined) {
      tooltip.appendMarkdown("  \nAuto-provision: ");
      tooltip.appendText(data.agentPool.autoProvision ? "Yes" : "No");
    }
    return [
      super.updateFrom(data),
      this.updateLabel(data.agentPool.name ?? "Unknown"),
      this.updateTooltip(tooltip),
    ].includes(true);
  }
}
