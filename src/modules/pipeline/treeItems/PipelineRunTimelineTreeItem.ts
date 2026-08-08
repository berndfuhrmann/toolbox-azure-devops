import { TaskResult, TimelineRecordState } from "azure-devops-node-api/interfaces/BuildInterfaces";
import { MarkdownString, TreeItemCollapsibleState } from "vscode";
import { getStatus } from "../../../common/fileDecorator/StatusFileDecorationProvider";
import { formatDuration } from "../../../common/stringUtils";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { extensionName } from "../../../config";
import { PipelineRunTimelineItem } from "../items/PipelineRunTimelineItem";

const resultLabels: Partial<Record<TaskResult, string>> = {
  [TaskResult.Succeeded]: "Succeeded",
  [TaskResult.SucceededWithIssues]: "Succeeded with issues",
  [TaskResult.Failed]: "Failed",
  [TaskResult.Canceled]: "Canceled",
  [TaskResult.Skipped]: "Skipped",
};

export class PipelineRunTimelineTreeItem<
  Data extends PipelineRunTimelineItem = PipelineRunTimelineItem,
> extends AbstractTreeItem<Data> {
  public constructor() {
    super();
    this.setIcon("artifact");
  }

  public override updateFrom(data: Data) {
    const timelineRecord = data.timeline.records?.find((record) => record.id === data.timelineRecordId);
    const hasChildren = data.timeline.records?.find((record) => record.parentId === data.timelineRecordId);

    const tooltip = new MarkdownString();
    if (timelineRecord?.result !== undefined) {
      const resultLabel = resultLabels[timelineRecord.result];
      if (resultLabel) {
        tooltip.appendText(resultLabel);
      }
    }
    if (timelineRecord?.workerName) {
      if (tooltip.value) {
        tooltip.appendMarkdown("  \n");
      }
      tooltip.appendMarkdown("Agent: ");
      tooltip.appendText(timelineRecord.workerName);
    }
    if (timelineRecord?.startTime) {
      tooltip.appendMarkdown("  \nStarted ");
      tooltip.appendText(new Date(timelineRecord.startTime).toLocaleString());
    }
    if (timelineRecord?.finishTime) {
      tooltip.appendMarkdown("  \nFinished ");
      tooltip.appendText(new Date(timelineRecord.finishTime).toLocaleString());
    }
    if (timelineRecord?.startTime && timelineRecord?.finishTime) {
      tooltip.appendMarkdown("  \nDuration: ");
      tooltip.appendText(formatDuration(timelineRecord.startTime, timelineRecord.finishTime));
    }
    return [
      super.updateFrom(data),
      this.updateLabel(`${timelineRecord?.type ?? "Unknown"}: ${timelineRecord?.name ?? "Unknown"}`),
      this.updateTooltip(tooltip),
      this.updateCollapsibleState(hasChildren ? TreeItemCollapsibleState.Collapsed : TreeItemCollapsibleState.None),
      this.updateCommand({
        command: extensionName + ".openTextFile",
        title: "Open log",
        arguments: [this],
      }),
    ].includes(true);
  }

  public [getStatus]() {
    const timelineRecord = this.data.timeline.records?.find((record) => record.id === this.data.timelineRecordId);

    switch (timelineRecord?.state) {
      case TimelineRecordState.Completed:
        return "✅";
      case TimelineRecordState.Pending:
        return "⏳";
      case TimelineRecordState.InProgress:
        return "⚙️";
    }
    return "";
  }
}
