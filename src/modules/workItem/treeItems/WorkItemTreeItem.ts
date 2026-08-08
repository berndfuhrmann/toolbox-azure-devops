import vscode from "vscode";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import {
  getAreaPath,
  getAssignedTo,
  getCreatedBy,
  getEffort,
  getIterationPath,
  getState,
  getTags,
  getTitle,
  getWorkItemType,
} from "../../workItemTracking/fields";
import { canOpenInWeb, WorkItemItem } from "../items/WorkItemItem";

function buildWorkItemTooltip(
  workItemId: number,
  workItem: NonNullable<WorkItemItem["workItem"]>,
): vscode.MarkdownString {
  const tooltip = new vscode.MarkdownString();
  tooltip.appendMarkdown(`**#${workItemId}: ${getTitle(workItem)}**\n\n`);
  tooltip.appendMarkdown(`*${getWorkItemType(workItem)}* · ${getState(workItem)}\n\n`);
  const assignedTo = getAssignedTo(workItem);
  const createdBy = getCreatedBy(workItem);
  const iterationPath = getIterationPath(workItem);
  const areaPath = getAreaPath(workItem);
  const effort = getEffort(workItem);
  const tags = getTags(workItem);
  if (assignedTo) {
    tooltip.appendMarkdown(`- **Assigned To:** ${assignedTo}\n`);
  }
  if (createdBy) {
    tooltip.appendMarkdown(`- **Created By:** ${createdBy}\n`);
  }
  if (iterationPath) {
    tooltip.appendMarkdown(`- **Iteration:** ${iterationPath}\n`);
  }
  if (areaPath) {
    tooltip.appendMarkdown(`- **Area:** ${areaPath}\n`);
  }
  if (effort !== undefined) {
    tooltip.appendMarkdown(`- **Effort:** ${effort}\n`);
  }
  if (tags.length > 0) {
    tooltip.appendMarkdown(`- **Tags:** ${tags.join(", ")}\n`);
  }
  return tooltip;
}

export class WorkItemTreeItem<Data extends WorkItemItem = WorkItemItem> extends AbstractTreeItem<Data> {
  public constructor() {
    super();
    this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
    this.addContextTag("inWeb");
    this.addContextTag("workItem.workItem");
  }

  public override updateFrom(data: Data) {
    return [
      super.updateFrom(data),
      this.updateIconSVG(data.iconSvg),
      this.updateLabel(
        (data.workItem &&
          `${data.workItemId}: ${getTitle(data.workItem)} [${getWorkItemType(data.workItem)}] ${getState(data.workItem)}`) ||
          `${data.workItemId} (loading details)`,
      ),
      this.updateTag("inWeb", canOpenInWeb(data)),
      this.updateTooltip(data.workItem ? buildWorkItemTooltip(data.workItemId, data.workItem) : undefined),
    ].includes(true);
  }
}
