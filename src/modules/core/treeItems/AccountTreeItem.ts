import { MarkdownString, TreeItemCollapsibleState } from "vscode";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { buildAccountUrl } from "../account";
import { AccountItem } from "../items/AccountItem";

export class AccountTreeItem<Data extends AccountItem = AccountItem> extends AbstractTreeItem<Data> {
  public constructor() {
    super();
    this.collapsibleState = TreeItemCollapsibleState.Collapsed;
    this.setIcon("organization");
    this.addContextTag("account");
  }

  public override updateFrom(data: Data) {
    const tooltip = new MarkdownString();
    tooltip.appendMarkdown("**URL:** ");
    tooltip.appendText(data.account.url);
    tooltip.appendMarkdown("  \n**Organization:** ");
    tooltip.appendText(data.account.organization);
    tooltip.appendMarkdown("  \n**Account URL:** ");
    tooltip.appendText(buildAccountUrl(data.account));
    return [super.updateFrom(data), this.updateLabel(data.account.organization), this.updateTooltip(tooltip)].includes(
      true,
    );
  }
}
