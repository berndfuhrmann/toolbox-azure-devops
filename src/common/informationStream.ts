import { Observable, shareReplay, Subject } from "rxjs";
import { Exception, isException } from "./Exception";
import { nextTrigger, valuesOperator } from "./operators";

export interface InformationStream<T> {
  values: Observable<T | Exception>;
  refreshTriggers: Subject<Observable<number>>;
}

/**
 * Wrap a callback, so that an incoming Exception is passed on instead of calling the callback with it.
 * It does not convert errors of the callback: the callback is expected to return them as Exception, not reject.
 * @param getValues callback that is only called with valid parameters
 */
export function exceptionGuard<T, U>(getValues: (v: U) => Promise<T | Exception>) {
  return async (value: U | Exception) => {
    if (isException(value)) {
      // e.g. the API could not be created: there is nothing to call the callback with
      return value;
    } else {
      return await getValues(value);
    }
  };
}
// TODO: createInformationStream returns refreshTriggers.
// If that Observable get's the same observable multiple times, does it subscribe to it only once?
/**
 * Create an auto-updating stream of values, based on an async function and a stream of parameters to supply to that function.
 * @param getValues callback to retrieve values. It must return errors as Exception, a rejection ends the stream.
 * @param parameterObservable observable that provides parameters for callback. An Exception is passed on without calling the callback.
 * @returns
 */
export function createInformationStream<T, U>(
  getValues: (v: U) => Promise<T | Exception>,
  parameterObservable: Observable<U | Exception>,
): InformationStream<T> {
  const refreshTriggers = new Subject<Observable<number>>();

  const values = refreshTriggers.pipe(
    nextTrigger(),
    valuesOperator<T | Exception, U | Exception>(exceptionGuard(getValues), parameterObservable),
    shareReplay(1),
  );

  return {
    values,
    refreshTriggers,
  };
}
