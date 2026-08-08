import vscode from "vscode";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { ProjectContext } from "../../core/items/ProjectItem";

export class RecentlyModifiedByMeTreeItem<Data extends ProjectContext = ProjectContext> extends AbstractTreeItem<Data> {
  constructor() {
    super();
    this.label = "Recently Modified by Me";
    this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
    this.setIcon("history");
  }

  public updateFrom(data: Data) {
    return [super.updateFrom(data), this.updateTooltip("Work items I recently modified")].includes(true);
  }
}
