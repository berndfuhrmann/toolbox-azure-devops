import vscode from "vscode";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { WorkItemRevisionFieldChangeItem } from "../items/WorkItemRevisionFieldChangeItem";

function formatValue(value: unknown): string {
  if (value === undefined || value === null || value === "") {
    return "(empty)";
  }
  return String(value);
}

function shortFieldName(fieldReferenceName: string): string {
  const dotIndex = fieldReferenceName.lastIndexOf(".");
  return dotIndex >= 0 ? fieldReferenceName.substring(dotIndex + 1) : fieldReferenceName;
}

export class WorkItemRevisionFieldChangeTreeItem<
  Data extends WorkItemRevisionFieldChangeItem = WorkItemRevisionFieldChangeItem,
> extends AbstractTreeItem<Data> {
  public constructor() {
    super();
    this.collapsibleState = vscode.TreeItemCollapsibleState.None;
    this.setIcon("edit");
  }

  public override updateFrom(data: Data) {
    const label = `${shortFieldName(data.fieldReferenceName)}: ${formatValue(data.oldValue)} → ${formatValue(data.newValue)}`;
    const tooltip = `${data.fieldReferenceName}: ${formatValue(data.oldValue)} → ${formatValue(data.newValue)}`;
    return [super.updateFrom(data), this.updateLabel(label), this.updateTooltip(tooltip)].includes(true);
  }
}
