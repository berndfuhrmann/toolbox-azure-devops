import type { IRequestHandler } from "azure-devops-node-api/interfaces/common/VsoBaseInterfaces";
import { Observable } from "rxjs";
import { Account, Authentication, AuthenticationType } from "../account";

export type SignInStatus = "signedIn" | "signedOut";

export interface AuthenticationConfiguration {
  authentication: Authentication;
  secrets?: unknown;
}

/**
 * A way to authenticate against Azure DevOps. Everything outside of the
 * implementations only talks to this interface.
 */
export interface AuthenticationMethod {
  readonly type: AuthenticationType;
  /** Shown to the user when picking a method. */
  readonly label: string;
  /** Whether this method can be used for the given host URL at all. */
  isAvailableFor(url: string): boolean;
  /** Whether this method should be preselected for the given host URL. */
  isSuggestedFor(url: string): boolean;
  /**
   * Asks the user for everything the method needs. Returns undefined if the user cancelled.
   * @param accountId the account to configure; when adding an organization, the id it will be saved with
   */
  configure(url: string, organization: string, accountId: string): Promise<AuthenticationConfiguration | undefined>;
  /** Asks the user for new credentials of an existing account. Returns undefined if the user cancelled. */
  updateCredentials(account: Account): Promise<AuthenticationConfiguration | undefined>;
  /**
   * Creates the request handler for a snapshot of the account.
   * Asynchronous, so that a method can obtain a token before the first request is sent.
   */
  createRequestHandler(account: Account): Promise<IRequestHandler>;
  /** Whether the user is signed in for the account. Never prompts the user. */
  signInStatus(account: Account): Observable<SignInStatus>;
}
