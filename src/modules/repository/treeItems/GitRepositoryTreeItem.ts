import { MarkdownString, TreeItemCollapsibleState } from "vscode";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { GitRepositoryItem, refToDisplayString } from "../items/GitRepositoryItem";

export class GitRepositoryTreeItem<Data extends GitRepositoryItem = GitRepositoryItem> extends AbstractTreeItem<Data> {
  public constructor() {
    super();
    this.collapsibleState = TreeItemCollapsibleState.Collapsed;
    this.setIcon("git");
    this.addContextTag("inWeb");
  }

  public override updateFrom(data: Data) {
    return [
      super.updateFrom(data),
      this.updateLabel(data.gitRepository.name ?? "Unknown"),
      this.updateTooltip(
        new MarkdownString()
          .appendText("Default branch: ")
          .appendMarkdown("`")
          .appendText(refToDisplayString(data.gitRepository.defaultBranch))
          .appendMarkdown("`")
          .appendText("\n")
          .appendText("Size: ")
          .appendMarkdown("`")
          .appendText("" + (data.gitRepository.size ?? "unknown size"))
          .appendMarkdown("`"),
      ),
    ].includes(true);
  }
}
