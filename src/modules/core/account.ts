import { Type, type Static } from "@sinclair/typebox";
import { isDeepStrictEqual } from "node:util";

export const authenticationSchema = Type.Union([Type.Object({ type: Type.Literal("personalAccessToken") })]);

/**
 * Non-secret settings of the authentication method used for an account.
 * Secrets are kept separately in {@link Account.secrets}.
 */
export type Authentication = Static<typeof authenticationSchema>;

export type AuthenticationType = Authentication["type"];

export interface Account {
  accountId: string;
  url: string;
  organization: string;
  authentication: Authentication;
  /** Secrets of the authentication method, only interpreted by that method. */
  secrets?: unknown;
}

/**
 * Compares everything that is needed to connect to the account.
 */
export function compareAccount(a: Account, b: Account) {
  return (
    a.url === b.url &&
    a.organization === b.organization &&
    isDeepStrictEqual(a.authentication, b.authentication) &&
    isDeepStrictEqual(a.secrets, b.secrets)
  );
}

export function buildAccountUrl(account: Pick<Account, "url" | "organization">): string {
  const base = account.url.endsWith("/") ? account.url : account.url + "/";
  const organization = account.organization.startsWith("/") ? account.organization.slice(1) : account.organization;
  return base + organization;
}
