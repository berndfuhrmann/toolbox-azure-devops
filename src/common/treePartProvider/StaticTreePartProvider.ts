import { combineLatest, map, Observable, scan } from "rxjs";
import { AbstractTreeItem } from "../treeItems/AbstractTreeItem";
import { createOrUpdateTreeItem, ItemInformation, TreePartProvider } from "./TreePartProvider";
import { CancellationToken } from "vscode";
import { Constructor } from "../constructor";
import { randomUUID } from "crypto";

export interface StaticTreePartProviderEntry<Item> {
  treeItem: Constructor<AbstractTreeItem<any>>;
  condition?: (itemObservable: Observable<Item>) => Observable<boolean>;
}

const contextSymbol = randomUUID();

export class StaticTreePartProvider<Item> extends TreePartProvider<Item, Item> {
  #cases: Record<string, StaticTreePartProviderEntry<Item>>;
  constructor(cases: Record<string, StaticTreePartProviderEntry<Item>>) {
    super();
    this.#cases = cases;
  }

  getItems(context: Observable<Item>): Observable<ItemInformation<Item>> {
    const entries = Object.entries(this.#cases);

    const conditions = Object.fromEntries([
      [contextSymbol, context],
      ...entries.filter((entry) => entry[1].condition).map((entry) => [entry[0], entry[1].condition!(context)]),
    ]) as Record<string, Observable<boolean>> & Record<typeof contextSymbol, Observable<Item>>;

    return combineLatest(conditions).pipe(
      scan(
        (last, contextItem) => {
          const mapInitializer = entries
            .filter(([key, value]) => contextItem[key] === undefined || contextItem[key] === true)
            .map(([key, value]) => [key, contextItem[contextSymbol]] as [string, Item]);
          return {
            added: new Map<string, Item>(mapInitializer),
            removed: last.added,
          };
        },
        {
          added: new Map<string, Item>(),
          removed: new Map<string, Item>(),
        },
      ),
      map((changes) => ({ changes })),
    );
  }

  override updateTreeItem(item: Item, key: string, oldTreeItem: AbstractTreeItem<any> | undefined) {
    return createOrUpdateTreeItem(oldTreeItem, this.#cases[key].treeItem, item);
  }

  override async resolveItem(key: string, treeItem: AbstractTreeItem<any>, token: CancellationToken) {
    // TODO: It would be nice to give static tree nodes the ability to load more data.
    return treeItem;
  }
}
