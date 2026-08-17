import { Observable } from "rxjs";
import { ItemInformation } from "../../../src/common/treePartProvider/TreePartProvider";
export const error = Symbol("error");
export const complete = Symbol("complete");

export const createTestObserver = <T, E = any>() => {
  const combined = vi.fn();
  return {
    next: (v: T) => combined(v),
    error: (e: E) => combined(error, e),
    complete: () => combined(complete),
    combined,
  };
};

export const createTestMapChangeSetListener = <Item>(source: Observable<ItemInformation<Item>>) => {
  const items = new Map<string, Item>();
  let errored = false;
  const unsubscribe = source.subscribe(({ changes }) => {
    for (const [key, item] of changes.removed) {
      if (!items.has(key)) {
        errored = true;
        throw new Error("removing non-existant key" + key);
      }
      items.delete(key);
    }
    for (const [key, item] of changes.added) {
      if (items.has(key)) {
        errored = true;
        throw new Error("adding existant key" + key);
      }
      items.set(key, item);
    }
  });
  return {
    unsubscribe,
    getItems: () => items,
    errored: () => {
      if (errored) {
        throw new Error("errored");
      }
    },
  };
};
