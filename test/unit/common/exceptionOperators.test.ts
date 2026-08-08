import { mapX, switchMapX, combineLatestX } from "../../../src/common/exceptionOperators";
import { createException, Exception } from "../../../src/common/Exception";
import { describe, it, expect } from "vitest";
import * as rxjs from "rxjs";

const { lastValueFrom } = rxjs;

describe("mapX", () => {
  it("should map non-Exception values", async () => {
    const result = await lastValueFrom(rxjs.of(1).pipe(mapX((v) => v + 1)));
    expect(result).toBe(2);
  });

  it("should pass Exception values through", async () => {
    const ex = createException(new Error());
    const result = await lastValueFrom(rxjs.of(ex).pipe(mapX((v: number) => v + 1)));
    expect(result).toBe(ex);
  });
});

describe("switchMapX", () => {
  it("should switchMap non-Exception values", async () => {
    const result = await lastValueFrom(rxjs.of(2).pipe(switchMapX((v) => rxjs.of(v * 2))));
    expect(result).toBe(4);
  });

  it("should pass Exception values through as observable", async () => {
    const ex = createException(new Error());
    const result = await lastValueFrom(rxjs.of(ex).pipe(switchMapX((v: number) => rxjs.of(v * 2))));
    expect(result).toBe(ex);
  });
});

describe("combineLatestX", () => {
  it("should combine non-Exception values", async () => {
    const result = await lastValueFrom(combineLatestX([rxjs.of(1), rxjs.of(2)]));
    expect(result).toEqual([1, 2]);
  });

  it("should return Exception if any source emits Exception", async () => {
    const ex = createException(new Error());
    const result = await lastValueFrom(combineLatestX([rxjs.of(1), rxjs.of(ex)]));
    expect(result).toBe(ex);
  });
});
