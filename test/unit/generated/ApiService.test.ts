import { setTimeout } from "timers/promises";
import { ApiService } from "../../../src/generated/ApiService";
import { createTestAuthenticationMethodRegistry } from "../helper/authentication";
import { AuthenticationMethodRegistry } from "../../../src/modules/core/authentication/AuthenticationMethodRegistry";
import { createTestObserver } from "../helper/observables";
import { MockGitApi } from "../mocks/ado/WebApi";
import { Account } from "../../../src/modules/core/account";
import { BehaviorSubject, Observable, of, ReplaySubject, Subject } from "rxjs";
import { randomUUID } from "crypto";
import type { IRequestHandler } from "azure-devops-node-api/interfaces/common/VsoBaseInterfaces";
import { AuthenticationMethod, SignInStatus } from "../../../src/modules/core/authentication/AuthenticationMethod";

vi.mock("azure-devops-node-api", async (importOriginal) => {
  return {
    ...(await importOriginal<typeof import("azure-devops-node-api")>()),
    WebApi: (await import("../mocks/ado/WebApi.js")).MockWebApi,
    getPersonalAccessTokenHandler: (token: string) => "token:" + token,
  };
});

function createAccount(organization = "some-org"): Account {
  return {
    accountId: randomUUID(),
    organization,
    authentication: { type: "personalAccessToken" },
    secrets: { personalAccessToken: "some-pat" },
    url: "some-url",
  };
}

function createRegistry(
  createRequestHandler: AuthenticationMethod["createRequestHandler"],
  status: Observable<SignInStatus> = of("signedIn"),
) {
  const method: AuthenticationMethod = {
    type: "personalAccessToken",
    label: "Test",
    isAvailableFor: () => true,
    isSuggestedFor: () => false,
    configure: vi.fn(),
    updateCredentials: vi.fn(),
    createRequestHandler,
    signInStatus: () => status,
  };
  return new AuthenticationMethodRegistry([method]);
}

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

  test("waits for the request handler before creating the connection", async () => {
    const accountObservable = new Subject<Account>();
    const { promise, resolve } = Promise.withResolvers<IRequestHandler>();
    const subject = new ApiService(
      accountObservable,
      createRegistry(() => promise),
    );
    subject.gitApi().subscribe(observer);
    accountObservable.next(createAccount());
    await setTimeout(1);
    expect(observer.combined.mock.calls).toEqual([]);
    resolve({} as IRequestHandler);
    await setTimeout(1);
    expect(observer.combined.mock.calls).toEqual([[expect.any(MockGitApi)]]);
  });

  test("ignores a request handler for an outdated account", async () => {
    const accountObservable = new Subject<Account>();
    const outdated = Promise.withResolvers<IRequestHandler>();
    const current = Promise.withResolvers<IRequestHandler>();
    const createRequestHandler = vi
      .fn<AuthenticationMethod["createRequestHandler"]>()
      .mockReturnValueOnce(outdated.promise)
      .mockReturnValueOnce(current.promise);
    const subject = new ApiService(accountObservable, createRegistry(createRequestHandler));
    subject.gitApi().subscribe(observer);
    accountObservable.next(createAccount("outdated"));
    accountObservable.next(createAccount("current"));
    current.resolve({} as IRequestHandler);
    await setTimeout(1);
    outdated.resolve({} as IRequestHandler);
    await setTimeout(1);
    expect(observer.combined.mock.calls).toEqual([[expect.any(MockGitApi)]]);
  });

  test("emits an exception if the request handler cannot be created", async () => {
    const accountObservable = new Subject<Account>();
    const subject = new ApiService(
      accountObservable,
      createRegistry(() => Promise.reject(new Error("no token"))),
    );
    subject.gitApi().subscribe(observer);
    accountObservable.next(createAccount());
    await setTimeout(1);
    expect(observer.combined.mock.calls).toEqual([[expect.objectContaining({ error: expect.any(Error) })]]);
  });

  test("reconnects when the sign-in status changes", async () => {
    const accountObservable = new Subject<Account>();
    const status = new BehaviorSubject<SignInStatus>("signedIn");
    const createRequestHandler = vi.fn(async () => ({}) as IRequestHandler);
    const subject = new ApiService(accountObservable, createRegistry(createRequestHandler, status));
    subject.gitApi().subscribe(observer);
    accountObservable.next(createAccount());
    await setTimeout(1);
    status.next("signedIn");
    await setTimeout(1);
    status.next("signedOut");
    await setTimeout(1);
    status.next("signedIn");
    await setTimeout(1);
    expect(createRequestHandler).toHaveBeenCalledTimes(2);
    expect(observer.combined.mock.calls).toEqual([
      [expect.any(MockGitApi)],
      [expect.objectContaining({ error: expect.any(Error) })],
      [expect.any(MockGitApi)],
    ]);
  });

  test("does not connect while signed out", async () => {
    const accountObservable = new Subject<Account>();
    const createRequestHandler = vi.fn(async () => ({}) as IRequestHandler);
    const subject = new ApiService(accountObservable, createRegistry(createRequestHandler, of("signedOut")));
    subject.gitApi().subscribe(observer);
    accountObservable.next(createAccount("my-org"));
    await setTimeout(1);
    expect(createRequestHandler).not.toHaveBeenCalled();
    expect(observer.combined.mock.calls).toEqual([
      [expect.objectContaining({ error: new Error("Signed out of my-org") })],
    ]);
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
