import { map, Observable, ReplaySubject } from "rxjs";
import { mapToMapChangeSet } from "../../../src/common/collections/observableMap";
import { Constructor } from "../../../src/common/constructor";
import { AbstractTreeItem } from "../../../src/common/treeItems/AbstractTreeItem";
import {
  createOrUpdateTreeItem,
  ItemInformation,
  TreePartProvider,
} from "../../../src/common/treePartProvider/TreePartProvider";
import { compareTestItem, TestItem } from "./TestItem";
import { TestTreeItem } from "./TestTreeItem";

export interface TestContext {
  id: string;
  data: string;
}

export interface TestTreePartProviderOptions {
  /**
   * When true, the provider is driven manually via emit() instead of via addItems().
   * The last emission is replayed to late subscribers, so the subscription order in
   * the test can be controlled.
   */
  manual?: boolean;
  /**
   * Callback that receives every value of the itemInput observable (the context passed
   * by AbstractTreeProvider). Useful to observe parent data changes.
   */
  onItemInput?: (data: TestContext | undefined) => void;
  /**
   * Tree item constructor used in updateTreeItem. Defaults to TestTreeItem. Pass
   * UpdatingTestTreeItem to detect actual data changes, so they land in the "updated"
   * change set of AbstractTreeProvider.
   */
  treeItemType?: Constructor<AbstractTreeItem<TestItem>>;
}

// Tree item whose updateFrom detects actual data changes, so updates land in the
// "updated" change set of AbstractTreeProvider.
export class UpdatingTestTreeItem extends AbstractTreeItem<TestItem> {
  public override updateFrom(data: TestItem) {
    const labelChanged = this.updateLabel(data.testData);
    return super.updateFrom(data) || labelChanged;
  }
}

export class TestTreePartProvider extends TreePartProvider<TestItem, TestContext> {
  #children = new Map<string | undefined, Set<string>>();
  #items = new Map<string, TestItem>();
  #emissions: ReplaySubject<ItemInformation<TestItem>> | undefined;
  #treeItemType: Constructor<AbstractTreeItem<TestItem>>;
  #onItemInput: ((data: TestContext | undefined) => void) | undefined;

  constructor(options: TestTreePartProviderOptions = {}) {
    super();
    this.#treeItemType = options.treeItemType ?? TestTreeItem;
    this.#onItemInput = options.onItemInput;
    if (options.manual) {
      this.#emissions = new ReplaySubject(1);
    }
  }

  getItems(context: Observable<TestContext>): Observable<ItemInformation<TestItem>> {
    if (this.#onItemInput) {
      context.subscribe(this.#onItemInput);
    }
    if (this.#emissions) {
      return this.#emissions.asObservable();
    }
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

  emit(info: ItemInformation<TestItem>) {
    this.#emissions?.next(info);
  }

  updateTreeItem(item: TestItem, key: string, oldTreeItem: AbstractTreeItem<any> | undefined) {
    return createOrUpdateTreeItem(oldTreeItem, this.#treeItemType, item);
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
