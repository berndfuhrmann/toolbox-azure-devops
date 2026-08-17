import { GitRepository } from "azure-devops-node-api/interfaces/GitInterfaces";
import { randomUUID } from "crypto";
import { BehaviorSubject, ReplaySubject, Subject } from "rxjs";
import { setTimeout } from "timers/promises";
import { ApiService } from "../../../src/generated/ApiService";
import { GitService } from "../../../src/generated/services";
import { Account } from "../../../src/modules/core/account";
import { createTestObserver } from "../helper/observables";
import { sampleGitRepositories } from "../mocks/ado/MockData";
import { configureMock, configureMockOnce } from "../mocks/ado/MockDataHelper";
import { MockGitApi } from "../mocks/ado/WebApi";
import { createTestAccount } from "../mocks/generateData";
import vscode from "vscode";

vi.mock("azure-devops-node-api", async (importOriginal) => {
  return {
    ...(await importOriginal<typeof import("azure-devops-node-api")>()),
    WebApi: (await import("../mocks/ado/WebApi.js")).MockWebApi,
    getPersonalAccessTokenHandler: (token: string) => "token:" + token,
  };
});

const projectId = randomUUID();

// Test setup helpers
const createTestSetup = () => {
  const observer = createTestObserver();
  const refresher = new BehaviorSubject<number>(Date.now());
  return { observer, refresher };
};

const createGitServiceWithAccount = (account: Account) => {
  const accountObservable = new ReplaySubject<Account>();
  accountObservable.next(account);
  const apiService = new ApiService(accountObservable);
  return {
    subject: new GitService(apiService, vscode.window.createOutputChannel("test")),
    accountObservable,
  };
};

const createGitServiceWithoutAccount = () => {
  const accountObservable = new Subject<Account>();
  const apiService = new ApiService(accountObservable);
  return {
    subject: new GitService(apiService, vscode.window.createOutputChannel("test")),
    accountObservable,
  };
};

const waitForNextTick = () => setTimeout(1);

describe("GitService - getRepositories", () => {
  test("no call", async () => {
    const { observer, refresher } = createTestSetup();
    const { subject } = createGitServiceWithoutAccount();

    subject.repositories(projectId, refresher).subscribe(observer);
    await waitForNextTick();

    expect(observer.combined).not.toHaveBeenCalled();
  });

  test("single call", async () => {
    const { observer, refresher } = createTestSetup();
    const { subject } = createGitServiceWithAccount(createTestAccount());
    const controller = configureMock<GitRepository[]>(MockGitApi.getRepositories);

    subject.repositories(projectId, refresher).subscribe(observer);
    refresher.next(new Date().getTime());
    await waitForNextTick();
    controller.resolve([]);
    await waitForNextTick();

    expect(observer.combined).toHaveBeenCalledExactlyOnceWith([]);
  });

  test("call, then refresh", async () => {
    const { observer, refresher } = createTestSetup();
    const { subject } = createGitServiceWithAccount(createTestAccount());
    const controller1 = configureMockOnce<GitRepository[]>(MockGitApi.getRepositories);
    const controller2 = configureMockOnce<GitRepository[]>(MockGitApi.getRepositories);

    subject.repositories(projectId, refresher).subscribe(observer);
    refresher.next(new Date().getTime());
    await waitForNextTick();
    controller1.resolve([]);
    controller2.resolve(sampleGitRepositories);
    await waitForNextTick();
    refresher.next(new Date().getTime());
    await waitForNextTick();

    expect(observer.combined).toHaveBeenCalledTimes(2);
    expect(observer.combined.mock.calls).toMatchObject([[[]], [sampleGitRepositories]]);
  });

  test("call, then update account", async () => {
    const { observer, refresher } = createTestSetup();
    const account = createTestAccount();
    const { subject, accountObservable } = createGitServiceWithAccount(account);
    const controller1 = configureMockOnce<GitRepository[]>(MockGitApi.getRepositories);
    const controller2 = configureMockOnce<GitRepository[]>(MockGitApi.getRepositories);

    subject.repositories(projectId, refresher).subscribe(observer);
    refresher.next(new Date().getTime());
    await waitForNextTick();
    controller1.resolve([]);
    controller2.resolve(sampleGitRepositories);
    await waitForNextTick();
    accountObservable.next({ ...account, personalAccessToken: "new-token" });
    await waitForNextTick();

    expect(observer.combined).toHaveBeenCalledTimes(2);
    expect(observer.combined.mock.calls).toMatchObject([[[]], [sampleGitRepositories]]);
  });

  // FIXME
  test.skip("call twice, only one request", async () => {
    const { observer: observer1, refresher: refresher1 } = createTestSetup();
    const { observer: observer2, refresher: refresher2 } = createTestSetup();
    const account = createTestAccount();
    const { subject, accountObservable } = createGitServiceWithAccount(account);
    const controller = configureMock<GitRepository[]>(MockGitApi.getRepositories);

    subject.repositories(projectId, refresher1).subscribe(observer1);
    subject.repositories(projectId, refresher2).subscribe(observer2);
    refresher1.next(new Date().getTime());
    refresher2.next(new Date().getTime());
    await waitForNextTick();
    controller.resolve([]);
    await waitForNextTick();
    expect(observer1.combined).toHaveBeenCalledTimes(1);
    expect(observer2.combined).toHaveBeenCalledTimes(1);
    expect(MockGitApi.getRepositories).toHaveBeenCalledTimes(1);
  });
});
