import { TreeItemCollapsibleState } from "vscode";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { PipelineRunItem } from "../items/PipelineRunItem";

export class PipelineArtifactsTreeItem<Data extends PipelineRunItem = PipelineRunItem> extends AbstractTreeItem<Data> {
  public constructor() {
    super();
    this.collapsibleState = TreeItemCollapsibleState.Collapsed;
    this.setIcon("artifact");
  }

  public override updateFrom(data: Data) {
    return [super.updateFrom(data), this.updateLabel("Artifacts"), this.updateTooltip("Artifacts")].includes(true);
  }
}
