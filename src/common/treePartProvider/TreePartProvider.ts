import { Observable, Subject } from "rxjs";
import { CancellationToken } from "vscode";
import { MapChangeSet } from "../collections/observableMap";
import { Constructor } from "../constructor";
import { AbstractTreeItem } from "../treeItems/AbstractTreeItem";

/**
 * Emitted information from getItems for displaying a current set of items in a TreeView.
 * Item refers to an Item, not a TreeItem.
 */
export type ItemInformation<Item> = {
  /**
   * A set of changes, relative to last emitted ItemInformation object
   */
  changes: MapChangeSet<string, Item>;

  /**
   * Record containing all refresh triggers for updating the result of the latest emission
   */
  refreshObservables?: Record<string, Subject<number>>;
};

export function createOrUpdateTreeItem<Data, TreeItem extends AbstractTreeItem<Data>>(
  item: AbstractTreeItem<any> | undefined,
  constructor: Constructor<TreeItem>,
  data: Data,
) {
  let updated = false;
  if (!item || !(item instanceof constructor)) {
    item = new constructor();
    updated = true;
  }
  // execute updateFrom, regardless of state of updated
  const updatedFromResult = item.updateFrom(data);
  updated ||= updatedFromResult;
  return { treeItem: item as TreeItem, updated };
}

export abstract class TreePartProvider<Item, Context> {
  // Aspects:
  // * TreeItem create/update
  // * Decoration info
  // * Command info

  /**
   * Create an observable of map changeset
   * @param context observable to provide additional information, about ancestors
   */
  abstract getItems(context: Observable<Context>): Observable<ItemInformation<Item>>;

  /**
   * Create or update a tree item. When implementing this,
   * either return the oldTreeItem (if any) or create a new item.
   * @param item data
   * @param key key of tree item
   * @param oldTreeItem old tree item or undefined
   */
  abstract updateTreeItem(
    item: Item,
    key: string,
    oldTreeItem: AbstractTreeItem<any> | undefined,
  ): { treeItem: AbstractTreeItem<any>; updated: boolean };

  protected createRefreshObservable() {
    const inner = new Subject<number>();
    return Object.assign(
      new Observable<number>((subscriber) => {
        subscriber.next(Date.now());
        return inner.subscribe(subscriber);
      }),
      {
        next: inner.next.bind(inner),
        error: inner.error.bind(inner),
        complete: inner.complete.bind(inner),
      },
    ) as unknown as Subject<number>;
  }

  /**
   * Creates a fresh refreshObservables record containing only the new observable under the given key.
   * Use this in getItemIterable when creating child items — parent observables are not propagated,
   * so refreshing a child does not trigger ancestor refreshes.
   */
  protected createRefreshObservables(key: string): {
    refreshObservables: Record<string, Subject<number>>;
    refreshObservable: Subject<number>;
  } {
    const refreshObservable = this.createRefreshObservable();
    return { refreshObservables: { [key]: refreshObservable }, refreshObservable };
  }

  /**
   * Appends a new refresh observable to an existing item's refreshObservables record under the given key.
   * Use this when extending an already-created item with additional observables (e.g. in withItemObservable).
   */
  protected appendRefreshObservable<T extends { refreshObservables: Record<string, Subject<number>> }>(
    item: T,
    key: string,
  ): { refreshObservables: Record<string, Subject<number>>; refreshObservable: Subject<number> } {
    const refreshObservable = this.createRefreshObservable();
    const refreshObservables = { ...item.refreshObservables, [key]: refreshObservable };
    return { refreshObservables, refreshObservable };
  }

  public async resolveItem(key: string, treeItem: AbstractTreeItem<any>, token: CancellationToken) {
    return treeItem;
  }

  public activateItem(key: string, treeItem: AbstractTreeItem<any>) {
    // Default implementation does nothing
  }

  public deactivateItem(key: string, treeItem: AbstractTreeItem<any>) {
    // Default implementation does nothing
  }

  public activateContext(context: Context) {
    // Default implementation does nothing
  }

  public deactivateContext(context: Context) {
    // Default implementation does nothing
  }
}
