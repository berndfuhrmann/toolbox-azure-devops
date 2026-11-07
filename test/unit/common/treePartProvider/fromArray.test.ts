import { map, of, Subject, switchMap } from "rxjs";
import type { MapChangeSet } from "../../../../src/common/collections/observableMap";
import { createException, type Exception } from "../../../../src/common/Exception";
import { fromArray, fromArrayWithItemInformation } from "../../../../src/common/treePartProvider/fromArray";

interface TestItem {
  id: string;
  name: string;
  isEqual(other: TestItem): boolean;
}

const createItem = (id: string, name = id): TestItem => ({
  id,
  name,
  isEqual(other) {
    return this.id === other.id && this.name === other.name;
  },
});

const keys = (changes: MapChangeSet<string, TestItem | Exception>) => ({
  added: [...changes.added.keys()],
  removed: [...changes.removed.keys()],
});

describe("fromArray", () => {
  test("computes changes relative to the previous list", () => {
    const changes: ReturnType<typeof keys>[] = [];
    of([createItem("1"), createItem("2")], [createItem("1"), createItem("3")])
      .pipe(fromArray((item: TestItem) => item.id, {}))
      .subscribe((information) => changes.push(keys(information.changes)));
    expect(changes).toEqual([
      { added: ["1", "2"], removed: [] },
      { added: ["3"], removed: ["2"] },
    ]);
  });

  test("shows an exception as a single item", () => {
    const changes: ReturnType<typeof keys>[] = [];
    of(createException(new Error("failed")))
      .pipe(fromArray((item: TestItem) => item.id, {}))
      .subscribe((information) => changes.push(keys(information.changes)));
    expect(changes).toEqual([{ added: ["exception"], removed: [] }]);
  });
});

describe("fromArrayWithItemInformation", () => {
  test("computes changes across switches of the context", () => {
    const context = new Subject<string>();
    const changes: ReturnType<typeof keys>[] = [];
    context
      .pipe(
        switchMap((name) => of({ items: [createItem("1", name), createItem("2")] })),
        fromArrayWithItemInformation((item: TestItem) => item.id),
      )
      .subscribe((information) => changes.push(keys(information.changes)));

    context.next("a");
    context.next("a");
    context.next("b");

    // inside of switchMap, fromArray would add both items again for each context
    expect(changes).toEqual([
      { added: ["1", "2"], removed: [] },
      { added: [], removed: [] },
      { added: ["1"], removed: ["1"] },
    ]);
  });

  test("passes the item information of the latest list", () => {
    const first = { first: new Subject<number>() };
    const second = { second: new Subject<number>() };
    const refreshObservables: unknown[] = [];
    of(first, second)
      .pipe(
        map((refreshObservables) => ({ items: [createItem("1")], refreshObservables })),
        fromArrayWithItemInformation((item: TestItem) => item.id),
      )
      .subscribe((information) => refreshObservables.push(information.refreshObservables));
    expect(refreshObservables).toEqual([first, second]);
  });
});
