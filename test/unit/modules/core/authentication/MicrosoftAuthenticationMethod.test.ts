import type { IHttpClient, IRequestInfo } from "azure-devops-node-api/interfaces/common/VsoBaseInterfaces";
import type { RequestOptions } from "http";
import { firstValueFrom } from "rxjs";
import vscode from "vscode";
import { Account } from "../../../../../src/modules/core/account";
import { MicrosoftAuthenticationMethod } from "../../../../../src/modules/core/authentication/MicrosoftAuthenticationMethod";
import { lookupTenant, promptForTenant } from "../../../../../src/modules/core/authentication/microsoftTenant";
import { MemoryStorageService } from "../../../helper/MemoryStorageService";
import { createMockContext } from "../../../mocks/mockContext";

vi.mock("../../../../../src/modules/core/authentication/microsoftTenant", () => ({
  lookupTenant: vi.fn(),
  promptForTenant: vi.fn(),
}));

const azureDevOpsScope = "499b84ac-1321-427f-aa17-267ca6975798/.default";
const scopes = [azureDevOpsScope];
const tenantScopes = (tenantId: string) => [azureDevOpsScope, `VSCODE_TENANT:${tenantId}`];

const session = (accessToken: string, id = "ms-id", label = "user@example.com") =>
  ({ id: "session", accessToken, account: { id, label }, scopes }) as vscode.AuthenticationSession;

const microsoftAuthentication = {
  type: "microsoft" as const,
  microsoftAccountId: "ms-id",
  microsoftAccountLabel: "user@example.com",
};

const account: Account = {
  accountId: "id-1",
  url: "https://dev.azure.com/",
  organization: "org",
  authentication: microsoftAuthentication,
};

const authorizationOf = (handler: Awaited<ReturnType<MicrosoftAuthenticationMethod["createRequestHandler"]>>) => {
  const options: RequestOptions = { host: "dev.azure.com", headers: {} };
  handler.prepareRequest(options);
  return (options.headers as Record<string, string>)["Authorization"];
};

/** Lets the handler answer a 401 and returns the Authorization header of the retried request. */
const retryAfterUnauthorized = async (
  handler: Awaited<ReturnType<MicrosoftAuthenticationMethod["createRequestHandler"]>>,
  retryStatusCode = 200,
) => {
  const httpClient = {
    requestRaw: vi.fn().mockResolvedValue({ message: { statusCode: retryStatusCode } }),
  } as unknown as IHttpClient;
  const requestInfo = { options: { host: "dev.azure.com", headers: {} } } as unknown as IRequestInfo;
  await handler.handleAuthentication(httpClient, requestInfo, undefined);
  return (requestInfo.options.headers as Record<string, string>)["Authorization"];
};

let subject: MicrosoftAuthenticationMethod;
let storageService: MemoryStorageService;
let fireDidChangeSessions: (event: vscode.AuthenticationSessionsChangeEvent) => void;

beforeEach(() => {
  vi.mocked(vscode.authentication.getSession).mockReset();
  vi.mocked(lookupTenant).mockReset().mockResolvedValue(undefined);
  vi.mocked(promptForTenant).mockReset().mockResolvedValue("");
  vi.mocked(vscode.authentication.onDidChangeSessions).mockImplementation((listener: any) => {
    fireDidChangeSessions = listener;
    return { dispose: vi.fn() };
  });
  storageService = new MemoryStorageService();
  subject = new MicrosoftAuthenticationMethod(createMockContext(), storageService);
});

test.each([
  ["https://dev.azure.com/", true],
  ["https://my-org.visualstudio.com/", true],
  ["https://tfs.example.com/tfs/", false],
])("is available and suggested for %s: %s", (url, expected) => {
  expect(subject.isAvailableFor(url)).toBe(expected);
  expect(subject.isSuggestedFor(url)).toBe(expected);
});

describe("configure", () => {
  test("lets the user pick an account and remembers it", async () => {
    vi.mocked(vscode.authentication.getSession).mockResolvedValue(session("token"));

    expect(await subject.configure("https://dev.azure.com/", "org")).toEqual({
      authentication: account.authentication,
    });
    expect(vscode.authentication.getSession).toHaveBeenCalledWith("microsoft", scopes, {
      createIfNone: true,
      clearSessionPreference: true,
    });
  });

  test("signs in to the looked up tenant without asking", async () => {
    vi.mocked(lookupTenant).mockResolvedValue("tenant");
    vi.mocked(vscode.authentication.getSession).mockResolvedValue(session("token"));

    expect(await subject.configure("https://dev.azure.com/", "org")).toEqual({
      authentication: { ...microsoftAuthentication, tenantId: "tenant" },
    });
    expect(lookupTenant).toHaveBeenCalledWith("https://dev.azure.com/org");
    expect(promptForTenant).not.toHaveBeenCalled();
    expect(vscode.authentication.getSession).toHaveBeenCalledWith(
      "microsoft",
      tenantScopes("tenant"),
      expect.anything(),
    );
  });

  test("signs in to the entered tenant if the lookup failed", async () => {
    vi.mocked(promptForTenant).mockResolvedValue("typed");
    vi.mocked(vscode.authentication.getSession).mockResolvedValue(session("token"));

    expect(await subject.configure("https://dev.azure.com/", "org")).toEqual({
      authentication: { ...microsoftAuthentication, tenantId: "typed" },
    });
    expect(vscode.authentication.getSession).toHaveBeenCalledWith(
      "microsoft",
      tenantScopes("typed"),
      expect.anything(),
    );
  });

  test("returns undefined if the user cancels the tenant input", async () => {
    vi.mocked(promptForTenant).mockResolvedValue(undefined);

    expect(await subject.configure("https://dev.azure.com/", "org")).toBeUndefined();
    expect(vscode.authentication.getSession).not.toHaveBeenCalled();
  });

  test("returns undefined if the user cancels the sign-in", async () => {
    vi.mocked(vscode.authentication.getSession).mockRejectedValue(new Error("User did not consent to login."));

    expect(await subject.configure("https://dev.azure.com/", "org")).toBeUndefined();
  });
});

describe("updateCredentials", () => {
  test("signs in again with the remembered account", async () => {
    vi.mocked(vscode.authentication.getSession).mockResolvedValue(session("token"));

    expect(await subject.updateCredentials(account)).toEqual({ authentication: account.authentication });
    expect(vscode.authentication.getSession).toHaveBeenCalledWith("microsoft", scopes, {
      forceNewSession: true,
      account: { id: "ms-id", label: "user@example.com" },
    });
  });

  test("offers the stored tenant if the lookup failed", async () => {
    vi.mocked(vscode.authentication.getSession).mockResolvedValue(session("token"));

    await subject.updateCredentials({ ...account, authentication: { ...microsoftAuthentication, tenantId: "old" } });

    expect(promptForTenant).toHaveBeenCalledWith("org", "old");
  });

  test("prefers the looked up tenant over the stored one", async () => {
    vi.mocked(lookupTenant).mockResolvedValue("new");
    vi.mocked(vscode.authentication.getSession).mockResolvedValue(session("token"));

    expect(
      await subject.updateCredentials({ ...account, authentication: { ...microsoftAuthentication, tenantId: "old" } }),
    ).toEqual({ authentication: { ...microsoftAuthentication, tenantId: "new" } });
    expect(promptForTenant).not.toHaveBeenCalled();
  });

  test("lets the user pick an account if the organization used another method", async () => {
    vi.mocked(vscode.authentication.getSession).mockResolvedValue(session("token"));

    await subject.updateCredentials({ ...account, authentication: { type: "personalAccessToken" } });

    expect(vscode.authentication.getSession).toHaveBeenCalledWith(
      "microsoft",
      scopes,
      expect.objectContaining({ clearSessionPreference: true }),
    );
  });
});

describe("createRequestHandler", () => {
  test("fetches the token without prompting before the first request", async () => {
    vi.mocked(vscode.authentication.getSession).mockResolvedValue(session("token"));

    const handler = await subject.createRequestHandler(account);

    expect(authorizationOf(handler)).toBe("Bearer token");
    expect(vscode.authentication.getSession).toHaveBeenCalledWith("microsoft", scopes, {
      account: { id: "ms-id", label: "user@example.com" },
    });
  });

  test("requests the token for the stored tenant", async () => {
    vi.mocked(vscode.authentication.getSession).mockResolvedValue(session("token"));

    await subject.createRequestHandler({ ...account, authentication: { ...microsoftAuthentication, tenantId: "t" } });

    expect(vscode.authentication.getSession).toHaveBeenCalledWith("microsoft", tenantScopes("t"), expect.anything());
  });

  test("sends no token if the user is signed out", async () => {
    vi.mocked(vscode.authentication.getSession).mockResolvedValue(undefined);

    expect(authorizationOf(await subject.createRequestHandler(account))).toBeUndefined();
  });

  test("uses the new token after the sessions changed", async () => {
    vi.mocked(vscode.authentication.getSession).mockResolvedValue(session("old"));
    const handler = await subject.createRequestHandler(account);
    vi.mocked(vscode.authentication.getSession).mockResolvedValue(session("new"));

    fireDidChangeSessions({ provider: { id: "microsoft", label: "Microsoft" } });
    await vi.waitFor(() => expect(authorizationOf(handler)).toBe("Bearer new"));
  });

  test("ignores session changes of other providers", async () => {
    vi.mocked(vscode.authentication.getSession).mockResolvedValue(session("token"));
    await subject.createRequestHandler(account);
    vi.mocked(vscode.authentication.getSession).mockClear();

    fireDidChangeSessions({ provider: { id: "github", label: "GitHub" } });

    expect(vscode.authentication.getSession).not.toHaveBeenCalled();
  });

  test("rejects accounts of other methods", async () => {
    await expect(
      subject.createRequestHandler({ ...account, authentication: { type: "personalAccessToken" } }),
    ).rejects.toThrow();
  });

  describe("on 401", () => {
    beforeEach(async () => {
      await storageService.addAccount(account);
    });

    test("stores a changed tenant and retries with its token", async () => {
      vi.mocked(vscode.authentication.getSession).mockImplementation(async (_, scopes) =>
        session((scopes as string[]).includes("VSCODE_TENANT:new") ? "new-token" : "old-token"),
      );
      const handler = await subject.createRequestHandler(account);
      vi.mocked(lookupTenant).mockResolvedValue("new");

      expect(await retryAfterUnauthorized(handler)).toBe("Bearer new-token");
      expect(authorizationOf(handler)).toBe("Bearer new-token");
      expect((await firstValueFrom(storageService.getAccounts()))[0].authentication).toEqual({
        ...account.authentication,
        tenantId: "new",
      });
    });

    test("keeps the account if the tenant did not change", async () => {
      vi.mocked(vscode.authentication.getSession).mockResolvedValue(session("token"));
      const handler = await subject.createRequestHandler(account);
      const updateAccountAuthentication = vi.spyOn(storageService, "updateAccountAuthentication");

      expect(await retryAfterUnauthorized(handler)).toBe("Bearer token");
      expect(updateAccountAuthentication).not.toHaveBeenCalled();
    });

    test("looks up the tenant only once", async () => {
      vi.mocked(vscode.authentication.getSession).mockResolvedValue(session("token"));
      const handler = await subject.createRequestHandler(account);

      await retryAfterUnauthorized(handler);
      await retryAfterUnauthorized(handler);

      expect(lookupTenant).toHaveBeenCalledTimes(1);
    });
  });
});

describe("signInStatus", () => {
  const statuses = (subject: MicrosoftAuthenticationMethod, account: Account) => {
    const values: string[] = [];
    subject.signInStatus(account).subscribe((status) => values.push(status));
    return values;
  };

  test("is signed in for other methods", async () => {
    expect(
      await firstValueFrom(subject.signInStatus({ ...account, authentication: { type: "personalAccessToken" } })),
    ).toBe("signedIn");
  });

  test("looks up the session without prompting and reports a missing one as signed out", async () => {
    vi.mocked(vscode.authentication.getSession).mockResolvedValue(undefined);

    const values = statuses(subject, account);

    await vi.waitFor(() => expect(values).toEqual(["signedIn", "signedOut"]));
    expect(vscode.authentication.getSession).toHaveBeenCalledWith("microsoft", scopes, {
      account: { id: "ms-id", label: "user@example.com" },
    });
  });

  test("reports signing in through the Accounts menu", async () => {
    vi.mocked(vscode.authentication.getSession).mockResolvedValue(undefined);
    const values = statuses(subject, account);
    await vi.waitFor(() => expect(values).toEqual(["signedIn", "signedOut"]));

    vi.mocked(vscode.authentication.getSession).mockResolvedValue(session("token"));
    fireDidChangeSessions({ provider: { id: "microsoft", label: "Microsoft" } });

    await vi.waitFor(() => expect(values).toEqual(["signedIn", "signedOut", "signedIn"]));
  });

  test("reports a token that was rejected after refreshing it as signed out", async () => {
    vi.mocked(vscode.authentication.getSession).mockResolvedValue(session("token"));
    const handler = await subject.createRequestHandler(account);
    const values = statuses(subject, account);

    await retryAfterUnauthorized(handler, 401);

    expect(values).toEqual(["signedIn", "signedOut"]);
  });

  test("only affects the organization whose request was rejected", async () => {
    vi.mocked(vscode.authentication.getSession).mockResolvedValue(session("token"));
    const handler = await subject.createRequestHandler(account);
    const otherValues = statuses(subject, { ...account, accountId: "id-2" });

    await retryAfterUnauthorized(handler, 401);

    expect(otherValues).toEqual(["signedIn"]);
  });

  test.each([
    ["a new token", () => fireDidChangeSessions({ provider: { id: "microsoft", label: "Microsoft" } })],
    ["signing in again", () => subject.updateCredentials(account)],
  ])("tries again after %s", async (_, retry) => {
    vi.mocked(vscode.authentication.getSession).mockResolvedValue(session("token"));
    const handler = await subject.createRequestHandler(account);
    const values = statuses(subject, account);
    await retryAfterUnauthorized(handler, 401);
    vi.mocked(vscode.authentication.getSession).mockResolvedValue(session("new-token"));

    await retry();

    await vi.waitFor(() => expect(values).toEqual(["signedIn", "signedOut", "signedIn"]));
  });
});
