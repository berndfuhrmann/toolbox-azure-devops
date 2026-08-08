import vscode from "vscode";
import { Exception } from "../Exception";
import { encodeStoredPin } from "../storage/pinEncoding";
import { AbstractStorageService } from "../storage/AbstractStorageService";
import { AbstractTreeItem } from "../treeItems/AbstractTreeItem";
import { PinnedItem } from "./PinnedItem";
import { Constructor } from "../constructor";

const pinAction = Symbol("pinAction");
const unpinAction = Symbol("unpinAction");

const pinnableTag = "pinnable";

export interface PinnableException extends Exception, PinnedItem {
  name: string;
  icon: string;
  pinInfo: PinInfo;
}

interface PinnableTreeItem {
  [pinAction]: () => void;
  [unpinAction]: () => void;
}

export function getPinInfo(data: PinnableException): PinInfo {
  return data.pinInfo;
}

export function isPinnable(item: vscode.TreeItem & Record<string | number | symbol, any>): item is PinnableTreeItem {
  return item && typeof item === "object" && pinAction in item;
}

export function handlePinAction(item: vscode.TreeItem) {
  if (isPinnable(item)) {
    item[pinAction]();
  }
}

export function handleUnpinAction(item: vscode.TreeItem) {
  if (isPinnable(item)) {
    item[unpinAction]();
  }
}

export interface PinInfo {
  accountId: string;
  type: string;
  name: string;
  object: string;
}

export function PinnedTreeItemMixin<BaseItem extends PinnedItem, TBase extends Constructor<AbstractTreeItem<BaseItem>>>(
  cls: TBase,
  getInfo: (item: InstanceType<TBase>["data"]) => PinInfo,
  storageService: AbstractStorageService,
) {
  return class PinnedTreeItem extends cls {
    #pinned!: boolean;
    constructor(...args: any[]) {
      super(...args);
      this.addContextTag(pinnableTag);
    }

    public override updateFrom(data: InstanceType<TBase>["data"]) {
      const updated = super.updateFrom(data);
      this.#updatePinned(data.pinned);
      return updated;
    }

    #updatePinned(pinned: boolean) {
      this.#pinned = pinned;
      this.updateIconOverlays(this.#pinned ? ["pin"] : []);
      if (this.#pinned) {
        return this.addContextTag("pinned");
      } else {
        return this.removeContextTag("pinned");
      }
    }

    [pinAction]() {
      const info = getInfo(this.data);
      storageService.addPinned(info.accountId, info.type, encodeStoredPin(info.name, info.object));
    }

    [unpinAction]() {
      const info = getInfo(this.data);
      storageService.removePinned(info.accountId, info.type, encodeStoredPin(info.name, info.object));
    }
  };
}
