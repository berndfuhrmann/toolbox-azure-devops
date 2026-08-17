import { BehaviorSubject, Observable, ReplaySubject, Subject } from "rxjs";
import { autoRefresh, nextTrigger, valuesOperator, bufferSynchronous } from "../../../src/common/operators";
import { complete, createTestObserver, error } from "../helper/observables";
import { setImmediate, setTimeout } from "timers/promises";

beforeEach(() => {
  vi.useFakeTimers();
  const date = new Date(2020, 1, 1, 0);
  vi.setSystemTime(date);
});

afterEach(() => {
  vi.useRealTimers();
});

describe("autoRefresh", () => {
  let refresh: ReturnType<typeof createTestObserver>;
  let generator: Subject<string>;
  let observer: ReturnType<typeof createTestObserver>;
  beforeEach(() => {
    refresh = createTestObserver();
    generator = new Subject<string>();
    observer = createTestObserver();
  });
  test("nothing happens", () => {
    generator.pipe(autoRefresh(refresh, new BehaviorSubject(5))).subscribe(observer);
    expect(observer.combined.mock.calls).toEqual([]);
    expect(refresh.combined.mock.calls).toEqual([]);
  });

  test("generator completes", () => {
    generator.pipe(autoRefresh(refresh, new BehaviorSubject(5))).subscribe(observer);
    generator.complete();
    expect(observer.combined.mock.calls).toEqual([[complete]]);
    expect(refresh.combined.mock.calls).toEqual([[complete]]);
  });

  test("generator generates 1 value", () => {
    generator.pipe(autoRefresh(refresh, new BehaviorSubject(5))).subscribe(observer);
    generator.next("alpha");
    const expectedScheduledDate = Date.now() + 5;
    expect(observer.combined.mock.calls).toEqual([["alpha"]]);
    expect(refresh.combined.mock.calls).toEqual([[expectedScheduledDate]]);
  });
});

describe("nextTrigger", () => {
  let observer: ReturnType<typeof createTestObserver>;
  let refreshers: Subject<Observable<number>>;
  beforeEach(() => {
    observer = createTestObserver();
    refreshers = new Subject<Observable<number>>();
  });

  test("nothing happens", () => {
    refreshers.pipe(nextTrigger()).subscribe(observer);
    expect(observer.combined.mock.calls).toEqual([[Infinity]]);
  });

  test("one refresher, no values", () => {
    const refresher1 = new Subject<number>();
    refreshers.pipe(nextTrigger()).subscribe(observer);
    refreshers.next(refresher1);
    expect(observer.combined.mock.calls).toEqual([[Infinity]]);
  });

  test("one refresher, one value", () => {
    const refresher1 = new Subject<number>();
    refreshers.pipe(nextTrigger()).subscribe(observer);
    refreshers.next(refresher1);
    refresher1.next(5);
    expect(observer.combined.mock.calls).toEqual([[Infinity], [5]]);
  });

  test("one refresher, two values in one refresher", () => {
    const refresher1 = new Subject<number>();
    refreshers.pipe(nextTrigger()).subscribe(observer);
    refreshers.next(refresher1);
    refresher1.next(5);
    refresher1.next(7);
    expect(observer.combined.mock.calls).toEqual([[Infinity], [5], [7]]);
  });

  test("one refresher, two values in two refreshers a < b", () => {
    const refresher1 = new Subject<number>();
    const refresher2 = new Subject<number>();
    refreshers.pipe(nextTrigger()).subscribe(observer);
    refreshers.next(refresher1);
    refreshers.next(refresher2);
    refresher1.next(5);
    refresher2.next(7);
    expect(observer.combined.mock.calls).toEqual([[Infinity], [5]]);
  });

  test("one refresher, two values in two refreshers a > b", () => {
    const refresher1 = new Subject<number>();
    const refresher2 = new Subject<number>();
    refreshers.pipe(nextTrigger()).subscribe(observer);
    refreshers.next(refresher1);
    refreshers.next(refresher2);
    refresher1.next(5);
    refresher2.next(3);
    expect(observer.combined.mock.calls).toEqual([[Infinity], [5], [3]]);
  });

  test("one refresher, two values in two refreshers a < b, complete 1st", () => {
    const refresher1 = new Subject<number>();
    const refresher2 = new Subject<number>();
    refreshers.pipe(nextTrigger()).subscribe(observer);
    refreshers.next(refresher1);
    refreshers.next(refresher2);
    refresher1.next(5);
    refresher2.next(7);
    refresher1.complete();
    expect(observer.combined.mock.calls).toEqual([[Infinity], [5], [7]]);
  });

  test("late subscriber gets Date.now() instead of stored future timestamp", () => {
    const now = Date.now();
    const futureTimestamp = now + 3_600_000;
    const refresher1 = new Subject<number>();

    const refreshTime = refreshers.pipe(nextTrigger());
    refreshers.next(refresher1);
    refresher1.next(futureTimestamp);

    refreshTime.subscribe(observer);

    expect(observer.combined.mock.calls).toEqual([[now]]);
  });

  test("late subscriber still gets Infinity when no triggers are registered", () => {
    const refreshTime = refreshers.pipe(nextTrigger());

    refreshTime.subscribe(observer);

    expect(observer.combined.mock.calls).toEqual([[Infinity]]);
  });
});

describe("valuesOperator", () => {
  let observer: ReturnType<typeof createTestObserver>;
  let timers: Subject<number>;
  let parameters: Subject<string>;
  let promises: {
    parameter: string;
    resolve: (value: string) => void;
    reject: (reason?: any) => void;
  }[];

  beforeEach(() => {
    observer = createTestObserver();
    timers = new Subject<number>();
    parameters = new ReplaySubject<string>();
    promises = [];
  });

  test("nothing happens", () => {
    timers
      .pipe(
        valuesOperator(
          (parameter) =>
            new Promise((resolve, reject) => {
              promises.push({ parameter, resolve, reject });
            }),
          parameters,
        ),
      )
      .subscribe(observer);
    expect(promises).toEqual([]);
  });

  test("has timer and parameter", async () => {
    timers
      .pipe(
        valuesOperator(
          (parameter) =>
            new Promise((resolve, reject) => {
              promises.push({ parameter, resolve, reject });
            }),
          parameters,
        ),
      )
      .subscribe(observer);

    parameters.next("alpha");
    const scheduledDate = Date.now() + 50;
    timers.next(scheduledDate);

    await vi.advanceTimersByTimeAsync(30);
    expect(promises).toHaveLength(0);
    await vi.advanceTimersByTimeAsync(30);
    promises[0].resolve("a");
    await vi.advanceTimersByTimeAsync(100);

    expect(promises).toHaveLength(1);
    expect(promises[0].parameter).toBe("alpha");
    expect(observer.combined.mock.calls).toEqual([["a"]]);
  });

  test("synchronous future-timestamp update does not cancel an immediate load", async () => {
    timers
      .pipe(
        valuesOperator(
          (parameter) =>
            new Promise((resolve, reject) => {
              promises.push({ parameter, resolve, reject });
            }),
          parameters,
        ),
      )
      .subscribe(observer);

    parameters.next("alpha");
    const now = Date.now();

    timers.next(now);
    timers.next(now + 3_600_000);

    await vi.advanceTimersByTimeAsync(1);

    expect(promises).toHaveLength(1);
    expect(promises[0].parameter).toBe("alpha");
  });
});

describe("bufferSynchronous", () => {
  let source: Subject<number>;
  let observer: ReturnType<typeof createTestObserver>;

  beforeEach(() => {
    source = new Subject<number>();
    observer = createTestObserver();
  });

  test("should buffer synchronous emissions", async () => {
    source.pipe(bufferSynchronous()).subscribe(observer);

    // Emit multiple values synchronously
    source.next(1);
    source.next(2);
    source.next(3);

    // Wait for next tick
    await vi.runAllTimersAsync();

    expect(observer.combined).toHaveBeenCalledTimes(1);
    expect(observer.combined).toHaveBeenCalledWith([1, 2, 3]);
  });

  test("should emit separate batches for different event loop ticks", async () => {
    source.pipe(bufferSynchronous()).subscribe(observer);

    // First batch
    source.next(1);
    source.next(2);

    // Wait for next tick
    await vi.runAllTimersAsync();

    // Second batch in different tick
    source.next(3);
    source.next(4);

    // Wait for next tick
    await vi.runAllTimersAsync();

    expect(observer.combined).toHaveBeenCalledTimes(2);
    expect(observer.combined).toHaveBeenNthCalledWith(1, [1, 2]);
    expect(observer.combined).toHaveBeenNthCalledWith(2, [3, 4]);
  });

  test("should flush values before propagating error", async () => {
    source.pipe(bufferSynchronous()).subscribe(observer);

    // Emit some values
    source.next(1);
    source.next(2);

    // Emit error
    const errorObject = new Error("test error");
    source.error(errorObject);

    // Should have emitted the buffered values before the error
    expect(observer.combined).toHaveBeenCalledTimes(2);
    expect(observer.combined).toHaveBeenCalledWith([1, 2]);
    expect(observer.combined).toHaveBeenCalledWith(error, errorObject);
  });

  test("should flush remaining values on complete", async () => {
    source.pipe(bufferSynchronous()).subscribe(observer);

    // Emit some values
    source.next(1);
    source.next(2);

    // Complete
    source.complete();

    expect(observer.combined).toHaveBeenCalledTimes(2);
    expect(observer.combined).toHaveBeenCalledWith([1, 2]);
    expect(observer.combined).toHaveBeenCalledWith(complete);
  });

  test("should not emit empty buffers", async () => {
    source.pipe(bufferSynchronous()).subscribe(observer);

    // Don't emit any values, just complete
    source.complete();

    expect(observer.combined).toHaveBeenCalledOnce();
    expect(observer.combined).toHaveBeenCalledWith(complete);
  });
});
