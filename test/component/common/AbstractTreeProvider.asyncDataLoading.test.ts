import { isDeepStrictEqual } from "node:util";
import { injectable, injectFromHierarchy } from "inversify";
import { BehaviorSubject, concat, delay, map, of, Subject, take } from "rxjs";
import { AbstractTreeItem } from "../../../src/common/treeItems/AbstractTreeItem";
import { CombiningTreePartProvider } from "../../../src/common/treePartProvider/CombiningTreePartProvider";
import { fromArray } from "../../../src/common/treePartProvider/fromArray";
import { StaticTreePartProvider } from "../../../src/common/treePartProvider/StaticTreePartProvider";
import { TreePartProvider } from "../../../src/common/treePartProvider/TreePartProvider";
import { withItemObservable } from "../../../src/common/treePartProvider/withItemObservable";
import { createTestContainer } from "../../unit/helper/testContainer";
import { TestTreeProvider } from "../../unit/helper/TestTreeProvider";

// Test item that simulates a work item with async loading
interface AsyncDataItem {
  readonly id: string;
  readonly container: any;
  readonly refreshObservables: Record<string, Subject<number>>;
  data?: {
    title: string;
    hasComments: boolean;
    hasAttachments: boolean;
  };
  isEqual(other: AsyncDataItem): boolean;
}

function createAsyncDataItem(
  id: string,
  data: AsyncDataItem["data"] | undefined,
  refreshObservables: Record<string, Subject<number>>,
): AsyncDataItem {
  return {
    id,
    container: {},
    data,
    refreshObservables,
    isEqual(other) {
      return this.id === other.id && isDeepStrictEqual(this.data, other.data);
    },
  };
}

class AsyncDataTreeItem extends AbstractTreeItem<AsyncDataItem> {
  public override updateFrom(data: AsyncDataItem) {
    const labelChanged = this.updateLabel(
      data.data ? `${data.id}: ${data.data.title}` : `${data.id} (loading details)`,
    );
    return super.updateFrom(data) || labelChanged;
  }
}

class AsyncDataChildTreeItem extends AbstractTreeItem<AsyncDataItem> {
  public override updateFrom(data: AsyncDataItem) {
    const labelChanged = this.updateLabel(`Child of ${data.id}`);
    return super.updateFrom(data) || labelChanged;
  }
}

/**
 * TreePartProvider that emits items with undefined data first,
 * then loads the full data asynchronously (simulates work item loading)
 */
class AsyncLoadingTreePartProvider extends TreePartProvider<AsyncDataItem, undefined> {
  #items: AsyncDataItem[] = [];

  setItems(items: AsyncDataItem[]) {
    this.#items = items;
  }

  getItems(_context: any): any {
    const { refreshObservables, refreshObservable } = this.createRefreshObservables("test");

    return of(this.#items.map((item) => createAsyncDataItem(item.id, undefined, refreshObservables))).pipe(
      fromArray((item: AsyncDataItem) => item.id, { refreshObservables }),
      withItemObservable((inputObservable) =>
        inputObservable.pipe(
          // Simulate async data loading
          (source) =>
            concat(
              // Emit the item as-is (data undefined) first, then complete
              source.pipe(take(1)),
              // After a delay, emit the item with its full data loaded
              source.pipe(
                take(1),
                delay(10),
                map((item) => {
                  const asyncDataItem = item as AsyncDataItem;
                  return {
                    ...asyncDataItem,
                    data: this.#items.find((i) => i.id === asyncDataItem.id)?.data,
                  };
                }),
              ),
            ),
        ),
      ),
    );
  }

  override updateTreeItem(item: AsyncDataItem, _key: string, oldTreeItem: AbstractTreeItem<any> | undefined) {
    if (!oldTreeItem || !(oldTreeItem instanceof AsyncDataTreeItem)) {
      const newItem = new AsyncDataTreeItem();
      newItem.updateFrom(item);
      return { treeItem: newItem, updated: true };
    }
    const updated = oldTreeItem.updateFrom(item);
    return { treeItem: oldTreeItem, updated };
  }
}

describe("AbstractTreeProvider - Async Data Loading with StaticTreePartProvider", () => {
  test("should show conditional children after parent data loads asynchronously", async () => {
    const container = createTestContainer();

    // Create tree part providers
    const rootProvider = new AsyncLoadingTreePartProvider();
    rootProvider.setItems([
      createAsyncDataItem("item1", { title: "Item 1", hasComments: true, hasAttachments: false }, {}),
      createAsyncDataItem("item2", { title: "Item 2", hasComments: false, hasAttachments: true }, {}),
    ]);

    // StaticTreePartProvider with conditions based on data
    const childProvider = new StaticTreePartProvider<AsyncDataItem>({
      comments: {
        treeItem: AsyncDataChildTreeItem,
        condition: (itemObservable) => itemObservable.pipe(map((item) => item.data?.hasComments ?? false)),
      },
      attachments: {
        treeItem: AsyncDataChildTreeItem,
        condition: (itemObservable) => itemObservable.pipe(map((item) => item.data?.hasAttachments ?? false)),
      },
    });

    @injectable()
    @injectFromHierarchy({
      extendConstructorArguments: false,
      extendProperties: true,
    })
    class TestAsyncTreeProvider extends TestTreeProvider {
      protected getTreePartProvider(element: AbstractTreeItem<any> | undefined) {
        if (element === undefined) {
          return rootProvider;
        }
        if (element instanceof AsyncDataTreeItem) {
          return childProvider;
        }
        return undefined;
      }
    }

    container.bind<TestTreeProvider>("subject").to(TestAsyncTreeProvider).inSingletonScope();
    const subject = container.get<TestTreeProvider>("subject");

    // Step 1: Get root items (should have data=undefined initially, then load)
    const rootItems = await subject.getChildren(undefined);
    expect(rootItems).toHaveLength(2);

    // Initially items show "loading details"
    expect(rootItems![0].label).toBe("item1 (loading details)");
    expect(rootItems![1].label).toBe("item2 (loading details)");

    // Step 2: Expand item1 BEFORE data finishes loading
    const item1Children = await subject.getChildren(rootItems![0]);
    expect(item1Children).toBeDefined();
    // No children yet because data is undefined and conditions evaluate to false
    expect(item1Children).toHaveLength(0);

    // Step 3: Wait for async data to load AND for reactive chain to process
    // The delay(10) in AsyncLoadingTreePartProvider plus processing time
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Step 4: Wait a tick for the replaySubject to emit after itemInput.next()
    await new Promise((resolve) => setTimeout(resolve, 10));

    // Step 5: Get children again - now they should appear!
    const item1ChildrenAfterLoad = await subject.getChildren(rootItems![0]);
    expect(item1ChildrenAfterLoad).toHaveLength(1);
    expect(item1ChildrenAfterLoad![0].label).toContain("Child");

    // Step 6: Check item2 which should have different children
    const item2Children = await subject.getChildren(rootItems![1]);
    expect(item2Children).toHaveLength(1);
    expect(item2Children![0].label).toContain("Child");
  });

  test("should update itemInput when parent data changes", async () => {
    const container = createTestContainer();

    const itemInputUpdatesSpy = vi.fn();
    let capturedItemInput: BehaviorSubject<any> | undefined;

    const rootProvider = new AsyncLoadingTreePartProvider();
    rootProvider.setItems([
      createAsyncDataItem("item1", { title: "Item 1", hasComments: true, hasAttachments: false }, {}),
    ]);

    // Create a spy provider to capture itemInput
    class SpyChildProvider extends StaticTreePartProvider<AsyncDataItem> {
      override getItems(context: any): any {
        capturedItemInput = context;
        context.subscribe((value: any) => {
          itemInputUpdatesSpy(value);
        });
        return super.getItems(context);
      }
    }

    const childProvider = new SpyChildProvider({
      comments: {
        treeItem: AsyncDataChildTreeItem,
        condition: (itemObservable) => itemObservable.pipe(map((item) => item.data?.hasComments ?? false)),
      },
    });

    @injectable()
    @injectFromHierarchy({
      extendConstructorArguments: false,
      extendProperties: true,
    })
    class TestAsyncTreeProvider extends TestTreeProvider {
      protected getTreePartProvider(element: AbstractTreeItem<any> | undefined) {
        if (element === undefined) {
          return rootProvider;
        }
        if (element instanceof AsyncDataTreeItem) {
          return childProvider;
        }
        return undefined;
      }
    }

    container.bind<TestTreeProvider>("subject").to(TestAsyncTreeProvider).inSingletonScope();
    const subject = container.get<TestTreeProvider>("subject");

    // Get root and expand before data loads
    const rootItems = await subject.getChildren(undefined);
    await subject.getChildren(rootItems![0]);

    // Should have received initial undefined data
    expect(itemInputUpdatesSpy).toHaveBeenCalled();
    expect(itemInputUpdatesSpy.mock.calls[0][0].data).toBeUndefined();

    // Wait for async load and reactive chain processing
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Should have received updated data
    expect(itemInputUpdatesSpy.mock.calls.length).toBeGreaterThan(1);
    const lastCall = itemInputUpdatesSpy.mock.calls[itemInputUpdatesSpy.mock.calls.length - 1][0];
    expect(lastCall.data).toBeDefined();
    expect(lastCall.data?.title).toBe("Item 1");
  });

  test("should not update itemInput when parent receives child update notifications", async () => {
    const container = createTestContainer();

    const itemInputUpdatesSpy = vi.fn();

    // Simple provider that emits one item immediately
    class SimpleProvider extends TreePartProvider<AsyncDataItem, undefined> {
      getItems(_context: any): any {
        return of([
          createAsyncDataItem("item1", { title: "Item 1", hasComments: true, hasAttachments: false }, {}),
        ]).pipe(fromArray((item: AsyncDataItem) => item.id, {}));
      }

      override updateTreeItem(item: AsyncDataItem, _key: string, oldTreeItem: AbstractTreeItem<any> | undefined) {
        if (!oldTreeItem || !(oldTreeItem instanceof AsyncDataTreeItem)) {
          const newItem = new AsyncDataTreeItem();
          newItem.updateFrom(item);
          return { treeItem: newItem, updated: true };
        }
        const updated = oldTreeItem.updateFrom(item);
        return { treeItem: oldTreeItem, updated };
      }
    }

    const rootProvider = new SimpleProvider();

    // Child provider with spy
    class SpyChildProvider extends StaticTreePartProvider<AsyncDataItem> {
      override getItems(context: any): any {
        context.subscribe((value: any) => {
          itemInputUpdatesSpy(value);
        });
        return super.getItems(context);
      }
    }

    const childProvider = new SpyChildProvider({
      comments: {
        treeItem: AsyncDataChildTreeItem,
      },
    });

    @injectable()
    @injectFromHierarchy({
      extendConstructorArguments: false,
      extendProperties: true,
    })
    class TestTreeProviderWithSpy extends TestTreeProvider {
      protected getTreePartProvider(element: AbstractTreeItem<any> | undefined) {
        if (element === undefined) {
          return rootProvider;
        }
        if (element instanceof AsyncDataTreeItem) {
          return childProvider;
        }
        return undefined;
      }
    }

    container.bind<TestTreeProvider>("subject").to(TestTreeProviderWithSpy).inSingletonScope();
    const subject = container.get<TestTreeProvider>("subject");

    const rootItems = await subject.getChildren(undefined);
    await subject.getChildren(rootItems![0]);

    const initialCallCount = itemInputUpdatesSpy.mock.calls.length;

    // Get children again (simulates VSCode tree refresh)
    await subject.getChildren(rootItems![0]);

    // itemInput should NOT receive duplicate updates
    expect(itemInputUpdatesSpy.mock.calls.length).toBe(initialCallCount);
  });

  test("should handle multiple children with different conditions", async () => {
    const container = createTestContainer();

    const rootProvider = new AsyncLoadingTreePartProvider();
    rootProvider.setItems([
      createAsyncDataItem("item1", { title: "Item 1", hasComments: true, hasAttachments: true }, {}),
      createAsyncDataItem("item2", { title: "Item 2", hasComments: false, hasAttachments: false }, {}),
    ]);

    const childProvider = new StaticTreePartProvider<AsyncDataItem>({
      comments: {
        treeItem: class CommentsTreeItem extends AbstractTreeItem<AsyncDataItem> {
          public override updateFrom(data: AsyncDataItem) {
            return this.updateLabel("Comments") || super.updateFrom(data);
          }
        },
        condition: (itemObservable) => itemObservable.pipe(map((item) => item.data?.hasComments ?? false)),
      },
      attachments: {
        treeItem: class AttachmentsTreeItem extends AbstractTreeItem<AsyncDataItem> {
          public override updateFrom(data: AsyncDataItem) {
            return this.updateLabel("Attachments") || super.updateFrom(data);
          }
        },
        condition: (itemObservable) => itemObservable.pipe(map((item) => item.data?.hasAttachments ?? false)),
      },
    });

    @injectable()
    @injectFromHierarchy({
      extendConstructorArguments: false,
      extendProperties: true,
    })
    class TestMultiChildTreeProvider extends TestTreeProvider {
      protected getTreePartProvider(element: AbstractTreeItem<any> | undefined) {
        if (element === undefined) {
          return rootProvider;
        }
        if (element instanceof AsyncDataTreeItem) {
          return childProvider;
        }
        return undefined;
      }
    }

    container.bind<TestTreeProvider>("subject").to(TestMultiChildTreeProvider).inSingletonScope();
    const subject = container.get<TestTreeProvider>("subject");

    const rootItems = await subject.getChildren(undefined);

    // Expand item1 before data loads
    await subject.getChildren(rootItems![0]);

    // Wait for data and reactive chain
    await new Promise((resolve) => setTimeout(resolve, 50));
    await new Promise((resolve) => setTimeout(resolve, 10));

    // Item1 should have both children
    const item1Children = await subject.getChildren(rootItems![0]);
    expect(item1Children).toHaveLength(2);
    expect(item1Children!.map((c) => c.label)).toContain("Comments");
    expect(item1Children!.map((c) => c.label)).toContain("Attachments");

    // Item2 should have no children
    const item2Children = await subject.getChildren(rootItems![1]);
    expect(item2Children).toHaveLength(0);
  });

  test("should handle itemInput updates with CombiningTreePartProvider", async () => {
    const container = createTestContainer();

    const rootProvider = new AsyncLoadingTreePartProvider();
    rootProvider.setItems([
      createAsyncDataItem("item1", { title: "Item 1", hasComments: true, hasAttachments: true }, {}),
    ]);

    const staticProvider = new StaticTreePartProvider<AsyncDataItem>({
      comments: {
        treeItem: class CommentsTreeItem extends AbstractTreeItem<AsyncDataItem> {
          public override updateFrom(data: AsyncDataItem) {
            return this.updateLabel("Comments") || super.updateFrom(data);
          }
        },
        condition: (itemObservable) => itemObservable.pipe(map((item) => item.data?.hasComments ?? false)),
      },
    });

    const alwaysProvider = new StaticTreePartProvider<AsyncDataItem>({
      alwaysVisible: {
        treeItem: class AlwaysTreeItem extends AbstractTreeItem<AsyncDataItem> {
          public override updateFrom(data: AsyncDataItem) {
            return this.updateLabel("Always Visible") || super.updateFrom(data);
          }
        },
      },
    });

    const combiningProvider = new CombiningTreePartProvider({
      conditional: staticProvider,
      always: alwaysProvider,
    });

    @injectable()
    @injectFromHierarchy({
      extendConstructorArguments: false,
      extendProperties: true,
    })
    class TestCombiningTreeProvider extends TestTreeProvider {
      protected getTreePartProvider(element: AbstractTreeItem<any> | undefined) {
        if (element === undefined) {
          return rootProvider;
        }
        if (element instanceof AsyncDataTreeItem) {
          return combiningProvider;
        }
        return undefined;
      }
    }

    container.bind<TestTreeProvider>("subject").to(TestCombiningTreeProvider).inSingletonScope();
    const subject = container.get<TestTreeProvider>("subject");

    const rootItems = await subject.getChildren(undefined);

    // Expand before data loads
    const childrenBefore = await subject.getChildren(rootItems![0]);
    expect(childrenBefore).toHaveLength(1); // Only "Always Visible"
    expect(childrenBefore![0].label).toBe("Always Visible");

    // Wait for data and reactive chain
    await new Promise((resolve) => setTimeout(resolve, 50));
    await new Promise((resolve) => setTimeout(resolve, 10));

    // Now should have both
    const childrenAfter = await subject.getChildren(rootItems![0]);
    expect(childrenAfter).toHaveLength(2);
    expect(childrenAfter!.map((c) => c.label)).toContain("Comments");
    expect(childrenAfter!.map((c) => c.label)).toContain("Always Visible");
  });
});
