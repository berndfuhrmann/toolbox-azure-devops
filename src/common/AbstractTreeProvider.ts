import { inject, injectable, injectFromHierarchy } from "inversify";
import {
  BehaviorSubject,
  firstValueFrom,
  map,
  pipe,
  ReplaySubject,
  scan,
  skip,
  Subject,
  Subscription,
  tap,
} from "rxjs";
import * as vscode from "vscode";
import { types } from "../generated/types";
import { existingItems } from "./mapUtilities";
import { bufferSynchronous } from "./operators";
import { TreeItemRegistry } from "./TreeItemRegistry";
import { AbstractTreeItem } from "./treeItems/AbstractTreeItem";
import { ItemInformation, TreePartProvider } from "./treePartProvider/TreePartProvider";

export function combineChangeSetsToTreeItemUpdate<TreeItem extends AbstractTreeItem<any> = AbstractTreeItem<any>>(
  treePartProvider: TreePartProvider<any, any>,
) {
  return pipe(
    scan(
      (
        last: {
          added: Map<string, TreeItem>;
          removed: Map<string, TreeItem>;
          updated: Map<string, TreeItem>;
          unchanged: Map<string, TreeItem>;
        },
        items: ItemInformation<any>[],
      ) => {
        const added = new Map<string, TreeItem>();
        const removed = new Map<string, TreeItem>();
        const updated = new Map<string, TreeItem>();
        const unchanged = existingItems(last);
        let refreshObservables: Record<string, Subject<number>> | undefined;
        items.forEach((item) => {
          const changeSet = item.changes;
          refreshObservables = item.refreshObservables;
          changeSet.added.forEach((value, key) => {
            if (changeSet.removed.has(key)) {
              // item was changed (signified by removing and adding)
              if (added.has(key)) {
                const oldItem = added.get(key)!;
                const result = treePartProvider.updateTreeItem(value, key, oldItem);
                const newItem = result.treeItem as TreeItem;
                if (newItem !== oldItem) {
                  added.set(key, newItem);
                }
              } else if (updated.has(key)) {
                const oldItem = updated.get(key)!;
                const result = treePartProvider.updateTreeItem(value, key, oldItem);
                const newItem = result.treeItem as TreeItem;
                if (newItem !== oldItem) {
                  removed.set(key, oldItem);
                  added.set(key, newItem);
                  updated.delete(key);
                }
              } else if (unchanged.has(key)) {
                const oldItem = unchanged.get(key)!;
                const result = treePartProvider.updateTreeItem(value, key, oldItem);
                const newItem = result.treeItem as TreeItem;
                if (newItem === oldItem) {
                  if (result.updated) {
                    updated.set(key, oldItem);
                    unchanged.delete(key);
                  }
                } else {
                  removed.set(key, oldItem);
                  added.set(key, newItem);
                  unchanged.delete(key);
                }
              } else {
                throw new Error(
                  `invalid state: key "${key}" in both added and removed of changeSet, but not found in any accumulated map`,
                );
              }
            } else {
              // item was added
              // it cannot be in any of those lists
              if (added.has(key) || updated.has(key) || unchanged.has(key)) {
                throw new Error(
                  `invalid state: key "${key}" added but already present in accumulated maps (added=${added.has(key)}, updated=${updated.has(key)}, unchanged=${unchanged.has(key)})`,
                );
              } else if (removed.has(key)) {
                // if item was removed previously
                const oldItem = removed.get(key)!;
                const result = treePartProvider.updateTreeItem(value, key, oldItem);
                const newItem = result.treeItem as TreeItem;
                if (newItem === oldItem) {
                  removed.delete(key);
                  if (result.updated) {
                    updated.set(key, oldItem);
                  } else {
                    unchanged.set(key, oldItem);
                  }
                } else {
                  added.set(key, newItem);
                }
              } else {
                // if item was unknown previously
                const result = treePartProvider.updateTreeItem(value, key, undefined);
                added.set(key, result.treeItem as TreeItem);
              }
            }
          });
          changeSet.removed.forEach((value, key) => {
            if (!changeSet.added.has(key)) {
              // item was removed (and not added)
              if (added.has(key)) {
                added.delete(key);
              } else if (removed.has(key)) {
                throw new Error("invalid state");
              } else if (updated.has(key)) {
                removed.set(key, updated.get(key)!);
                updated.delete(key);
              } else if (unchanged.has(key)) {
                removed.set(key, unchanged.get(key)!);
                unchanged.delete(key);
              } else {
                throw new Error(`invalid state: key "${key}" removed but not found in any accumulated map`);
              }
            }
          });
        });
        return {
          added,
          removed,
          updated,
          unchanged,
          refreshObservables: refreshObservables ?? ({} as Record<string, Subject<number>>),
        };
      },
      {
        added: new Map<string, TreeItem>(),
        removed: new Map<string, TreeItem>(),
        updated: new Map<string, TreeItem>(),
        unchanged: new Map<string, TreeItem>(),
        refreshObservables: {} as Record<string, Subject<number>>,
      },
    ),
  );
}

@injectable()
@injectFromHierarchy({
  extendConstructorArguments: false,
  extendProperties: true,
})
export abstract class AbstractTreeProvider<TreeItem extends AbstractTreeItem<any> = AbstractTreeItem<any>>
  implements vscode.TreeDataProvider<TreeItem>, vscode.TreeDragAndDropController<TreeItem>
{
  // a map from each TreeItem to its direct parent or undefined if on top level
  #itemParents = new Map<TreeItem, TreeItem | undefined>();

  // a map from each TreeItem to the set of its children
  #itemChildren = new Map<TreeItem | undefined, Set<TreeItem>>();

  // a map from each TreeItem to the TreePartProvider that returned the respective item
  #itemSourceInfo = new Map<TreeItem, { treePartProvider: TreePartProvider<any, any>; key: string }>();

  // the set of TreeItem instance whose content would be visible
  #itemChildrenVisible = new Set<TreeItem | undefined>();

  // the set of TreeItem instance who are visible
  #itemVisible = new Set<TreeItem>();

  // subscription data to handle observables for each parent (or undefined)
  #subscriptions: Map<
    TreeItem | undefined,
    {
      subscription: Subscription;
      replaySubject: ReplaySubject<{ items: TreeItem[]; refreshObservables: Record<string, Subject<number>> }>;
      updateSubscription: Subscription;
      itemInput: BehaviorSubject<any>;
    }
  > = new Map();

  get treeItemRegistry() {
    return this.#treeItemRegistry;
  }
  @inject(types.TreeItemRegistry)
  set treeItemRegistry(value: TreeItemRegistry<TreeItem>) {
    this.#treeItemRegistry = value;
  }

  // the tree item registry to communicate with FileDecorationHandlers
  #treeItemRegistry!: TreeItemRegistry<TreeItem>;
  #view!: vscode.TreeView<TreeItem>;
  #onDidChangeTreeData = new vscode.EventEmitter<undefined | TreeItem>();

  public readonly onDidChangeTreeData?: vscode.Event<void | TreeItem | TreeItem[] | null | undefined> | undefined;

  // TreeDragAndDropController implementation
  public dropMimeTypes: readonly string[] = [];
  public dragMimeTypes: readonly string[] = [];

  constructor() {
    this.onDidChangeTreeData = this.#onDidChangeTreeData.event;
  }

  protected registerTreeItem(treeItem: TreeItem) {
    this.#treeItemRegistry.register(treeItem);
    return treeItem;
  }

  protected abstract getTreePartProvider(
    element: AbstractTreeItem<any> | undefined,
  ): TreePartProvider<any, any> | undefined;

  protected abstract sortTreeItems(treeItems: TreeItem[], parent: TreeItem | undefined): void;

  getTreeItem(element: TreeItem): TreeItem | Thenable<TreeItem> {
    return element;
  }

  #subscribeToTreeItems(parent: TreeItem | undefined) {
    const treePartProvider = this.getTreePartProvider(parent);
    if (treePartProvider) {
      const replaySubject = new ReplaySubject<{
        items: TreeItem[];
        refreshObservables: Record<string, Subject<number>>;
      }>(1);
      const itemInput = new BehaviorSubject(parent?.data);

      const subscription = treePartProvider
        .getItems(itemInput)
        .pipe(
          bufferSynchronous(),
          combineChangeSetsToTreeItemUpdate<TreeItem>(treePartProvider),
          tap((changeSet) => {
            // remove removed items
            for (const item of changeSet.removed.values()) {
              this.#removeTreeItem(item);
            }

            // add new items
            for (const [key, item] of changeSet.added.entries()) {
              this.#addTreeItem(item, parent, key, treePartProvider);
            }

            // update items
            for (const item of changeSet.updated.values()) {
              this.notifyTreeDataChange(item);
              // Update child subscription context only when item data actually changed
              const childSubscription = this.#subscriptions.get(item);
              if (childSubscription) {
                childSubscription.itemInput.next(item.data);
              }
            }
          }),
          map((changeSet) => ({
            items: [...(this.#itemChildren.get(parent) ?? [])],
            refreshObservables: changeSet.refreshObservables,
          })),
          tap(({ items }) => {
            this.sortTreeItems(items, parent);
          }),
        )
        .subscribe(replaySubject);
      const updateSubscription = replaySubject.pipe(skip(1)).subscribe(() => {
        this.notifyTreeDataChange(parent);
      });
      return {
        subscription,
        replaySubject,
        updateSubscription,
        itemInput,
      };
    } else {
      return undefined;
    }
  }

  #addTreeItem(
    item: TreeItem,
    parent: TreeItem | undefined,
    key: string,
    treePartProvider: TreePartProvider<any, any>,
  ) {
    this.#itemChildren.set(item, new Set());
    this.#itemParents.set(item, parent);
    this.#itemChildren.get(parent)?.add(item);
    this.#itemSourceInfo.set(item, { treePartProvider, key });
    this.#itemVisible.add(item);
    item.treeProvider = this;
    this.registerTreeItem(item);
  }

  #removeTreeItem(item: TreeItem) {
    if (!this.#itemParents.has(item)) {
      throw new Error("invalid state" + item);
    }
    const parent = this.#itemParents.get(item);
    this.#itemChildren.get(parent)?.delete(item);
    this.#itemParents.delete(item);
    const children = this.#itemChildren.get(item);
    if (children) {
      for (const child of children) {
        this.#removeTreeItem(child);
      }
    }
    const subscription = this.#subscriptions.get(item);
    if (subscription) {
      subscription?.updateSubscription?.unsubscribe();
      subscription?.replaySubject.next({ items: [], refreshObservables: {} });
      subscription?.subscription?.unsubscribe();
      this.#subscriptions.delete(item);
    }
    this.#itemSourceInfo.delete(item);
    this.#itemVisible.delete(item);
  }

  #activateItem(item: TreeItem) {
    if (!this.#itemVisible.has(item)) {
      const entry = this.#itemSourceInfo.get(item)!;
      entry.treePartProvider.activateItem(entry.key, item);
      this.#itemVisible.add(item);
    }
  }

  #deactivateItem(item: TreeItem) {
    if (this.#itemVisible) {
      const entry = this.#itemSourceInfo.get(item)!;
      entry.treePartProvider.deactivateItem(entry.key, item);
      this.#itemVisible.delete(item);
    }
  }

  #activateItemContext(item: TreeItem | undefined) {
    if (!this.#itemChildrenVisible.has(item)) {
      const treePartProvider = this.getTreePartProvider(item);
      treePartProvider?.activateContext(item);
      this.#itemChildrenVisible.add(item);
    }
  }

  #deactivateItemContext(item: TreeItem | undefined) {
    if (this.#itemChildrenVisible.has(item)) {
      const treePartProvider = this.getTreePartProvider(item);
      treePartProvider?.deactivateContext(item);
      this.#itemChildrenVisible.delete(item);
    }
  }

  #onDidExpandTreeItem(item: TreeItem | undefined) {
    this.#activateItemContext(item);

    this.#itemChildren
      .get(item)
      ?.values()
      .forEach((child) => {
        this.#onDidExpandTreeItemRecursive(child);
      });
  }

  #onDidExpandTreeItemRecursive(item: TreeItem) {
    if (item) {
      this.#activateItem(item);
      if (item === undefined || item.collapsibleState === vscode.TreeItemCollapsibleState.Expanded) {
        this.#activateItemContext(item);
        this.#itemChildren
          .get(item)
          ?.values()
          .filter((child) => child.collapsibleState !== vscode.TreeItemCollapsibleState.None)
          .forEach((child) => {
            this.#onDidExpandTreeItemRecursive(child);
          });
      }
    }
  }

  #onDidCollapseTreeItem(item: TreeItem | undefined) {
    this.#deactivateItemContext(item);

    this.#itemChildren
      .get(item)
      ?.values()
      .forEach((child) => {
        this.#onDidCollapseTreeItemRecursive(child);
      });

    const entry = this.#subscriptions.get(item);
    if (entry) {
      entry.updateSubscription.unsubscribe();
      entry.subscription.unsubscribe();
      entry.replaySubject.next({ items: [], refreshObservables: {} });
      this.#subscriptions.delete(item);
    }
    const children = this.#itemChildren.get(item);
    if (children) {
      for (const child of [...children]) {
        this.#removeTreeItem(child);
      }
    }
  }

  #onDidCollapseTreeItemRecursive(item: TreeItem) {
    if (item) {
      this.#deactivateItem(item);
      if (item === undefined || item.collapsibleState === vscode.TreeItemCollapsibleState.Expanded) {
        this.#deactivateItemContext(item);
        this.#itemChildren
          .get(item)
          ?.values()
          .filter((child) => child.collapsibleState !== vscode.TreeItemCollapsibleState.None)
          .forEach((child) => {
            this.#onDidCollapseTreeItemRecursive(child);
          });
      }
    }
  }

  #onDidChangeVisibility(visibility: boolean) {
    if (visibility) {
      this.#onDidExpandTreeItem(undefined);
    } else {
      this.#onDidCollapseTreeItem(undefined);
    }
  }

  async getChildren(element?: TreeItem | undefined) {
    if (element === undefined && !this.#itemChildren.has(undefined)) {
      this.#itemChildren.set(undefined, new Set());
    }
    let entry = this.#subscriptions.get(element);

    if (!entry) {
      entry = this.#subscribeToTreeItems(element);
      if (entry === undefined) {
        return undefined;
      }
      this.#subscriptions.set(element, entry);
    }
    const itemsAndRefreshables = await firstValueFrom(entry.replaySubject);
    return itemsAndRefreshables.items;
  }

  /**
   * This method must be called after instantiating this class. This will register some hooks
   * to the tree view.
   * @param treeView
   * @returns
   */
  public registerTreeView(treeView: vscode.TreeView<TreeItem>) {
    this.#view = treeView;
    const collapseElementDisposable = this.#view.onDidCollapseElement((event) =>
      this.#onDidCollapseTreeItem(event.element),
    );
    const expandedElementDisposable = this.#view.onDidExpandElement((event) =>
      this.#onDidExpandTreeItem(event.element),
    );
    const visibilityElementDisposable = this.#view.onDidChangeVisibility((event) =>
      this.#onDidChangeVisibility(event.visible),
    );
    this.#onDidChangeVisibility(this.#view.visible);
    return new vscode.Disposable(() => {
      // add code to unsubscribe from everything
      collapseElementDisposable.dispose();
      expandedElementDisposable.dispose();
      visibilityElementDisposable.dispose();
    });
  }

  public async reveal(
    element: TreeItem,
    options?: { select?: boolean; focus?: boolean; expand?: boolean | number },
  ): Promise<void> {
    return this.#view.reveal(element, options);
  }

  public async refreshItem(item: TreeItem) {
    const entry = this.#subscriptions.get(item);
    if (entry) {
      const now = Date.now();
      const itemsAndRefreshObservables = await firstValueFrom(entry.replaySubject);
      Object.values(itemsAndRefreshObservables.refreshObservables).forEach((observable) => observable.next(now));
    }
    this.notifyTreeDataChange(item);
  }

  protected notifyTreeDataChange(element: TreeItem | undefined) {
    if (element) {
      this.#treeItemRegistry.notifyChange(element);
    }

    this.#onDidChangeTreeData.fire(element);
  }

  getParent?(element: TreeItem): vscode.ProviderResult<TreeItem> {
    return this.#itemParents.get(element);
  }

  async resolveTreeItem?(item: vscode.TreeItem, element: vscode.TreeItem, token: vscode.CancellationToken) {
    const itemSource = this.#itemSourceInfo.get(item as any);
    if (itemSource && item instanceof AbstractTreeItem) {
      return itemSource.treePartProvider.resolveItem(itemSource.key, item, token);
    } else {
      return item;
    }
  }

  // TreeDragAndDropController methods
  // Subclasses should override these to implement drag and drop behavior
  public async handleDrag?(
    source: readonly TreeItem[],
    dataTransfer: vscode.DataTransfer,
    token: vscode.CancellationToken,
  ): Promise<void> {
    // Default implementation does nothing
    // Subclasses should override to implement drag behavior
  }

  public async handleDrop?(
    target: TreeItem | undefined,
    dataTransfer: vscode.DataTransfer,
    token: vscode.CancellationToken,
  ): Promise<void> {
    // Default implementation does nothing
    // Subclasses should override to implement drop behavior
  }
}
