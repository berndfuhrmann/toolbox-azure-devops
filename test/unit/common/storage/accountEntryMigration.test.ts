import { migrateAccountEntry } from "../../../../src/common/storage/accountEntryMigration";

const v1Entry = { accountId: "id-1", url: "https://dev.azure.com/", organization: "org" };
const v2Entry = { ...v1Entry, version: 2, authentication: { type: "personalAccessToken" } };

describe("migrateAccountEntry", () => {
  test("migrates v1 to v2 and wraps the plain PAT", () => {
    expect(migrateAccountEntry({ entry: v1Entry, secrets: "plain-pat" })).toEqual({
      kind: "migrated",
      entry: v2Entry,
      secrets: JSON.stringify({ personalAccessToken: "plain-pat" }),
    });
  });

  test("migrating v1 is idempotent if the secrets were already wrapped", () => {
    const wrapped = JSON.stringify({ personalAccessToken: "plain-pat" });
    expect(migrateAccountEntry({ entry: v1Entry, secrets: wrapped })).toEqual({
      kind: "migrated",
      entry: v2Entry,
      secrets: wrapped,
    });
  });

  test("migrates v1 without secrets", () => {
    expect(migrateAccountEntry({ entry: v1Entry, secrets: undefined })).toEqual({
      kind: "migrated",
      entry: v2Entry,
      secrets: undefined,
    });
  });

  test("keeps current entries unchanged", () => {
    const secrets = JSON.stringify({ personalAccessToken: "pat" });
    expect(migrateAccountEntry({ entry: v2Entry, secrets })).toEqual({ kind: "current", entry: v2Entry, secrets });
  });

  test.each([
    ["without tenant", { type: "microsoft", microsoftAccountId: "ms-id", microsoftAccountLabel: "user@example.com" }],
    [
      "with tenant",
      { type: "microsoft", microsoftAccountId: "ms-id", microsoftAccountLabel: "user@example.com", tenantId: "t" },
    ],
  ])("keeps current Microsoft entries unchanged: %s", (_, authentication) => {
    const entry = { ...v2Entry, authentication };
    expect(migrateAccountEntry({ entry, secrets: undefined })).toEqual({ kind: "current", entry, secrets: undefined });
  });

  test("reports entries of newer versions", () => {
    expect(migrateAccountEntry({ entry: { ...v2Entry, version: 3 }, secrets: undefined })).toEqual({
      kind: "newer",
      version: 3,
    });
  });

  test.each([
    ["not an object", "some string"],
    ["missing fields", { accountId: "id-1" }],
    ["non-numeric version", { ...v2Entry, version: "2" }],
    ["unknown authentication", { ...v2Entry, authentication: { type: "unknown" } }],
    ["Microsoft authentication without account", { ...v2Entry, authentication: { type: "microsoft" } }],
  ])("reports invalid entries: %s", (_, entry) => {
    expect(migrateAccountEntry({ entry, secrets: undefined }).kind).toBe("invalid");
  });
});
