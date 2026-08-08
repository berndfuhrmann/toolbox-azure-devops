import { endWith, map, Observable, pipe, ReplaySubject, scan } from "rxjs";

export interface ChangeSet<Key, Item> {
  removed: Map<Key, Item>;
  added: Map<Key, Item>;
  updated: Map<Key, Item>;
  unchanged: Map<Key, Item>;
}

const fields = ["added", "updated", "unchanged"] as const;

/**
 * This returns a map that contains all current items from a ChangeSet.
 * That includes everything but the removed items.
 * @param changeSet
 * @returns
 */
export function existingItems<Key, Item>(changeSet: Partial<ChangeSet<Key, Item>> | undefined) {
  if (changeSet) {
    const result = new Map<Key, Item>();
    for (const field of fields) {
      if (changeSet[field]) {
        changeSet[field].forEach((value, key) => {
          result.set(key, value);
        });
      }
    }
    return result;
  } else {
    return new Map<Key, Item>();
  }
}

export function convertToMap<Key, Item>(getMapKey: (item: Item) => Key) {
  return map((items: Iterable<Item>) => {
    const result = new Map<Key, Item>();
    for (const item of items) {
      result.set(getMapKey(item), item);
    }
    return result;
  });
}

const emptyMap = new Map<any, any>();
const endSymbol = Symbol("end");

/**
 * This operator receives a ChangeSet and applies a function on each new item
 * and another function on each updated item.
 * @param createObservable
 * @returns
 */
export function convertMapToChangeSet<Key, InputItem, OutputItem>(
  createValue: (input: InputItem) => OutputItem,
  updateValue: (ouput: OutputItem, input: InputItem) => void,
  deleteValue?: (output: OutputItem) => void,
) {
  return pipe(
    endWith<Map<Key, InputItem>, [typeof endSymbol]>(endSymbol),
    scan(
      (last, items: Map<Key, InputItem> | typeof endSymbol) => {
        if (items === endSymbol) {
          const currentItems = existingItems(last);
          if (deleteValue) {
            currentItems.forEach((v) => deleteValue(v));
          }
          return {
            added: emptyMap as Map<Key, OutputItem>,
            removed: emptyMap as Map<Key, OutputItem>,
            unchanged: currentItems,
          };
        } else {
          const removed = existingItems(last);
          const added = new Map<Key, OutputItem>();
          const unchanged = existingItems(last);

          items.forEach((value, key) => {
            const lastEntry = removed.get(key);
            removed.delete(key);
            if (lastEntry === undefined) {
              added.set(key, createValue(value));
            } else {
              updateValue(lastEntry, value);
            }
          });
          removed.forEach((_, k) => unchanged.delete(k));
          if (deleteValue) {
            removed.forEach((v) => deleteValue(v));
          }
          return {
            added,
            removed,
            unchanged,
          };
        }
      },
      {
        added: emptyMap as Map<Key, OutputItem>,
        removed: emptyMap as Map<Key, OutputItem>,
        unchanged: emptyMap as Map<Key, OutputItem>,
      },
    ),
  );
}

/**
 * This operator receives a ChangeSet and applies a function to create an observable to each new item
 * and another function on each updated item.
 * @param createObservable
 * @returns
 */
export function changeSetToChangeSetOfObservables<Key, InputItem, OutputItem>(
  createObservable: (source: Observable<InputItem>) => Observable<OutputItem>,
) {
  const createValue = (input: InputItem) => {
    const source = new ReplaySubject<InputItem>(1);
    const observable = createObservable(source);
    source.next(input);
    return { source, observable };
  };
  const updateValue = (output: ReturnType<typeof createValue>, input: InputItem) => {
    output.source.next(input);
  };
  return convertMapToChangeSet<Key, InputItem, ReturnType<typeof createValue>>(createValue, updateValue);
}
