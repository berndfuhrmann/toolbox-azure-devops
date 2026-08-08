import vscode from "vscode";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { ProjectContext } from "../../core/items/ProjectItem";

export class DashboardsContainerTreeItem<Data extends ProjectContext = ProjectContext> extends AbstractTreeItem<Data> {
  public constructor() {
    super();
    this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
    this.setIcon("dashboard");
    this.addContextTag("dashboard.dashboardsContainer");
  }

  public override updateFrom(data: Data) {
    return [super.updateFrom(data), this.updateLabel("Dashboards"), this.updateTooltip("Project dashboards")].includes(
      true,
    );
  }
}
