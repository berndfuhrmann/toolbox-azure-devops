import { Observable } from "rxjs";
import { TreePartProvider } from "../../../../src/common/treePartProvider/TreePartProvider";
import { AbstractTreeItem } from "../../../../src/common/treeItems/AbstractTreeItem";

class ConcreteTreePartProvider extends TreePartProvider<unknown, unknown> {
  getItems(_context: Observable<unknown>): Observable<any> {
    return new Observable();
  }

  updateTreeItem(_item: unknown, _key: string, _oldTreeItem: AbstractTreeItem<any> | undefined) {
    return { treeItem: {} as any, updated: false };
  }

  createRefreshObservablePublic() {
    return this.createRefreshObservable();
  }
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2020, 1, 1, 0));
});

afterEach(() => {
  vi.useRealTimers();
});

describe("createRefreshObservable", () => {
  test("emits Date.now() at subscription time, not at creation time", () => {
    const provider = new ConcreteTreePartProvider();
    const obs = provider.createRefreshObservablePublic();

    vi.advanceTimersByTime(5000);
    const subscribeTime = Date.now();

    const received: number[] = [];
    obs.subscribe((v) => received.push(v));

    expect(received).toEqual([subscribeTime]);
  });

  test("late subscriber gets Date.now() not a stored future timestamp", () => {
    const provider = new ConcreteTreePartProvider();
    const obs = provider.createRefreshObservablePublic();

    const futureTimestamp = Date.now() + 3_600_000;
    obs.next(futureTimestamp);

    const subscribeTime = Date.now();
    const received: number[] = [];
    obs.subscribe((v) => received.push(v));

    expect(received).toEqual([subscribeTime]);
    expect(received[0]).not.toBe(futureTimestamp);
  });

  test("subsequent pushes are forwarded to existing subscribers", () => {
    const provider = new ConcreteTreePartProvider();
    const obs = provider.createRefreshObservablePublic();

    const received: number[] = [];
    obs.subscribe((v) => received.push(v));

    const t1 = Date.now() + 1000;
    obs.next(t1);

    expect(received).toEqual([Date.now(), t1]);
  });
});
