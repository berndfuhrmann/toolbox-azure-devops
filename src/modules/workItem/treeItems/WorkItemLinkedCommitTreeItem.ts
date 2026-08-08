import { WorkItemLinkedItemTreeItem } from "./WorkItemLinkedItemTreeItem";
import { WorkItemLinkedItemItem } from "../items/WorkItemLinkedItemItem";

export class WorkItemLinkedCommitTreeItem<
  Data extends WorkItemLinkedItemItem = WorkItemLinkedItemItem,
> extends WorkItemLinkedItemTreeItem<Data> {
  public constructor() {
    super();
    this.addContextTag("inWeb");
  }

  public override updateFrom(data: Data) {
    this.data = data;
    const commitMessage =
      data.commit?.comment?.split(/\r?\n/)[0] ?? data.commit?.commitId ?? data.relation.url ?? "Commit";
    return [
      this.updateLabel(commitMessage),
      this.updateIcon("git-commit"),
      this.updateTooltip("Linked commit"),
    ].includes(true);
  }
}
