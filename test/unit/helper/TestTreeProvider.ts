import { AbstractTreeProvider } from "../../../src/common/AbstractTreeProvider";
import { AbstractTreeItem } from "../../../src/common/treeItems/AbstractTreeItem";
import { TreePartProvider } from "../../../src/common/treePartProvider/TreePartProvider";

export const notifyTreeDataChange = vi.fn();

export class TestTreeProvider extends AbstractTreeProvider<AbstractTreeItem<string>> {
  protected getTreePartProvider(element: AbstractTreeItem<any> | undefined): TreePartProvider<any, any> | undefined {
    return undefined;
  }
  protected sortTreeItems(treeItems: AbstractTreeItem<string>[], parent: AbstractTreeItem<string> | undefined): void {}
  protected notifyTreeDataChange(element: AbstractTreeItem<string> | undefined) {
    notifyTreeDataChange(element);
  }
}
