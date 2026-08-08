import { WorkItemLinkedItemTreeItem } from "./WorkItemLinkedItemTreeItem";
import { WorkItemLinkedItemItem } from "../items/WorkItemLinkedItemItem";

export class WorkItemLinkedBranchTreeItem<
  Data extends WorkItemLinkedItemItem = WorkItemLinkedItemItem,
> extends WorkItemLinkedItemTreeItem<Data> {
  public constructor() {
    super();
    this.addContextTag("inWeb");
  }

  public override updateFrom(data: Data) {
    const label = data.branchName ?? data.relation.attributes?.["name"] ?? data.relation.url ?? "Branch";
    this.data = data;
    return [this.updateLabel(label), this.updateIcon("git-branch"), this.updateTooltip("Linked branch")].includes(true);
  }
}
