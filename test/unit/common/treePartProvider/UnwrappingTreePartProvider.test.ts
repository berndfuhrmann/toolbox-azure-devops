import { BehaviorSubject, of, Subject } from "rxjs";
import { beforeEach, describe, expect, test, vi } from "vitest";
import type { MapChangeSet } from "../../../../src/common/collections/observableMap";
import type { AbstractTreeItem } from "../../../../src/common/treeItems/AbstractTreeItem";
import { UnwrappingTreePartProvider } from "../../../../src/common/treePartProvider/UnwrappingTreePartProvider";
import type { ItemInformation, TreePartProvider } from "../../../../src/common/treePartProvider/TreePartProvider";
import { createTestMapChangeSetListener, createTestObserver, error } from "../../helper/observables";
import { setTimeout } from "node:timers/promises";
import { TestTreeItem } from "../../helper/TestTreeItem";

interface TestItem {
  id: string;
  name: string;
}

interface TestChildItem {
  childId: string;
  childName: string;
}

const testItem1: TestItem = { id: "1", name: "test1" };
const testItem2: TestItem = { id: "2", name: "test2" };
const testItem3: TestItem = { id: "3", name: "test3" };
const testItem4: TestItem = { id: "4", name: "test4" };
const testItem5: TestItem = { id: "5", name: "test5" };

const testChildItem1: TestChildItem = { childId: "child1", childName: "Child 1" };
const testChildItem2: TestChildItem = { childId: "child2", childName: "Child 2" };

const createWrappedKey = (key: string) => JSON.stringify([null, key]);

const createUnwrappedKey = (parentKey: string, childKey: string) => JSON.stringify([parentKey, childKey]);

interface TestContext {
  refreshObservables: Record<string, Subject<number>>;
}

let mockInnerProvider: TreePartProvider<TestItem, TestContext>;
let mockUnwrapPredicate: any;
let mockGetTreePartProvider: any;
let mockChildProvider: TreePartProvider<TestChildItem, TestItem>;
let mockTreeItem: AbstractTreeItem<TestItem>;

beforeEach(() => {
  mockTreeItem = {
    id: "test-item-id",
  } as AbstractTreeItem<TestItem>;

  mockInnerProvider = {
    getItems: vi.fn(),
    updateTreeItem: vi.fn().mockReturnValue({
      treeItem: new TestTreeItem(),
      updated: false,
    }),
  } as unknown as TreePartProvider<TestItem, TestContext>;

  mockChildProvider = {
    getItems: vi.fn(),
    updateTreeItem: vi.fn().mockReturnValue({
      treeItem: new TestTreeItem(),
      updated: false,
    }),
  } as unknown as TreePartProvider<TestChildItem, TestItem>;

  mockUnwrapPredicate = vi.fn();
  mockGetTreePartProvider = vi.fn();
});

test("constructor", () => {
  const provider = new UnwrappingTreePartProvider(mockInnerProvider, mockUnwrapPredicate, mockGetTreePartProvider);
  expect(provider).toBeDefined();
});

describe("getItems", () => {
  describe("no unwrap", () => {
    test("no updates", async () => {
      const provider = new UnwrappingTreePartProvider(mockInnerProvider, mockUnwrapPredicate, mockGetTreePartProvider);

      const changeSet: MapChangeSet<string, TestItem> = {
        added: new Map<string, TestItem>([]),
        removed: new Map<string, TestItem>([]),
      };

      vi.mocked(mockInnerProvider.getItems).mockReturnValue(of({ changes: changeSet }));
      vi.mocked(mockUnwrapPredicate).mockReturnValue(of(false));

      const context = of({ refreshObservables: {} });
      const observer = createTestMapChangeSetListener(provider.getItems(context));

      await setTimeout(0);

      expect(observer.getItems()).toEqual(new Map([]));
      observer.errored();
    });

    test("add one item", async () => {
      const provider = new UnwrappingTreePartProvider(mockInnerProvider, mockUnwrapPredicate, mockGetTreePartProvider);

      const changeSet: MapChangeSet<string, TestItem> = {
        added: new Map<string, TestItem>([["key1", testItem1]]),
        removed: new Map<string, TestItem>([]),
      };

      vi.mocked(mockInnerProvider.getItems).mockReturnValue(of({ changes: changeSet }));
      vi.mocked(mockInnerProvider.updateTreeItem).mockImplementation(
        (item: TestItem, key: string, oldTreeItem: AbstractTreeItem<any> | undefined) => {
          let treeItem = oldTreeItem ?? new TestTreeItem();
          const updated = treeItem.updateFrom(item);
          return { treeItem, updated };
        },
      );
      vi.mocked(mockUnwrapPredicate).mockReturnValue(of(false));

      const context = of({ refreshObservables: {} });
      const observer = createTestMapChangeSetListener(provider.getItems(context));

      await setTimeout(0);

      expect(observer.getItems()).toEqual(new Map([[createWrappedKey("key1"), testItem1]]));
      observer.errored();
    });

    test("add one and remove it item", async () => {
      const provider = new UnwrappingTreePartProvider(mockInnerProvider, mockUnwrapPredicate, mockGetTreePartProvider);

      const changeSet1: MapChangeSet<string, TestItem> = {
        added: new Map<string, TestItem>([
          ["key1", testItem1],
          ["key2", testItem2],
          ["key3", testItem3],
        ]),
        removed: new Map<string, TestItem>([]),
      };

      const changeSet2: MapChangeSet<string, TestItem> = {
        added: new Map<string, TestItem>([
          ["key3", testItem4],
          ["key5", testItem5],
        ]),
        removed: new Map<string, TestItem>([
          ["key2", testItem2],
          ["key3", testItem3],
        ]),
      };

      vi.mocked(mockInnerProvider.getItems).mockReturnValue(of({ changes: changeSet1 }, { changes: changeSet2 }));
      vi.mocked(mockUnwrapPredicate).mockReturnValue(of(false));

      const context = of({ refreshObservables: {} });
      const observer = createTestMapChangeSetListener(provider.getItems(context));

      await setTimeout(0);

      expect(observer.getItems()).toEqual(
        new Map([
          [createWrappedKey("key1"), testItem1],
          [createWrappedKey("key3"), testItem4],
          [createWrappedKey("key5"), testItem5],
        ]),
      );
      observer.errored();
    });

    test("state transition from unwrapped to wrapped emits remove and add changes", async () => {
      const provider = new UnwrappingTreePartProvider(mockInnerProvider, mockUnwrapPredicate, mockGetTreePartProvider);

      const parentChangeSets = new Subject<ItemInformation<TestItem>>();
      const unwrapStates = new Subject<boolean>();
      const childItems = new Subject<ItemInformation<TestChildItem>>();

      vi.mocked(mockInnerProvider.getItems).mockReturnValue(parentChangeSets);
      vi.mocked(mockChildProvider.getItems).mockReturnValue(childItems);
      vi.mocked(mockGetTreePartProvider).mockReturnValue(mockChildProvider);
      vi.mocked(mockUnwrapPredicate).mockImplementation(() => unwrapStates);

      const context = of({ refreshObservables: {} });
      const observer = createTestMapChangeSetListener(provider.getItems(context));

      parentChangeSets.next({
        changes: {
          added: new Map<string, TestItem>([["key1", testItem1]]),
          removed: new Map<string, TestItem>([]),
        },
      });
      unwrapStates.next(true);
      childItems.next({
        changes: {
          added: new Map<string, TestChildItem>([["child1", testChildItem1]]),
          removed: new Map<string, TestChildItem>([]),
        },
      });

      await setTimeout(0);

      expect(observer.getItems()).toEqual(new Map([[createUnwrappedKey("key1", "child1"), testChildItem1]]));

      unwrapStates.next(false);

      await setTimeout(0);

      expect(observer.getItems()).toEqual(new Map([[createWrappedKey("key1"), testItem1]]));
      observer.errored();
    });
  });

  describe("unwrap", () => {
    test("no updates", async () => {
      const provider = new UnwrappingTreePartProvider(mockInnerProvider, mockUnwrapPredicate, mockGetTreePartProvider);

      const changeSet: MapChangeSet<string, TestItem> = {
        added: new Map<string, TestItem>([]),
        removed: new Map<string, TestItem>([]),
      };

      vi.mocked(mockInnerProvider.getItems).mockReturnValue(of({ changes: changeSet }));
      vi.mocked(mockUnwrapPredicate).mockReturnValue(of(true));

      const context = of({ refreshObservables: {} });
      const observer = createTestMapChangeSetListener(provider.getItems(context));

      await setTimeout(0);

      expect(observer.getItems()).toEqual(new Map([]));
      observer.errored();
    });

    test("add one item with child provider", async () => {
      const provider = new UnwrappingTreePartProvider(mockInnerProvider, mockUnwrapPredicate, mockGetTreePartProvider);

      const parentChangeSet: MapChangeSet<string, TestItem> = {
        added: new Map<string, TestItem>([["key1", testItem1]]),
        removed: new Map<string, TestItem>([]),
      };

      const childChanges = new Subject<ItemInformation<TestChildItem>>();

      vi.mocked(mockInnerProvider.getItems).mockReturnValue(of({ changes: parentChangeSet }));
      vi.mocked(mockInnerProvider.updateTreeItem).mockImplementation(
        (item: TestItem, key: string, oldTreeItem: AbstractTreeItem<any> | undefined) => {
          const treeItem = oldTreeItem ?? new TestTreeItem();
          treeItem.updateFrom(item as any);
          return { treeItem, updated: true };
        },
      );
      vi.mocked(mockChildProvider.getItems).mockReturnValue(childChanges);
      vi.mocked(mockGetTreePartProvider).mockReturnValue(mockChildProvider);
      vi.mocked(mockUnwrapPredicate).mockReturnValue(of(true));

      const context = of({ refreshObservables: {} });
      const observer = createTestMapChangeSetListener(provider.getItems(context));

      childChanges.next({
        changes: {
          added: new Map<string, TestChildItem>([["child1", testChildItem1]]),
          removed: new Map<string, TestChildItem>([]),
        },
      });

      await setTimeout(0);

      expect(observer.getItems()).toEqual(new Map([[createUnwrappedKey("key1", "child1"), testChildItem1]]));
      expect(mockGetTreePartProvider).toHaveBeenCalledWith(expect.objectContaining({ data: testItem1 }));
      observer.errored();
    });

    test("add and remove child items for existing parent", async () => {
      const provider = new UnwrappingTreePartProvider(mockInnerProvider, mockUnwrapPredicate, mockGetTreePartProvider);

      const parentChangeSet: MapChangeSet<string, TestItem> = {
        added: new Map<string, TestItem>([["key1", testItem1]]),
        removed: new Map<string, TestItem>([]),
      };

      const childChanges = new Subject<ItemInformation<TestChildItem>>();

      vi.mocked(mockInnerProvider.getItems).mockReturnValue(of({ changes: parentChangeSet }));
      vi.mocked(mockChildProvider.getItems).mockReturnValue(childChanges);
      vi.mocked(mockGetTreePartProvider).mockReturnValue(mockChildProvider);
      vi.mocked(mockUnwrapPredicate).mockReturnValue(of(true));

      const context = of({ refreshObservables: {} });
      const observer = createTestMapChangeSetListener(provider.getItems(context));

      childChanges.next({
        changes: {
          added: new Map<string, TestChildItem>([
            ["child1", testChildItem1],
            ["child2", testChildItem2],
          ]),
          removed: new Map<string, TestChildItem>([]),
        },
      });

      await setTimeout(0);

      expect(observer.getItems()).toEqual(
        new Map([
          [createUnwrappedKey("key1", "child1"), testChildItem1],
          [createUnwrappedKey("key1", "child2"), testChildItem2],
        ]),
      );

      childChanges.next({
        changes: {
          added: new Map<string, TestChildItem>([]),
          removed: new Map<string, TestChildItem>([["child1", testChildItem1]]),
        },
      });

      await setTimeout(0);

      expect(observer.getItems()).toEqual(new Map([[createUnwrappedKey("key1", "child2"), testChildItem2]]));

      observer.errored();
    });

    test("state transition from wrapped to unwrapped", async () => {
      const provider = new UnwrappingTreePartProvider(mockInnerProvider, mockUnwrapPredicate, mockGetTreePartProvider);

      const parentChangeSets = new Subject<ItemInformation<TestItem>>();
      const unwrapStates = new Subject<boolean>();
      const childItems = new Subject<ItemInformation<TestChildItem>>();

      vi.mocked(mockInnerProvider.getItems).mockReturnValue(parentChangeSets);
      vi.mocked(mockChildProvider.getItems).mockReturnValue(childItems);
      vi.mocked(mockGetTreePartProvider).mockReturnValue(mockChildProvider);
      vi.mocked(mockUnwrapPredicate).mockImplementation(() => unwrapStates);

      const context = of({ refreshObservables: {} });
      const observer = createTestMapChangeSetListener(provider.getItems(context));

      parentChangeSets.next({
        changes: {
          added: new Map<string, TestItem>([["key1", testItem1]]),
          removed: new Map<string, TestItem>([]),
        },
      });
      unwrapStates.next(false);

      await setTimeout(0);

      expect(observer.getItems()).toEqual(new Map([[createWrappedKey("key1"), testItem1]]));

      unwrapStates.next(true);
      childItems.next({
        changes: {
          added: new Map<string, TestChildItem>([["child1", testChildItem1]]),
          removed: new Map<string, TestChildItem>([]),
        },
      });

      await setTimeout(0);

      expect(observer.getItems()).toEqual(new Map([[createUnwrappedKey("key1", "child1"), testChildItem1]]));

      observer.errored();
    });

    test("repeated unwrap evaluation with the same change set does not duplicate items", async () => {
      const provider = new UnwrappingTreePartProvider(mockInnerProvider, mockUnwrapPredicate, mockGetTreePartProvider);

      const parentChangeSets = new Subject<ItemInformation<TestItem>>();
      const unwrapStates = new Subject<boolean>();
      const childItems = new Subject<ItemInformation<TestChildItem>>();

      vi.mocked(mockInnerProvider.getItems).mockReturnValue(parentChangeSets);
      vi.mocked(mockChildProvider.getItems).mockReturnValue(childItems);
      vi.mocked(mockGetTreePartProvider).mockReturnValue(mockChildProvider);
      vi.mocked(mockUnwrapPredicate).mockImplementation(() => unwrapStates);

      const context = of({ refreshObservables: {} });
      const observer = createTestMapChangeSetListener(provider.getItems(context));

      const parentChangeSet: MapChangeSet<string, TestItem> = {
        added: new Map<string, TestItem>([["key1", testItem1]]),
        removed: new Map<string, TestItem>([]),
      };

      parentChangeSets.next({ changes: parentChangeSet });
      unwrapStates.next(true);
      childItems.next({
        changes: {
          added: new Map<string, TestChildItem>([["child1", testChildItem1]]),
          removed: new Map<string, TestChildItem>([]),
        },
      });

      await setTimeout(0);

      unwrapStates.next(true);

      await setTimeout(0);

      expect(observer.getItems()).toEqual(new Map([[createUnwrappedKey("key1", "child1"), testChildItem1]]));
      observer.errored();
    });

    test("retains existing child output when a parent item changes while staying unwrapped", async () => {
      const provider = new UnwrappingTreePartProvider(mockInnerProvider, mockUnwrapPredicate, mockGetTreePartProvider);

      const parentChangeSets = new Subject<ItemInformation<TestItem>>();
      const childItems1 = new Subject<ItemInformation<TestChildItem>>();
      const childItems2 = new Subject<ItemInformation<TestChildItem>>();

      vi.mocked(mockInnerProvider.getItems).mockReturnValue(parentChangeSets);
      vi.mocked(mockInnerProvider.updateTreeItem).mockImplementation(
        (item: TestItem, _key: string, oldTreeItem: AbstractTreeItem<any> | undefined) => {
          const treeItem = oldTreeItem ?? new TestTreeItem();
          treeItem.updateFrom(item as any);
          return { treeItem, updated: true };
        },
      );
      vi.mocked(mockChildProvider.getItems).mockReturnValueOnce(childItems1).mockReturnValueOnce(childItems2);
      vi.mocked(mockGetTreePartProvider).mockReturnValue(mockChildProvider);
      vi.mocked(mockUnwrapPredicate).mockReturnValue(of(true));

      const context = of({ refreshObservables: {} });
      const observer = createTestMapChangeSetListener(provider.getItems(context));

      parentChangeSets.next({
        changes: {
          added: new Map<string, TestItem>([["key1", testItem1]]),
          removed: new Map<string, TestItem>([]),
        },
      });

      childItems1.next({
        changes: {
          added: new Map<string, TestChildItem>([["child1", testChildItem1]]),
          removed: new Map<string, TestChildItem>([]),
        },
      });

      await setTimeout(0);

      expect(observer.getItems()).toEqual(new Map([[createUnwrappedKey("key1", "child1"), testChildItem1]]));

      parentChangeSets.next({
        changes: {
          added: new Map<string, TestItem>([["key1", testItem4]]),
          removed: new Map<string, TestItem>([["key1", testItem1]]),
        },
      });

      childItems2.next({
        changes: {
          added: new Map<string, TestChildItem>([["child2", testChildItem2]]),
          removed: new Map<string, TestChildItem>([]),
        },
      });

      await setTimeout(0);

      expect(observer.getItems()).toEqual(
        new Map([
          [createUnwrappedKey("key1", "child1"), testChildItem1],
          [createUnwrappedKey("key1", "child2"), testChildItem2],
        ]),
      );
      observer.errored();
    });

    test("errors when no child provider can be resolved", async () => {
      const provider = new UnwrappingTreePartProvider(mockInnerProvider, mockUnwrapPredicate, mockGetTreePartProvider);

      const parentChangeSet: MapChangeSet<string, TestItem> = {
        added: new Map<string, TestItem>([["key1", testItem1]]),
        removed: new Map<string, TestItem>([]),
      };

      vi.mocked(mockInnerProvider.getItems).mockReturnValue(of({ changes: parentChangeSet }));
      vi.mocked(mockInnerProvider.updateTreeItem).mockImplementation(
        (item: TestItem, _key: string, oldTreeItem: AbstractTreeItem<any> | undefined) => {
          const treeItem = oldTreeItem ?? new TestTreeItem();
          treeItem.updateFrom(item as any);
          return { treeItem, updated: true };
        },
      );
      vi.mocked(mockGetTreePartProvider).mockReturnValue(undefined);
      vi.mocked(mockUnwrapPredicate).mockReturnValue(of(true));

      const context = of({ refreshObservables: {} });
      const observer = createTestObserver();

      provider.getItems(context).subscribe(observer);

      await setTimeout(0);

      expect(observer.combined).toHaveBeenCalledWith(
        error,
        expect.objectContaining({ message: "treePartProvider must not be undefined" }),
      );
    });
  });
});

describe("updateTreeItem", () => {
  test("handles parent items", async () => {
    const provider = new UnwrappingTreePartProvider(mockInnerProvider, mockUnwrapPredicate, mockGetTreePartProvider);

    const changeSet: MapChangeSet<string, TestItem> = {
      added: new Map([["key1", testItem1]]),
      removed: new Map(),
    };
    vi.mocked(mockInnerProvider.getItems).mockReturnValue(of({ changes: changeSet }));
    vi.mocked(mockUnwrapPredicate).mockReturnValue(of(false));

    const observer = createTestMapChangeSetListener(provider.getItems(of({ refreshObservables: {} })));
    await setTimeout(0);

    const emittedItem = observer.getItems().get(createWrappedKey("key1"))!;

    const mockTreeItemResult = new TestTreeItem();
    vi.mocked(mockInnerProvider.updateTreeItem).mockReturnValue({
      treeItem: mockTreeItemResult,
      updated: false,
    });

    const result = provider.updateTreeItem(emittedItem, createWrappedKey("key1"), undefined);

    expect(mockInnerProvider.updateTreeItem).toHaveBeenCalledWith(testItem1, "key1", undefined);
    expect(result.treeItem).toBe(mockTreeItemResult);
  });

  test("handles child items with child provider", async () => {
    const provider = new UnwrappingTreePartProvider(mockInnerProvider, mockUnwrapPredicate, mockGetTreePartProvider);

    const parentChangeSet: MapChangeSet<string, TestItem> = {
      added: new Map([["key1", testItem1]]),
      removed: new Map(),
    };
    const childChanges = new Subject<ItemInformation<TestChildItem>>();

    vi.mocked(mockInnerProvider.getItems).mockReturnValue(of({ changes: parentChangeSet }));
    vi.mocked(mockInnerProvider.updateTreeItem).mockImplementation(
      (item: TestItem, _key: string, oldTreeItem: AbstractTreeItem<any> | undefined) => {
        const treeItem = oldTreeItem ?? new TestTreeItem();
        treeItem.updateFrom(item as any);
        return { treeItem, updated: true };
      },
    );
    vi.mocked(mockChildProvider.getItems).mockReturnValue(childChanges);
    vi.mocked(mockGetTreePartProvider).mockReturnValue(mockChildProvider);
    vi.mocked(mockUnwrapPredicate).mockReturnValue(of(true));

    const observer = createTestMapChangeSetListener(provider.getItems(of({ refreshObservables: {} })));
    childChanges.next({
      changes: {
        added: new Map([["child1", testChildItem1]]),
        removed: new Map(),
      },
    });
    await setTimeout(0);

    const emittedItem = observer.getItems().get(createUnwrappedKey("key1", "child1"))!;

    const mockTreeItemResult = new TestTreeItem();
    vi.mocked(mockChildProvider.updateTreeItem).mockReturnValue({
      treeItem: mockTreeItemResult,
      updated: false,
    });

    const result = provider.updateTreeItem(emittedItem, createUnwrappedKey("key1", "child1"), undefined);

    expect(mockChildProvider.updateTreeItem).toHaveBeenCalledWith(testChildItem1, "child1", undefined);
    expect(result.treeItem).toBe(mockTreeItemResult);
  });

  test("removes parent part from composite child key", async () => {
    const provider = new UnwrappingTreePartProvider(mockInnerProvider, mockUnwrapPredicate, mockGetTreePartProvider);

    const parentChangeSet: MapChangeSet<string, TestItem> = {
      added: new Map([["key1", testItem1]]),
      removed: new Map(),
    };
    const childChanges = new Subject<ItemInformation<TestChildItem>>();

    vi.mocked(mockInnerProvider.getItems).mockReturnValue(of({ changes: parentChangeSet }));
    vi.mocked(mockInnerProvider.updateTreeItem).mockImplementation(
      (item: TestItem, _key: string, oldTreeItem: AbstractTreeItem<any> | undefined) => {
        const treeItem = oldTreeItem ?? new TestTreeItem();
        treeItem.updateFrom(item as any);
        return { treeItem, updated: true };
      },
    );
    vi.mocked(mockChildProvider.getItems).mockReturnValue(childChanges);
    vi.mocked(mockGetTreePartProvider).mockReturnValue(mockChildProvider);
    vi.mocked(mockUnwrapPredicate).mockReturnValue(of(true));

    const observer = createTestMapChangeSetListener(provider.getItems(of({ refreshObservables: {} })));
    childChanges.next({
      changes: {
        added: new Map([["child1", testChildItem1]]),
        removed: new Map(),
      },
    });
    await setTimeout(0);

    const emittedItem = observer.getItems().get(createUnwrappedKey("key1", "child1"))!;
    provider.updateTreeItem(emittedItem, createUnwrappedKey("key1", "child1"), undefined);

    expect(mockChildProvider.updateTreeItem).toHaveBeenCalledWith(testChildItem1, "child1", undefined);
  });
});
