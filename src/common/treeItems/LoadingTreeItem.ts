import { AbstractTreeItem } from "./AbstractTreeItem";
import { LoadingItem } from "../items/LoadingItem";

export class LoadingTreeItem<Data extends LoadingItem = LoadingItem> extends AbstractTreeItem<Data> {
  override updateFrom(data: Data) {
    return [
      super.updateFrom(data),
      this.updateLabel(`Loading: ${data.name}`),
      this.updateIcon(data.icon),
      this.updateTooltip("Loading item"),
    ].includes(true);
  }
}
