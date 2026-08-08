/**
 * Interface for items that are or can be pinned
 */
export type PinnedItem = {
  /**
   * Indicates if this item has been pinned (`true`) or not (`false`).
   */
  pinned: boolean;

  /**
   * Indicates if this item is restored from a pin (`true`) or not (missing).
   */
  pinnedInstance?: true;
};

export function isPinnedInstance<T extends object>(item: T): item is T & { pinnedInstance: true } {
  return (item as { pinnedInstance?: unknown }).pinnedInstance === true;
}

export function createPinnedItem<T extends object>(item: T): T & PinnedItem {
  return {
    ...item,
    pinned: true,
  };
}
