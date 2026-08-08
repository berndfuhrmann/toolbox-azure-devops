import vscode from "vscode";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { WorkItemRelationGroupItem } from "../items/WorkItemRelationGroupItem";

export class WorkItemRelationGroupTreeItem<
  Data extends WorkItemRelationGroupItem = WorkItemRelationGroupItem,
> extends AbstractTreeItem<Data> {
  public constructor() {
    super();
    this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
    this.setIcon("link");
  }

  public override updateFrom(data: Data) {
    return [
      super.updateFrom(data),
      this.updateLabel(data.displayName),
      this.updateTooltip(`Related work items: ${data.displayName}`),
    ].includes(true);
  }
}
