import { TaskAgentStatus } from "azure-devops-node-api/interfaces/TaskAgentInterfaces";
import { MarkdownString, TreeItemCollapsibleState } from "vscode";
import { getStatus } from "../../../common/fileDecorator/StatusFileDecorationProvider";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { AgentItem } from "../items/AgentItem";

export class AgentTreeItem<Data extends AgentItem = AgentItem> extends AbstractTreeItem<Data> {
  public constructor() {
    super();
    this.collapsibleState = TreeItemCollapsibleState.Collapsed;
    this.setIcon("user");
    this.addContextTag("agents.agent");
  }

  public override updateFrom(data: Data) {
    const agentName = data.agent.name ?? "Unknown";

    return [super.updateFrom(data), this.updateLabel(agentName), this.updateTooltip(this.getTooltip(data))].includes(
      true,
    );
  }

  private getTooltip(data: Data) {
    const md = new MarkdownString();

    if (data.agent.name) {
      md.appendMarkdown(`**Agent:** ${data.agent.name}\n\n`);
    }
    if (data.agent.version) {
      md.appendMarkdown(`**Version:** \`${data.agent.version}\`\n\n`);
    }
    if (data.agent.oSDescription) {
      md.appendMarkdown(`**OS:** ${data.agent.oSDescription}\n\n`);
    }
    if (data.agent.enabled !== undefined) {
      md.appendMarkdown(`**Enabled:** ${data.agent.enabled ? "Yes" : "No"}\n\n`);
    }
    if (data.agent.status !== undefined) {
      const status = data.agent.status === TaskAgentStatus.Online ? "Online" : "Offline";
      md.appendMarkdown(`**Status:** ${status}\n\n`);
    }

    // Add capabilities
    const capabilities = {
      ...data.agent.systemCapabilities,
      ...data.agent.userCapabilities,
    };
    if (Object.keys(capabilities).length > 0) {
      md.appendMarkdown("**Capabilities:**\n\n");
      Object.entries(capabilities)
        .sort(([a], [b]) => a.localeCompare(b))
        .forEach(([key, value]) => {
          md.appendMarkdown(`- \`${key}\`: ${value}\n`);
        });
    }

    return md;
  }

  public [getStatus](): string | undefined {
    if (this.data.agent.assignedRequest) {
      return "⚙️";
    }
    if (this.data.agent.status === TaskAgentStatus.Online) {
      return "✅";
    }
    if (this.data.agent.status === TaskAgentStatus.Offline) {
      return "⭕";
    }
    return undefined;
  }
}
