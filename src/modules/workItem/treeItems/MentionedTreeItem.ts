import vscode from "vscode";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { ProjectContext } from "../../core/items/ProjectItem";

export class MentionedTreeItem<Data extends ProjectContext = ProjectContext> extends AbstractTreeItem<Data> {
  constructor() {
    super();
    this.label = "Mentioned";
    this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
    this.setIcon("mentioned");
  }

  public updateFrom(data: Data) {
    return [super.updateFrom(data), this.updateTooltip("Work items with recent comments from others")].includes(true);
  }
}
