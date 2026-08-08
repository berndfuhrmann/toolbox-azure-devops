import vscode from "vscode";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { WorkItemRevisionItem } from "../items/WorkItemRevisionItem";

const noiseFields = new Set([
  "System.Watermark",
  "System.ChangedDate",
  "System.ChangedBy",
  "System.Rev",
  "System.AuthorizedDate",
  "System.RevisedDate",
  "System.AuthorizedAs",
]);

export class WorkItemRevisionTreeItem<
  Data extends WorkItemRevisionItem = WorkItemRevisionItem,
> extends AbstractTreeItem<Data> {
  public constructor() {
    super();
    this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
    this.setIcon("git-commit");
  }

  public override updateFrom(data: Data) {
    const update = data.update;
    const rev = update.rev ?? 0;
    const author = update.revisedBy?.displayName ?? "Unknown";
    const date = update.revisedDate ? new Date(update.revisedDate).toLocaleDateString() : "";
    const displayableFields = Object.entries(update.fields ?? {}).filter(([fieldName]) => !noiseFields.has(fieldName));

    const tooltip = new vscode.MarkdownString();
    tooltip.appendMarkdown(`**Rev ${rev}** · ${date} · ${author}\n\n`);
    for (const [fieldName, change] of displayableFields) {
      tooltip.appendMarkdown(
        `- **${fieldName}:** ${String(change.oldValue ?? "")} → ${String(change.newValue ?? "")}\n`,
      );
    }

    return [
      super.updateFrom(data),
      this.updateLabel(`Rev ${rev} · ${date} · ${author}`),
      this.updateCollapsibleState(
        displayableFields.length > 0 ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None,
      ),
      this.updateTooltip(tooltip),
    ].includes(true);
  }
}
