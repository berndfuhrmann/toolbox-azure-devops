import vscode from "vscode";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { ProjectItem } from "../items/ProjectItem";

export class ProjectTreeItem<Data extends ProjectItem = ProjectItem> extends AbstractTreeItem<Data> {
  public constructor() {
    super();
    this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
    this.setIcon("project");
    this.addContextTag("common.project");
  }

  public override updateFrom(data: Data) {
    return [
      super.updateFrom(data),
      this.updateLabel(data.project.name ?? "Unknown"),
      this.updateTooltip(data.project.description),
    ].includes(true);
  }
}
