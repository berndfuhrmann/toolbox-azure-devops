import { combineLatest, map, Observable, ObservableInput, ObservableInputTuple, of, switchMap } from "rxjs";
import { Exception, isException } from "./Exception";

export function mapX<T, R>(project: (value: Exclude<T, Exception>, index: number) => R) {
  return map((value: Exclude<T, Exception> | Exception, index: number) => {
    if (isException(value)) {
      return value;
    } else {
      return project(value, index);
    }
  });
}

export function switchMapX<T, O extends ObservableInput<any>>(
  project: (value: Exclude<T, Exception>, index: number) => O,
) {
  return switchMap((value: Exclude<T, Exception> | Exception, index: number) => {
    if (isException(value)) {
      return of(value);
    } else {
      return project(value as Exclude<T, Exception>, index);
    }
  });
}

// Utility type to remove Exception from a union
type NonException<T> = T extends Exception ? never : T;

// Transform the tuple to remove Exception from each element
type StripExceptions<T extends readonly unknown[]> = {
  [K in keyof T]: NonException<T[K]>;
};

export function combineLatestX<A extends readonly unknown[]>(
  sources: readonly [...ObservableInputTuple<A>],
): Observable<StripExceptions<A> | Exception> {
  return combineLatest(sources).pipe(
    map((results) => {
      for (const result of results) {
        if (typeof result === "object" && isException(result)) {
          return result;
        }
      }
      return results as StripExceptions<A>;
    }),
  );
}
