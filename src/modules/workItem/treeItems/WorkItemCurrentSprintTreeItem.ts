import vscode from "vscode";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { WorkItemCurrentSprintItem } from "../items/WorkItemCurrentSprintItem";
import { TimeFrame } from "azure-devops-node-api/interfaces/WorkInterfaces";

export class WorkItemCurrentSprintTreeItem<
  Data extends WorkItemCurrentSprintItem = WorkItemCurrentSprintItem,
> extends AbstractTreeItem<Data> {
  constructor() {
    super();
    this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
    this.setIcon("calendar");
  }

  public updateFrom(data: Data) {
    return [
      super.updateFrom(data),
      this.updateLabel(this.#getSprintName(data)),
      this.updateTooltip(data.sprint.path ?? data.sprint.name),
    ].includes(true);
  }

  #getSprintName(data: Data) {
    let suffix;
    switch (data.sprint.attributes?.timeFrame) {
      case TimeFrame.Current:
        suffix = " (current)";
        break;
      case TimeFrame.Future:
        suffix = " (future)";
        break;
      case TimeFrame.Past:
      default:
        suffix = "";
    }
    return (data.sprint.name ?? data.sprint.id!) + suffix;
  }
}
