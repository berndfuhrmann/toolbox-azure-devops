import { map, pipe, scan } from "rxjs";
import { ItemInformation } from "../treePartProvider/TreePartProvider";

export interface MapChangeSet<Key, Value> {
  added: Map<Key, Value>;
  removed: Map<Key, Value>;
}

/**
 * Creates a function that dispatches the contents of a {@link MapChangeSet} to callbacks.
 *
 * When an `updated` callback is provided, a key that appears in both `removed` and `added`
 * is treated as an update and routed only to `updated`. In that case, the value passed to
 * `updated` is the value from `removed`, which represents the previous value for that key.
 *
 * When no `updated` callback is provided, all entries in `removed` are dispatched to `removed`
 * and all entries in `added` are dispatched to `added`, even if the same key exists in both maps.
 *
 * @param options Callbacks for added and removed entries, plus an optional update callback.
 * @returns A function that processes a single {@link MapChangeSet}.
 */
export function processMapChangeSet<Key, Value>(options: {
  added: (key: Key, value: Value) => void;
  removed: (key: Key, value: Value) => void;
  updated?: (key: Key, value: Value) => void;
}) {
  const { added, removed, updated } = options;
  if (updated) {
    return (changeSet: MapChangeSet<Key, Value>) => {
      for (const [key, value] of changeSet.removed) {
        if (changeSet.added.has(key)) {
          updated(key, value);
        } else {
          removed(key, value);
        }
      }
      for (const [key, value] of changeSet.added) {
        if (!changeSet.removed.has(key)) {
          added(key, value);
        }
      }
    };
  } else {
    return (changeSet: MapChangeSet<Key, Value>) => {
      for (const [key, value] of changeSet.removed) {
        removed(key, value);
      }
      for (const [key, value] of changeSet.added) {
        added(key, value);
      }
    };
  }
}

export interface MapChangeSetWithItems<Key, Value> extends MapChangeSet<Key, Value> {
  items: Map<Key, Value>;
}

export function convertIterableToMap<Key, Item>(getMapKey: (item: Item) => Key) {
  return map((items: Iterable<Item>) => {
    const result = new Map<Key, Item>();
    for (const item of items) {
      const key = getMapKey(item);
      result.set(key, item);
    }
    return result;
  });
}

const emptyMap = new Map<any, any>();

/**
 * This operator receives Maps and convert them into MapChangeSet.
 * and another function on each updated item. Changes are calculated on
 * new and removed keys. Additionally, items are compare via a provided
 * compare function. If a change is detected, the old item will be removed
 * and a new one added (same key).
 * @param createObservable
 * @returns
 */
export function mapToMapChangeSet<Key, Value>(compare: (value1: Value, value2: Value) => boolean) {
  return pipe(
    scan(
      (last, items: Map<Key, Value>) => {
        const removed = new Map<Key, Value>();
        const added = new Map<Key, Value>();
        const state = last.state;
        const oldKeys = new Set<Key>(last.state.keys());
        items.forEach((value, key) => {
          const hasOldValue = state.has(key);
          if (hasOldValue) {
            const oldValue = state.get(key)!;
            if (!compare(oldValue, value)) {
              removed.set(key, oldValue);
              added.set(key, value);
            }
          } else {
            added.set(key, value);
          }
          oldKeys.delete(key);
        });

        for (const oldKey of oldKeys) {
          removed.set(oldKey, state.get(oldKey)!);
        }

        return {
          added,
          removed,
          state: items,
        };
      },
      {
        added: emptyMap as Map<Key, Value>,
        removed: emptyMap as Map<Key, Value>,
        state: emptyMap as Map<Key, Value>,
      },
    ),
    map(({ added, removed }) => ({ added, removed })),
  );
}

export function mapChangeSetToArray<Key, Value>(sort: (a: Value, b: Value) => number) {
  return pipe(
    scan((last, changeSet: MapChangeSet<Key, Value>) => {
      changeSet.removed.forEach((_, key) => last.delete(key));
      changeSet.added.forEach((value, key) => last.set(key, value));
      return last;
    }, new Map<Key, Value>()),
    map((x) => [...x.values()].sort(sort)),
  );
}

export function mapChangeSetToMap<Key, Value>() {
  return pipe(
    scan((last, changeSet: MapChangeSet<Key, Value>) => {
      changeSet.removed.forEach((_, key) => last.delete(key));
      changeSet.added.forEach((value, key) => last.set(key, value));
      return new Map<Key, Value>(last);
    }, new Map<Key, Value>()),
  );
}

export function mapChangeSetToMapChangeSetWithItems<Item>() {
  return pipe(
    scan(
      (last, changeSet: ItemInformation<Item>) => {
        changeSet.changes.removed.forEach((_, key) => last.changes.items.delete(key));
        changeSet.changes.added.forEach((value, key) => last.changes.items.set(key, value));
        return {
          ...changeSet,
          changes: {
            removed: changeSet.changes.removed,
            added: changeSet.changes.added,
            items: new Map(last.changes.items.entries()),
          },
        };
      },
      {
        changes: {
          removed: new Map<string, Item>(),
          added: new Map<string, Item>(),
          items: new Map<string, Item>(),
        },
      },
    ),
  );
}

export function mapChangeSetMap<Key, InputValue, OutputValue>(
  createOutput: (input: InputValue) => OutputValue,
  removeOutput?: (outputValue: OutputValue) => void,
) {
  return pipe(
    scan(
      (last, changeSet: MapChangeSet<Key, InputValue>) => {
        const added = new Map<Key, OutputValue>();
        const removed = new Map<Key, OutputValue>();
        const existing = last.existing;
        changeSet.added.forEach((inputItem, key) => {
          const outputValue = createOutput(inputItem);
          existing.set(key, outputValue);
          added.set(key, outputValue);
        });
        if (removeOutput) {
          changeSet.removed.forEach((_, key) => {
            const existingOutput = existing.get(key)!;
            removeOutput(existingOutput);
            removed.set(key, existingOutput);
            existing.delete(key);
          });
        } else {
          changeSet.removed.forEach((_, key) => {
            const existingOutput = existing.get(key)!;
            removed.set(key, existingOutput);
            existing.delete(key);
          });
        }

        //changeSet.added.forEach((inputItem, key) => added.set(key, createOutput(inputItem)));
        return { added, removed, existing };
      },
      {
        added: new Map<Key, OutputValue>(),
        removed: new Map<Key, OutputValue>(),
        existing: new Map<Key, OutputValue>(),
      },
    ),
  );
}

export function mapKeysMapChangeSet<KeyIn, KeyOut, Value>(mapKey: (k: KeyIn) => KeyOut) {
  return pipe(
    map((changeSet: MapChangeSet<KeyIn, Value>) => ({
      added: new Map(changeSet.added.entries().map(([k, v]) => [mapKey(k), v])),
      removed: new Map(changeSet.removed.entries().map(([k, v]) => [mapKey(k), v])),
    })),
  );
}

export function mapKeysMap<KeyIn, KeyOut, Value>(mapKey: (k: KeyIn) => KeyOut) {
  return pipe(map((changeSet: Map<KeyIn, Value>) => new Map(changeSet.entries().map(([k, v]) => [mapKey(k), v]))));
}
