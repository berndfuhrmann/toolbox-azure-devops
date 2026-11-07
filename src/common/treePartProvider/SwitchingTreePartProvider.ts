import { concat, defer, EMPTY, of, ReplaySubject, type Observable } from "rxjs";
import { distinctUntilChanged, share, switchMap, tap } from "rxjs/operators";
import type { CancellationToken } from "vscode";
import type { AbstractTreeItem } from "../treeItems/AbstractTreeItem";
import { ItemInformation, TreePartProvider } from "./TreePartProvider";

/**
 * Switches between tree part providers, depending on the latest case selected from the context.
 * The items of the previous provider are removed, and the provider is unsubscribed, before the next one starts.
 * A case without a provider shows no items.
 * Item keys are passed through unchanged; calls are routed to the provider that produced the item.
 */
export class SwitchingTreePartProvider<Item extends object, Context> extends TreePartProvider<Item, Context> {
  readonly #selectCase: (context: Observable<Context>) => Observable<string>;
  readonly #cases: Record<string, TreePartProvider<Item, Context>>;
  readonly #providerByItem = new WeakMap<Item, TreePartProvider<Item, Context>>();

  /**
   * @param selectCase builds the observable of cases from the context. Keep it synchronous, so that the provider of
   * the previous case is unsubscribed before it receives a context that belongs to the next case.
   * @param cases the provider for each case
   */
  public constructor(
    selectCase: (context: Observable<Context>) => Observable<string>,
    cases: Record<string, TreePartProvider<Item, Context>>,
  ) {
    super();
    this.#selectCase = selectCase;
    this.#cases = cases;
  }

  public override getItems(context: Observable<Context>): Observable<ItemInformation<Item>> {
    return defer(() => {
      const shownItems = new Map<string, Item>();
      // replays the latest context to the provider of a case, which subscribes after the case has been selected
      const sharedContext = context.pipe(share({ connector: () => new ReplaySubject<Context>(1) }));
      return this.#selectCase(sharedContext).pipe(
        distinctUntilChanged(),
        switchMap((caseKey) => {
          const provider = this.#cases[caseKey];
          // copy, because shownItems is emptied when this change set is applied
          const removeShownItems = defer(() =>
            shownItems.size > 0 || !provider
              ? of<ItemInformation<Item>>({ changes: { added: new Map(), removed: new Map(shownItems) } })
              : EMPTY,
          );
          if (!provider) {
            return removeShownItems;
          }
          return concat(
            removeShownItems,
            provider
              .getItems(sharedContext)
              .pipe(tap(({ changes }) => changes.added.forEach((item) => this.#providerByItem.set(item, provider)))),
          );
        }),
        tap(({ changes }) => {
          changes.removed.forEach((_item, key) => shownItems.delete(key));
          changes.added.forEach((item, key) => shownItems.set(key, item));
        }),
      );
    });
  }

  #getProvider(item: Item) {
    const provider = this.#providerByItem.get(item);
    if (!provider) {
      throw new Error("invalid state: item was not produced by any case of this provider");
    }
    return provider;
  }

  public override updateTreeItem(item: Item, key: string, oldTreeItem: AbstractTreeItem<any> | undefined) {
    return this.#getProvider(item).updateTreeItem(item, key, oldTreeItem);
  }

  public override resolveItem(key: string, treeItem: AbstractTreeItem<any>, token: CancellationToken) {
    return this.#getProvider(treeItem.data).resolveItem(key, treeItem, token);
  }

  public override activateItem(key: string, treeItem: AbstractTreeItem<any>): void {
    this.#getProvider(treeItem.data).activateItem(key, treeItem);
  }

  public override deactivateItem(key: string, treeItem: AbstractTreeItem<any>): void {
    this.#getProvider(treeItem.data).deactivateItem(key, treeItem);
  }

  public override activateContext(context: Context): void {
    Object.values(this.#cases).forEach((provider) => provider.activateContext(context));
  }

  public override deactivateContext(context: Context): void {
    Object.values(this.#cases).forEach((provider) => provider.deactivateContext(context));
  }
}
