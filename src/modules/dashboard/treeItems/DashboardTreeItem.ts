import { TreeItemCollapsibleState } from "vscode";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { DashboardItem } from "../items/DashboardItem";

export class DashboardTreeItem<Data extends DashboardItem = DashboardItem> extends AbstractTreeItem<Data> {
  public constructor() {
    super();
    this.collapsibleState = TreeItemCollapsibleState.Collapsed;
    this.setIcon("dashboard");
    this.addContextTag("inWeb");
    this.addContextTag("dashboard.dashboard");
  }

  public override updateFrom(data: Data) {
    return [
      super.updateFrom(data),
      this.updateLabel(data.dashboard.name ?? "Unnamed Dashboard"),
      this.updateDescription(data.dashboard.description ?? undefined),
      this.updateTooltip(`Dashboard: ${data.dashboard.name}`),
    ].includes(true);
  }
}
