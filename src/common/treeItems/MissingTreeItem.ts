import { MissingItem } from "../items/MissingItem";
import { PinInfo } from "../items/PinnedTreeItemMixin";
import { AbstractTreeItem } from "./AbstractTreeItem";

export function getPinInfo(data: MissingItem): PinInfo {
  return data.pinInfo;
}

export class MissingTreeItem<Data extends MissingItem = MissingItem> extends AbstractTreeItem<Data> {
  override updateFrom(data: Data) {
    return [
      super.updateFrom(data),
      this.updateLabel(`Missing: ${data.name}`),
      this.updateIcon(data.icon),
      this.updateTooltip("Missing item"),
    ].includes(true);
  }
}
