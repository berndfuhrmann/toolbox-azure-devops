import type { IRequestHandler } from "azure-devops-node-api/interfaces/common/VsoBaseInterfaces";
import { Account, Authentication, AuthenticationType } from "../account";

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
  /** Whether this method should be preselected for the given host URL. */
  isSuggestedFor(url: string): boolean;
  /** Asks the user for everything the method needs. Returns undefined if the user cancelled. */
  configure(url: string, organization: string): Promise<AuthenticationConfiguration | undefined>;
  /** Asks the user for new credentials of an existing account. Returns undefined if the user cancelled. */
  updateCredentials(account: Account): Promise<AuthenticationConfiguration | undefined>;
  /** Creates the request handler for a snapshot of the account. */
  createRequestHandler(account: Pick<Account, "authentication" | "secrets">): IRequestHandler;
}
