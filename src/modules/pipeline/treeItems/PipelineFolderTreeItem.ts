import { MarkdownString, TreeItemCollapsibleState } from "vscode";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { PipelineFolderItem } from "../items/PipelineFolderItem";
import { createCodeSpan } from "../../../common/stringUtils";

export function getFolderName(data: PipelineFolderItem) {
  const index = data.folder.path!.lastIndexOf("\\");
  return data.folder.path!.substring(index === -1 ? 0 : index + 1);
}

export class PipelineFolderTreeItem<
  Data extends PipelineFolderItem = PipelineFolderItem,
> extends AbstractTreeItem<Data> {
  public constructor() {
    super();
    this.collapsibleState = TreeItemCollapsibleState.Collapsed;
    this.setIcon("folder");
    this.addContextTag("pipeline.folder");
  }

  public override updateFrom(data: Data) {
    const tooltip = new MarkdownString();
    tooltip.appendMarkdown(createCodeSpan(data.folder.path ?? ""));
    if (data.folder.description) {
      tooltip.appendMarkdown("\n");
      tooltip.appendText(data.folder.description);
    }
    if (data.folder.lastChangedBy?.displayName) {
      tooltip.appendMarkdown("\nLast changed by ");
      tooltip.appendText(data.folder.lastChangedBy.displayName);
      if (data.folder.lastChangedDate) {
        tooltip.appendMarkdown(" on ");
        tooltip.appendText(new Date(data.folder.lastChangedDate).toLocaleDateString());
      }
    }
    return [super.updateFrom(data), this.updateLabel(getFolderName(data)), this.updateTooltip(tooltip)].includes(true);
  }
}
