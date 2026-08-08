import { describe, expect, test, beforeEach, vi } from "vitest";
import { of, Subject, firstValueFrom } from "rxjs";
import { createTestContainer } from "../helper/testContainer";
import { TestTreeProvider } from "../helper/TestTreeProvider";
import { AbstractTreeItem } from "../../../src/common/treeItems/AbstractTreeItem";
import { TestTreePartProvider } from "../helper/TestTreePartProvider";
import { combineChangeSetsToTreeItemUpdate } from "../../../src/common/AbstractTreeProvider";
import { MapChangeSet } from "../../../src/common/collections/observableMap";
import { ItemInformation, TreePartProvider } from "../../../src/common/treePartProvider/TreePartProvider";
import { TestItem, createTestItemWithEmptyContainer, createTestItem } from "../helper/TestItem";
import { TestTreeItem } from "../helper/TestTreeItem";
import { injectable, injectFromHierarchy } from "inversify";

class MockTreePartProvider extends TreePartProvider<TestItem, any> {
  getItems(context: any) {
    return of();
  }

  updateTreeItem(item: TestItem, key: string, oldTreeItem: AbstractTreeItem<any> | undefined) {
    return {
      treeItem: oldTreeItem ?? new TestTreeItem(item),
      updated: oldTreeItem ? false : true,
    };
  }
}

describe("combineChangeSetsToTreeItemUpdate", () => {
  let mockTreePartProvider: MockTreePartProvider;
  let updateTreeItemSpy: any;

  beforeEach(() => {
    mockTreePartProvider = new MockTreePartProvider();
    updateTreeItemSpy = vi.spyOn(mockTreePartProvider, "updateTreeItem");
  });

  test("should initialize with empty maps", async () => {
    const subject = new Subject<ItemInformation<TestItem>[]>();

    const result = subject.pipe(combineChangeSetsToTreeItemUpdate(mockTreePartProvider));

    const promise = firstValueFrom(result);
    subject.next([]);

    const state = await promise;
    subject.complete();
    expect(state.added.size).toBe(0);
    expect(state.removed.size).toBe(0);
    expect(state.updated.size).toBe(0);
    expect(state.unchanged.size).toBe(0);
  });

  test("should add new items", async () => {
    const subject = new Subject<ItemInformation<TestItem>[]>();
    const testData1: TestItem = createTestItemWithEmptyContainer("Item 1");
    const testData2: TestItem = createTestItemWithEmptyContainer("Item 2");

    const changeSet: MapChangeSet<string, TestItem> = {
      added: new Map([
        ["key1", testData1],
        ["key2", testData2],
      ]),
      removed: new Map(),
    };

    const result = subject.pipe(combineChangeSetsToTreeItemUpdate(mockTreePartProvider));

    const promise = firstValueFrom(result);
    subject.next([{ changes: changeSet }]);

    const state = await promise;
    subject.complete();
    expect(state.added.size).toBe(2);
    expect(state.removed.size).toBe(0);
    expect(state.updated.size).toBe(0);
    expect(state.unchanged.size).toBe(0);
    expect(updateTreeItemSpy).toHaveBeenCalledTimes(2);
  });

  test("should remove items", async () => {
    const subject = new Subject<ItemInformation<TestItem>[]>();
    const testData: TestItem = createTestItemWithEmptyContainer("Item 1");

    const changeSet1: MapChangeSet<string, TestItem> = {
      added: new Map([["key1", testData]]),
      removed: new Map(),
    };

    const changeSet2: MapChangeSet<string, TestItem> = {
      added: new Map(),
      removed: new Map([["key1", testData]]),
    };

    const result = subject.pipe(combineChangeSetsToTreeItemUpdate(mockTreePartProvider));

    const states: any[] = [];
    result.subscribe((state) => states.push(state));

    subject.next([{ changes: changeSet1 }]);
    subject.next([{ changes: changeSet2 }]);
    subject.complete();

    const lastState = states[states.length - 1];
    expect(lastState.added.size).toBe(0);
    expect(lastState.removed.size).toBe(1);
    expect(lastState.updated.size).toBe(0);
    expect(lastState.unchanged.size).toBe(0);
  });

  test("should handle unchanged items becoming updated", async () => {
    const subject = new Subject<ItemInformation<TestItem>[]>();
    const testData: TestItem = createTestItemWithEmptyContainer("Item 1");

    const customProvider = new MockTreePartProvider();
    vi.spyOn(customProvider, "updateTreeItem").mockImplementation((item, key, oldTreeItem) => {
      const treeItem = oldTreeItem ?? new TestTreeItem(item);
      const updated = oldTreeItem !== undefined;
      return { treeItem, updated };
    });

    const changeSet1: MapChangeSet<string, TestItem> = {
      added: new Map([["key1", testData]]),
      removed: new Map(),
    };

    const changeSet2: MapChangeSet<string, TestItem> = {
      added: new Map([["key1", testData]]),
      removed: new Map([["key1", testData]]),
    };

    const result = subject.pipe(combineChangeSetsToTreeItemUpdate(customProvider));

    const states: any[] = [];
    result.subscribe((state) => states.push(state));

    subject.next([{ changes: changeSet1 }]);
    subject.next([{ changes: changeSet2 }]);
    subject.complete();

    const lastState = states[states.length - 1];
    expect(lastState.updated.size).toBeGreaterThan(0);
  });

  test("should handle item updates with updateTreeItem returning updated=true", async () => {
    const subject = new Subject<ItemInformation<TestItem>[]>();
    const testData: TestItem = createTestItemWithEmptyContainer("Item 1");

    const customProvider = new MockTreePartProvider();
    vi.spyOn(customProvider, "updateTreeItem").mockImplementation((item, key, oldTreeItem) => ({
      treeItem: oldTreeItem ?? new TestTreeItem(item),
      updated: true,
    }));

    const changeSet1: MapChangeSet<string, TestItem> = {
      added: new Map([["key1", testData]]),
      removed: new Map(),
    };

    const changeSet2: MapChangeSet<string, TestItem> = {
      added: new Map([["key1", testData]]),
      removed: new Map([["key1", testData]]),
    };

    const result = subject.pipe(combineChangeSetsToTreeItemUpdate(customProvider));

    const states: any[] = [];
    result.subscribe((state) => states.push(state));

    subject.next([{ changes: changeSet1 }]);
    subject.next([{ changes: changeSet2 }]);
    subject.complete();

    const lastState = states[states.length - 1];
    expect(lastState.updated.size).toBe(1);
    expect(lastState.added.size).toBe(0);
    expect(lastState.removed.size).toBe(0);
  });

  test("should handle item removed then re-added", async () => {
    const subject = new Subject<ItemInformation<TestItem>[]>();
    const testData: TestItem = createTestItemWithEmptyContainer("Item 1");

    const changeSet1: MapChangeSet<string, TestItem> = {
      added: new Map([["key1", testData]]),
      removed: new Map(),
    };

    const changeSet2: MapChangeSet<string, TestItem> = {
      added: new Map(),
      removed: new Map([["key1", testData]]),
    };

    const changeSet3: MapChangeSet<string, TestItem> = {
      added: new Map([["key1", testData]]),
      removed: new Map(),
    };

    const result = subject.pipe(combineChangeSetsToTreeItemUpdate(mockTreePartProvider));

    const states: any[] = [];
    result.subscribe((state) => states.push(state));

    subject.next([{ changes: changeSet1 }]);
    subject.next([{ changes: changeSet2 }]);
    subject.next([{ changes: changeSet3 }]);
    subject.complete();

    const lastState = states[states.length - 1];
    expect(lastState.added.size).toBe(1);
    expect(lastState.removed.size).toBe(0);
    expect(lastState.updated.size).toBe(0);
    expect(lastState.unchanged.size).toBe(0);
  });

  test("should handle multiple change sets in single emission", async () => {
    const subject = new Subject<ItemInformation<TestItem>[]>();
    const testData1: TestItem = createTestItemWithEmptyContainer("Item 1");
    const testData2: TestItem = createTestItemWithEmptyContainer("Item 2");
    const testData3: TestItem = createTestItemWithEmptyContainer("Item 3");

    const changeSet1: MapChangeSet<string, TestItem> = {
      added: new Map([["key1", testData1]]),
      removed: new Map(),
    };

    const changeSet2: MapChangeSet<string, TestItem> = {
      added: new Map([["key2", testData2]]),
      removed: new Map(),
    };

    const changeSet3: MapChangeSet<string, TestItem> = {
      added: new Map([["key3", testData3]]),
      removed: new Map(),
    };

    const result = subject.pipe(combineChangeSetsToTreeItemUpdate(mockTreePartProvider));

    const promise = firstValueFrom(result);
    subject.next([{ changes: changeSet1 }, { changes: changeSet2 }, { changes: changeSet3 }]);

    const state = await promise;
    subject.complete();
    expect(state.added.size).toBe(3);
    expect(state.removed.size).toBe(0);
  });

  test("should track unchanged items", async () => {
    const subject = new Subject<ItemInformation<TestItem>[]>();
    const testData1: TestItem = createTestItemWithEmptyContainer("Item 1");
    const testData2: TestItem = createTestItemWithEmptyContainer("Item 2");

    const changeSet1: MapChangeSet<string, TestItem> = {
      added: new Map([["key1", testData1]]),
      removed: new Map(),
    };

    const changeSet2: MapChangeSet<string, TestItem> = {
      added: new Map([["key2", testData2]]),
      removed: new Map(),
    };

    const result = subject.pipe(combineChangeSetsToTreeItemUpdate(mockTreePartProvider));

    const states: any[] = [];
    result.subscribe((state) => states.push(state));

    subject.next([{ changes: changeSet1 }]);
    subject.next([{ changes: changeSet2 }]);
    subject.complete();

    expect(states[0].added.size).toBe(1);
    expect(states[0].unchanged.size).toBe(0);

    const lastState = states[states.length - 1];
    expect(lastState.added.size).toBe(1);
    expect(lastState.unchanged.size).toBe(1);
  });

  test("should call updateTreeItem with correct parameters", async () => {
    const subject = new Subject<ItemInformation<TestItem>[]>();
    const testData: TestItem = createTestItemWithEmptyContainer("Item 1");

    const changeSet: MapChangeSet<string, TestItem> = {
      added: new Map([["key1", testData]]),
      removed: new Map(),
    };

    const result = subject.pipe(combineChangeSetsToTreeItemUpdate(mockTreePartProvider));

    const promise = firstValueFrom(result);
    subject.next([{ changes: changeSet }]);

    await promise;
    subject.complete();

    expect(updateTreeItemSpy).toHaveBeenCalledWith(testData, "key1", undefined);
  });

  test("should handle complex state transitions", async () => {
    const subject = new Subject<ItemInformation<TestItem>[]>();
    const testData1: TestItem = createTestItemWithEmptyContainer("Item 1");
    const testData2: TestItem = createTestItemWithEmptyContainer("Item 2");
    const testData3: TestItem = createTestItemWithEmptyContainer("Item 3");

    const changeSet1: MapChangeSet<string, TestItem> = {
      added: new Map([
        ["key1", testData1],
        ["key2", testData2],
      ]),
      removed: new Map(),
    };

    const changeSet2: MapChangeSet<string, TestItem> = {
      added: new Map([["key3", testData3]]),
      removed: new Map([["key1", testData1]]),
    };

    const changeSet3: MapChangeSet<string, TestItem> = {
      added: new Map([["key1", testData1]]),
      removed: new Map([["key2", testData2]]),
    };

    const result = subject.pipe(combineChangeSetsToTreeItemUpdate(mockTreePartProvider));

    const states: any[] = [];
    result.subscribe((state) => states.push(state));

    subject.next([{ changes: changeSet1 }]);
    subject.next([{ changes: changeSet2 }]);
    subject.next([{ changes: changeSet3 }]);
    subject.complete();

    const lastState = states[states.length - 1];
    expect(lastState.added.size).toBeGreaterThan(0);
  });

  test("should maintain separate old and new items when tree item instance changes", async () => {
    const subject = new Subject<ItemInformation<TestItem>[]>();
    const testData: TestItem = createTestItemWithEmptyContainer("Item 1");

    const oldTreeItem = new TestTreeItem(testData);
    const newTreeItem = new TestTreeItem(testData);

    const customProvider = new MockTreePartProvider();
    let callCount = 0;
    vi.spyOn(customProvider, "updateTreeItem").mockImplementation((item, key, oldItem) => {
      callCount++;
      if (callCount === 1) {
        return { treeItem: oldTreeItem, updated: true };
      }
      return { treeItem: newTreeItem, updated: true };
    });

    const changeSet1: MapChangeSet<string, TestItem> = {
      added: new Map([["key1", testData]]),
      removed: new Map(),
    };

    const changeSet2: MapChangeSet<string, TestItem> = {
      added: new Map([["key1", testData]]),
      removed: new Map([["key1", testData]]),
    };

    const result = subject.pipe(combineChangeSetsToTreeItemUpdate(customProvider));

    const states: any[] = [];
    result.subscribe((state) => states.push(state));

    subject.next([{ changes: changeSet1 }]);
    subject.next([{ changes: changeSet2 }]);
    subject.complete();

    const lastState = states[states.length - 1];
    expect(lastState.added.get("key1")).toBe(newTreeItem);
  });

  test("should throw error on invalid state - item in multiple maps", async () => {
    const subject = new Subject<ItemInformation<TestItem>[]>();
    const testData: TestItem = createTestItemWithEmptyContainer("Item 1");

    const customProvider = new MockTreePartProvider();
    const errorSpy = vi.spyOn(customProvider, "updateTreeItem").mockImplementation(() => {
      throw new Error("intentional error for testing");
    });

    const changeSet: MapChangeSet<string, TestItem> = {
      added: new Map([["key1", testData]]),
      removed: new Map(),
    };

    const result = subject.pipe(combineChangeSetsToTreeItemUpdate(customProvider));

    let error: Error | null = null;
    result.subscribe({
      error: (err) => {
        error = err;
      },
    });

    subject.next([{ changes: changeSet }]);
    subject.complete();

    expect(errorSpy).toHaveBeenCalled();
  });

  test("should handle item in added map getting removed and re-added in same changeset", async () => {
    const subject = new Subject<ItemInformation<TestItem>[]>();
    const testData: TestItem = createTestItemWithEmptyContainer("Item 1");

    const customProvider = new MockTreePartProvider();
    vi.spyOn(customProvider, "updateTreeItem").mockImplementation((item, key, oldTreeItem) => {
      // Simulate tree item changing on update
      const newTreeItem = new TestTreeItem(item);
      return { treeItem: newTreeItem, updated: true };
    });

    const changeSet1: MapChangeSet<string, TestItem> = {
      added: new Map([["key1", testData]]),
      removed: new Map(),
    };

    const changeSet2: MapChangeSet<string, TestItem> = {
      added: new Map([["key1", testData]]),
      removed: new Map([["key1", testData]]),
    };

    const result = subject.pipe(combineChangeSetsToTreeItemUpdate(customProvider));

    const states: any[] = [];
    result.subscribe((state) => states.push(state));

    subject.next([{ changes: changeSet1 }, { changes: changeSet2 }]);
    subject.complete();

    const lastState = states[states.length - 1];
    expect(lastState.added.size).toBe(1);
    expect(lastState.removed.size).toBe(0);
    expect(lastState.updated.size).toBe(0);
  });

  test("should handle item in updated map getting removed and re-added in same changeset", async () => {
    const subject = new Subject<ItemInformation<TestItem>[]>();
    const testData: TestItem = createTestItemWithEmptyContainer("Item 1");

    const customProvider = new MockTreePartProvider();
    let callCount = 0;
    const oldTreeItem = new TestTreeItem(testData);
    const newTreeItem = new TestTreeItem(testData);

    vi.spyOn(customProvider, "updateTreeItem").mockImplementation((item, key, oldItem) => {
      callCount++;
      // First call: item added
      if (callCount === 1) {
        return { treeItem: oldTreeItem, updated: false };
      }
      // Second call: item marked as updated (removed and re-added in same changeset)
      if (callCount === 2) {
        return { treeItem: oldTreeItem, updated: true };
      }
      // Third call: item changed during re-add while in updated map
      return { treeItem: newTreeItem, updated: true };
    });

    const changeSet1: MapChangeSet<string, TestItem> = {
      added: new Map([["key1", testData]]),
      removed: new Map(),
    };

    // Move item from added to updated via remove and re-add in same changeset
    const changeSet2: MapChangeSet<string, TestItem> = {
      added: new Map([["key1", testData]]),
      removed: new Map([["key1", testData]]),
    };

    // Now item is in updated, remove and re-add it again
    const changeSet3: MapChangeSet<string, TestItem> = {
      added: new Map([["key1", testData]]),
      removed: new Map([["key1", testData]]),
    };

    const result = subject.pipe(combineChangeSetsToTreeItemUpdate(customProvider));

    const states: any[] = [];
    result.subscribe((state) => states.push(state));

    subject.next([{ changes: changeSet1 }, { changes: changeSet2 }, { changes: changeSet3 }]);
    subject.complete();

    const lastState = states[states.length - 1];
    expect(lastState.removed.size).toBe(0);
    expect(lastState.added.size).toBe(1);
    expect(lastState.added.get("key1")).toBe(newTreeItem);
  });

  test("should handle multiple items with mixed operations in paired changesets", async () => {
    const subject = new Subject<ItemInformation<TestItem>[]>();
    const testData1: TestItem = createTestItemWithEmptyContainer("Item 1");
    const testData2: TestItem = createTestItemWithEmptyContainer("Item 2");
    const testData3: TestItem = createTestItemWithEmptyContainer("Item 3");

    const changeSet1: MapChangeSet<string, TestItem> = {
      added: new Map([
        ["key1", testData1],
        ["key2", testData2],
      ]),
      removed: new Map(),
    };

    const changeSet2: MapChangeSet<string, TestItem> = {
      added: new Map([["key3", testData3]]),
      removed: new Map(),
    };

    const changeSet3: MapChangeSet<string, TestItem> = {
      added: new Map([["key1", testData1]]),
      removed: new Map([
        ["key1", testData1],
        ["key2", testData2],
      ]),
    };

    const result = subject.pipe(combineChangeSetsToTreeItemUpdate(mockTreePartProvider));

    const states: any[] = [];
    result.subscribe((state) => states.push(state));

    subject.next([{ changes: changeSet1 }, { changes: changeSet2 }, { changes: changeSet3 }]);
    subject.complete();

    const lastState = states[states.length - 1];
    expect(lastState.added.size).toBe(2);
    expect(lastState.removed.size).toBe(0);
    expect(lastState.unchanged.size).toBe(0);
  });
});

describe("AbstractTreeProvider", () => {
  describe("getChildren", () => {
    test("no content", async () => {
      const container = createTestContainer();
      container
        .bind<TestTreeProvider>("subject")
        .to(
          class extends TestTreeProvider {
            constructor() {
              super();
            }
            protected getTreePartProvider(element: AbstractTreeItem<string> | undefined) {
              return undefined;
            }
          },
        )
        .inSingletonScope();
      const subject = container.get<TestTreeProvider>("subject");

      const children = await subject.getChildren(undefined);
      expect(children).toBeUndefined();
    });

    test("simple content", async () => {
      const container = createTestContainer();
      const item1: TestItem = createTestItem(container, "test1");
      const item2: TestItem = createTestItem(container, "test2");

      @injectable()
      @injectFromHierarchy({
        extendConstructorArguments: false,
        extendProperties: true,
      })
      class MyTreeProvider extends TestTreeProvider {
        #testTreePartProvider: TestTreePartProvider;
        constructor() {
          super();
          this.#testTreePartProvider = new TestTreePartProvider();
          this.#testTreePartProvider.addItems(new Map([[undefined, [item1, item2]]]));
        }
        protected getTreePartProvider(element: AbstractTreeItem<string> | undefined) {
          if (element === undefined) {
            return this.#testTreePartProvider;
          }
          return undefined;
        }
      }

      container.bind<TestTreeProvider>("subject").to(MyTreeProvider).inSingletonScope();
      const subject = container.get<TestTreeProvider>("subject");

      const children = await subject.getChildren(undefined);
      expect(children?.map((treeItem) => treeItem.data)).toEqual([item1, item2]);
    });
  });
});
