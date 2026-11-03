import { setTimeout } from "timers/promises";
import { ApiService } from "../../../src/generated/ApiService";
import { createTestAuthenticationMethodRegistry } from "../helper/authentication";
import { AuthenticationMethodRegistry } from "../../../src/modules/core/authentication/AuthenticationMethodRegistry";
import { createTestObserver } from "../helper/observables";
import { MockGitApi } from "../mocks/ado/WebApi";
import { Account } from "../../../src/modules/core/account";
import { ReplaySubject, Subject } from "rxjs";
import { randomUUID } from "crypto";

vi.mock("azure-devops-node-api", async (importOriginal) => {
  return {
    ...(await importOriginal<typeof import("azure-devops-node-api")>()),
    WebApi: (await import("../mocks/ado/WebApi.js")).MockWebApi,
    getPersonalAccessTokenHandler: (token: string) => "token:" + token,
  };
});

describe("ApiService", () => {
  let observer: ReturnType<typeof createTestObserver>;
  beforeEach(() => {
    observer = createTestObserver();
  });

  test("nothing happens", () => {
    const accountObservable = new Subject<Account>();
    const subject = new ApiService(accountObservable, createTestAuthenticationMethodRegistry());
    subject.gitApi().subscribe(observer);
    expect(observer.combined.mock.calls).toEqual([]);
  });

  test("get value once", async () => {
    const accountObservable = new Subject<Account>();
    const subject = new ApiService(accountObservable, createTestAuthenticationMethodRegistry());
    subject.gitApi().subscribe(observer);
    accountObservable.next({
      accountId: randomUUID(),
      organization: "some-org",
      authentication: { type: "personalAccessToken" },
      secrets: { personalAccessToken: "some-pat" },
      url: "some-url",
    });
    await setTimeout(1);
    expect(observer.combined.mock.calls).toEqual([[expect.any(MockGitApi)]]);
  });

  test("get new value after change", async () => {
    const accountObservable = new Subject<Account>();
    const subject = new ApiService(accountObservable, createTestAuthenticationMethodRegistry());
    subject.gitApi().subscribe(observer);
    accountObservable.next({
      accountId: randomUUID(),
      organization: "some-org",
      authentication: { type: "personalAccessToken" },
      secrets: { personalAccessToken: "some-pat" },
      url: "some-url",
    });
    await setTimeout(1);
    accountObservable.next({
      accountId: randomUUID(),
      organization: "some-org2",
      authentication: { type: "personalAccessToken" },
      secrets: { personalAccessToken: "some-pat2" },
      url: "some-url2",
    });
    await setTimeout(1);
    expect(observer.combined.mock.calls).toEqual([[expect.any(MockGitApi)], [expect.any(MockGitApi)]]);
  });

  test("late subscribers get a value", async () => {
    const accountObservable = new ReplaySubject<Account>(1);
    const subject = new ApiService(accountObservable, createTestAuthenticationMethodRegistry());
    accountObservable.next({
      accountId: randomUUID(),
      organization: "some-org",
      authentication: { type: "personalAccessToken" },
      secrets: { personalAccessToken: "some-pat" },
      url: "some-url",
    });
    await setTimeout(1);
    subject.gitApi().subscribe(observer);
    await setTimeout(1);

    expect(observer.combined.mock.calls).toEqual([[expect.any(MockGitApi)]]);
  });

  test("does not reconnect if nothing relevant for the connection changed", async () => {
    const accountObservable = new Subject<Account>();
    const subject = new ApiService(accountObservable, createTestAuthenticationMethodRegistry());
    subject.gitApi().subscribe(observer);
    const account: Account = {
      accountId: randomUUID(),
      organization: "some-org",
      authentication: { type: "personalAccessToken" },
      secrets: { personalAccessToken: "some-pat" },
      url: "some-url",
    };
    accountObservable.next(account);
    await setTimeout(1);
    accountObservable.next({ ...account, secrets: { personalAccessToken: "some-pat" } });
    await setTimeout(1);
    expect(observer.combined.mock.calls).toEqual([[expect.any(MockGitApi)]]);
  });

  test("reconnects if the secrets changed", async () => {
    const accountObservable = new Subject<Account>();
    const subject = new ApiService(accountObservable, createTestAuthenticationMethodRegistry());
    subject.gitApi().subscribe(observer);
    const account: Account = {
      accountId: randomUUID(),
      organization: "some-org",
      authentication: { type: "personalAccessToken" },
      secrets: { personalAccessToken: "some-pat" },
      url: "some-url",
    };
    accountObservable.next(account);
    await setTimeout(1);
    accountObservable.next({ ...account, secrets: { personalAccessToken: "other-pat" } });
    await setTimeout(1);
    expect(observer.combined.mock.calls).toEqual([[expect.any(MockGitApi)], [expect.any(MockGitApi)]]);
  });

  test("emits an exception for an unknown authentication method", async () => {
    const accountObservable = new Subject<Account>();
    const subject = new ApiService(accountObservable, new AuthenticationMethodRegistry([]));
    subject.gitApi().subscribe(observer);
    accountObservable.next({
      accountId: randomUUID(),
      organization: "some-org",
      authentication: { type: "personalAccessToken" },
      url: "some-url",
    });
    await setTimeout(1);
    expect(observer.combined.mock.calls).toEqual([[expect.objectContaining({ error: expect.any(Error) })]]);
  });
});
