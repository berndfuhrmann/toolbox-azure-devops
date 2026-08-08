import { MarkdownString } from "vscode";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { GitRepositoryTagItem } from "../items/GitRepositoryTagItem";

const refsTagsPrefix = "refs/tags/";

export class GitRepositoryTagTreeItem<
  Data extends GitRepositoryTagItem = GitRepositoryTagItem,
> extends AbstractTreeItem<Data> {
  constructor() {
    super();
    this.setIcon("tag");
  }

  public updateFrom(data: Data) {
    const tooltip = new MarkdownString();
    const commitHash = data.ref.peeledObjectId ?? data.ref.objectId;
    if (commitHash) {
      if (data.ref.peeledObjectId) {
        tooltip.appendMarkdown("Commit `");
        tooltip.appendText(commitHash.substring(0, 8));
        tooltip.appendMarkdown("`");
      } else {
        tooltip.appendMarkdown("`");
        tooltip.appendText(commitHash.substring(0, 8));
        tooltip.appendMarkdown("`");
      }
    }
    return [
      super.updateFrom(data),
      this.updateLabel(this.#getTagFromRef(data) ?? "unknown"),
      this.updateTooltip(tooltip),
    ].includes(true);
  }

  #getTagFromRef(data: Data) {
    const name = data.ref.name;
    if (name?.startsWith(refsTagsPrefix)) {
      return name.substring(refsTagsPrefix.length);
    }
    return name;
  }
}
