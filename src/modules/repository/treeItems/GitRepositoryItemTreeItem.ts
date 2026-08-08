import { MarkdownString, TreeItemCollapsibleState } from "vscode";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { extensionName } from "../../../config";
import { GitRepositoryItemItem } from "../items/GitRepositoryItemItem";

export class GitRepositoryItemTreeItem<
  Data extends GitRepositoryItemItem = GitRepositoryItemItem,
> extends AbstractTreeItem<Data> {
  public override updateFrom(data: Data) {
    const tooltip = new MarkdownString();
    tooltip.appendText(data.item.path ?? "");
    return [
      super.updateFrom(data),
      this.updateIcon(data.item.isFolder ? "folder" : "file"),
      this.updateCollapsibleState(
        data.item.isFolder ? TreeItemCollapsibleState.Collapsed : TreeItemCollapsibleState.None,
      ),
      this.updateLabel(`${data.item.path?.split("/").at(-1)}`),
      this.updateTooltip(tooltip),
      this.updateCommand({
        command: extensionName + ".openTextFile",
        title: "Open file",
        arguments: [this],
      }),
    ].includes(true);
  }
}
