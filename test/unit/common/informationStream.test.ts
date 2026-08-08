import { Subject, of, throwError, timer, firstValueFrom, BehaviorSubject, ReplaySubject } from "rxjs";
import { take, toArray } from "rxjs/operators";
import { createException, Exception } from "../../../src/common/Exception";
import { createInformationStream, exceptionGuard, InformationStream } from "../../../src/common/informationStream";
import { expect, describe, test, vi, beforeEach, vitest } from "vitest";
import { setTimeout } from "timers/promises";

beforeEach(() => {
  vitest.resetAllMocks();
});

describe("exceptionGuard", () => {
  const mockLambda = vi.fn(async (value: any) => "someresult");
  const lambda = exceptionGuard(mockLambda);

  test("calls callback", async () => {
    const result = await lambda("sometest");
    expect(mockLambda).toHaveBeenCalledOnce();
    expect(mockLambda).toHaveBeenCalledWith("sometest");
    expect(result).toBe("someresult");
  });

  test("passes Exception", async () => {
    const error = new Error();
    const exception = createException(error);
    const result = await lambda(exception);
    expect(mockLambda).not.toHaveBeenCalled();
    expect(result).toBe(exception);
    expect((result as Exception).error).toBe(error);
  });
});

describe("createInformationStream", () => {
  let mockGetValues: ReturnType<typeof vi.fn<(v: string) => Promise<string>>>;
  let parameterSubject: Subject<string | Exception>;
  let informationStream: InformationStream<string>;

  beforeEach(() => {
    mockGetValues = vi.fn<(v: string) => Promise<string>>();
    parameterSubject = new ReplaySubject<string | Exception>();
    informationStream = createInformationStream(mockGetValues, parameterSubject);
  });

  test("should not call getValues without refresh trigger", async () => {
    // Subscribe to values but don't trigger refresh
    const valuePromiseResolvedSpy = vi.fn();
    const valuesPromise = firstValueFrom(informationStream.values.pipe(take(1))).then(valuePromiseResolvedSpy);

    // Wait a bit to ensure no calls are made
    await setTimeout(10);

    expect(mockGetValues).not.toHaveBeenCalled();
    expect(valuePromiseResolvedSpy).not.toHaveBeenCalled();
  });

  test("should call getValues when refresh is triggered with valid parameter", async () => {
    mockGetValues.mockResolvedValue("test result");

    const valuesPromise = firstValueFrom(informationStream.values.pipe(take(1)));

    // Trigger refresh with a timer observable
    informationStream.refreshTriggers.next(of(Date.now()));
    parameterSubject.next("test parameter");

    const result = await valuesPromise;
    expect(mockGetValues).toHaveBeenCalledOnce();
    expect(mockGetValues).toHaveBeenCalledWith("test parameter");
    expect(result).toBe("test result");
  });

  test("should handle multiple refresh triggers", async () => {
    mockGetValues.mockResolvedValue("test result");

    const valuesPromise = firstValueFrom(informationStream.values.pipe(take(2), toArray()));
    parameterSubject.next("param1");

    // Trigger first refresh
    informationStream.refreshTriggers.next(of(Date.now()));
    await setTimeout(10);

    // Trigger second refresh
    informationStream.refreshTriggers.next(of(Date.now()));
    await setTimeout(10);

    expect(mockGetValues).toHaveBeenCalledTimes(2);
    expect(mockGetValues).toHaveBeenNthCalledWith(1, "param1");
    expect(mockGetValues).toHaveBeenNthCalledWith(2, "param1");
    await expect(valuesPromise).resolves.toEqual(["test result", "test result"]);
  });

  test("should handle Exception in parameter observable", async () => {
    const error = new Error("Test error");
    const exception = createException(error);

    const valuesPromise = firstValueFrom(informationStream.values.pipe(take(1)));

    informationStream.refreshTriggers.next(of(Date.now()));
    parameterSubject.next(exception);

    const result = await valuesPromise;
    expect(mockGetValues).not.toHaveBeenCalled();
    expect(result).toBe(exception);
  });
});
