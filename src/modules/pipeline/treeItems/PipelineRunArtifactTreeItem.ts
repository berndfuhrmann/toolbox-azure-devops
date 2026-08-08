import { MarkdownString, TreeItemCollapsibleState } from "vscode";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { PipelineRunArtifactItem } from "../items/PipelineRunArtifactItem";

export class PipelineRunArtifactTreeItem<
  Data extends PipelineRunArtifactItem = PipelineRunArtifactItem,
> extends AbstractTreeItem<Data> {
  public constructor() {
    super();
    this.collapsibleState = TreeItemCollapsibleState.None;
    this.setIcon("artifact");
  }

  public override updateFrom(data: Data) {
    const tooltip = new MarkdownString();
    const artifactSize = data.artifact?.resource?.properties?.artifactsize;
    if (typeof artifactSize === "string") {
      tooltip.appendMarkdown("Artifact Size: ");
      tooltip.appendText(artifactSize);
    }
    return [super.updateFrom(data), this.updateLabel(data.artifact.name), this.updateTooltip(tooltip)].includes(true);
  }
}
