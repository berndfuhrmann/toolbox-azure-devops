import { Container } from "inversify";
import { Account } from "../account";
import { compareRefreshableItem, RefreshableItem } from "../../../common/items/RefreshableItem";
import { isDeepStrictEqual } from "node:util";
import { SignInStatus } from "../authentication/AuthenticationMethod";

export function isAccountItem(item: { type: string }): item is AccountItem {
  return item.type === "account";
}

export function isSignedOutAccountItem(item: { type?: unknown; signInStatus?: unknown }) {
  return item.type === "account" && item.signInStatus === "signedOut";
}

export function compareAccountContext(a: AccountContext, b: AccountContext) {
  if (!compareRefreshableItem(a, b)) {
    return false;
  }
  if (a.container !== b.container) {
    return false;
  }
  return isDeepStrictEqual(a.account, b.account);
}

export function compareAccountItem(a: AccountItem, b: AccountItem) {
  return compareAccountContext(a, b) && a.signInStatus === b.signInStatus;
}

export interface AccountContext extends RefreshableItem {
  account: Account;
  container: Container;
}

export interface AccountItem extends AccountContext {
  readonly type: "account";
  signInStatus: SignInStatus;
  isEqual(other: AccountItem): boolean;
}

export function createAccountItem(account: Account, container: Container, signInStatus: SignInStatus): AccountItem {
  return {
    type: "account",
    account,
    container,
    signInStatus,
    refreshObservables: {},
    isEqual(other) {
      return compareAccountItem(this, other);
    },
  };
}
