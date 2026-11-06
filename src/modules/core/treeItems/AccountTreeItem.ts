import { MarkdownString, TreeItemCollapsibleState } from "vscode";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { extensionName } from "../../../config";
import { buildAccountUrl } from "../account";
import { AccountItem } from "../items/AccountItem";

/** Tags organizations that need a sign-in. */
export const signedOutContextTag = "signed-out";

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
    const signedOut = data.signInStatus === "signedOut";
    if (signedOut) {
      tooltip.appendMarkdown("\n\nSigned out. Click to sign in.");
    }
    return [
      super.updateFrom(data),
      this.updateLabel(data.account.organization),
      this.updateDescription(signedOut ? "Signed out" : undefined),
      this.updateTag(signedOutContextTag, signedOut),
      this.updateTooltip(tooltip),
      // a signed-out organization has no content, so clicking it signs in instead of expanding it
      this.updateIcon(signedOut ? "sign-in" : "organization"),
      this.updateCollapsibleState(signedOut ? TreeItemCollapsibleState.None : TreeItemCollapsibleState.Collapsed),
      this.updateCommand(
        signedOut ? { command: extensionName + ".signIn", title: "Sign In", arguments: [this] } : undefined,
      ),
    ].includes(true);
  }
}
