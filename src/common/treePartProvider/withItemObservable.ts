import {
  BehaviorSubject,
  combineLatest,
  defer,
  filter,
  map,
  Observable,
  of,
  scan,
  shareReplay,
  switchMap,
  tap,
} from "rxjs";
import { ItemInformation } from "./TreePartProvider";

interface Entry<InputItem, OutputItem> {
  perItemSubject: BehaviorSubject<InputItem>;
  perItemObservable: Observable<OutputItem>;
}

export function withItemObservable<InputItem, OutputItem>(
  getItemObservable: (inputObservable: Observable<InputItem>) => Observable<OutputItem>,
) {
  return (source: Observable<ItemInformation<InputItem>>): Observable<ItemInformation<OutputItem>> =>
    defer(() => {
      // The item information (e.g. refreshObservables) of the latest input. It is emitted with every output,
      // also with outputs caused by per-item updates.
      let itemInformation: Omit<ItemInformation<InputItem>, "changes"> = {};
      let itemInformationChanged = false;
      return source.pipe(
        tap(({ changes: _changes, ...latestItemInformation }) => {
          itemInformationChanged = !isShallowEqual(itemInformation, latestItemInformation);
          itemInformation = latestItemInformation;
        }),
        // Accumulate incremental change sets into a persistent entries map.
        // Must be outside switchMap so state survives across emissions.
        scan(
          (
            last: {
              entries: Map<string, Entry<InputItem, OutputItem>>;
              keysChanged: boolean;
              index: number;
              inputInfo: ItemInformation<InputItem>;
            },
            inputInfo: ItemInformation<InputItem>,
          ) => {
            const lastEntries = new Map<string, Entry<InputItem, OutputItem>>(last.entries.entries());
            let keysChanged = false;
            for (const [key, value] of inputInfo.changes.added.entries()) {
              if (!lastEntries.has(key)) {
                const perItemSubject = new BehaviorSubject<InputItem>(value);
                const perItemObservable = getItemObservable(perItemSubject).pipe(shareReplay(1));
                lastEntries.set(key, { perItemSubject, perItemObservable });
                keysChanged = true;
              } else if (inputInfo.changes.removed.has(key)) {
                const lastEntry = lastEntries.get(key)!;
                lastEntry.perItemSubject.next(value);
              } else {
                throw new Error("invalid state");
              }
            }
            for (const [key, value] of inputInfo.changes.removed.entries()) {
              // skip removed and added = updated entries
              if (inputInfo.changes.added.has(key)) {
                continue;
              }
              const entry = lastEntries.get(key);

              if (!entry) {
                throw new Error("invalid state");
              }
              entry.perItemSubject.complete();
              lastEntries.delete(key);
              keysChanged = true;
            }

            return {
              entries: lastEntries,
              keysChanged,
              // The first update needs to get through, even when
              // it is the empty list
              index: Math.min(last.index + 1, 1),
              inputInfo,
            };
          },
          {
            entries: new Map<string, Entry<InputItem, OutputItem>>(),
            keysChanged: false,
            index: -1,
            inputInfo: undefined,
          } as unknown as {
            entries: Map<string, Entry<InputItem, OutputItem>>;
            keysChanged: boolean;
            index: number;
            inputInfo: ItemInformation<InputItem>;
          },
        ),
        // Changed item information needs to get through, even when no keys changed
        filter((obj) => obj.index === 0 || obj?.keysChanged || itemInformationChanged),
        // Switch to a new combineLatest only when keys or the item information change.
        // Per-item subject updates (no key change) flow through the existing
        // combineLatest without switching, so the diff scan below maintains state.
        switchMap((obj) => {
          const entriesArray = Array.from(obj.entries.entries());
          const keys = entriesArray.map(([key]) => key);
          const observables = entriesArray.map(([, value]) => value.perItemObservable);
          const inputInfo = obj.inputInfo;
          if (observables.length === 0) {
            return of({ entries: new Map<string, OutputItem>(), inputInfo });
          } else {
            return combineLatest(observables).pipe(
              //FIXME: I don't like combineLatest since it unsubscribes and re-subscribes a lot.
              map((values) => {
                const result = new Map<string, OutputItem>();
                keys.forEach((key, i) => {
                  result.set(key, values[i]);
                });
                return { entries: result, inputInfo };
              }),
            );
          }
        }),
        // Compute incremental diffs. Must be outside switchMap so state survives.
        scan(
          (
            last: {
              entries: Map<string, OutputItem>;
              changes: { added: Map<string, OutputItem>; removed: Map<string, OutputItem> };
              inputInfo: ItemInformation<InputItem>;
            },
            { entries, inputInfo }: { entries: Map<string, OutputItem>; inputInfo: ItemInformation<InputItem> },
          ) => {
            const added = new Map<string, OutputItem>();
            const removed = new Map<string, OutputItem>();
            for (const [key, value] of entries.entries()) {
              if (!last.entries.has(key)) {
                added.set(key, value);
              } else if (last.entries.get(key) !== value) {
                // FIXME: crude comparison by reference
                added.set(key, value);
                removed.set(key, last.entries.get(key)!);
              }
            }
            for (const [key, value] of last.entries.entries()) {
              if (!entries.has(key)) {
                removed.set(key, value);
              }
            }
            return {
              entries,
              changes: {
                added,
                removed,
              },
              inputInfo,
            };
          },
          {
            entries: new Map<string, OutputItem>(),
            changes: {
              added: new Map<string, OutputItem>(),
              removed: new Map<string, OutputItem>(),
            },
            inputInfo: undefined,
          } as unknown as {
            entries: Map<string, OutputItem>;
            changes: { added: Map<string, OutputItem>; removed: Map<string, OutputItem> };
            inputInfo: ItemInformation<InputItem>;
          },
        ),
        map((obj) => ({ ...itemInformation, changes: obj.changes })),
      );
    });
}

function isShallowEqual(a: object, b: object) {
  const aEntries = Object.entries(a);
  return (
    aEntries.length === Object.keys(b).length &&
    aEntries.every(([key, value]) => (b as Record<string, unknown>)[key] === value)
  );
}
