import { Constructor } from "./constructor";

export function sortByNumber<T>(getNumber: (element: T) => number) {
  return (a: T, b: T) => {
    const string1 = getNumber(a);
    const string2 = getNumber(b);
    return string1 > string2 ? 1 : string1 < string2 ? -1 : 0;
  };
}

export function sortByString<T>(getString: (element: T) => string) {
  return (a: T, b: T) => {
    const string1 = getString(a);
    const string2 = getString(b);
    return string1 > string2 ? 1 : string1 < string2 ? -1 : 0;
  };
}

export function sortByDate<T>(getDate: (element: T) => Date) {
  return (a: T, b: T) => {
    const date1 = getDate(a);
    const date2 = getDate(b);
    return date1 > date2 ? 1 : date1 < date2 ? -1 : 0;
  };
}

export function sortByBoolean<T>(getBoolean: (element: T) => boolean) {
  return (a: T, b: T) => {
    const date1 = getBoolean(a);
    const date2 = getBoolean(b);
    return date1 > date2 ? 1 : date1 < date2 ? -1 : 0;
  };
}

type ConstructorSorter<T> = [Constructor<T>, undefined | ((a: T, b: T) => number)];
export function sortByType<T extends ConstructorSorter<any>[]>(data: T) {
  return (a: object, b: object) => {
    for (const [k, v] of data) {
      const aInstanceOf = a instanceof k;
      const bInstanceOf = b instanceof k;
      if (aInstanceOf && bInstanceOf) {
        if (v) {
          return v(a, b);
        } else {
          return 0;
        }
      }
      if (aInstanceOf) {
        return -1;
      }
      if (bInstanceOf) {
        return 1;
      }
    }
    return 0;
  };
}

export function sorter<T>(...sorters: ((a: T, b: T) => number)[]) {
  return (a: T, b: T) => {
    for (const s of sorters) {
      const result = s(a, b);
      if (result !== 0) {
        return result;
      }
    }
    return 0;
  };
}
