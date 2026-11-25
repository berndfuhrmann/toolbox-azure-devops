import vscode from "vscode";
import { TaskResult } from "azure-devops-node-api/interfaces/TaskAgentInterfaces";
import { getStatus } from "../../../common/fileDecorator/StatusFileDecorationProvider";
import { formatDateTime } from "../../../common/date/dateFormat";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { AgentJobItem } from "../items/AgentJobItem";

export class AgentJobTreeItem<Data extends AgentJobItem = AgentJobItem> extends AbstractTreeItem<Data> {
  public constructor() {
    super();
    this.collapsibleState = vscode.TreeItemCollapsibleState.None;
    this.setIcon("task");
    // Use different context tags based on whether this is agent-level or pool-level
    this.addContextTag("agents.agentJob");
  }

  public override updateFrom(data: Data) {
    return [
      super.updateFrom(data),
      this.updateLabel(this.getJobName(data)),
      this.updateTooltip(this.getJobTooltip(data)),
    ].includes(true);
  }

  private getJobName(data: Data): string {
    if (data.jobRequest.jobName) {
      return data.jobRequest.jobName;
    }
    if (data.jobRequest.requestId !== undefined && data.jobRequest.definition?.name) {
      return `${data.jobRequest.requestId} - ${data.jobRequest.definition.name}`;
    }
    return data.jobRequest.jobId ?? "Unknown Job";
  }

  public [getStatus](): string {
    const request = this.data.jobRequest;

    if (request.finishTime) {
      switch (request.result) {
        case TaskResult.Succeeded:
          return "✅";
        case TaskResult.SucceededWithIssues:
          return "⚠️";
        case TaskResult.Failed:
          return "❌";
        case TaskResult.Canceled:
          return "🚫";
        case TaskResult.Skipped:
          return "⏭️";
        case TaskResult.Abandoned:
          return "🗑️";
        default:
          return "✅";
      }
    }
    if (request.assignTime) {
      return "⚙️";
    }
    if (request.queueTime) {
      return "⏳";
    }
    return "";
  }

  private getJobTooltip(data: Data): string {
    const request = data.jobRequest;
    const lines = [];

    if (request.jobName) {
      lines.push(`Job: ${request.jobName}`);
    }
    if (request.definition?.name) {
      lines.push(`Pipeline: ${request.definition.name}`);
    }
    if (request.queueTime) {
      lines.push(`Queued: ${formatDateTime(request.queueTime)}`);
    }
    if (request.assignTime) {
      lines.push(`Started: ${formatDateTime(request.assignTime)}`);
    }
    if (request.finishTime) {
      lines.push(`Finished: ${formatDateTime(request.finishTime)}`);
    }

    return lines.join("\n");
  }
}
