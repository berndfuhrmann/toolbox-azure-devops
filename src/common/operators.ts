import {
  from,
  map,
  Observable,
  Observer,
  of,
  pipe,
  Subject,
  Subscription,
  switchMap,
  tap,
  throttleTime,
  timer,
} from "rxjs";

/**
 * RxJS operator that collects synchronous emissions into batches and flushes them
 * together on the next event-loop tick, without relying on a continuous timer.
 *
 * When the source emits one or more values synchronously, they are accumulated in
 * a buffer. A single `setTimeout(0)` is scheduled (only once per flush cycle) to
 * emit the buffered array downstream. This coalesces bursts of synchronous emissions
 * into a single array emission while adding no overhead when the source is idle.
 *
 * Errors and completions flush any pending buffer before being forwarded.
 *
 * @returns An operator function that wraps a source `Observable<T>` and returns an
 *   `Observable<T[]>` where each emission is a non-empty array of values collected
 *   since the previous flush.
 */
export function bufferSynchronous<T>() {
  return (source: Observable<T>) => {
    return new Observable<T[]>((subscriber) => {
      let buffer: T[] = [];
      let scheduled = false;

      const flush = () => {
        if (buffer.length > 0) {
          subscriber.next([...buffer]);
          buffer = [];
        }
        scheduled = false;
      };

      const scheduleFlush = () => {
        if (!scheduled) {
          scheduled = true;
          // Use setImmediate to defer to next event loop tick
          setTimeout(flush, 0);
        }
      };

      return source.subscribe({
        next: (value) => {
          buffer.push(value);
          scheduleFlush();
        },
        error: (err) => {
          flush(); // Flush any values received before the error
          subscriber.error(err);
        },
        complete: () => {
          flush(); // Flush any remaining values
          subscriber.complete();
        },
      });
    });
  };
}

/**
 * RxJS operator that, given a higher-order observable of due-date streams, tracks
 * the **earliest** scheduled trigger time across all active inner observables and
 * re-emits it whenever it changes.
 *
 * Each inner `Observable<number>` emitted by the source represents a series of
 * absolute timestamps (ms since epoch) at which a particular piece of data should
 * next be refreshed. `nextTrigger` keeps a live minimum over all currently active
 * inner observables and outputs that minimum as a single flat `Observable<number>`.
 *
 * ### Behaviour
 * - On **subscribe**, the output immediately emits the current minimum (or `Infinity`
 *   if no inner observable has produced a value yet). If the current minimum is in
 *   the past, `Date.now()` is used as a floor so subscribers always receive a
 *   meaningful value.
 * - Whenever any inner observable emits a **new** timestamp, the minimum is
 *   recalculated and re-emitted if it changed.
 * - When an inner observable **completes**, its contribution is removed and the
 *   minimum is recalculated if that observable held the previous minimum.
 *
 * @returns An operator function that accepts an `Observable<Observable<number>>`
 *   and returns a flat `Observable<number>` representing the earliest pending
 *   trigger timestamp.
 */
export function nextTrigger() {
  return (observable: Observable<Observable<number>>) => {
    const maxAgeValues = new Map<Observable<number>, number>();
    const maxAgeSubscriptions = new Map<Observable<number>, Subscription>();
    const refreshTimeSubject = new Subject<number>();
    let refreshTimeCurrent = Infinity;
    const getRefreshTime = () => refreshTimeCurrent;
    const setRefreshTime = (v: number) => {
      refreshTimeCurrent = v;
      refreshTimeSubject.next(v);
    };
    const refreshTime = new Observable<number>((subscriber) => {
      subscriber.next(refreshTimeCurrent === Infinity ? Infinity : Math.min(refreshTimeCurrent, Date.now()));
      return refreshTimeSubject.subscribe(subscriber);
    });
    observable.subscribe({
      next: (observer) => {
        maxAgeSubscriptions.set(
          observer,
          observer.subscribe({
            next: (newValue) => {
              const oldValue = maxAgeValues.get(observer);
              maxAgeValues.set(observer, newValue);
              const currentValue = getRefreshTime();
              if (newValue < currentValue) {
                setRefreshTime(newValue);
              } else if (oldValue === currentValue || currentValue === Infinity) {
                setRefreshTime(Math.min(...maxAgeValues.values()));
              }
            },
            complete() {
              const oldValue = maxAgeValues.get(observer);
              maxAgeValues.delete(observer);
              const unsubscribe = maxAgeSubscriptions.get(observer);
              unsubscribe?.unsubscribe();
              maxAgeSubscriptions.delete(observer);

              const currentValue = getRefreshTime();
              if (oldValue === currentValue) {
                setRefreshTime(Math.min(...maxAgeValues.values()));
              }
            },
          }),
        );
      },
    });
    return refreshTime;
  };
}

export const nowOrEarlier = of(0);

/**
 * RxJS operator that schedules automatic refresh triggers whenever the source emits.
 *
 * Each time the source observable emits a value, the previous refresh schedule is
 * cancelled and a new one is started. The `time` observable is subscribed to and
 * each of its emitted relative offsets (in milliseconds) is converted to an absolute
 * timestamp (`Date.now() + offset`) and forwarded to `triggerRefresh`. This allows
 * callers to drive periodic or delayed re-fetches based on the age of the last
 * received data.
 *
 * When the source errors or completes, the active refresh subscription is torn down
 * and `triggerRefresh` is completed.
 *
 * @param triggerRefresh - Observer that receives absolute timestamps (ms since epoch)
 *   at which a refresh should be triggered.
 * @param time - Observable of relative time offsets (ms from the moment the source
 *   last emitted) that determine when refresh triggers are scheduled.
 * @returns An operator function that wraps a source `Observable<T>` and returns a
 *   new `Observable<T>` with the same values but with side-effect refresh scheduling.
 */
export function autoRefresh<T>(triggerRefresh: Observer<number>, time: Observable<number>) {
  return (observable: Observable<T>) =>
    new Observable<T>((subscriber) => {
      let refreshSubscription: Subscription | undefined = undefined;
      const subscription = observable.subscribe({
        next: (v) => {
          refreshSubscription?.unsubscribe();
          const now = Date.now();
          refreshSubscription = time.pipe(map((timeValue) => timeValue + now)).subscribe(triggerRefresh);
          subscriber.next(v);
        },
        error: (e) => {
          refreshSubscription?.unsubscribe();
          triggerRefresh.complete();
          subscriber.error(e);
        },
        complete: () => {
          refreshSubscription?.unsubscribe();
          subscriber.complete();
          triggerRefresh.complete();
        },
      });
      return () => {
        refreshSubscription?.unsubscribe();
        subscription.unsubscribe();
      };
    });
}

/**
 * Create an operator that takes due dates as input.
 * It will output the values from `getValues`. `getValues` is called with
 * a the latest parameter received from `parameterObservable`.
 * @param getValues
 * @param parameterObservable source of parameter values. Should be replayable.
 * @returns
 */
export function valuesOperator<T, U>(getValues: (v: U) => Promise<T>, parameterObservable: Observable<U>) {
  return pipe(
    throttleTime(0),
    switchMap((dueDate) => timer(new Date(dueDate))),
    switchMap((_) => parameterObservable),
    switchMap((p) => from(getValues(p))),
  ) as (x: Observable<number>) => Observable<T>;
}
