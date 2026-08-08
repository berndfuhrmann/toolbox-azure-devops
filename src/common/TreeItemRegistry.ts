import { injectable } from "inversify";
import { TreeItem } from "vscode";

/**
 * This class provides a way to retrieve TreeItem instances by their id.
 * It also offers a way to get notified when a given item changes.
 * This class does not hold strong references to TreeItem instances, so
 * they can be garbage collected.
 */
@injectable()
export class TreeItemRegistry<T extends TreeItem> {
  notifyChange(item: T) {
    const handler = this.#changeListener.get(item);
    if (handler) {
      handler(item);
    }
  }
  #items = new Map<string | undefined, WeakRef<T>>();
  #changeListener = new WeakMap<T, (t: T) => boolean>();
  constructor() {}

  #finalizationRegistry = new FinalizationRegistry<string | undefined>((key) => {
    this.#items.delete(key);
  });

  register(item: T) {
    const weakRef = new WeakRef(item);
    const key = item.id;
    this.#items.set(key, weakRef);
    this.#finalizationRegistry.register(weakRef, key);
  }

  getById(id: string) {
    return this.#items.get(id)?.deref();
  }

  registerListener(item: T, handler: (t: T) => boolean) {
    this.#changeListener.set(item, handler);
  }
}
