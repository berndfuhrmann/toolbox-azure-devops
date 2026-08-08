import { BehaviorSubject, defer, merge, of, Subject, type Observable } from "rxjs";
import { endWith, filter, map, mergeMap, scan, switchMap, takeUntil, tap, withLatestFrom } from "rxjs/operators";
import {
  mapChangeSetToMapChangeSetWithItems,
  MapChangeSetWithItems,
  processMapChangeSet,
  type MapChangeSet,
} from "../collections/observableMap";
import { AbstractTreeItem } from "../treeItems/AbstractTreeItem";
import { ItemInformation, TreePartProvider } from "./TreePartProvider";
import { createCompositeKey, getChildKey } from "./keyUtilities";

type ItemInformationResidual<Item> = Omit<ItemInformation<Item>, "changes">;

type UnwrappingChangeInput<Item> = {
  unwrap: boolean;
  changeSet: MapChangeSetWithItems<string, Item>;
  parentResidual: ItemInformationResidual<Item>;
};

type UnwrappingScanState<ChildItem extends object, Item extends object> = {
  emitObservables: Observable<ItemInformation<Item | ChildItem>>[];
  unwrappedObservableCloseTriggers: Map<string, Subject<boolean>> | undefined;
  unwrappedValueObservables: Map<string, Subject<Item>> | undefined;
  rootObservable: Subject<MapChangeSet<string, Item>> | undefined;
  last: UnwrappingChangeInput<Item>;
  childResiduals: Map<string, ItemInformationResidual<Item | ChildItem>> | undefined;
  parentResidualSubject: BehaviorSubject<ItemInformationResidual<Item>>;
};

type ChildProviderChange<ChildItem extends object, Item extends object> = {
  changeSet: MapChangeSet<string, ChildItem>;
  treePartProvider: TreePartProvider<ChildItem, Item>;
  residual: ItemInformationResidual<Item>;
};

type ChildOutputHandle<ChildItem extends object, Item extends object> = {
  observable: Observable<{
    changes: MapChangeSet<string, Item | ChildItem>;
    residual: ItemInformationResidual<Item | ChildItem> | undefined;
  }>;
  trigger: Subject<boolean>;
};

const isDefined = <Value>(value: Value | undefined): value is Value => value !== undefined;

let unwrappingTreePartProviderCounter = 0;

export class UnwrappingTreePartProvider<
  ChildItem extends object,
  Item extends object,
  Context,
  ChildTreePartProvider extends TreePartProvider<ChildItem, Item>,
> extends TreePartProvider<Item | ChildItem, Context> {
  readonly #parentTreePartProvider: TreePartProvider<Item, Context>;
  readonly #getUnwrapObservable: (items: Map<string, Item>) => Observable<boolean>;
  readonly #getTreePartProvider: (item: AbstractTreeItem<Item>) => ChildTreePartProvider | undefined;

  readonly #providerTag = Symbol("unwrappingTreePartProviderCounter" + unwrappingTreePartProviderCounter++);

  #tagItem<T extends Item | ChildItem>(
    item: T,
    provider: TreePartProvider<ChildItem, Item> | TreePartProvider<Item, Context>,
  ): T {
    const itemWithSymbol = item as Record<string | symbol, any>;
    itemWithSymbol[this.#providerTag] = provider;
    return itemWithSymbol as T;
  }

  #getProvider(item: Item | ChildItem): TreePartProvider<ChildItem, Item> | TreePartProvider<Item, Context> {
    return (item as unknown as Record<symbol, TreePartProvider<ChildItem, Item> | TreePartProvider<Item, Context>>)[
      this.#providerTag
    ];
  }

  public readonly unwrapObservable = new Subject<{ itemMap: Map<string, Item>; unwrap: boolean }>();

  /** Creates an unwrapping provider around a parent provider. */
  public constructor(
    innerTreePartProvider: TreePartProvider<Item, Context>,
    unwrapPredicate: (items: Map<string, Item>) => Observable<boolean>,
    getChildTreePartProvider: (item: AbstractTreeItem<Item>) => ChildTreePartProvider | undefined,
  ) {
    super();
    this.#parentTreePartProvider = innerTreePartProvider;
    this.#getUnwrapObservable = unwrapPredicate;
    this.#getTreePartProvider = getChildTreePartProvider;
  }

  /** Maps child changes into flattened output entries. */
  #mapChildOutputChangeSet(
    parentKey: string,
    treePartProvider: TreePartProvider<ChildItem, Item>,
    changeSet: MapChangeSet<string, ChildItem>,
  ): MapChangeSet<string, Item | ChildItem> {
    return {
      added: new Map(
        changeSet.added
          .entries()
          .map(([key, value]) => [createCompositeKey(parentKey, key), this.#tagItem(value, treePartProvider)]),
      ),
      removed: new Map(
        changeSet.removed
          .entries()
          .map(([key, value]) => [createCompositeKey(parentKey, key), this.#tagItem(value, treePartProvider)]),
      ),
    };
  }

  /** Maps parent changes into flattened output entries. */
  #mapRootOutputChangeSet(changeSet: MapChangeSet<string, Item>): MapChangeSet<string, Item | ChildItem> {
    return {
      added: new Map(
        changeSet.added
          .entries()
          .map(([key, value]) => [createCompositeKey(null, key), this.#tagItem(value, this.#parentTreePartProvider)]),
      ),
      removed: new Map(
        changeSet.removed
          .entries()
          .map(([key, value]) => [createCompositeKey(null, key), this.#tagItem(value, this.#parentTreePartProvider)]),
      ),
    };
  }

  /** Resolves child provider change sets for a parent item stream. */
  #createChildProviderObservable(
    key: string,
    item: Observable<Item>,
  ): Observable<ChildProviderChange<ChildItem, Item>> {
    return item.pipe(
      scan<Item, { treeItem: AbstractTreeItem<Item> }, undefined>((accumulated, value) => {
        const { treeItem } = this.#parentTreePartProvider.updateTreeItem(value, key, accumulated?.treeItem);
        return {
          treeItem: treeItem,
        };
      }, undefined),
      map((value) => value.treeItem),
      switchMap((treeItem) => {
        const treePartProvider = this.#getTreePartProvider(treeItem);
        if (treePartProvider === undefined) {
          throw new Error("treePartProvider must not be undefined");
        }
        return treePartProvider.getItems(of(treeItem.data)).pipe(
          map((info) => {
            const { changes, ...residual } = info;
            return { changeSet: changes, treePartProvider, residual };
          }),
        );
      }),
    );
  }

  /** Creates a child output stream together with its close trigger. */
  #createChildOutputHandle(key: string, item: Observable<Item>): ChildOutputHandle<ChildItem, Item> {
    const trigger = new Subject<boolean>();
    const observable = defer(() => {
      const items = new Map<string, ChildItem>();
      let lastTreePartProvider: TreePartProvider<ChildItem, Item>;
      return this.#createChildProviderObservable(key, item).pipe(
        takeUntil(trigger),
        tap(({ changeSet, treePartProvider: treePartProvider }) => {
          changeSet.removed.forEach((_, removed) => items.delete(removed));
          changeSet.added.forEach((addedValue, addedKey) => items.set(addedKey, addedValue));
          lastTreePartProvider = treePartProvider;
        }),
        endWith({
          changeSet: {
            added: new Map<string, ChildItem>(),
            removed: items,
          },
          treePartProvider: lastTreePartProvider!,
          residual: undefined,
        }),
        map(({ changeSet, treePartProvider, residual }) => ({
          changes: this.#mapChildOutputChangeSet(key, treePartProvider, changeSet),
          residual,
        })),
      );
    });
    return { observable, trigger };
  }

  /** Merges parent and child residuals. This is the only place that knows about specific residual properties. */
  #joinItemInformation(
    parentResidual: ItemInformationResidual<Item | ChildItem>,
    childResiduals: Map<string, ItemInformationResidual<Item | ChildItem>>,
  ): ItemInformationResidual<Item | ChildItem> {
    const refreshObservables: Record<string, Subject<number>> = {};
    if (parentResidual.refreshObservables) {
      Object.assign(refreshObservables, parentResidual.refreshObservables);
    }
    for (const r of childResiduals.values()) {
      if (r.refreshObservables) {
        Object.assign(refreshObservables, r.refreshObservables);
      }
    }
    return Object.keys(refreshObservables).length > 0 ? { refreshObservables } : {};
  }

  /** Wraps a child emit observable to track its residual and emit complete ItemInformation. */
  #wrapChildEmitObservable(
    key: string,
    handle: ChildOutputHandle<ChildItem, Item>,
    childResiduals: Map<string, ItemInformationResidual<Item | ChildItem>>,
    parentResidual$: Observable<ItemInformationResidual<Item | ChildItem>>,
  ): Observable<ItemInformation<Item | ChildItem>> {
    return handle.observable.pipe(
      withLatestFrom(parentResidual$),
      tap(([{ residual }]) => {
        if (residual !== undefined) {
          childResiduals.set(key, residual);
        } else {
          childResiduals.delete(key);
        }
      }),
      map(([{ changes }, parentResidual]) => ({
        changes,
        ...this.#joinItemInformation(parentResidual, childResiduals),
      })),
    );
  }

  /** Reuses the current state when unwrap evaluation repeats. */
  #createRepeatedEvaluationState(
    acc: UnwrappingScanState<ChildItem, Item>,
    value: UnwrappingChangeInput<Item>,
  ): UnwrappingScanState<ChildItem, Item> {
    return {
      emitObservables: [],
      unwrappedObservableCloseTriggers: acc.unwrappedObservableCloseTriggers,
      unwrappedValueObservables: acc.unwrappedValueObservables,
      rootObservable: acc.rootObservable,
      last: value,
      childResiduals: acc.childResiduals,
      parentResidualSubject: acc.parentResidualSubject,
    };
  }

  /** Applies parent changes while already in unwrapped mode. */
  #createUnwrappedUpdateState(
    acc: UnwrappingScanState<ChildItem, Item>,
    value: UnwrappingChangeInput<Item>,
  ): UnwrappingScanState<ChildItem, Item> {
    const emitObservables: Observable<ItemInformation<Item | ChildItem>>[] = [];
    const unwrappedObservableCloseTriggers = acc.unwrappedObservableCloseTriggers!;
    const childResiduals = acc.childResiduals!;
    const parentResidualSubject = acc.parentResidualSubject;
    parentResidualSubject.next(value.parentResidual);
    processMapChangeSet<string, Item>({
      added: (key, addedValue) => {
        const unwrappedValueObservable = new BehaviorSubject(addedValue);
        acc.unwrappedValueObservables!.set(key, unwrappedValueObservable);
        const handle = this.#createChildOutputHandle(key, unwrappedValueObservable);
        unwrappedObservableCloseTriggers.set(key, handle.trigger);
        emitObservables.push(this.#wrapChildEmitObservable(key, handle, childResiduals, parentResidualSubject));
      },
      removed: (key, _removedValue) => {
        const trigger = unwrappedObservableCloseTriggers.get(key)!;
        unwrappedObservableCloseTriggers.delete(key);
        trigger.next(true);
        childResiduals.delete(key);
      },
      updated: (key, updatedValue) => {
        const unwrappedValueObservable = acc.unwrappedValueObservables!.get(key)!;
        unwrappedValueObservable.next(updatedValue);
      },
    })(value.changeSet);

    return {
      emitObservables,
      unwrappedObservableCloseTriggers: acc.unwrappedObservableCloseTriggers,
      unwrappedValueObservables: acc.unwrappedValueObservables,
      rootObservable: undefined,
      last: value,
      childResiduals,
      parentResidualSubject,
    };
  }

  /** Applies parent changes while already in wrapped mode. */
  #createWrappedUpdateState(
    acc: UnwrappingScanState<ChildItem, Item>,
    value: UnwrappingChangeInput<Item>,
  ): UnwrappingScanState<ChildItem, Item> {
    acc.rootObservable!.next(value.changeSet);
    acc.parentResidualSubject.next(value.parentResidual);
    return {
      emitObservables: [],
      unwrappedObservableCloseTriggers: undefined,
      unwrappedValueObservables: undefined,
      rootObservable: acc.rootObservable,
      last: value,
      childResiduals: undefined,
      parentResidualSubject: acc.parentResidualSubject,
    };
  }

  /** Switches output from wrapped mode to unwrapped mode. */
  #createSwitchToUnwrappedState(
    acc: UnwrappingScanState<ChildItem, Item> | undefined,
    value: UnwrappingChangeInput<Item>,
  ): UnwrappingScanState<ChildItem, Item> {
    acc?.rootObservable?.complete();

    const emitObservables: Observable<ItemInformation<Item | ChildItem>>[] = [];
    const unwrappedObservableCloseTriggers = new Map<string, Subject<boolean>>();
    const unwrappedValueObservables = new Map<string, Subject<Item>>();
    const childResiduals = new Map<string, ItemInformationResidual<Item | ChildItem>>();
    const parentResidualSubject = new BehaviorSubject<ItemInformationResidual<Item>>(value.parentResidual);
    value.changeSet.items.forEach((item, key) => {
      const unwrappedValueObservable = new BehaviorSubject(item);
      unwrappedValueObservables.set(key, unwrappedValueObservable);
      const handle = this.#createChildOutputHandle(key, unwrappedValueObservable);
      unwrappedObservableCloseTriggers.set(key, handle.trigger);
      emitObservables.push(this.#wrapChildEmitObservable(key, handle, childResiduals, parentResidualSubject));
    });
    return {
      emitObservables,
      unwrappedObservableCloseTriggers,
      unwrappedValueObservables,
      rootObservable: undefined,
      last: value,
      childResiduals,
      parentResidualSubject,
    };
  }

  /** Switches output from unwrapped mode to wrapped mode. */
  #createSwitchToWrappedState(
    acc: UnwrappingScanState<ChildItem, Item> | undefined,
    value: UnwrappingChangeInput<Item>,
  ): UnwrappingScanState<ChildItem, Item> {
    acc?.unwrappedObservableCloseTriggers?.forEach((trigger) => trigger.next(true));
    const emitObservables: Observable<ItemInformation<Item | ChildItem>>[] = [];
    const rootObservable = new BehaviorSubject<MapChangeSet<string, Item>>({
      added: value.changeSet.items,
      removed: new Map<string, Item>(),
    });
    const wrappedChanges: Observable<MapChangeSet<string, Item>> = defer(() => {
      const activeItemsToRemoveOnComplete = new Map<string, Item>();
      return rootObservable.pipe(
        tap((changeSet) => {
          changeSet.removed.forEach((_value, key) => activeItemsToRemoveOnComplete.delete(key));
          changeSet.added.forEach((addedValue, key) => activeItemsToRemoveOnComplete.set(key, addedValue));
        }),
        endWith({
          added: new Map<string, Item>(),
          removed: activeItemsToRemoveOnComplete,
        }),
      );
    });
    const parentResidualSubject = new BehaviorSubject<ItemInformationResidual<Item>>(value.parentResidual);
    const emitObservable: Observable<ItemInformation<Item | ChildItem>> = wrappedChanges.pipe(
      withLatestFrom(parentResidualSubject),
      map(([changeSet, parentResidual]) => ({
        ...parentResidual,
        changes: this.#mapRootOutputChangeSet(changeSet),
      })),
    );
    emitObservables.push(emitObservable);
    return {
      emitObservables,
      unwrappedObservableCloseTriggers: undefined,
      unwrappedValueObservables: undefined,
      rootObservable,
      last: value,
      childResiduals: undefined,
      parentResidualSubject,
    };
  }

  /** Emits flattened items from either parent or child providers. */
  public override getItems(context: Observable<Context>): Observable<ItemInformation<Item | ChildItem>> {
    return this.#parentTreePartProvider.getItems(context).pipe(
      mapChangeSetToMapChangeSetWithItems<Item>(),
      switchMap(({ changes: changeSet, ...parentResidual }) =>
        this.#getUnwrapObservable(changeSet.items).pipe(map((unwrap) => ({ unwrap, changeSet, parentResidual }))),
      ),
      scan<UnwrappingChangeInput<Item>, UnwrappingScanState<ChildItem, Item> | undefined>((acc, value) => {
        if (value.unwrap === acc?.last.unwrap) {
          if (value.changeSet === acc?.last.changeSet) {
            return this.#createRepeatedEvaluationState(acc, value);
          } else {
            if (value.unwrap) {
              // acc is defined because value.unwrap matched acc?.last.unwrap
              return this.#createUnwrappedUpdateState(acc!, value);
            } else {
              // acc is defined because value.unwrap matched acc?.last.unwrap
              return this.#createWrappedUpdateState(acc!, value);
            }
          }
        } else {
          if (value.unwrap) {
            return this.#createSwitchToUnwrappedState(acc, value);
          } else {
            return this.#createSwitchToWrappedState(acc, value);
          }
        }
      }, undefined),
      filter(isDefined),
      mergeMap((x) => merge(...x.emitObservables)),
    );
  }

  /** Delegates tree item updates to the provider read from the item's symbol tag. */
  public override updateTreeItem(
    item: Item | ChildItem,
    key: string,
    oldTreeItem: AbstractTreeItem<Item> | AbstractTreeItem<ChildItem> | undefined,
  ): { treeItem: AbstractTreeItem<Item> | AbstractTreeItem<ChildItem>; updated: boolean } {
    const provider = this.#getProvider(item);
    return (provider as TreePartProvider<Item & ChildItem, Item & Context>).updateTreeItem(
      item as Item & ChildItem,
      getChildKey(key),
      oldTreeItem,
    );
  }

  // TODO: These methods are incomplete
  override activateItem(key: string, treeItem: AbstractTreeItem<any>): void {
    this.#getProvider(treeItem.data).activateItem(getChildKey(key), treeItem);
  }

  override deactivateItem(key: string, treeItem: AbstractTreeItem<any>): void {
    this.#getProvider(treeItem.data).deactivateItem(getChildKey(key), treeItem);
  }

  override activateContext(context: Context): void {
    this.#parentTreePartProvider.activateContext(context);
  }

  override deactivateContext(context: Context): void {
    this.#parentTreePartProvider.deactivateContext(context);
  }
}
