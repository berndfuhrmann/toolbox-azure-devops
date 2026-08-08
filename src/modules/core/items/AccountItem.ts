import { Container } from "inversify";
import { Account } from "../account";
import { compareRefreshableItem, RefreshableItem } from "../../../common/items/RefreshableItem";
import { isDeepStrictEqual } from "node:util";

export function isAccountItem(item: { type: string }): item is AccountItem {
  return item.type === "account";
}

export function compareAccountItem(a: AccountContext, b: AccountContext) {
  if (!compareRefreshableItem(a, b)) {
    return false;
  }
  if (a.container !== b.container) {
    return false;
  }
  return isDeepStrictEqual(a.account, b.account);
}

export interface AccountContext extends RefreshableItem {
  account: Account;
  container: Container;
}

export interface AccountItem extends AccountContext {
  readonly type: "account";
  isEqual(other: AccountItem): boolean;
}

export function createAccountItem(account: Account, container: Container): AccountItem {
  return {
    type: "account",
    account,
    container,
    refreshObservables: {},
    isEqual(other) {
      return compareAccountItem(this, other);
    },
  };
}
