import { Subject } from "rxjs";

export function compareRefreshableItem(a: RefreshableItem, b: RefreshableItem) {
  if (a.refreshObservables === b.refreshObservables) {
    return true;
  }
  const aKeys = Object.keys(a.refreshObservables);
  const bKeys = Object.keys(b.refreshObservables);
  if (aKeys.length !== bKeys.length) {
    return false;
  }
  for (const key of aKeys) {
    if (a.refreshObservables[key] !== b.refreshObservables[key]) {
      return false;
    }
  }
  return true;
}

export function refreshRefreshable(refreshable: RefreshableItem) {
  const now = Date.now();
  Object.values(refreshable.refreshObservables).forEach((refreshObservable) => refreshObservable.next(now));
}

export type RefreshableItem = {
  refreshObservables: Record<string, Subject<number>>;
};
