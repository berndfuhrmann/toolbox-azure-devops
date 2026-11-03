import { Type, type Static } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import { authenticationSchema } from "../../modules/core/account";
import { personalAccessTokenSecretsSchema } from "../../modules/core/authentication/PersonalAccessTokenAuthenticationMethod";

export const currentAccountEntryVersion = 2;

const accountEntrySchemaV1 = Type.Object({
  accountId: Type.String(),
  url: Type.String(),
  organization: Type.String(),
});

export const accountEntrySchema = Type.Object({
  version: Type.Literal(currentAccountEntryVersion),
  accountId: Type.String(),
  url: Type.String(),
  organization: Type.String(),
  authentication: authenticationSchema,
});

export type AccountEntry = Static<typeof accountEntrySchema>;

/**
 * An account as stored: the entry lives in globalState, the secrets (JSON) in SecretStorage.
 */
export interface StoredAccount {
  entry: unknown;
  secrets: string | undefined;
}

export type AccountEntryMigrationResult =
  | { kind: "current"; entry: AccountEntry; secrets: string | undefined }
  | { kind: "migrated"; entry: AccountEntry; secrets: string | undefined }
  | { kind: "newer"; version: number }
  | { kind: "invalid"; error: unknown };

export function getAccountEntryVersion(entry: unknown): number | undefined {
  if (typeof entry !== "object" || entry === null) {
    return undefined;
  }
  if (!("version" in entry)) {
    return 1;
  }
  return typeof entry.version === "number" ? entry.version : undefined;
}

/**
 * Brings a stored account to the current version, step by step.
 * Each step must be idempotent, as an interrupted migration may run again.
 */
export function migrateAccountEntry(stored: StoredAccount): AccountEntryMigrationResult {
  const version = getAccountEntryVersion(stored.entry);
  if (version === undefined) {
    return { kind: "invalid", error: new Error("account entry has no valid version") };
  }
  if (version > currentAccountEntryVersion) {
    return { kind: "newer", version };
  }
  try {
    let current = stored;
    if (version < 2) {
      current = migrateV1ToV2(current);
    }
    const entry = Value.Parse(accountEntrySchema, current.entry);
    return { kind: version === currentAccountEntryVersion ? "current" : "migrated", entry, secrets: current.secrets };
  } catch (error) {
    return { kind: "invalid", error };
  }
}

/**
 * v1 only knew Personal Access Tokens and stored them as plain string.
 */
function migrateV1ToV2(stored: StoredAccount): StoredAccount {
  const entry = Value.Parse(accountEntrySchemaV1, stored.entry);
  return {
    entry: { ...entry, version: 2, authentication: { type: "personalAccessToken" } },
    secrets: wrapPersonalAccessToken(stored.secrets),
  };
}

function wrapPersonalAccessToken(secrets: string | undefined) {
  if (secrets === undefined) {
    return undefined;
  }
  if (Value.Check(personalAccessTokenSecretsSchema, parseSecrets(secrets))) {
    // already wrapped by an interrupted migration
    return secrets;
  }
  return JSON.stringify({ personalAccessToken: secrets });
}

export function parseSecrets(secrets: string | undefined): unknown {
  if (secrets === undefined) {
    return undefined;
  }
  try {
    return JSON.parse(secrets);
  } catch {
    return undefined;
  }
}
