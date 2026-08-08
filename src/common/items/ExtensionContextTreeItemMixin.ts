import { Constructor } from "../constructor";
import { IconService } from "../icons/IconService";
import { AbstractTreeItem } from "../treeItems/AbstractTreeItem";

export function ExtensionContextTreeItemMixin<BaseItem, TBase extends Constructor<AbstractTreeItem<BaseItem>>>(
  cls: TBase,
  iconService: IconService,
) {
  return class ExtensionContextTreeItem extends cls {
    constructor(...args: any[]) {
      super(...args);
      this.setIconService(iconService);
    }
  };
}
