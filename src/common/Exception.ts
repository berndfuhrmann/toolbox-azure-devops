export const exceptionType = Symbol("Exception");
export interface Exception {
  [exceptionType]: boolean;
  error: Error;
}

export function createException(error: unknown): Exception {
  return {
    [exceptionType]: true,
    error: error instanceof Error ? error : new Error(String(error)),
  };
}

export function isException(item: any): item is Exception {
  return item && typeof item === "object" && exceptionType in item;
}
