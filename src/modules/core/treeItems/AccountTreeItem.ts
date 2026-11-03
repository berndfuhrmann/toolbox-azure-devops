import { MarkdownString, TreeItemCollapsibleState } from "vscode";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { AuthenticationType, buildAccountUrl } from "../account";
import { AccountItem } from "../items/AccountItem";

export class AccountTreeItem<Data extends AccountItem = AccountItem> extends AbstractTreeItem<Data> {
  #authenticationTag: string | undefined;

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
    return [
      super.updateFrom(data),
      this.updateLabel(data.account.organization),
      this.updateTooltip(tooltip),
      this.#updateAuthenticationTag(data.account.authentication.type),
    ].includes(true);
  }

  #updateAuthenticationTag(type: AuthenticationType) {
    const tag = "auth-" + type;
    const removed =
      this.#authenticationTag !== undefined && this.#authenticationTag !== tag
        ? this.removeContextTag(this.#authenticationTag)
        : false;
    this.#authenticationTag = tag;
    return [removed, this.addContextTag(tag)].includes(true);
  }
}
