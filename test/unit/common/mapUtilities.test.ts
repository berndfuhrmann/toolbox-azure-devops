import { isObservable, Subject } from "rxjs";

import {
  changeSetToChangeSetOfObservables,
  convertMapToChangeSet,
  convertToMap,
  existingItems,
} from "../../../src/common/mapUtilities";
import { complete, createTestObserver } from "../helper/observables";

beforeEach(() => {
  vi.useFakeTimers();
  const date = new Date(2020, 1, 1, 0);
  vi.setSystemTime(date);
});

afterEach(() => {
  vi.useRealTimers();
});
let call = 0;
beforeEach(() => (call = 0));

describe("existingItems", () => {
  test("undefined", () => {
    expect(existingItems(undefined)).toEqual(new Map());
  });
  test("with entries", () => {
    expect(
      existingItems({
        added: new Map([
          ["add1", "a1"],
          ["add2", "a2"],
        ]),
        removed: new Map([
          ["rem1", "r1"],
          ["rem2", "r2"],
        ]),
        unchanged: new Map([
          ["unc1", "u1"],
          ["unc2", "u2"],
        ]),
        updated: new Map([
          ["upd1", "up1"],
          ["upd2", "up2"],
        ]),
      }),
    ).toEqual(
      new Map([
        ["add1", "a1"],
        ["add2", "a2"],
        ["unc1", "u1"],
        ["unc2", "u2"],
        ["upd1", "up1"],
        ["upd2", "up2"],
      ]),
    );
  });
});

describe("convertToMap", () => {
  let observable: Subject<{ name: string }[]>;
  let observer: ReturnType<typeof createTestObserver>;

  beforeEach(() => {
    observable = new Subject();
    observer = createTestObserver();
    observable.pipe(convertToMap((x) => x.name)).subscribe(observer);
  });

  test("no call", () => {
    expect(observer.combined).not.toHaveBeenCalled();
  });
  test("one empty array", () => {
    observable.next([]);
    expect(observer.combined).toHaveBeenNthCalledWith(++call, new Map());
    expect(observer.combined).toHaveBeenCalledTimes(call);
  });
  test("one array with two items", () => {
    observable.next([{ name: "alpha" }, { name: "beta" }]);
    expect(observer.combined).toHaveBeenNthCalledWith(
      ++call,
      new Map([
        ["alpha", { name: "alpha" }],
        ["beta", { name: "beta" }],
      ]),
    );
    expect(observer.combined).toHaveBeenCalledTimes(call);
  });

  test("two arrays", () => {
    observable.next([{ name: "alpha" }, { name: "beta" }]);
    observable.next([{ name: "gamma" }, { name: "beta" }]);
    expect(observer.combined).toHaveBeenNthCalledWith(
      ++call,
      new Map([
        ["alpha", { name: "alpha" }],
        ["beta", { name: "beta" }],
      ]),
    );
    expect(observer.combined).toHaveBeenNthCalledWith(
      ++call,
      new Map([
        ["gamma", { name: "gamma" }],
        ["beta", { name: "beta" }],
      ]),
    );
    expect(observer.combined).toHaveBeenCalledTimes(call);
  });
});

describe("convertMapToChangeSet", () => {
  let observable: Subject<Map<string, { name: string }>>;
  let observer: ReturnType<typeof createTestObserver>;
  const createValue = vi.fn((x) => ({ id: x.name, oldValues: [] as string[] }));
  const updatecreateValue = vi.fn((x, y) => x.oldValues.push(y.name));
  beforeEach(() => {
    observable = new Subject();
    observer = createTestObserver();

    observable.pipe(convertMapToChangeSet(createValue, updatecreateValue)).subscribe(observer);
  });

  test("nothing happens", () => {
    expect(observer.combined).toHaveBeenCalledTimes(call);
  });

  test("entries added", () => {
    observable.next(
      new Map([
        ["alpha", { name: "alpha" }],
        ["beta", { name: "beta" }],
      ]),
    );

    expect(observer.combined).toHaveBeenNthCalledWith(++call, {
      added: new Map([
        ["alpha", { id: "alpha", oldValues: [] }],
        ["beta", { id: "beta", oldValues: [] }],
      ]),
      removed: new Map(),
      unchanged: new Map(),
    });
    expect(observer.combined).toHaveBeenCalledTimes(call);
  });

  test("entries removed", () => {
    observable.next(
      new Map([
        ["alpha", { name: "alpha" }],
        ["beta", { name: "beta" }],
      ]),
    );
    observable.next(new Map([["beta", { name: "beta" }]]));
    expect(observer.combined).toHaveBeenNthCalledWith(++call, {
      added: new Map([
        ["alpha", { id: "alpha", oldValues: [] }],
        ["beta", { id: "beta", oldValues: ["beta"] }],
      ]),
      removed: new Map(),
      unchanged: new Map(),
    });
    expect(observer.combined).toHaveBeenNthCalledWith(++call, {
      added: new Map([]),
      removed: new Map([["alpha", { id: "alpha", oldValues: [] }]]),
      unchanged: new Map([["beta", { id: "beta", oldValues: ["beta"] }]]),
    });
    expect(observer.combined).toHaveBeenCalledTimes(call);
  });

  test("completes", () => {
    observable.next(
      new Map([
        ["alpha", { name: "alpha" }],
        ["beta", { name: "beta" }],
      ]),
    );
    observable.next(new Map([["beta", { name: "beta" }]]));
    observable.complete();
    expect(observer.combined).toHaveBeenCalledWith(complete);
  });

  test("completes and closes", () => {
    observable = new Subject();
    observer = createTestObserver();
    observable
      .pipe(
        convertMapToChangeSet(createValue, updatecreateValue, (value) => {
          value.oldValues.push("closed");
        }),
      )
      .subscribe(observer);
    observable.next(
      new Map([
        ["alpha", { name: "alpha" }],
        ["beta", { name: "beta" }],
      ]),
    );
    observable.next(new Map([["beta", { name: "beta" }]]));
    observable.complete();
    expect(observer.combined).toHaveBeenNthCalledWith(++call, {
      added: new Map([
        ["alpha", { id: "alpha", oldValues: ["closed"] }],
        ["beta", { id: "beta", oldValues: ["beta", "closed"] }],
      ]),
      removed: new Map(),
      unchanged: new Map(),
    });
    expect(observer.combined).toHaveBeenNthCalledWith(++call, {
      added: new Map([]),
      removed: new Map([["alpha", { id: "alpha", oldValues: ["closed"] }]]),
      unchanged: new Map([["beta", { id: "beta", oldValues: ["beta", "closed"] }]]),
    });
    expect(observer.combined).toHaveBeenCalledWith(complete);
  });
});

describe("changeSetToChangeSetOfObservables", () => {
  let observable: Subject<Map<string, { name: string }>>;
  let observer: ReturnType<typeof createTestObserver>;

  beforeEach(() => {
    observable = new Subject();
    observer = createTestObserver();
    observable.pipe(changeSetToChangeSetOfObservables((x) => x)).subscribe(observer);
  });

  test("nothing happens", () => {
    expect(observer.combined).toHaveBeenCalledTimes(call);
  });

  test("entries added", () => {
    observable.next(
      new Map([
        ["alpha", { name: "alpha" }],
        ["beta", { name: "beta" }],
      ]),
    );

    expect(observer.combined).toHaveBeenNthCalledWith(++call, {
      added: new Map([
        [
          "alpha",
          {
            source: expect.any(Subject),
            observable: expect.toSatisfy((x) => isObservable(x)),
          },
        ],
        [
          "beta",
          {
            source: expect.any(Subject),
            observable: expect.toSatisfy((x) => isObservable(x)),
          },
        ],
      ]),
      removed: new Map(),
      unchanged: new Map(),
    });
    expect(observer.combined).toHaveBeenCalledTimes(call);
  });
  test("entries removed", () => {
    observable.next(
      new Map([
        ["alpha", { name: "alpha" }],
        ["beta", { name: "beta" }],
      ]),
    );
    observable.next(new Map([["beta", { name: "beta" }]]));
    expect(observer.combined).toHaveBeenNthCalledWith(++call, {
      added: new Map([
        [
          "alpha",
          {
            source: expect.any(Subject),
            observable: expect.toSatisfy((x) => isObservable(x)),
          },
        ],
        [
          "beta",
          {
            source: expect.any(Subject),
            observable: expect.toSatisfy((x) => isObservable(x)),
          },
        ],
      ]),
      removed: new Map(),
      unchanged: new Map(),
    });
    expect(observer.combined).toHaveBeenNthCalledWith(++call, {
      added: new Map([]),
      removed: new Map([
        [
          "alpha",
          {
            source: expect.any(Subject),
            observable: expect.toSatisfy((x) => isObservable(x)),
          },
        ],
      ]),
      unchanged: new Map([
        [
          "beta",
          {
            source: expect.any(Subject),
            observable: expect.toSatisfy((x) => isObservable(x)),
          },
        ],
      ]),
    });
    expect(observer.combined).toHaveBeenCalledTimes(call);
  });
});
