import { DefinitionQueueStatus } from "azure-devops-node-api/interfaces/BuildInterfaces";
import vscode, { MarkdownString } from "vscode";
import { createCodeSpan } from "../../../common/stringUtils";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { PipelineItem } from "../items/PipelineItem";

export class PipelineTreeItem<Data extends PipelineItem = PipelineItem> extends AbstractTreeItem<Data> {
  public constructor() {
    super();
    this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
    this.setIcon("pipeline");
    this.addContextTag("inWeb");
    this.addContextTag("pipeline.pipeline");
  }

  public override updateFrom(data: Data) {
    const queueStatusLabels: Partial<Record<DefinitionQueueStatus, string>> = {
      [DefinitionQueueStatus.Enabled]: "Enabled",
      [DefinitionQueueStatus.Paused]: "Paused",
      [DefinitionQueueStatus.Disabled]: "Disabled",
    };
    const tooltip = new MarkdownString();
    tooltip.appendMarkdown(`#${data.pipeline.id}`);
    if (data.pipeline.path && data.pipeline.path !== "\\") {
      tooltip.appendMarkdown("  \nPath: ");
      tooltip.appendMarkdown(createCodeSpan(data.pipeline.path));
    }
    if (data.pipeline.authoredBy?.displayName) {
      tooltip.appendMarkdown("  \nAuthored by ");
      tooltip.appendText(data.pipeline.authoredBy.displayName);
    }
    if (data.pipeline.queueStatus !== undefined) {
      const statusLabel = queueStatusLabels[data.pipeline.queueStatus];
      if (statusLabel) {
        tooltip.appendMarkdown("  \nQueue: ");
        tooltip.appendText(statusLabel);
      }
    }
    return [super.updateFrom(data), this.updateLabel(data.pipeline.name), this.updateTooltip(tooltip)].includes(true);
  }
}
