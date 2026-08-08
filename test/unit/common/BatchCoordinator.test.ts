import { firstValueFrom, of, ReplaySubject, Subject } from "rxjs";
import { skip, take } from "rxjs/operators";
import { expect, describe, test, vi, beforeEach } from "vitest";
import { BatchCoordinator } from "../../../src/common/BatchCoordinator";

type Params = [id: number, group: string];
type Item = { id: number; group: string; value: string };

function makeCoordinator(batchFetch: (ids: number[], group: string) => Promise<Item[]>, batchSize = 30) {
  const paramObs = new ReplaySubject<unknown>(1);
  paramObs.next("ready");
  const coordinator = new BatchCoordinator<Params, number, [string], Item>(
    paramObs,
    (ids, [group]) => batchFetch(ids, group),
    (item) => item.id,
    ([id, group]) => ({ item: id, group: [group] }),
    batchSize,
  );
  return { coordinator, paramObs };
}

function getItem(coordinator: BatchCoordinator<Params, number, [string], Item>, id: number, group = "g") {
  return coordinator.get([id, group], of(Date.now()));
}

describe("BatchCoordinator", () => {
  describe("basic fetching", () => {
    test("fetches a single item", async () => {
      const fetch = vi.fn(async (ids: number[], group: string) => ids.map((id) => ({ id, group, value: `v${id}` })));
      const { coordinator } = makeCoordinator(fetch);

      const result = await firstValueFrom(getItem(coordinator, 1));

      expect(fetch).toHaveBeenCalledOnce();
      expect(fetch).toHaveBeenCalledWith([1], "g");
      expect(result).toEqual({ id: 1, group: "g", value: "v1" });
    });

    test("batches concurrent requests into one call", async () => {
      const fetch = vi.fn(async (ids: number[], group: string) => ids.map((id) => ({ id, group, value: `v${id}` })));
      const { coordinator } = makeCoordinator(fetch);

      const [r1, r2, r3] = await Promise.all([
        firstValueFrom(getItem(coordinator, 1)),
        firstValueFrom(getItem(coordinator, 2)),
        firstValueFrom(getItem(coordinator, 3)),
      ]);

      expect(fetch).toHaveBeenCalledOnce();
      expect(fetch).toHaveBeenCalledWith([1, 2, 3], "g");
      expect(r1).toMatchObject({ id: 1 });
      expect(r2).toMatchObject({ id: 2 });
      expect(r3).toMatchObject({ id: 3 });
    });

    test("separates items by group into separate batch calls", async () => {
      const fetch = vi.fn(async (ids: number[], group: string) => ids.map((id) => ({ id, group, value: `v${id}` })));
      const { coordinator } = makeCoordinator(fetch);

      const [rA, rB] = await Promise.all([
        firstValueFrom(coordinator.get([1, "groupA"], of(Date.now()))),
        firstValueFrom(coordinator.get([2, "groupB"], of(Date.now()))),
      ]);

      expect(fetch).toHaveBeenCalledTimes(2);
      expect(rA).toMatchObject({ id: 1, group: "groupA" });
      expect(rB).toMatchObject({ id: 2, group: "groupB" });
    });
  });

  describe("caching", () => {
    test("returns cached observable for same params", () => {
      const fetch = vi.fn(async (ids: number[]) => ids.map((id) => ({ id, group: "g", value: `v${id}` })));
      const { coordinator } = makeCoordinator(fetch);

      const obs1 = getItem(coordinator, 1);
      const obs2 = getItem(coordinator, 1);

      expect(obs1).toBe(obs2);
    });

    test("returns different observables for different params", () => {
      const fetch = vi.fn(async (ids: number[]) => ids.map((id) => ({ id, group: "g", value: `v${id}` })));
      const { coordinator } = makeCoordinator(fetch);

      const obs1 = getItem(coordinator, 1);
      const obs2 = getItem(coordinator, 2);

      expect(obs1).not.toBe(obs2);
    });

    test("does not issue duplicate in-flight requests for same params", async () => {
      const fetch = vi.fn(async (ids: number[], group: string) => ids.map((id) => ({ id, group, value: `v${id}` })));
      const { coordinator } = makeCoordinator(fetch);

      const [r1, r2] = await Promise.all([
        firstValueFrom(getItem(coordinator, 5)),
        firstValueFrom(getItem(coordinator, 5)),
      ]);

      expect(fetch).toHaveBeenCalledOnce();
      expect(r1).toEqual(r2);
    });
  });

  describe("batchSize", () => {
    test("chunks items into batches of batchSize", async () => {
      const fetch = vi.fn(async (ids: number[], group: string) => ids.map((id) => ({ id, group, value: `v${id}` })));
      const { coordinator } = makeCoordinator(fetch, 2);

      await Promise.all([
        firstValueFrom(getItem(coordinator, 1)),
        firstValueFrom(getItem(coordinator, 2)),
        firstValueFrom(getItem(coordinator, 3)),
      ]);

      expect(fetch).toHaveBeenCalledTimes(2);
      const calls = fetch.mock.calls.map(([ids]) => ids).sort((a, b) => a[0] - b[0]);
      expect(calls[0]).toEqual([1, 2]);
      expect(calls[1]).toEqual([3]);
    });
  });

  describe("error handling", () => {
    test("propagates batch fetch errors as observable errors", async () => {
      const fetch = vi.fn(async () => {
        throw new Error("API failure");
      });
      const { coordinator } = makeCoordinator(fetch);

      await expect(firstValueFrom(getItem(coordinator, 1))).rejects.toThrow("API failure");
    });

    test("rejects when item is missing from batch result", async () => {
      const fetch = vi.fn(async (ids: number[], group: string) =>
        ids.filter((id) => id !== 99).map((id) => ({ id, group, value: `v${id}` })),
      );
      const { coordinator } = makeCoordinator(fetch);

      await expect(firstValueFrom(getItem(coordinator, 99))).rejects.toThrow("Item 99 not found in batch result");
    });

    test("resolves other items when one item is missing", async () => {
      const fetch = vi.fn(async (ids: number[], group: string) =>
        ids.filter((id) => id !== 99).map((id) => ({ id, group, value: `v${id}` })),
      );
      const { coordinator } = makeCoordinator(fetch);

      const r1 = await firstValueFrom(getItem(coordinator, 1));
      expect(r1).toMatchObject({ id: 1 });

      const rMissingPromise = firstValueFrom(coordinator.get([99, "g"], of(Date.now())));
      await expect(rMissingPromise).rejects.toThrow("Item 99 not found in batch result");
    });
  });

  describe("refresh", () => {
    test("re-fetches when refresh trigger fires", async () => {
      const fetch = vi.fn(async (ids: number[], group: string) => ids.map((id) => ({ id, group, value: `v${id}` })));
      const { coordinator } = makeCoordinator(fetch);

      // First fetch via getItem — creates entry and triggers initial load
      await firstValueFrom(getItem(coordinator, 1));
      expect(fetch).toHaveBeenCalledTimes(1);

      // Re-trigger by calling get() again with a fresh of(Date.now()) trigger.
      // nextTrigger() sees the new timestamp and schedules a second fetch.
      // skip(1) skips the replayed cached value and waits for the second emission.
      const obs = getItem(coordinator, 1);
      await firstValueFrom(obs.pipe(skip(1)));
      expect(fetch).toHaveBeenCalledTimes(2);
    });
  });
});
