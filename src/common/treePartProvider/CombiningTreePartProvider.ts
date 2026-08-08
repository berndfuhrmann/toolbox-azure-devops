import { from, map, mergeAll, Observable, scan } from "rxjs";
import { CancellationToken } from "vscode";
import { MapChangeSet } from "../collections/observableMap";
import { AbstractTreeItem } from "../treeItems/AbstractTreeItem";
import { ItemInformation, TreePartProvider } from "./TreePartProvider";

/**
 * This tree part provider combines multiple tree part providers into one.
 */
export class CombiningTreePartProvider<Context, Input extends Record<string, any>> extends TreePartProvider<
  Input[keyof Input],
  Context
> {
  #inputs: Record<string, TreePartProvider<Input[keyof Input], Context>>;

  constructor(inputs: Record<string, TreePartProvider<Input[keyof Input], Context>>) {
    super();
    this.#inputs = inputs;
  }

  getItems(context: Observable<Context>): Observable<ItemInformation<Input[keyof Input]>> {
    const entries = Object.entries(this.#inputs);
    return from(entries).pipe(
      map(([category, treePartProvider]) =>
        treePartProvider.getItems(context).pipe(map((info) => [category as string, info] as const)),
      ),
      mergeAll(),
      scan<
        readonly [string, ItemInformation<any>],
        {
          category: string;
          changeSet: MapChangeSet<string, any>;
          accumulatedResiduals: Omit<ItemInformation<any>, "changes">;
        },
        undefined
      >((acc, [category, { changes, ...residual }]) => {
        const accumulatedResiduals = this.#combineResidual(category, residual, acc?.accumulatedResiduals ?? {});
        return {
          category,
          changeSet: changes,
          accumulatedResiduals,
        };
      }, undefined),
      map(({ category, changeSet, accumulatedResiduals }) => {
        const added = new Map<string, Input[keyof Input]>();
        const removed = new Map<string, Input[keyof Input]>();
        changeSet.added.forEach((value, key) => added.set(this.combineIdentifiers(category, key), value));
        changeSet.removed.forEach((value, key) => removed.set(this.combineIdentifiers(category, key), value));
        return { changes: { added, removed }, ...accumulatedResiduals };
      }),
    );
  }

  #combineResidual<T>(
    category: string,
    incoming: Omit<ItemInformation<T>, "changes">,
    target: Omit<ItemInformation<T>, "changes">,
  ) {
    return {
      ...target,
      refreshObservables: {
        ...target.refreshObservables,
        ...Object.fromEntries(
          Object.entries(incoming.refreshObservables ?? {}).map((entry) => [
            this.combineIdentifiers(category, entry[0]),
            entry[1],
          ]),
        ),
      },
    };
  }

  override updateTreeItem(item: Input[keyof Input], newKey: string, oldTreeItem: AbstractTreeItem<any> | undefined) {
    const [category, key] = this.splitIdentifiers(newKey);
    const input = this.#inputs[category];
    return input.updateTreeItem(item, key, oldTreeItem);
  }

  combineIdentifiers(identifier1: string, identifier2: string): string {
    return (identifier1 as string) + "|" + identifier2;
  }

  splitIdentifiers(identifier: string) {
    const index = identifier.indexOf("|");
    return [identifier.substring(0, index), identifier.substring(index + 1)];
  }

  override async resolveItem(combinedKey: string, treeItem: AbstractTreeItem<any>, token: CancellationToken) {
    const [category, key] = this.splitIdentifiers(combinedKey);
    const treePartProvider = this.#inputs[category];
    return treePartProvider.resolveItem(key, treeItem, token);
  }

  override activateItem(key: string, treeItem: AbstractTreeItem<any>): void {
    const [category, itemKey] = this.splitIdentifiers(key);
    const treePartProvider = this.#inputs[category];
    treePartProvider.activateItem(itemKey, treeItem);
  }

  override deactivateItem(key: string, treeItem: AbstractTreeItem<any>): void {
    const [category, itemKey] = this.splitIdentifiers(key);
    const treePartProvider = this.#inputs[category];
    treePartProvider.deactivateItem(itemKey, treeItem);
  }

  public activateContext(context: Context): void {
    Object.entries(this.#inputs).forEach(([_key, treePartProvider]) => {
      treePartProvider.activateContext(context);
    });
  }

  public deactivateContext(context: Context): void {
    Object.entries(this.#inputs).forEach(([_key, treePartProvider]) => {
      treePartProvider.deactivateContext(context);
    });
  }
}
