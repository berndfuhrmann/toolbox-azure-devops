import { TupleMap } from "@nfi/tuplemap";
import { inject, injectable } from "inversify";
import { defer, distinctUntilChanged, map, Observable, of, startWith, Subject } from "rxjs";
import vscode from "vscode";
import { AbstractStorageService } from "../../../common/storage/AbstractStorageService";
import { types } from "../../../generated/types";
import { Account, Authentication, buildAccountUrl } from "../account";
import { AuthenticationConfiguration, AuthenticationMethod, SignInStatus } from "./AuthenticationMethod";
import { isMicrosoftAuthenticationUrl, MicrosoftRequestHandler } from "./MicrosoftRequestHandler";
import { lookupTenant, promptForTenant } from "./microsoftTenant";

const microsoftProviderId = "microsoft";
/** The Azure DevOps resource. */
const azureDevOpsScope = "499b84ac-1321-427f-aa17-267ca6975798/.default";

type MicrosoftAuthentication = Extract<Authentication, { type: "microsoft" }>;

function asMicrosoftAuthentication(authentication: Authentication) {
  return authentication.type === "microsoft" ? authentication : undefined;
}

function scopes(tenantId: string | undefined) {
  return tenantId ? [azureDevOpsScope, `VSCODE_TENANT:${tenantId}`] : [azureDevOpsScope];
}

function tokenKey(authentication: MicrosoftAuthentication): [string, string] {
  return [authentication.microsoftAccountId, authentication.tenantId ?? ""];
}

@injectable()
export class MicrosoftAuthenticationMethod implements AuthenticationMethod {
  readonly type = "microsoft";
  readonly label = "Microsoft Account";
  #storageService: AbstractStorageService;
  /** The latest token per Microsoft account and tenant, shared by all request handlers. */
  #tokens: TupleMap<[string, string], { authentication: MicrosoftAuthentication; token: string | undefined }, 2> =
    new TupleMap(2);
  /** Per account, the token that was not accepted even after refreshing it. A new token is tried again. */
  #rejectedTokens = new Map<string, string>();
  /** Emits whenever a token or a rejection changed. */
  #changes = new Subject<void>();

  constructor(
    @inject(types.vscodeContext) context: vscode.ExtensionContext,
    @inject(types.StorageService) storageService: AbstractStorageService,
  ) {
    this.#storageService = storageService;
    context.subscriptions.push(
      vscode.authentication.onDidChangeSessions((event) => {
        if (event.provider.id === microsoftProviderId) {
          void this.#refreshTokens();
        }
      }),
    );
  }

  isAvailableFor(url: string) {
    return isMicrosoftAuthenticationUrl(url);
  }

  isSuggestedFor(url: string) {
    return isMicrosoftAuthenticationUrl(url);
  }

  async configure(url: string, organization: string, accountId: string) {
    const tenantId = await this.#resolveTenant(url, organization, undefined);
    if (tenantId === undefined) {
      return undefined;
    }
    // lets the user pick one of the signed-in accounts or sign in with another one
    const configuration = await this.#signIn(tenantId, { createIfNone: true, clearSessionPreference: true });
    if (configuration) {
      this.#acceptAgain(accountId);
    }
    return configuration;
  }

  async updateCredentials(account: Account) {
    const authentication = asMicrosoftAuthentication(account.authentication);
    if (!authentication) {
      return this.configure(account.url, account.organization, account.accountId);
    }
    const tenantId = await this.#resolveTenant(account.url, account.organization, authentication.tenantId);
    if (tenantId === undefined) {
      return undefined;
    }
    const configuration = await this.#signIn(tenantId, {
      forceNewSession: true,
      account: toAccountInformation(authentication),
    });
    if (configuration) {
      this.#acceptAgain(account.accountId);
    }
    return configuration;
  }

  /** The user explicitly signed in, so a rejected token of the account is worth another try. */
  #acceptAgain(accountId: string) {
    this.#rejectedTokens.delete(accountId);
    this.#changes.next();
  }

  async createRequestHandler(account: Account) {
    const initialAuthentication = asMicrosoftAuthentication(account.authentication);
    if (!initialAuthentication) {
      throw new Error(`Expected Microsoft authentication, got ${account.authentication.type}`);
    }
    let authentication = initialAuthentication;
    // without a token, requests fail with 401, which offers the user to update the credentials
    await this.#refreshToken(authentication);
    let tenantUpdate: Promise<void> | undefined;
    return new MicrosoftRequestHandler(
      () => this.#tokens.get(tokenKey(authentication))?.token,
      async () => {
        // a 401 may mean the organization moved to another tenant; looked up only once to avoid repeated requests
        tenantUpdate ??= this.#updateTenant(account, authentication).then((updated) => {
          authentication = updated;
        });
        await tenantUpdate;
        return this.#refreshToken(authentication);
      },
      (token) => {
        this.#rejectedTokens.set(account.accountId, token);
        this.#changes.next();
      },
    );
  }

  signInStatus(account: Account): Observable<SignInStatus> {
    const authentication = asMicrosoftAuthentication(account.authentication);
    if (!authentication) {
      return of("signedIn");
    }
    return defer(() => {
      if (!this.#tokens.has(tokenKey(authentication))) {
        void this.#refreshToken(authentication);
      }
      return this.#changes.pipe(startWith(undefined));
    }).pipe(
      map(() => this.#currentSignInStatus(account.accountId, authentication)),
      distinctUntilChanged(),
    );
  }

  #currentSignInStatus(accountId: string, authentication: MicrosoftAuthentication): SignInStatus {
    const entry = this.#tokens.get(tokenKey(authentication));
    if (!entry) {
      // not known yet; assumed signed in, so that signed-in organizations do not flicker at startup
      return "signedIn";
    }
    return entry.token && entry.token !== this.#rejectedTokens.get(accountId) ? "signedIn" : "signedOut";
  }

  /**
   * Returns the tenant to use: the looked up one, or else the one entered by the user.
   * An empty string means the home tenant, undefined that the user cancelled.
   */
  async #resolveTenant(url: string, organization: string, tenantId: string | undefined) {
    return (await lookupTenant(buildAccountUrl({ url, organization }))) ?? promptForTenant(organization, tenantId);
  }

  /** Stores a changed tenant. The stored account triggers a reconnect, the current handler uses it right away. */
  async #updateTenant(account: Account, authentication: MicrosoftAuthentication) {
    const tenantId = await lookupTenant(buildAccountUrl(account));
    if (!tenantId || tenantId === authentication.tenantId) {
      return authentication;
    }
    const updated: MicrosoftAuthentication = { ...authentication, tenantId };
    await this.#storageService.updateAccountAuthentication(account.accountId, {
      authentication: updated,
      secrets: account.secrets,
    });
    return updated;
  }

  async #signIn(
    tenantId: string,
    options: vscode.AuthenticationGetSessionOptions,
  ): Promise<AuthenticationConfiguration | undefined> {
    let session: vscode.AuthenticationSession | undefined;
    try {
      session = await vscode.authentication.getSession(microsoftProviderId, scopes(tenantId), options);
    } catch {
      // the user cancelled the sign-in
      return undefined;
    }
    if (!session) {
      return undefined;
    }
    const authentication: MicrosoftAuthentication = {
      type: this.type,
      microsoftAccountId: session.account.id,
      microsoftAccountLabel: session.account.label,
      ...(tenantId && { tenantId }),
    };
    this.#tokens.set(tokenKey(authentication), { authentication, token: session.accessToken });
    this.#changes.next();
    return { authentication };
  }

  /**
   * Fetches the token without ever prompting the user. Without a session, VS Code offers the sign-in in its Accounts
   * menu, which leads to a session change.
   */
  async #refreshToken(authentication: MicrosoftAuthentication) {
    let token: string | undefined;
    try {
      const session = await vscode.authentication.getSession(microsoftProviderId, scopes(authentication.tenantId), {
        account: toAccountInformation(authentication),
      });
      token = session?.accessToken;
    } catch {
      token = undefined;
    }
    this.#tokens.set(tokenKey(authentication), { authentication, token });
    this.#changes.next();
    return token;
  }

  async #refreshTokens() {
    await Promise.all([...this.#tokens.values()].map(({ authentication }) => this.#refreshToken(authentication)));
  }
}

function toAccountInformation(authentication: MicrosoftAuthentication): vscode.AuthenticationSessionAccountInformation {
  return { id: authentication.microsoftAccountId, label: authentication.microsoftAccountLabel };
}
