import { map, Subject } from "rxjs";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { AbstractTreeProvider } from "../../../src/common/AbstractTreeProvider";
import { AbstractTreeItem } from "../../../src/common/treeItems/AbstractTreeItem";
import {
  ChangeSetOfObservables,
  changeSetOfObservablesToChangeSet,
} from "../../../src/common/mapOfObservablesUtilities";
import { TreeItemRegistry } from "../../../src/common/TreeItemRegistry";
import { createTestObserver } from "../helper/observables";
import { Container } from "inversify";
import { types } from "../../../src/generated/types";
import { TestTreeProvider } from "../helper/TestTreeProvider";

beforeEach(() => {
  vi.useFakeTimers();
  const date = new Date(2020, 1, 1, 0);
  vi.setSystemTime(date);
});

afterEach(() => {
  vi.useRealTimers();
});
let call = 0;
beforeEach(() => (call = 0));

describe("changeSetOfObservablesToChangeSet", () => {
  let observable: Subject<ChangeSetOfObservables<number, string>>;
  let observer: ReturnType<typeof createTestObserver>;

  beforeEach(() => {
    observable = new Subject();
    observer = createTestObserver();
    observable
      .pipe(
        changeSetOfObservablesToChangeSet(
          (x) => ({
            item: x,
            firstItem: x,
          }),
          (x, t) => {
            if (t.item !== x) {
              t.item = x;
              return true;
            } else {
              return false;
            }
          },
        ),
      )
      .subscribe(observer);
  });
  test("nothing happens", () => {
    expect(observer.combined).toHaveBeenCalledTimes(call);
  });

  test("empty change set", () => {
    observable.next({
      added: new Map(),
      removed: new Map(),
      unchanged: new Map(),
    });
    expect(observer.combined).toHaveBeenCalledTimes(call);
  });

  test("add element and update", () => {
    const alphaSource = new Subject<number>();
    const alphaObservable = alphaSource.pipe(map((x) => `${x}`));
    const betaSource = new Subject<number>();
    const betaObservable = betaSource.pipe(map((x) => `${x}`));

    observable.next({
      added: new Map([
        ["alpha", { observable: alphaObservable, source: alphaSource }],
        ["beta", { observable: betaObservable, source: betaSource }],
      ]),
      removed: new Map(),
      unchanged: new Map(),
    });
    alphaSource.next(4);
    betaSource.next(40);
    alphaSource.next(5);
    observable.next({
      added: new Map(),
      removed: new Map([["beta", { observable: betaObservable, source: betaSource }]]),
      unchanged: new Map([["alpha", { observable: alphaObservable, source: alphaSource }]]),
    });
    expect(observer.combined).toHaveBeenNthCalledWith(++call, {
      added: new Map([["alpha", { firstItem: "4", item: "5" }]]),
    });
    expect(observer.combined).toHaveBeenNthCalledWith(++call, {
      added: new Map([["beta", { firstItem: "40", item: "40" }]]),
    });
    expect(observer.combined).toHaveBeenNthCalledWith(++call, {
      updated: new Map([["alpha", { firstItem: "4", item: "5" }]]),
    });
    expect(observer.combined).toHaveBeenNthCalledWith(++call, {
      removed: new Set(["beta"]),
    });
    expect(observer.combined).toHaveBeenCalledTimes(call);
  });
});

describe("getChildren", () => {
  test("no content", async () => {
    const container = new Container();
    container
      .bind<TreeItemRegistry<AbstractTreeItem<any>>>(types.TreeItemRegistry)
      .to(TreeItemRegistry)
      .inSingletonScope();
    container.bind<TestTreeProvider>("subject").to(TestTreeProvider).inSingletonScope();
    const subject = container.get<TestTreeProvider>("subject");
    const children = await subject.getChildren(undefined);
    expect(children).toBeUndefined();
  });
});
