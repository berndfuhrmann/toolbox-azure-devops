import { Exception, isException } from "../Exception";
import { AbstractTreeItem } from "../treeItems/AbstractTreeItem";
import { ExceptionTreeItem } from "../treeItems/ExceptionTreeItem";
import { createOrUpdateTreeItem } from "./TreePartProvider";

export function updateExceptionTreeItem<Item>(item: Item | Exception, oldTreeItem: AbstractTreeItem<any> | undefined) {
  if (isException(item)) {
    return createOrUpdateTreeItem(oldTreeItem, ExceptionTreeItem, item);
  }
  return undefined;
}
