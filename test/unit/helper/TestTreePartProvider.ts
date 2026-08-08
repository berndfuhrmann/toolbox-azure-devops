import { map, Observable } from "rxjs";
import { mapToMapChangeSet } from "../../../src/common/collections/observableMap";
import { AbstractTreeItem } from "../../../src/common/treeItems/AbstractTreeItem";
import {
  createOrUpdateTreeItem,
  ItemInformation,
  TreePartProvider,
} from "../../../src/common/treePartProvider/TreePartProvider";
import { compareTestItem, TestItem } from "./TestItem";
import { TestTreeItem } from "./TestTreeItem";

interface TestContext {
  id: string;
  data: string;
}

export class TestTreePartProvider extends TreePartProvider<TestItem, TestContext> {
  #children = new Map<string | undefined, Set<string>>();
  #items = new Map<string, TestItem>();

  constructor() {
    super();
  }

  getItems(context: Observable<TestContext>): Observable<ItemInformation<TestItem>> {
    return context.pipe(
      map((c) => {
        const children = [...(this.#children.get(c?.id) ?? [])];

        const items = new Map<string, any>(children.map((id) => [id, this.#items.get(id)] as [string, TestItem]));
        return items;
      }),
      mapToMapChangeSet(compareTestItem),
      map((changes) => ({ changes })),
    );
  }

  updateTreeItem(item: TestItem, key: string, oldTreeItem: AbstractTreeItem<any> | undefined) {
    return createOrUpdateTreeItem(oldTreeItem, TestTreeItem, item);
  }

  addItems(testData: Map<string | undefined, TestItem[]>) {
    for (const [key, values] of testData) {
      for (const value of values) {
        this.#items.set(value.id, value);
      }
      this.#children.set(key, new Set(values.map((value) => value.id)));
    }
  }
}
