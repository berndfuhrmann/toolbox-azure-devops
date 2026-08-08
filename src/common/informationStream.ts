import { Observable, shareReplay, Subject } from "rxjs";
import { Exception, isException } from "./Exception";
import { nextTrigger, valuesOperator } from "./operators";

export interface InformationStream<T> {
  values: Observable<T | Exception>;
  refreshTriggers: Subject<Observable<number>>;
}

export function exceptionGuard<T, U>(getValues: (v: U) => Promise<T>) {
  return async (value: U | Exception) => {
    if (isException(value)) {
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
 * @param getValues callback to retrieve values
 * @param parameterObservable observable that provides parameters for callback
 * @returns
 */
export function createInformationStream<T, U>(
  getValues: (v: U) => Promise<T>,
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
