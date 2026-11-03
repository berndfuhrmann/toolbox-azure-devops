import { firstValueFrom } from "rxjs";
import { setTimeout } from "timers/promises";
import type { ExtensionContext } from "vscode";
import { VSCodeStorageService } from "../../../../src/common/storage/VSCodeStorageService";
import { encodeStoredPin } from "../../../../src/common/storage/pinEncoding";
import { extensionName } from "../../../../src/config";
import { Account } from "../../../../src/modules/core/account";

const accountKey = (accountId: string) => `${extensionName}-accounts-${accountId}`;
const pinnedKey = (accountId: string) => `${extensionName}-accountData-${accountId}-pinnedTreeItems`;
const legacyPinnedKey = `${extensionName}-pinnedTreeItems`;

const accountId = "11111111-1111-1111-1111-111111111111";
const otherAccountId = "22222222-2222-2222-2222-222222222222";

const v2Entry = (id: string) => ({
  version: 2,
  accountId: id,
  url: "https://dev.azure.com/",
  organization: "org-" + id,
  authentication: { type: "personalAccessToken" },
});

function createFakeContext(initialState: Record<string, unknown> = {}, initialSecrets: Record<string, string> = {}) {
  const state = new Map<string, unknown>(Object.entries(initialState));
  const secrets = new Map<string, string>(Object.entries(initialSecrets));
  const secretListeners: ((event: { key: string }) => void)[] = [];
  const notify = (key: string) => secretListeners.forEach((listener) => listener({ key }));
  const context = {
    subscriptions: [],
    globalState: {
      keys: () => [...state.keys()],
      get: (key: string, defaultValue?: unknown) => (state.has(key) ? structuredClone(state.get(key)) : defaultValue),
      update: async (key: string, value: unknown) => {
        if (value === undefined) {
          state.delete(key);
        } else {
          state.set(key, structuredClone(value));
        }
      },
    },
    secrets: {
      get: async (key: string) => secrets.get(key),
      store: async (key: string, value: string) => {
        secrets.set(key, value);
        notify(key);
      },
      delete: async (key: string) => {
        secrets.delete(key);
        notify(key);
      },
      onDidChange: (listener: (event: { key: string }) => void) => {
        secretListeners.push(listener);
        return { dispose: () => {} };
      },
    },
  } as unknown as ExtensionContext;
  return { context, state, secrets };
}

async function createService(initialState: Record<string, unknown> = {}, initialSecrets: Record<string, string> = {}) {
  const fake = createFakeContext(initialState, initialSecrets);
  const subject = new VSCodeStorageService(fake.context);
  // let the initial load, migrations and reloads triggered by secret changes settle
  await setTimeout(1);
  return { subject, ...fake };
}

const getAccounts = (subject: VSCodeStorageService) => firstValueFrom(subject.getAccounts());
const getPinned = (subject: VSCodeStorageService, id: string, type: string) =>
  firstValueFrom(subject.getPinned(id, type));

const testAccount = (id: string): Account => ({
  accountId: id,
  url: "https://dev.azure.com/",
  organization: "org-" + id,
  authentication: { type: "personalAccessToken" },
  secrets: { personalAccessToken: "pat-" + id },
});

describe("loading accounts", () => {
  test("migrates v1 accounts and writes them back", async () => {
    const v1Entry = { accountId, url: "https://dev.azure.com/", organization: "org" };
    const { subject, state, secrets } = await createService(
      { [accountKey(accountId)]: v1Entry },
      { [accountKey(accountId)]: "plain-pat" },
    );

    expect(await getAccounts(subject)).toEqual([
      {
        ...v1Entry,
        authentication: { type: "personalAccessToken" },
        secrets: { personalAccessToken: "plain-pat" },
      },
    ]);
    expect(state.get(accountKey(accountId))).toEqual({
      ...v1Entry,
      version: 2,
      authentication: { type: "personalAccessToken" },
    });
    expect(secrets.get(accountKey(accountId))).toBe(JSON.stringify({ personalAccessToken: "plain-pat" }));
  });

  test("skips accounts of newer versions without deleting them", async () => {
    const newerEntry = { ...v2Entry(accountId), version: 3 };
    const { subject, state, secrets } = await createService(
      { [accountKey(accountId)]: newerEntry },
      { [accountKey(accountId)]: "something" },
    );

    expect(await getAccounts(subject)).toEqual([]);
    expect(state.get(accountKey(accountId))).toEqual(newerEntry);
    expect(secrets.get(accountKey(accountId))).toBe("something");
  });

  test("skips invalid accounts without deleting them", async () => {
    const invalidEntry = { accountId };
    const { subject, state } = await createService({ [accountKey(accountId)]: invalidEntry });

    expect(await getAccounts(subject)).toEqual([]);
    expect(state.get(accountKey(accountId))).toEqual(invalidEntry);
  });
});

describe("changing accounts", () => {
  test("adds an account with its secrets", async () => {
    const { subject, state, secrets } = await createService();

    await subject.addAccount(testAccount(accountId));

    expect(await getAccounts(subject)).toEqual([testAccount(accountId)]);
    expect(state.get(accountKey(accountId))).toEqual(v2Entry(accountId));
    expect(secrets.get(accountKey(accountId))).toBe(JSON.stringify({ personalAccessToken: "pat-" + accountId }));
  });

  test("updating the authentication emits a new account object and keeps the order", async () => {
    const { subject, secrets } = await createService();
    await subject.addAccount(testAccount(accountId));
    await subject.addAccount(testAccount(otherAccountId));
    const [before] = await getAccounts(subject);

    await subject.updateAccountAuthentication(accountId, {
      authentication: { type: "personalAccessToken" },
      secrets: { personalAccessToken: "new-pat" },
    });

    const accounts = await getAccounts(subject);
    expect(accounts.map((account) => account.accountId)).toEqual([accountId, otherAccountId]);
    expect(accounts[0]).not.toBe(before);
    expect(accounts[0].secrets).toEqual({ personalAccessToken: "new-pat" });
    expect(secrets.get(accountKey(accountId))).toBe(JSON.stringify({ personalAccessToken: "new-pat" }));
  });

  test("updating the authentication without secrets deletes the stored secrets", async () => {
    const { subject, secrets } = await createService();
    await subject.addAccount(testAccount(accountId));

    await subject.updateAccountAuthentication(accountId, { authentication: { type: "personalAccessToken" } });

    expect(secrets.has(accountKey(accountId))).toBe(false);
  });

  test("deleting an account removes its entry, secrets and account data, but not that of others", async () => {
    const { subject, state, secrets } = await createService();
    await subject.addAccount(testAccount(accountId));
    await subject.addAccount(testAccount(otherAccountId));
    subject.addPinned(accountId, "pipeline", encodeStoredPin("name", "1"));
    subject.addPinned(otherAccountId, "pipeline", encodeStoredPin("name", "2"));
    await subject.updateAccountData(accountId, "something", { value: 1 });

    await subject.deleteAccount(accountId);

    expect((await getAccounts(subject)).map((account) => account.accountId)).toEqual([otherAccountId]);
    expect([...state.keys()].filter((key) => key.includes(accountId))).toEqual([]);
    expect(secrets.has(accountKey(accountId))).toBe(false);
    expect(await getPinned(subject, accountId, "pipeline")).toEqual(new Set());
    expect(await getPinned(subject, otherAccountId, "pipeline")).toEqual(new Set([encodeStoredPin("name", "2")]));
  });
});

describe("account data", () => {
  test("stores account data per account", async () => {
    const { subject } = await createService();
    await subject.addAccount(testAccount(accountId));

    await subject.updateAccountData(accountId, "something", { value: 1 });

    expect(subject.getAccountData(accountId, "something")).toEqual({ value: 1 });
    expect(subject.getAccountData(otherAccountId, "something")).toBeUndefined();
  });

  test("pinned items are stored per account and loaded again", async () => {
    const { subject, context } = await createService();
    await subject.addAccount(testAccount(accountId));
    subject.addPinned(accountId, "pipeline", encodeStoredPin("name", "1"));
    await setTimeout(1);

    const reloaded = new VSCodeStorageService(context);

    expect(await getPinned(reloaded, accountId, "pipeline")).toEqual(new Set([encodeStoredPin("name", "1")]));
  });

  test("removing the last pinned item removes the key", async () => {
    const { subject, state } = await createService();
    await subject.addAccount(testAccount(accountId));
    subject.addPinned(accountId, "pipeline", encodeStoredPin("name", "1"));
    subject.removePinned(accountId, "pipeline", encodeStoredPin("name", "1"));
    await setTimeout(1);

    expect(state.has(pinnedKey(accountId))).toBe(false);
  });
});

describe("legacy cleanup", () => {
  // TODO(2027-06): remove the legacy pin migration and the orphan sweep from VSCodeStorageService, then this test.
  test("legacy account data cleanup is removed by end of June 2027", () => {
    expect(
      new Date() < new Date("2027-07-01T00:00:00Z"),
      "Remove the legacy pinned item migration and the orphaned account data sweep (see TODO(2027-06))",
    ).toBe(true);
  });

  test("migrates legacy pinned items to account data", async () => {
    const legacy = [
      { accountId, type: "pipeline", object: encodeStoredPin("a", "1") },
      { accountId: otherAccountId, type: "repository", object: encodeStoredPin("b", "2") },
    ];
    const { subject, state } = await createService({
      [accountKey(accountId)]: v2Entry(accountId),
      [accountKey(otherAccountId)]: v2Entry(otherAccountId),
      [legacyPinnedKey]: JSON.stringify(legacy),
    });

    expect(state.has(legacyPinnedKey)).toBe(false);
    expect(state.get(pinnedKey(accountId))).toEqual([{ type: "pipeline", object: encodeStoredPin("a", "1") }]);
    expect(await getPinned(subject, otherAccountId, "repository")).toEqual(new Set([encodeStoredPin("b", "2")]));
  });

  test("merges legacy pinned items with already migrated ones", async () => {
    const { state } = await createService({
      [accountKey(accountId)]: v2Entry(accountId),
      [pinnedKey(accountId)]: [{ type: "pipeline", object: encodeStoredPin("a", "1") }],
      [legacyPinnedKey]: JSON.stringify([{ accountId, type: "pipeline", object: encodeStoredPin("b", "2") }]),
    });

    expect(state.get(pinnedKey(accountId))).toEqual([
      { type: "pipeline", object: encodeStoredPin("a", "1") },
      { type: "pipeline", object: encodeStoredPin("b", "2") },
    ]);
  });

  test("sweeps account data of removed accounts", async () => {
    const { subject, state } = await createService({
      [accountKey(accountId)]: v2Entry(accountId),
      [pinnedKey(accountId)]: [{ type: "pipeline", object: encodeStoredPin("a", "1") }],
      [legacyPinnedKey]: JSON.stringify([
        { accountId: otherAccountId, type: "pipeline", object: encodeStoredPin("b", "2") },
      ]),
    });

    expect(state.has(pinnedKey(accountId))).toBe(true);
    expect(state.has(pinnedKey(otherAccountId))).toBe(false);
    expect(await getPinned(subject, otherAccountId, "pipeline")).toEqual(new Set());
  });

  test("keeps account data of accounts that could not be loaded", async () => {
    const { state } = await createService({
      [accountKey(accountId)]: { ...v2Entry(accountId), version: 3 },
      [pinnedKey(accountId)]: [{ type: "pipeline", object: encodeStoredPin("a", "1") }],
    });

    expect(state.has(pinnedKey(accountId))).toBe(true);
  });
});
