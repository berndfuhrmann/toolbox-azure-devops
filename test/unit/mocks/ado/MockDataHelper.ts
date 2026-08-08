import { Mock } from "vitest";
import { PromiseController } from "./PromiseController";

// Generic helper function for configuring mocks with promise controllers
export function configureMock<T>(mock: Mock<() => Promise<T>>): PromiseController<T> {
  const controller = new PromiseController<T>();
  mock.mockReturnValue(controller.getPromise());
  return controller;
}

// Generic helper function for configuring mocks that can only be called once
export function configureMockOnce<T>(mock: Mock<() => Promise<T>>): PromiseController<T> {
  const controller = new PromiseController<T>();
  mock.mockReturnValueOnce(controller.getPromise());
  return controller;
}

// Utility function to simulate network errors
export function configureMockError<T>(mock: Mock<() => Promise<T>>, error: Error, controller?: PromiseController<T>) {
  if (controller) {
    mock.mockReturnValue(controller.getPromise());
  } else {
    mock.mockReturnValue(Promise.reject(error));
  }
}

// Utility functions for creating promise controllers
export function createPromiseController<T>(): PromiseController<T> {
  return new PromiseController<T>();
}

// Utility function to resolve a promise controller after a microtask
export function resolveAfterMicrotask<T>(controller: PromiseController<T>, value: T) {
  Promise.resolve().then(() => {
    controller.resolve(value);
  });
}

// Utility function to reject a promise controller after a microtask
export function rejectAfterMicrotask<T>(controller: PromiseController<T>, error: Error) {
  Promise.resolve().then(() => {
    controller.reject(error);
  });
}

// Utility function to resolve a promise controller after multiple microtasks
export function resolveAfterMicrotasks<T>(controller: PromiseController<T>, value: T, count: number = 1) {
  let remaining = count;
  const resolve = () => {
    remaining--;
    if (remaining <= 0) {
      controller.resolve(value);
    } else {
      Promise.resolve().then(resolve);
    }
  };
  Promise.resolve().then(resolve);
}

// Utility function to reject a promise controller after multiple microtasks
export function rejectAfterMicrotasks<T>(controller: PromiseController<T>, error: Error, count: number = 1) {
  let remaining = count;
  const reject = () => {
    remaining--;
    if (remaining <= 0) {
      controller.reject(error);
    } else {
      Promise.resolve().then(reject);
    }
  };
  Promise.resolve().then(reject);
}
