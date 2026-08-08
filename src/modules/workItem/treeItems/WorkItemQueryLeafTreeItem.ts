import vscode from "vscode";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { WorkItemQueryItem } from "../items/WorkItemQueryItem";

export class WorkItemQueryLeafTreeItem<
  Data extends WorkItemQueryItem = WorkItemQueryItem,
> extends AbstractTreeItem<Data> {
  constructor() {
    super();
    this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
    this.setIcon("list-details");
  }

  public override updateFrom(data: Data) {
    return [
      super.updateFrom(data),
      this.updateLabel(data.queryItem.name ?? ""),
      this.updateTooltip("Saved query"),
    ].includes(true);
  }
}
