import { BuildReason } from "azure-devops-node-api/interfaces/BuildInterfaces";
import vscode, { MarkdownString } from "vscode";
import { formatDuration } from "../../../common/stringUtils";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { extensionName } from "../../../config";
import { PipelineRunItem } from "../items/PipelineRunItem";

export class PipelineRunTreeItem<Data extends PipelineRunItem = PipelineRunItem> extends AbstractTreeItem<Data> {
  public constructor() {
    super();
    this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
    this.setIcon("run");
    this.addContextTag("pipeline.run");
  }

  public override updateFrom(data: Data) {
    const reasonLabels: Partial<Record<BuildReason, string>> = {
      [BuildReason.Manual]: "Manual",
      [BuildReason.IndividualCI]: "CI",
      [BuildReason.BatchedCI]: "Batched CI",
      [BuildReason.Schedule]: "Scheduled",
      [BuildReason.ScheduleForced]: "Scheduled (forced)",
      [BuildReason.PullRequest]: "Pull Request",
      [BuildReason.BuildCompletion]: "Build Completion",
    };
    const tooltip = new MarkdownString();
    if (data.build.requestedFor?.displayName) {
      tooltip.appendMarkdown("Triggered by ");
      tooltip.appendText(data.build.requestedFor.displayName);
    }
    if (data.build.reason !== undefined) {
      const reasonLabel = reasonLabels[data.build.reason];
      if (reasonLabel) {
        tooltip.appendMarkdown("  \nReason: ");
        tooltip.appendText(reasonLabel);
      }
    }
    if (data.build.startTime) {
      tooltip.appendMarkdown("  \nStarted ");
      tooltip.appendText(new Date(data.build.startTime).toLocaleString());
    }
    if (data.build.finishTime) {
      tooltip.appendMarkdown("  \nFinished ");
      tooltip.appendText(new Date(data.build.finishTime).toLocaleString());
    }
    if (data.build.startTime && data.build.finishTime) {
      tooltip.appendMarkdown("  \nDuration: ");
      tooltip.appendText(formatDuration(data.build.startTime, data.build.finishTime));
    }
    return [
      super.updateFrom(data),
      this.updateLabel(data.build.buildNumber ?? "unknown"),
      this.updateTooltip(tooltip),
      this.updateCommand({
        command: extensionName + ".openTextFile",
        title: "Open log",
        arguments: [this],
      }),
    ].includes(true);
  }
}
