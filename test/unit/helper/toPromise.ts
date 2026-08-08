// Helper type for VSCode Thenable
export interface Thenable<T> {
  then: (onfulfilled: (value: T) => any, ...args: any[]) => any;
}
// Helper to await a value if it's a Promise or Thenable
export async function toPromise<T>(value: T | Promise<T> | Thenable<T>): Promise<T> {
  if (value && typeof (value as any).then === "function") {
    return await value;
  }
  return value as T;
}
