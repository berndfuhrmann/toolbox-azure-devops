# Microsoft (Entra ID) Authentication

## Problem

Every organization currently needs a Personal Access Token (PAT). PATs are tedious to create and rotate, and organization admins increasingly restrict or disable them. Microsoft recommends Entra ID tokens instead.

## Goal

- Offer **Microsoft sign-in** (Entra ID, via VS Code's built-in `microsoft` authentication provider) for cloud organizations.
- Keep **PAT** as an equal option; each organization picks its method.
- Design for a later **Windows authentication** method (NTLM/Basic) for Azure DevOps Server / TFS, so it is "one more class".
- Fix the cleanup of per-account data when an organization is removed (today pinned items are left behind).

Not in scope: Azure CLI / `@azure/identity` credentials, the deprecated Azure DevOps OAuth apps.

## Delivery

The work is split into two pull requests:

1. **Preparation** — refactors storage, the account model and the API client around a pluggable `AuthenticationMethod`, with PAT as the only method. Visible changes are limited to bug fixes and the renamed/new commands.
2. **Microsoft authentication** — adds the Microsoft method and everything around it.

---

## Design

### Account model

```ts
type Authentication =
  | { type: "personalAccessToken" }
  | { type: "microsoft"; microsoftAccountId: string; microsoftAccountLabel: string; tenantId?: string }; // PR 2
// later: | { type: "windows"; user: string; domain?: string }

interface Account {
  accountId: string; // keeps its name
  url: string;
  organization: string;
  authentication: Authentication;
  secrets?: unknown; // interpreted only by the authentication method
}
```

- Non-secret method settings live in `authentication` (globalState).
- Secrets are stored as **one JSON value per organization** in `SecretStorage`, under the existing key. Each method owns a TypeBox schema for its secrets, e.g. PAT: `{ personalAccessToken: string }`, Windows (later): `{ password: string }`, Microsoft: none (VS Code holds the tokens). This allows methods with several secrets.
- The storage API `updateAccountPersonalAccessToken` becomes `updateAccountAuthentication(accountId, { authentication, secrets })`, so a method can also update its non-secret settings (e.g. the Microsoft account or tenant). Passing no secrets deletes the stored secrets.

### Stored account schema and migration

- Every stored account entry carries a `version`; a missing version means **v1** (today's format).
- On load, entries are migrated step by step and written back immediately.
- **v1 → v2**: adds `authentication: { type: "personalAccessToken" }` and wraps the plain PAT string as `{"personalAccessToken": "…"}`. Wrapping is idempotent (a value that already is the JSON object is kept), so an interrupted migration is safe.
- Entries with a version newer than the code knows are **skipped and kept**.
- Entries that are invalid even after migration are **logged and kept** (today they are deleted).
- This migration stays permanently.
- Downgrade: older versions strip unknown fields when parsing and never write entries back; a v2 entry then fails with an auth error, without data loss.
- If the PAT is updated while running an older version, a plain PAT ends up next to a v2 entry. The PAT method then treats the secrets as invalid, which leads to an authentication error with the "Update Credentials" action.

### Account-scoped data

- All per-account data is stored under `{extension}-accountData-{accountId}-{name}` through a storage API (`getAccountData` / `updateAccountData`). (`accountData` rather than `account`, so the prefix cannot be confused with the account entries `{extension}-accounts-{accountId}`.)
- `deleteAccount` removes the account entry, its secrets and every key with the account's data prefix. Future per-account data is cleaned up automatically as long as it uses this API.
- Pinned items move from the single legacy key `{extension}-pinnedTreeItems` to one key per account: copy, then delete the legacy key.
- An **orphan sweep** runs once at startup after accounts have loaded and deletes account data without an account.
- The legacy pin migration and the orphan sweep are temporary: both carry a `TODO(2027-06)` comment, and a unit test fails after 2027-06-30 as a reminder to remove them.

### Authentication methods

```ts
interface AuthenticationConfiguration {
  authentication: Authentication;
  secrets?: unknown;
}

interface AuthenticationMethod {
  readonly type: AuthenticationType;
  readonly label: string; // shown in the method picker
  isSuggestedFor(url: string): boolean;
  configure(url: string, organization: string): Promise<AuthenticationConfiguration | undefined>;
  updateCredentials(account: Account): Promise<AuthenticationConfiguration | undefined>;
  createRequestHandler(account: Pick<Account, "authentication" | "secrets">): IRequestHandler;
  // PR 2: status(account: Account): Observable<"signedIn" | "signedOut">;
}
```

- `updateCredentials` is what "Update Credentials", "Sign in again" and (PR 2) "Sign In" call; for PAT it asks for a new token.
- `status` is only needed once a method can be signed out, so it is added in PR 2.

- Implementations are bound in inversify under `types.AuthenticationMethod` and looked up through an `AuthenticationMethodRegistry` by `authentication.type`.
- The add-organization flow, the commands and `ApiService` only talk to this interface.
- `ApiService` (generated from `src-gen/ApiService.egl`) gets the request handler from the method instead of calling `getPersonalAccessTokenHandler`.

**Correction to the original plan (request handler):** `typed-rest-client`'s `IRequestHandler.prepareRequest` is synchronous, so a handler cannot asynchronously fetch a token per request. Instead:

- `createRequestHandler` takes an account **snapshot**.
- `ApiService` rebuilds its `WebApi` only when url, organization, `authentication` or `secrets` of _this_ account change (`distinctUntilChanged`), not on every account emission as today. Rebuilding on a secrets change is needed so that results that failed with the old credentials are fetched again.
- The Microsoft handler (PR 2) keeps a cached token, refreshes it on `vscode.authentication.onDidChangeSessions`, and on a 401 fetches a fresh token silently in `handleAuthentication` and retries once.

### Commands and UX

- **Add Organization**: URL → organization (taken from the URL when a full `https://dev.azure.com/{org}` URL is pasted) → method picker with the suggested method preselected (skipped while only one method exists) → the method's own steps → connection test (`connectionData`) with "Save anyway" / "Cancel". Cancelling any step ends the flow.
- **Update Credentials** replaces "Update Personal Access Token (PAT)"; each method decides what it means. The PAT prompt is a password input.
- **Change Sign-in Method** (PR 2): re-runs the method picker and the method's steps for an existing organization.
- **Sign In** (PR 2): only shown for signed-out organizations.
- Account tree items get context tags only where a menu needs them, added explicitly with `updateTag` (e.g. `signed-out` for "Sign In"), not one generated tag per method.
- **Auth errors**: HTTP 401 errors are tagged (`authentication-error`) and get an "Update Credentials" action. Only 401: a 403 means missing permissions, not bad credentials. Error items do not know their account; the action uses the single account, or asks via a quick pick when there are several.

### Microsoft method (PR 2)

- Uses `vscode.authentication.getSession("microsoft", ["499b84ac-1321-427f-aa17-267ca6975798/.default", …tenant scope])`.
- Remembers the Microsoft account per organization (`microsoftAccountId`, `microsoftAccountLabel`); the add flow shows an account picker when several sessions exist.
- Never prompts at startup: tokens are requested silently. Without a session, the organization shows "Signed out", a "Sign in to {org}" child item, and VS Code's Accounts menu badge (`createIfNone: false`). Interactive sign-in only on user action.
- When the remembered Microsoft account is gone, "Sign In" shows the account picker with the previous account preselected.
- **Host allowlist**: only `https://dev.azure.com/…` and `https://*.visualstudio.com/…`, checked in the method picker and again in the request handler. A Microsoft token for Azure DevOps works for every organization the user can reach, so it must never go to another host.
- **Tenant**:
  1. On add: unauthenticated request to `https://dev.azure.com/{org}/_apis/connectionData`; store the `X-VSS-ResourceTenant` header as `tenantId`. If missing, zero or failing: one optional input for a tenant ID (empty = home tenant).
  2. Every request: token for `VSCODE_TENANT:{tenantId}` when a tenant is set.
  3. On 401: look up once more. Changed tenant → store and retry once. Otherwise mark the organization as needing sign-in; no further automatic retries.
  4. Sign In / Update Credentials: interactive; shows the tenant input again when the last lookup failed. A successful lookup overrides a typed tenant.
- **Cleanup**: switching PAT → Microsoft deletes the PAT. Switching Microsoft → PAT and removing an organization leave the VS Code Microsoft session alone.

---

## PR 1: Preparation

- [x] Account model: `authentication`, `secrets`; update `compareAccount`.
- [x] Storage: versioned account entries, v1 → v2 migration, skip newer, keep invalid.
- [x] Storage: `updateAccountAuthentication` replaces `updateAccountPersonalAccessToken`.
- [x] Storage: account-scoped data API, pinned items per account, legacy pin migration, `deleteAccount` cascade, orphan sweep, `TODO(2027-06)` + reminder test.
- [x] `AuthenticationMethod` interface, registry, `PersonalAccessTokenAuthenticationMethod`.
- [x] `ApiService.egl`: handler from the method, rebuild only on relevant changes.
- [x] Add Organization: reworked flow (cancellation, URL parsing, connection test); method picker prepared but skipped with one method.
- [x] "Update Credentials" command replacing "Update PAT".
- [x] Tag 401 errors and offer "Update Credentials" on them.
- [x] Unit tests: storage migration, account data and orphan sweep, PAT method, `ApiService` rebuild behaviour, add flow incl. cancellation, update credentials, 401 tagging, 2027 reminder.

## PR 2: Microsoft authentication

- [ ] `status` in `AuthenticationMethod`; `MicrosoftAuthenticationMethod` with account picker, silent token handling, token cache and refresh, 401 retry.
- [ ] Host allowlist (picker + request time).
- [ ] Tenant lookup, optional tenant input, single re-lookup on 401.
- [ ] Signed-out state: account description, "Sign in to {org}" child item, Accounts menu badge, "Sign In" command.
- [ ] "Change Sign-in Method" command incl. secrets cleanup.
- [ ] Method picker enabled in Add Organization.
- [ ] Unit tests with mocked `vscode.authentication`: configure, handler, allowlist, tenant lookup and retry limit, signed-out state.
- [ ] Manual test checklist in the PR (real browser sign-in, guest tenant, sign-out, removed account).
