import { Account } from "../../modules/core/account";

export interface PinnedSerializedItem {
  readonly type: "pinnedSerializedItem";
  account: Account;
  pinned: string;
  isEqual(other: PinnedSerializedItem): boolean;
}

export function isPinnedSerializedItem(item: { type: string }): item is PinnedSerializedItem {
  return item.type === "pinnedSerializedItem";
}

export function comparePinnedSerializedItem(a: PinnedSerializedItem, b: PinnedSerializedItem) {
  return a.account.accountId === b.account.accountId && a.pinned === b.pinned;
}

export function createPinnedSerializedItem(account: Account, pinned: string): PinnedSerializedItem {
  return {
    type: "pinnedSerializedItem",
    account,
    pinned,
    isEqual(other) {
      return comparePinnedSerializedItem(this, other);
    },
  };
}
