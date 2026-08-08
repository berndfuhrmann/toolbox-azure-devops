import { PinnedItem } from "../items/PinnedItem";
import { PinInfo } from "./PinnedTreeItemMixin";

export const missingSymbol = Symbol("missing");

export interface MissingItem extends PinnedItem {
  name: string;
  icon: string;
  [missingSymbol]: true;
  pinInfo: PinInfo;
}

export function isMissingItem(item: any) {
  return item && typeof item === "object" && missingSymbol in item;
}

export function createMissingItem(name: string, icon: string, pinInfo: PinInfo): MissingItem {
  return {
    [missingSymbol]: true,
    pinned: true,
    name,
    icon,
    pinInfo,
  };
}
