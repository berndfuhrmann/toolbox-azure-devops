export class PromiseController<T> {
  private resolvePromise: ((value: T) => void) | null = null;
  private rejectPromise: ((error: Error) => void) | null = null;
  private promise: Promise<T>;

  constructor() {
    this.promise = new Promise<T>((resolve, reject) => {
      this.resolvePromise = resolve;
      this.rejectPromise = reject;
    });
  }

  getPromise(): Promise<T> {
    return this.promise;
  }

  resolve(value: T): void {
    if (this.resolvePromise) {
      this.resolvePromise(value);
    }
  }

  reject(error: Error): void {
    if (this.rejectPromise) {
      this.rejectPromise(error);
    }
  }
}
