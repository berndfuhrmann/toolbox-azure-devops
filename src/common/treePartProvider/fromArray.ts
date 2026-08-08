import { map, Observable, pipe, switchMap } from "rxjs";
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
