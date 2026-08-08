import { map, pipe } from "rxjs";
import { MapChangeSet } from "../collections/observableMap";
import { ItemInformation } from "./TreePartProvider";

export function filterObservable<InputItem, OutputItem extends InputItem>(
  getFilterObservable: (item: InputItem) => item is OutputItem,
) {
  return pipe(
    map((input: ItemInformation<InputItem>) => {
      const added = new Map<string, InputItem>();
      for (const [key, item] of input.changes.added.entries()) {
        if (getFilterObservable(item)) {
          added.set(key, item);
        }
      }

      const removed = new Map<string, InputItem>();
      for (const [key, item] of input.changes.removed.entries()) {
        if (getFilterObservable(item)) {
          removed.set(key, item);
        }
      }

      return {
        ...input,
        changes: {
          added,
          removed,
        } as MapChangeSet<string, OutputItem>,
      };
    }),
  );
}
