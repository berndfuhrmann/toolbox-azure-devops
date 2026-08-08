import { defer, Subject, type Observable } from "rxjs";
import { map, switchMap, tap } from "rxjs/operators";
import { mapChangeSetToMap, mapToMapChangeSet } from "../collections/observableMap";
import type { AbstractTreeItem } from "../treeItems/AbstractTreeItem";
import { ItemInformation, TreePartProvider } from "./TreePartProvider";

export class DeduplicatingTreePartProvider<Item extends object, Context> extends TreePartProvider<Item, Context> {
  readonly #innerTreePartProvider: TreePartProvider<Item, Context>;
  readonly #dedupeFunction: (items: Map<string, Item>) => Observable<Set<string>>;

  public readonly unwrapObservable = new Subject<{ itemMap: Map<string, Item>; unwrap: boolean }>();

  public constructor(
    innerTreePartProvider: TreePartProvider<Item, Context>,
    dedupeFunction: (items: Map<string, Item>) => Observable<Set<string>>,
  ) {
    super();
    this.#innerTreePartProvider = innerTreePartProvider;
    this.#dedupeFunction = dedupeFunction;
  }

  public override getItems(context: Observable<Context>): Observable<ItemInformation<Item>> {
    return defer(() => {
      let residual: Omit<ItemInformation<Item>, "changes"> = {};
      return this.#innerTreePartProvider.getItems(context).pipe(
        tap((info) => {
          const { changes: _, ...infoResidual } = info;
          residual = infoResidual;
        }),
        map((info) => info.changes),
        mapChangeSetToMap(),
        switchMap((items) =>
          this.#dedupeFunction(items).pipe(
            map((toRemove) => {
              const result = new Map(items.entries());
              toRemove.forEach((key) => result.delete(key));
              return result;
            }),
          ),
        ),
        mapToMapChangeSet((v1, v2) => false),
        map((changes) => ({ changes, ...residual }) as ItemInformation<Item>),
      );
    });
  }

  public override updateTreeItem(item: Item, key: string, oldTreeItem: AbstractTreeItem<Item> | undefined) {
    return this.#innerTreePartProvider.updateTreeItem(item, key, oldTreeItem);
  }

  // FIXME: Should removed items be deactivated?
  public activateItem(key: string, treeItem: AbstractTreeItem<any>): void {
    this.#innerTreePartProvider.activateItem(key, treeItem);
  }

  public deactivateItem(key: string, treeItem: AbstractTreeItem<any>): void {
    this.#innerTreePartProvider.deactivateItem(key, treeItem);
  }

  public activateContext(context: Context): void {
    this.#innerTreePartProvider.activateContext(context);
  }

  public deactivateContext(context: Context): void {
    this.#innerTreePartProvider.deactivateContext(context);
  }
}
