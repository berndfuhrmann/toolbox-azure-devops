export const exceptionType = Symbol("Exception");
export interface Exception {
  [exceptionType]: boolean;
  error: Error;
}

export function createException(error: Error) {
  return {
    [exceptionType]: true,
    error,
  };
}

export function isException(item: any): item is Exception {
  return item && typeof item === "object" && exceptionType in item;
}
