import { AbstractTreeItem } from "../../../src/common/treeItems/AbstractTreeItem";
import { TestItem } from "./TestItem";

export class TestTreeItem extends AbstractTreeItem<TestItem> {
  constructor(data?: TestItem) {
    super();
    if (data) {
      this.updateFrom(data);
    }
  }
}
