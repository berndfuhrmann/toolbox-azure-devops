import { Observable } from "rxjs";
import { DeepMap } from "deep-equality-data-structures";
import { createInformationStream, InformationStream } from "./informationStream";
import { Exception } from "./Exception";

const DefaultBatchSize = 30;

interface PendingItem<Params, ItemParams, Value> {
  params: Params;
  key: ItemParams;
  resolve: (value: Value) => void;
  reject: (error: unknown) => void;
}

/**
 * Batches individual fetch requests into group API calls.
 *
 * - `Params`      — full parameter set passed to `get()`; used as the cache and in-flight key
 * - `ItemParams`  — the per-item identifier extracted from `Params` (usually a primitive ID)
 * - `GroupParams` — the shared parameters that are constant within a single batch call;
 *                   items with identical `GroupParams` are batched together
 */
export class BatchCoordinator<Params, ItemParams, GroupParams, Result> {
  #parameterObservable: Observable<unknown>;
  #batchFetch: (keys: ItemParams[], groupParams: GroupParams) => Promise<Result[]>;
  #getKey: (result: Result) => ItemParams;
  #splitParams: (params: Params) => { item: ItemParams; group: GroupParams };
  #batchSize: number;

  #cache: DeepMap<Params, WeakRef<InformationStream<Result>>> = new DeepMap();
  #cacheFinalizationRegistry: FinalizationRegistry<Params> = new FinalizationRegistry((key) => this.#cache.delete(key));

  #pendingMap: DeepMap<GroupParams, PendingItem<Params, ItemParams, Result>[]> = new DeepMap();
  #pendingGroups: Array<{
    groupParams: GroupParams;
    items: PendingItem<Params, ItemParams, Result>[];
  }> = [];
  #inFlight: DeepMap<Params, Promise<Result>> = new DeepMap();
  #flushScheduled = false;

  constructor(
    parameterObservable: Observable<unknown>,
    batchFetch: (keys: ItemParams[], groupParams: GroupParams) => Promise<Result[]>,
    getKey: (result: Result) => ItemParams,
    splitParams: (params: Params) => { item: ItemParams; group: GroupParams },
    batchSize = DefaultBatchSize,
  ) {
    this.#parameterObservable = parameterObservable;
    this.#batchFetch = batchFetch;
    this.#getKey = getKey;
    this.#splitParams = splitParams;
    this.#batchSize = batchSize;
  }

  get(params: Params, refreshTrigger: Observable<number>): Observable<Result | Exception> {
    let entry = this.#cache.get(params)?.deref();
    if (!entry) {
      entry = createInformationStream<Result, unknown>(async (_) => this.#fetch(params), this.#parameterObservable);
      const weakRef = new WeakRef(entry);
      this.#cacheFinalizationRegistry.register(weakRef, params);
      this.#cache.set(params, weakRef);
    }
    entry.refreshTriggers.next(refreshTrigger);
    return entry.values;
  }

  #fetch(params: Params): Promise<Result> {
    const inFlightPromise = this.#inFlight.get(params);
    if (inFlightPromise) {
      return inFlightPromise;
    }
    return new Promise<Result>((resolve, reject) => {
      const { item: key, group: groupParams } = this.#splitParams(params);
      let items = this.#pendingMap.get(groupParams);
      if (!items) {
        items = [];
        this.#pendingMap.set(groupParams, items);
        this.#pendingGroups.push({ groupParams, items });
      }
      items.push({ params, key, resolve, reject });
      this.#scheduleFlush();
    });
  }

  #scheduleFlush(): void {
    if (!this.#flushScheduled) {
      this.#flushScheduled = true;
      setTimeout(() => {
        void this.#flush();
      }, 0);
    }
  }

  async #flush(): Promise<void> {
    this.#flushScheduled = false;

    // Snapshot and reset pending state synchronously before any await.
    const groups = this.#pendingGroups;
    this.#pendingGroups = [];
    this.#pendingMap = new DeepMap();

    // Phase 1 (synchronous): set up in-flight promises for all batches before
    // any await, so concurrent #fetch() calls for the same items immediately
    // join the existing promise instead of queuing a duplicate request.
    type BatchEntry = {
      groupParams: GroupParams;
      keys: ItemParams[];
      resolve: (results: Result[]) => void;
      reject: (error: unknown) => void;
    };
    const batches: BatchEntry[] = [];

    for (const { groupParams, items } of groups) {
      for (let offset = 0; offset < items.length; offset += this.#batchSize) {
        const chunk = items.slice(offset, offset + this.#batchSize);

        let batchResolve!: (results: Result[]) => void;
        let batchReject!: (error: unknown) => void;
        const batchPromise = new Promise<Result[]>((res, rej) => {
          batchResolve = res;
          batchReject = rej;
        });

        for (const item of chunk) {
          const itemPromise = batchPromise
            .then((results) => {
              const result = results.find((r) => this.#getKey(r) === item.key);
              if (!result) {
                throw new Error(`Item ${String(item.key)} not found in batch result`);
              }
              return result;
            })
            .finally(() => this.#inFlight.delete(item.params));
          this.#inFlight.set(item.params, itemPromise);
          itemPromise.then(item.resolve, item.reject);
        }

        batches.push({
          groupParams,
          keys: chunk.map((item) => item.key),
          resolve: batchResolve,
          reject: batchReject,
        });
      }
    }

    // Phase 2 (async): execute batch API calls.
    for (const batch of batches) {
      try {
        const results = await this.#batchFetch(batch.keys, batch.groupParams);
        batch.resolve(results);
      } catch (error) {
        batch.reject(error);
      }
    }
  }
}
