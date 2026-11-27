import { Container } from "inversify";
import { BehaviorSubject, of } from "rxjs";
import { isException } from "../../../../../src/common/Exception";
import type { ItemInformation } from "../../../../../src/common/treePartProvider/TreePartProvider";
import { GitService, LocationsService } from "../../../../../src/generated/services";
import { types } from "../../../../../src/generated/types";
import { GitRepositoryPullRequestCommentThreadTreePartProvider } from "../../../../../src/modules/repository/treePartProviders/GitRepositoryPullRequestCommentThreadTreePartProvider";
import { GitRepositoryPullRequestCommentTreePartProvider } from "../../../../../src/modules/repository/treePartProviders/GitRepositoryPullRequestCommentTreePartProvider";
import { GitRepositoryPullRequestCommentThreadTreeItem } from "../../../../../src/modules/repository/treeItems/GitRepositoryPullRequestCommentThreadTreeItem";
import { GitRepositoryPullRequestCommentTreeItem } from "../../../../../src/modules/repository/treeItems/GitRepositoryPullRequestCommentTreeItem";
import { createCommentThreadItem, createPullRequestItem } from "../createCommentThreadItem";

const getThreads = vi.fn();
const getConnectionData = vi.fn();
const autoRefreshInterval = 60_000;

// like a real request, not finished immediately. Otherwise throttleTime(0) in valuesOperator drops the next auto refresh.
function later(result: () => unknown) {
  return () => new Promise((resolve) => setTimeout(() => resolve(undefined), 1)).then(result);
}

function fail(): never {
  throw new Error("offline");
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.resetAllMocks();
  getThreads.mockImplementation(later(() => [{ id: 5, comments: [{ id: 1 }] }]));
  getConnectionData.mockImplementation(later(() => ({ authenticatedUser: { id: "me" } })));
});

afterEach(() => {
  vi.useRealTimers();
});

function setup() {
  const locationsApi = { getConnectionData };
  const apiService = { gitApi: () => of({ getThreads }), locationsApi: () => of(locationsApi) };
  const container = new Container();
  container.bind(types.ApiService).toConstantValue(apiService);
  container.bind(types.GitService).toConstantValue(new GitService(apiService as any, undefined as any));
  container.bind(types.LocationsService).toConstantValue(new LocationsService(apiService as any, undefined as any));
  const context = new BehaviorSubject(createPullRequestItem(container));
  const provider = new GitRepositoryPullRequestCommentThreadTreePartProvider(
    GitRepositoryPullRequestCommentThreadTreeItem,
    { autoRefreshInterval: () => new BehaviorSubject(autoRefreshInterval) } as any,
  );
  const emissions: ItemInformation<any>[] = [];
  const subscription = provider.getItems(context).subscribe((information) => emissions.push(information));
  return { context, emissions, subscription, container };
}

// keys of the items that are shown after all emissions
function currentKeys(emissions: ItemInformation<any>[]) {
  const keys = new Set<string>();
  for (const { changes } of emissions) {
    changes.removed.forEach((_, key) => keys.delete(key));
    changes.added.forEach((_, key) => keys.add(key));
  }
  return [...keys];
}

describe("GitRepositoryPullRequestCommentThreadTreePartProvider", () => {
  test("loads and filters threads", async () => {
    getThreads.mockImplementation(
      later(() => [
        { id: 5, comments: [{ id: 1 }] },
        { id: 6, isDeleted: true },
      ]),
    );
    const { emissions, subscription } = setup();
    await vi.advanceTimersByTimeAsync(10);
    expect(getThreads).toHaveBeenCalledExactlyOnceWith("repository-1", 7, "project-1");
    expect(emissions).toHaveLength(1);
    expect([...emissions[0].changes.added.keys()]).toEqual(["5"]);
    expect(emissions[0].changes.added.get("5").userId).toBe("me");
    subscription.unsubscribe();
  });

  test("does not load again when other data of the pull request changes", async () => {
    const { context, subscription, container } = setup();
    await vi.advanceTimersByTimeAsync(10);
    context.next({ ...createPullRequestItem(container), pullRequestStatusses: [] });
    await vi.advanceTimersByTimeAsync(10);
    expect(getThreads).toHaveBeenCalledOnce();
    subscription.unsubscribe();
  });

  test("refreshes automatically and manually", async () => {
    const { emissions, subscription } = setup();
    await vi.advanceTimersByTimeAsync(10);
    getThreads.mockImplementation(later(() => []));
    emissions[0].refreshObservables!.pullRequestCommentThread.next(Date.now());
    await vi.advanceTimersByTimeAsync(10);
    expect(getThreads).toHaveBeenCalledTimes(2);
    expect(currentKeys(emissions)).toEqual([]);
    await vi.advanceTimersByTimeAsync(autoRefreshInterval + 10);
    expect(getThreads).toHaveBeenCalledTimes(3);
    expect(getConnectionData).toHaveBeenCalledTimes(3);
    subscription.unsubscribe();
  });

  test.each([
    ["threads", getThreads],
    ["user", getConnectionData],
  ])("shows an error when loading the %s fails and tries again with the next refresh", async (_name, request) => {
    request.mockImplementationOnce(later(fail));
    const { emissions, subscription } = setup();
    await vi.advanceTimersByTimeAsync(10);
    expect(emissions).toHaveLength(1);
    expect([...emissions[0].changes.added.values()].map(isException)).toEqual([true]);
    await vi.advanceTimersByTimeAsync(autoRefreshInterval / 2);
    expect(request).toHaveBeenCalledOnce();
    await vi.advanceTimersByTimeAsync(autoRefreshInterval);
    expect(currentKeys(emissions)).toEqual(["5"]);
    subscription.unsubscribe();
  });

  test("recovers from errors with a manual refresh", async () => {
    const { emissions, subscription } = setup();
    await vi.advanceTimersByTimeAsync(10);
    for (let i = 0; i < 2; i++) {
      getThreads.mockImplementationOnce(later(fail));
      emissions.at(-1)!.refreshObservables!.pullRequestCommentThread.next(Date.now());
      await vi.advanceTimersByTimeAsync(10);
      expect(currentKeys(emissions)).toEqual(["exception"]);
      emissions.at(-1)!.refreshObservables!.pullRequestCommentThread.next(Date.now());
      await vi.advanceTimersByTimeAsync(10);
      expect(currentKeys(emissions)).toEqual(["5"]);
    }
    subscription.unsubscribe();
  });
});

test("GitRepositoryPullRequestCommentTreePartProvider emits replies and their changes", () => {
  const context = new BehaviorSubject(createCommentThreadItem({ comments: [{ id: 1 }, { id: 2 }] }));
  const provider = new GitRepositoryPullRequestCommentTreePartProvider(GitRepositoryPullRequestCommentTreeItem);
  const emissions: ItemInformation<any>[] = [];
  provider.getItems(context).subscribe((information) => emissions.push(information));
  expect([...emissions[0].changes.added.keys()]).toEqual(["2"]);
  context.next({ ...context.value, replies: [{ id: 2 }, { id: 3 }] });
  expect([...emissions[1].changes.added.keys()]).toEqual(["3"]);
});
