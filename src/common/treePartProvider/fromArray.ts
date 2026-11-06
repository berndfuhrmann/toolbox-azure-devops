import { defer, map, Observable, pipe, switchMap, tap } from "rxjs";
import { convertIterableToMap, mapToMapChangeSet } from "../collections/observableMap";
import { Exception, isException } from "../Exception";
import { ItemInformation } from "./TreePartProvider";

const exceptionKey = "exception";

export function fromArray<Item extends { isEqual(other: Item): boolean }>(
  getItemKey: (item: Item) => string,
  itemInformation: Omit<ItemInformation<Item>, "changes">,
) {
  return pipe(
    map((itemsOrException: Iterable<Item | Exception> | Exception) => {
      if (isException(itemsOrException)) {
        return [itemsOrException] as Iterable<Item | Exception>;
      } else {
        return itemsOrException as Iterable<Item | Exception>;
      }
    }),
    convertIterableToMap((a) => (isException(a) ? exceptionKey : getItemKey(a))),
    mapToMapChangeSet<string, Item | Exception>((a, b) => {
      if (a === b) {
        return true;
      }
      if (isException(a) || isException(b)) {
        return false;
      }
      return a.isEqual(b);
    }),
    map((changes) => {
      return {
        ...itemInformation,
        changes,
      };
    }),
  );
}

/**
 * Like {@link fromArray}, but the item information comes with each list of items.
 * Use it after a `switchMap`, so that the changes are computed across switches: items of the previous inner observable
 * are removed or updated instead of being added a second time.
 */
export function fromArrayWithItemInformation<Item extends { isEqual(other: Item): boolean }>(
  getItemKey: (item: Item) => string,
) {
  return (
    source: Observable<{ items: Iterable<Item | Exception> | Exception } & Omit<ItemInformation<Item>, "changes">>,
  ): Observable<ItemInformation<Item | Exception>> =>
    defer(() => {
      let itemInformation: Omit<ItemInformation<Item>, "changes"> = {};
      return source.pipe(
        tap(({ items: _items, ...latestItemInformation }) => {
          itemInformation = latestItemInformation;
        }),
        map(({ items }) => items),
        fromArray(getItemKey, {}),
        map(({ changes }) => ({ ...itemInformation, changes })),
      );
    });
}
