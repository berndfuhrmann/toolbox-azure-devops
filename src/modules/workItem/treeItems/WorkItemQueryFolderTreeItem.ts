import vscode from "vscode";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { WorkItemQueryItem } from "../items/WorkItemQueryItem";

export class WorkItemQueryFolderTreeItem<
  Data extends WorkItemQueryItem = WorkItemQueryItem,
> extends AbstractTreeItem<Data> {
  constructor() {
    super();
    this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
    this.setIcon("folder");
  }

  public override updateFrom(data: Data) {
    return [
      super.updateFrom(data),
      this.updateLabel(data.queryItem.name ?? ""),
      this.updateTooltip("Query folder"),
    ].includes(true);
  }
}
