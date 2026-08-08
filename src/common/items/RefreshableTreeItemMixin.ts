import { TreeItem } from "vscode";
import { AbstractTreeItem } from "../treeItems/AbstractTreeItem";
import { RefreshableItem } from "./RefreshableItem";
import { Constructor } from "../constructor";
const refreshAction = Symbol("refreshAction");

const refreshableTag = "refreshable";

interface RefreshableTreeItem {
  [refreshAction]: () => void;
}

export function isRefreshable(item: TreeItem & Record<string | number | symbol, any>): item is RefreshableTreeItem {
  return item && typeof item === "object" && refreshAction in item;
}

export function handleRefreshAction(item: TreeItem) {
  if (isRefreshable(item)) {
    item[refreshAction]();
  }
}

export function RefreshableTreeItemMixin<TBase extends Constructor<AbstractTreeItem<RefreshableItem>>>(cls: TBase) {
  return class RefreshableTreeItem extends cls {
    constructor(...args: any[]) {
      super(...args);
      this.addContextTag(refreshableTag);
    }

    [refreshAction]() {
      const now = Date.now();
      Object.values(this.data!.refreshObservables).forEach((refreshObservable) => refreshObservable.next(now));
      this.treeProvider.refreshItem(this);
    }
  };
}
