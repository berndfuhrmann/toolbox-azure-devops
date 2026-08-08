import { TreeItemCollapsibleState } from "vscode";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { DashboardWidgetItem } from "../items/DashboardWidgetItem";

export class DashboardWidgetTreeItem<
  Data extends DashboardWidgetItem = DashboardWidgetItem,
> extends AbstractTreeItem<Data> {
  public constructor() {
    super();
    this.collapsibleState = TreeItemCollapsibleState.None;
    this.setIcon("widget");
    this.addContextTag("dashboard.widget");
  }

  public override updateFrom(data: Data) {
    const widgetType = data.widget.contributionId?.split(".").pop() ?? "Unknown";
    return [
      super.updateFrom(data),
      this.updateLabel(data.widget.name ?? "Unnamed Widget"),
      this.updateDescription(widgetType),
      this.updateTooltip(`Widget: ${data.widget.name}`),
    ].includes(true);
  }
}
