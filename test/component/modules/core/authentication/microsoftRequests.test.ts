import { WebApi } from "azure-devops-node-api";
import nock from "nock";
import { firstValueFrom } from "rxjs";
import vscode from "vscode";
import { Account, buildAccountUrl } from "../../../../../src/modules/core/account";
import { MicrosoftAuthenticationMethod } from "../../../../../src/modules/core/authentication/MicrosoftAuthenticationMethod";
import { PersonalAccessTokenAuthenticationMethod } from "../../../../../src/modules/core/authentication/PersonalAccessTokenAuthenticationMethod";
import { MemoryStorageService } from "../../../../unit/helper/MemoryStorageService";
import { createMockContext } from "../../../../unit/mocks/mockContext";

// Runs the real authentication method, request handler and HTTP client against a fake Azure DevOps, so that retries,
// redirects and the host check are tested the way they happen in the extension.

interface Request {
  url: string;
  authorization: string | undefined;
  fedAuthRedirect: string | undefined;
}

const account: Account = {
  accountId: "id-1",
  url: "https://dev.azure.com/",
  organization: "org",
  authentication: {
    type: "microsoft",
    microsoftAccountId: "ms-id",
    microsoftAccountLabel: "user@example.com",
    tenantId: "tenant-1",
  },
};

let requests: Request[];
/** The tokens Azure DevOps accepts. */
let acceptedTokens: Set<string>;
/** Redirect targets by requested URL. */
let redirects: Record<string, string>;
/** The tenant Azure DevOps reports for the organization. */
let organizationTenant: string;
/** The token VS Code returns per tenant, undefined if the user is signed out. */
let sessionTokens: Record<string, string | undefined>;
let storageService: MemoryStorageService;
let subject: MicrosoftAuthenticationMethod;

/** Answers like Azure DevOps for a private organization: data only with an accepted token. */
function fakeAzureDevOps(host: string) {
  return nock(`https://${host}`)
    .persist()
    .get(/.*/)
    .reply(function (path) {
      const url = `https://${host}${path}`;
      const authorization = this.req.headers["authorization"] as string | undefined;
      requests.push({
        url,
        authorization,
        fedAuthRedirect: this.req.headers["x-tfs-fedauthredirect"] as string | undefined,
      });
      if (redirects[url]) {
        return [302, "", { Location: redirects[url] }];
      }
      const token = authorization?.replace(/^Bearer /, "");
      const tenantHeader = { "X-VSS-ResourceTenant": organizationTenant };
      return token && acceptedTokens.has(token) ? [200, { value: "data" }, tenantHeader] : [401, "", tenantHeader];
    });
}

function createWebApi(handler: Awaited<ReturnType<MicrosoftAuthenticationMethod["createRequestHandler"]>>) {
  return new WebApi(buildAccountUrl(account), handler);
}

const signInStatus = (method = subject) => firstValueFrom(method.signInStatus(account));

/** Makes Azure DevOps reject the current token, which leaves the organization signed out. */
async function rejectToken() {
  acceptedTokens.clear();
  const webApi = createWebApi(await subject.createRequestHandler(account));
  await expect(webApi.connect()).rejects.toMatchObject({ statusCode: 401 });
  expect(await signInStatus()).toBe("signedOut");
}

beforeAll(() => {
  nock.disableNetConnect();
});

afterAll(() => {
  nock.enableNetConnect();
});

beforeEach(async () => {
  requests = [];
  redirects = {};
  acceptedTokens = new Set(["token-1"]);
  organizationTenant = "tenant-1";
  sessionTokens = { "tenant-1": "token-1" };
  vi.mocked(vscode.authentication.onDidChangeSessions).mockReturnValue({ dispose: vi.fn() });
  vi.mocked(vscode.authentication.getSession)
    .mockReset()
    .mockImplementation(async (_providerId, scopeList) => {
      const scopes = scopeList as readonly string[];
      const tenantId = scopes.find((scope) => scope.startsWith("VSCODE_TENANT:"))?.slice("VSCODE_TENANT:".length);
      const accessToken = sessionTokens[tenantId ?? ""];
      return accessToken
        ? { id: "session", accessToken, account: { id: "ms-id", label: "user@example.com" }, scopes: [...scopes] }
        : undefined;
    });
  fakeAzureDevOps("dev.azure.com");
  fakeAzureDevOps("vsrm.dev.azure.com");
  fakeAzureDevOps("other.example");
  storageService = new MemoryStorageService();
  await storageService.addAccount(account);
  subject = new MicrosoftAuthenticationMethod(createMockContext(), storageService);
});

afterEach(() => {
  nock.cleanAll();
});

test("sends the token and suppresses the redirect to the sign-in page", async () => {
  const webApi = createWebApi(await subject.createRequestHandler(account));

  await webApi.connect();

  expect(requests).toEqual([
    {
      url: "https://dev.azure.com/org/_apis/connectionData",
      authorization: "Bearer token-1",
      fedAuthRedirect: "Suppress",
    },
  ]);
  expect(await signInStatus()).toBe("signedIn");
});

test("sends the token to service hosts of Azure DevOps", async () => {
  const webApi = createWebApi(await subject.createRequestHandler(account));

  await webApi.rest.client.get("https://vsrm.dev.azure.com/org/_apis/release/releases");

  expect(requests.map((request) => request.authorization)).toEqual(["Bearer token-1"]);
});

test("retries a rejected token once after looking up the tenant, then reports the organization as signed out", async () => {
  acceptedTokens.clear();
  const webApi = createWebApi(await subject.createRequestHandler(account));

  await expect(webApi.connect()).rejects.toMatchObject({ statusCode: 401 });

  expect(requests).toEqual([
    {
      url: "https://dev.azure.com/org/_apis/connectionData",
      authorization: "Bearer token-1",
      fedAuthRedirect: "Suppress",
    },
    // the tenant lookup, which works without a token
    { url: "https://dev.azure.com/org/_apis/connectionData", authorization: undefined, fedAuthRedirect: "Suppress" },
    {
      url: "https://dev.azure.com/org/_apis/connectionData",
      authorization: "Bearer token-1",
      fedAuthRedirect: "Suppress",
    },
  ]);
  expect(await signInStatus()).toBe("signedOut");
});

test("looks up the tenant only once for further rejected requests", async () => {
  acceptedTokens.clear();
  const webApi = createWebApi(await subject.createRequestHandler(account));
  await expect(webApi.connect()).rejects.toMatchObject({ statusCode: 401 });
  requests = [];

  await expect(webApi.connect()).rejects.toMatchObject({ statusCode: 401 });

  expect(requests.map((request) => request.authorization)).toEqual(["Bearer token-1", "Bearer token-1"]);
});

test("uses the new tenant if the organization moved", async () => {
  organizationTenant = "tenant-2";
  sessionTokens["tenant-2"] = "token-2";
  acceptedTokens = new Set(["token-2"]);
  const webApi = createWebApi(await subject.createRequestHandler(account));

  await webApi.connect();

  expect(requests.map((request) => request.authorization)).toEqual([
    "Bearer token-1",
    undefined, // tenant lookup
    "Bearer token-2",
  ]);
  const [storedAccount] = await firstValueFrom(storageService.getAccounts());
  expect(storedAccount.authentication).toMatchObject({ tenantId: "tenant-2" });
  expect(await signInStatus()).toBe("signedIn");
});

test("does not send the token along a redirect to another host", async () => {
  redirects["https://dev.azure.com/org/_apis/moved"] = "https://other.example/collect";
  acceptedTokens.clear(); // other.example answers 401 to the missing token, which must not lead to a retry with it
  const webApi = createWebApi(await subject.createRequestHandler(account));

  await webApi.rest.client.get("https://dev.azure.com/org/_apis/moved");

  expect(requests).toEqual([
    { url: "https://dev.azure.com/org/_apis/moved", authorization: "Bearer token-1", fedAuthRedirect: "Suppress" },
    { url: "https://other.example/collect", authorization: undefined, fedAuthRedirect: "Suppress" },
  ]);
});

test("refuses a redirect from https to http", async () => {
  redirects["https://dev.azure.com/org/_apis/moved"] = "http://dev.azure.com/org/_apis/connectionData";
  const webApi = createWebApi(await subject.createRequestHandler(account));

  await expect(webApi.rest.client.get("https://dev.azure.com/org/_apis/moved")).rejects.toThrow(/downgrade/);
});

test("keeps the organization signed in if a host that got no token answers 401", async () => {
  const webApi = createWebApi(await subject.createRequestHandler(account));

  await webApi.rest.client.get("https://other.example/data");

  expect(await signInStatus()).toBe("signedIn");
});

test("loads again after signing in once access is restored", async () => {
  await rejectToken();
  acceptedTokens.add("token-1");

  await subject.updateCredentials(account);
  const webApi = createWebApi(await subject.createRequestHandler(account));
  await webApi.connect();

  expect(await signInStatus()).toBe("signedIn");
});

test("loads again after changing the sign-in method to the same Microsoft account once access is restored", async () => {
  await rejectToken();
  acceptedTokens.add("token-1");

  await subject.configure(account.url, account.organization, account.accountId);

  expect(await signInStatus()).toBe("signedIn");
});

test("tries a rejected token once more after a restart, without prompting", async () => {
  await rejectToken();
  requests = [];

  const restarted = new MicrosoftAuthenticationMethod(createMockContext(), storageService);
  const webApi = createWebApi(await restarted.createRequestHandler(account));
  await expect(webApi.connect()).rejects.toMatchObject({ statusCode: 401 });

  expect(requests.map((request) => request.authorization)).toEqual([
    "Bearer token-1",
    undefined, // tenant lookup
    "Bearer token-1",
  ]);
  expect(await signInStatus(restarted)).toBe("signedOut");
  for (const [, , options] of vi.mocked(vscode.authentication.getSession).mock.calls) {
    expect(options).not.toMatchObject({ createIfNone: true });
    expect(options).not.toMatchObject({ forceNewSession: true });
  }
});

test("sends a personal access token without asking for a Microsoft session", async () => {
  const personalAccessTokenAccount: Account = {
    ...account,
    authentication: { type: "personalAccessToken" },
    secrets: { personalAccessToken: "pat" },
  };
  const handler = await new PersonalAccessTokenAuthenticationMethod().createRequestHandler(personalAccessTokenAccount);
  const webApi = new WebApi(buildAccountUrl(personalAccessTokenAccount), handler);

  await webApi.rest.client.get("https://dev.azure.com/org/_apis/connectionData");

  expect(requests.map((request) => request.authorization)).toEqual([
    `Basic ${Buffer.from("PAT:pat").toString("base64")}`,
  ]);
  expect(vscode.authentication.getSession).not.toHaveBeenCalled();
});
