import vscode from "vscode";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { WorkItemCurrentSprintGroupItem } from "../items/WorkItemCurrentSprintGroupItem";

export class WorkItemCurrentSprintGroupTreeItem<
  Data extends WorkItemCurrentSprintGroupItem = WorkItemCurrentSprintGroupItem,
> extends AbstractTreeItem<Data> {
  constructor() {
    super();
    this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
    this.setIcon("list-tree");
  }

  public updateFrom(data: Data) {
    return [
      super.updateFrom(data),
      this.updateLabel(data.groupName),
      this.updateTooltip(`Current sprint ${data.grouping} group: ${data.groupName}`),
      this.updateDescription(`${data.workItems.length}`),
    ].includes(true);
  }
}
