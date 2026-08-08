import vscode from "vscode";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { AttachmentItem, getAttachmentFileName, getAttachmentSize } from "../items/AttachmentItem";

export class AttachmentTreeItem<Data extends AttachmentItem = AttachmentItem> extends AbstractTreeItem<Data> {
  public constructor() {
    super();
    this.collapsibleState = vscode.TreeItemCollapsibleState.None;
    this.addContextTag("workItem.attachment");
  }

  public override updateFrom(data: Data) {
    const fileName = getAttachmentFileName(data.attachment);
    const size = getAttachmentSize(data.attachment);
    const sizeFormatted = this.formatFileSize(size);

    return [
      super.updateFrom(data),
      this.updateIcon("download"),
      this.updateLabel(`${fileName} (${sizeFormatted})`),
      this.updateTooltip(`${fileName}\nSize: ${sizeFormatted}`),
    ].includes(true);
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) {
      return "0 B";
    }
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
  }
}
