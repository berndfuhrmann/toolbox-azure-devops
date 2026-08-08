import { from, map, Subject, switchMap } from "rxjs";
import { beforeEach, expect, test, describe } from "vitest";
import { withItemObservable } from "../../../../src/common/treePartProvider/withItemObservable";
import { ItemInformation } from "../../../../src/common/treePartProvider/TreePartProvider";
import { createTestObserver } from "../../helper/observables";
import { setTimeout } from "timers/promises";

let call = 0;
beforeEach(() => (call = 0));
describe("sync", () => {
  test("no element, no updates", async () => {
    const inputSubject = new Subject<ItemInformation<number>>();
    const subject = withItemObservable<number, string>((x) => x.pipe(map((v) => `${v}`)));
    const testObserver = createTestObserver();
    inputSubject.pipe(subject).subscribe(testObserver);
    inputSubject.next({
      changes: { added: new Map(), removed: new Map() },
    });
    expect(testObserver.combined).toHaveBeenCalledTimes(1);
  });

  test("one element added", async () => {
    const inputSubject = new Subject<ItemInformation<number>>();
    const subject = withItemObservable<number, string>((x) => x.pipe(map((v) => `${v}`)));
    const observer = createTestObserver();
    inputSubject.pipe(subject).subscribe(observer);
    inputSubject.next({
      changes: { added: new Map([["key", 1]]), removed: new Map() },
    });
    expect(observer.combined).toHaveBeenNthCalledWith(++call, {
      changes: { added: new Map([["key", "1"]]), removed: new Map() },
    });
  });

  test("two elements added", async () => {
    const inputSubject = new Subject<ItemInformation<number>>();
    const subject = withItemObservable<number, string>((x) => x.pipe(map((v) => `${v}`)));
    const observer = createTestObserver();
    inputSubject.pipe(subject).subscribe(observer);
    inputSubject.next({
      changes: {
        added: new Map([
          ["key1", 1],
          ["key2", 2],
        ]),
        removed: new Map(),
      },
    });
    expect(observer.combined).toHaveBeenNthCalledWith(++call, {
      changes: {
        added: new Map([
          ["key1", "1"],
          ["key2", "2"],
        ]),
        removed: new Map(),
      },
    });
  });

  test("two elements added, then empty emission", async () => {
    const inputSubject = new Subject<ItemInformation<number>>();
    const subject = withItemObservable<number, string>((x) => x.pipe(map((v) => `${v}`)));
    const observer = createTestObserver();
    inputSubject.pipe(subject).subscribe(observer);
    inputSubject.next({
      changes: {
        added: new Map([
          ["key1", 1],
          ["key2", 2],
        ]),
        removed: new Map(),
      },
    });
    expect(observer.combined).toHaveBeenNthCalledWith(++call, {
      changes: {
        added: new Map([
          ["key1", "1"],
          ["key2", "2"],
        ]),
        removed: new Map(),
      },
    });
    inputSubject.next({
      changes: { added: new Map(), removed: new Map() },
    });
    // Empty change set with no key changes is filtered out
    expect(observer.combined).toHaveBeenCalledTimes(call);
  });

  test("add then remove across emissions", async () => {
    const inputSubject = new Subject<ItemInformation<number>>();
    const subject = withItemObservable<number, string>((x) => x.pipe(map((v) => `${v}`)));
    const observer = createTestObserver();
    inputSubject.pipe(subject).subscribe(observer);
    inputSubject.next({
      changes: { added: new Map([["key1", 1]]), removed: new Map() },
    });
    expect(observer.combined).toHaveBeenNthCalledWith(++call, {
      changes: { added: new Map([["key1", "1"]]), removed: new Map() },
    });
    inputSubject.next({
      changes: { added: new Map(), removed: new Map([["key1", 1]]) },
    });
    expect(observer.combined).toHaveBeenNthCalledWith(++call, {
      changes: { added: new Map(), removed: new Map([["key1", "1"]]) },
    });
  });

  test("add items across separate emissions", async () => {
    const inputSubject = new Subject<ItemInformation<number>>();
    const subject = withItemObservable<number, string>((x) => x.pipe(map((v) => `${v}`)));
    const observer = createTestObserver();
    inputSubject.pipe(subject).subscribe(observer);
    inputSubject.next({
      changes: { added: new Map([["key1", 1]]), removed: new Map() },
    });
    expect(observer.combined).toHaveBeenNthCalledWith(++call, {
      changes: { added: new Map([["key1", "1"]]), removed: new Map() },
    });
    inputSubject.next({
      changes: { added: new Map([["key2", 2]]), removed: new Map() },
    });
    expect(observer.combined).toHaveBeenNthCalledWith(++call, {
      changes: { added: new Map([["key2", "2"]]), removed: new Map() },
    });
  });

  test("add, remove, re-add across emissions", async () => {
    const inputSubject = new Subject<ItemInformation<number>>();
    const subject = withItemObservable<number, string>((x) => x.pipe(map((v) => `${v}`)));
    const observer = createTestObserver();
    inputSubject.pipe(subject).subscribe(observer);
    inputSubject.next({
      changes: { added: new Map([["key1", 1]]), removed: new Map() },
    });
    expect(observer.combined).toHaveBeenNthCalledWith(++call, {
      changes: { added: new Map([["key1", "1"]]), removed: new Map() },
    });
    inputSubject.next({
      changes: { added: new Map(), removed: new Map([["key1", 1]]) },
    });
    expect(observer.combined).toHaveBeenNthCalledWith(++call, {
      changes: { added: new Map(), removed: new Map([["key1", "1"]]) },
    });
    inputSubject.next({
      changes: { added: new Map([["key1", 3]]), removed: new Map() },
    });
    expect(observer.combined).toHaveBeenNthCalledWith(++call, {
      changes: { added: new Map([["key1", "3"]]), removed: new Map() },
    });
  });
});

describe("async", () => {
  const promises: {
    resolve: (v: string) => void;
    input: number;
  }[] = [];
  beforeEach(() => {
    promises.length = 0;
  });
  const subject = withItemObservable<number, string>((x) =>
    x.pipe(
      switchMap((n) => {
        let resolve: (v: string) => void | undefined;
        const promise = new Promise<string>((r) => (resolve = r));
        promises.push({
          resolve: resolve!,
          input: n,
        });
        return from(promise);
      }),
    ),
  );

  test("no returned observables resolved, no emissions", async () => {
    const inputSubject = new Subject<ItemInformation<number>>();

    const observer = createTestObserver();
    inputSubject.pipe(subject).subscribe(observer);

    expect(observer.combined).not.toHaveBeenCalled();
  });

  test("delayed emission", async () => {
    const inputSubject = new Subject<ItemInformation<number>>();

    const observer = createTestObserver();
    inputSubject.pipe(subject).subscribe(observer);
    inputSubject.next({
      changes: { added: new Map([["key1", 1]]), removed: new Map() },
    });
    promises[0].resolve("1");
    await setTimeout(1);
    expect(observer.combined).toHaveBeenNthCalledWith(++call, {
      changes: { added: new Map([["key1", "1"]]), removed: new Map() },
    });
    expect(observer.combined).toHaveBeenCalledTimes(call);
  });

  test("element removed before emission", async () => {
    const inputSubject = new Subject<ItemInformation<number>>();

    const observer = createTestObserver();
    inputSubject.pipe(subject).subscribe(observer);
    inputSubject.next({
      changes: { added: new Map([["key1", 1]]), removed: new Map() },
    });
    expect(observer.combined).toHaveBeenCalledTimes(call++);
    inputSubject.next({
      changes: { added: new Map(), removed: new Map([["key1", 1]]) },
    });
    promises[0].resolve("1");
    await setTimeout(1);
    expect(observer.combined).toHaveBeenCalledTimes(call);
  });

  test("element replaced before emission", async () => {
    const inputSubject = new Subject<ItemInformation<number>>();

    const observer = createTestObserver();
    inputSubject.pipe(subject).subscribe(observer);
    inputSubject.next({
      changes: { added: new Map([["key1", 1]]), removed: new Map() },
    });
    inputSubject.next({
      changes: { added: new Map([["key1", 2]]), removed: new Map([["key1", 1]]) },
    });
    promises[1].resolve("2");
    promises[0].resolve("1");
    await setTimeout(1);
    expect(observer.combined).toHaveBeenNthCalledWith(++call, {
      changes: { added: new Map([["key1", "2"]]), removed: new Map() },
    });
    expect(observer.combined).toHaveBeenCalledTimes(call);
  });

  test("element replaced after emission", async () => {
    const inputSubject = new Subject<ItemInformation<number>>();

    const observer = createTestObserver();
    inputSubject.pipe(subject).subscribe(observer);
    inputSubject.next({
      changes: { added: new Map([["key1", 1]]), removed: new Map() },
    });
    promises[0].resolve("1");
    await setTimeout(1);
    expect(observer.combined).toHaveBeenNthCalledWith(++call, {
      changes: { added: new Map([["key1", "1"]]), removed: new Map() },
    });
    // New emission with replacement (added + removed for same key)
    inputSubject.next({
      changes: { added: new Map([["key1", 2]]), removed: new Map([["key1", 1]]) },
    });
    promises[1].resolve("2");
    await setTimeout(1);
    expect(observer.combined).toHaveBeenNthCalledWith(++call, {
      changes: { added: new Map([["key1", "2"]]), removed: new Map([["key1", "1"]]) },
    });
    expect(observer.combined).toHaveBeenCalledTimes(call);
  });

  test("element removed after emission", async () => {
    const inputSubject = new Subject<ItemInformation<number>>();

    const observer = createTestObserver();
    inputSubject.pipe(subject).subscribe(observer);
    inputSubject.next({
      changes: { added: new Map([["key1", 1]]), removed: new Map() },
    });
    promises[0].resolve("1");
    await setTimeout(1);
    expect(observer.combined).toHaveBeenNthCalledWith(++call, {
      changes: { added: new Map([["key1", "1"]]), removed: new Map() },
    });
    inputSubject.next({
      changes: { added: new Map(), removed: new Map([["key1", 1]]) },
    });
    await setTimeout(1);
    expect(observer.combined).toHaveBeenNthCalledWith(++call, {
      changes: { added: new Map(), removed: new Map([["key1", "1"]]) },
    });
    expect(observer.combined).toHaveBeenCalledTimes(call);
  });
});
