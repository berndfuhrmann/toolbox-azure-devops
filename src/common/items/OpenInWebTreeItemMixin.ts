import { env, Uri, TreeItem } from "vscode";
import { AbstractTreeItem } from "../treeItems/AbstractTreeItem";
import { Constructor } from "../constructor";

const openInWebAction = Symbol("openInWeb");

export function handleOpenInWebAction(item: TreeItem & Record<string | number | symbol, any>) {
  if (openInWebAction in item) {
    item[openInWebAction]();
  }
}

export function OpenInWebTreeItemMixin<TBase extends Constructor<AbstractTreeItem<any>>>(
  cls: TBase,
  getUrl: (item: InstanceType<TBase>["data"]) => string | undefined,
) {
  return class OpenInWebTreeItem extends cls {
    [openInWebAction]() {
      const url = getUrl(this.data);
      if (url) {
        env.openExternal(Uri.parse(url));
      }
    }
  };
}
