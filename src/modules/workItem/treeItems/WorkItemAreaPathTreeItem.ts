import vscode from "vscode";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { WorkItemAreaPathItem } from "../items/WorkItemAreaPathItem";

export class WorkItemAreaPathTreeItem<
  Data extends WorkItemAreaPathItem = WorkItemAreaPathItem,
> extends AbstractTreeItem<Data> {
  constructor() {
    super();
    this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
    this.setIcon("folder");
  }

  public override updateFrom(data: Data) {
    return [
      super.updateFrom(data),
      this.updateLabel(data.classificationNode.name ?? ""),
      this.updateTooltip(data.classificationNode.path?.replace(/^\\/, "") ?? ""),
    ].includes(true);
  }
}
