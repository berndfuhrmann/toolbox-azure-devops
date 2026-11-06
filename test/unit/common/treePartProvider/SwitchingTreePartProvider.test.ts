import { BehaviorSubject, map, Observable } from "rxjs";
import type { MapChangeSet } from "../../../../src/common/collections/observableMap";
import { SwitchingTreePartProvider } from "../../../../src/common/treePartProvider/SwitchingTreePartProvider";
import type { ItemInformation, TreePartProvider } from "../../../../src/common/treePartProvider/TreePartProvider";
import { TestTreeItem } from "../../helper/TestTreeItem";

interface TestItem {
  id: string;
}

interface TestContext {
  name: string;
  mode: string;
}

const item1: TestItem = { id: "1" };
const item2: TestItem = { id: "2" };
const item3: TestItem = { id: "3" };

const changeSet = (added: TestItem[], removed: TestItem[]) => ({
  added: new Map(added.map((item) => [item.id, item])),
  removed: new Map(removed.map((item) => [item.id, item])),
});

const selectMode = (context: Observable<TestContext>) => context.pipe(map((value) => value.mode));

type TestProvider = TreePartProvider<TestItem, TestContext> & { contexts: string[]; subscriptions: number };

const createProvider = (items: TestItem[]): TestProvider => {
  const provider = {
    contexts: [] as string[],
    subscriptions: 0,
    getItems: vi.fn(
      (context: Observable<TestContext>) =>
        new Observable<ItemInformation<TestItem>>((subscriber) => {
          provider.subscriptions++;
          subscriber.next({ changes: changeSet(items, []) });
          return context.subscribe((value) => provider.contexts.push(value.name));
        }),
    ),
    updateTreeItem: vi.fn().mockReturnValue({ treeItem: new TestTreeItem(), updated: false }),
    resolveItem: vi.fn(),
    activateItem: vi.fn(),
    deactivateItem: vi.fn(),
    activateContext: vi.fn(),
    deactivateContext: vi.fn(),
  };
  return provider as unknown as TestProvider;
};

let first: TestProvider;
let second: TestProvider;
let context: BehaviorSubject<TestContext>;
let changes: MapChangeSet<string, TestItem>[];
let subject: SwitchingTreePartProvider<TestItem, TestContext>;

beforeEach(() => {
  first = createProvider([item1, item2]);
  second = createProvider([item3]);
  context = new BehaviorSubject<TestContext>({ name: "a", mode: "first" });
  changes = [];
  subject = new SwitchingTreePartProvider(selectMode, { first, second });
});

const subscribe = () => subject.getItems(context).subscribe((information) => changes.push(information.changes));

test("shows the items of the provider of the selected case", () => {
  subscribe();
  expect(changes).toEqual([changeSet([item1, item2], [])]);
  expect(first.contexts).toEqual(["a"]);
  expect(second.subscriptions).toBe(0);
});

test("passes context changes within the same case to the provider without restarting it", () => {
  subscribe();
  context.next({ name: "b", mode: "first" });
  expect(first.subscriptions).toBe(1);
  expect(first.contexts).toEqual(["a", "b"]);
  expect(changes).toHaveLength(1);
});

test("removes the items of the previous provider and stops it when switching", () => {
  subscribe();
  context.next({ name: "b", mode: "second" });
  expect(changes).toEqual([changeSet([item1, item2], []), changeSet([], [item1, item2]), changeSet([item3], [])]);
  // the previous provider does not see the context of the next case
  expect(first.contexts).toEqual(["a"]);
  expect(second.contexts).toEqual(["b"]);
});

test("shows no items for a case without a provider", () => {
  subscribe();
  context.next({ name: "b", mode: "none" });
  expect(changes).toEqual([changeSet([item1, item2], []), changeSet([], [item1, item2])]);
});

test("emits an empty change set when starting in a case without a provider", () => {
  context.next({ name: "a", mode: "none" });
  subscribe();
  expect(changes).toEqual([changeSet([], [])]);
  expect(first.subscriptions).toBe(0);
});

test("restarts a provider when switching back", () => {
  subscribe();
  context.next({ name: "b", mode: "none" });
  context.next({ name: "c", mode: "first" });
  expect(first.subscriptions).toBe(2);
  expect(changes).toEqual([
    changeSet([item1, item2], []),
    changeSet([], [item1, item2]),
    changeSet([item1, item2], []),
  ]);
});

test("routes item calls to the provider that produced the item", () => {
  subscribe();
  context.next({ name: "b", mode: "second" });
  const treeItem = Object.assign(new TestTreeItem(), { data: item3 });

  subject.updateTreeItem(item3, "3", undefined);
  subject.activateItem("3", treeItem);
  subject.deactivateItem("3", treeItem);

  expect(second.updateTreeItem).toHaveBeenCalledWith(item3, "3", undefined);
  expect(second.activateItem).toHaveBeenCalledWith("3", treeItem);
  expect(second.deactivateItem).toHaveBeenCalledWith("3", treeItem);
  expect(first.updateTreeItem).not.toHaveBeenCalled();
});

test("passes context activation to all providers", () => {
  subject.activateContext(context.value);
  subject.deactivateContext(context.value);
  expect(first.activateContext).toHaveBeenCalledWith(context.value);
  expect(second.activateContext).toHaveBeenCalledWith(context.value);
  expect(first.deactivateContext).toHaveBeenCalledWith(context.value);
  expect(second.deactivateContext).toHaveBeenCalledWith(context.value);
});
