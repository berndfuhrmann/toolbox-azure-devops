import { WorkItemLinkedItemTreeItem } from "./WorkItemLinkedItemTreeItem";
import { WorkItemLinkedItemItem } from "../items/WorkItemLinkedItemItem";

export class WorkItemLinkedBuildTreeItem<
  Data extends WorkItemLinkedItemItem = WorkItemLinkedItemItem,
> extends WorkItemLinkedItemTreeItem<Data> {
  public constructor() {
    super();
    this.addContextTag("inWeb");
  }

  public override updateFrom(data: Data) {
    const buildName = data.build?.definition?.name;
    const buildNumber = data.build?.buildNumber;
    let label: string;
    if (buildName && buildNumber) {
      label = `${buildName} #${buildNumber}`;
    } else if (buildName) {
      label = buildName;
    } else if (buildNumber) {
      label = `Build #${buildNumber}`;
    } else {
      label = data.relation.attributes?.["name"] ?? data.relation.url ?? "Build";
    }
    this.data = data;
    return [this.updateLabel(label), this.updateIcon("run"), this.updateTooltip("Linked build")].includes(true);
  }
}
