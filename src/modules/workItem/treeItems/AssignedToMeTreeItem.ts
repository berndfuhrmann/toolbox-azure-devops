import vscode from "vscode";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { ProjectContext } from "../../core/items/ProjectItem";

export class AssignedToMeTreeItem<Data extends ProjectContext = ProjectContext> extends AbstractTreeItem<Data> {
  constructor() {
    super();
    this.label = "Assigned to Me";
    this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
    this.setIcon("user");
  }

  public updateFrom(data: Data) {
    return [super.updateFrom(data), this.updateTooltip("Work items assigned to me")].includes(true);
  }
}
