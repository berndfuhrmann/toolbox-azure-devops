import { TupleMap } from "@nfi/tuplemap";
import { Type } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import { inject, injectable } from "inversify";
import { map, ReplaySubject } from "rxjs";
import vscode from "vscode";
import { types } from "../../generated/types";
import { Account } from "../../modules/core/account";
import { AuthenticationConfiguration } from "../../modules/core/authentication/AuthenticationMethod";
import { AbstractStorageService } from "./AbstractStorageService";
import { AccountEntry, currentAccountEntryVersion, migrateAccountEntry, parseSecrets } from "./accountEntryMigration";
import { decodeStoredPin, encodeStoredPin } from "./pinEncoding";
import { extensionName } from "../../config";

const accountsKey = extensionName + "-accounts";
const accountDataKey = extensionName + "-accountData";
const pinnedName = "pinnedTreeItems";
// TODO(2027-06): remove, by then all users have migrated their pinned items to account data.
const legacyPinnedKey = extensionName + "-pinnedTreeItems";

const legacyPinnedItemsSchema = Type.Array(
  Type.Object({
    accountId: Type.String(),
    type: Type.String(),
    object: Type.String(),
  }),
);

const pinnedItemsSchema = Type.Array(
  Type.Object({
    type: Type.String(),
    object: Type.String(),
  }),
);

function accountKey(accountId: string) {
  return accountsKey + "-" + accountId;
}

function accountDataPrefix(accountId: string) {
  return `${accountDataKey}-${accountId}-`;
}

function toAccountEntry(account: Account): AccountEntry {
  return {
    version: currentAccountEntryVersion,
    accountId: account.accountId,
    url: account.url,
    organization: account.organization,
    authentication: account.authentication,
  };
}

function toAccount(entry: AccountEntry, secrets: string | undefined): Account {
  return {
    accountId: entry.accountId,
    url: entry.url,
    organization: entry.organization,
    authentication: entry.authentication,
    secrets: parseSecrets(secrets),
  };
}

@injectable()
export class VSCodeStorageService extends AbstractStorageService {
  #items: TupleMap<[string, string], Map<string, string>, 2> = new TupleMap(2);
  #observable = new ReplaySubject<undefined>(1);
  #context: vscode.ExtensionContext;
  #accounts: Account[] = [];
  #accountsObservable = new ReplaySubject<undefined>(1);
  #accountsLoadCount = 0;
  #initialized: Promise<void>;

  constructor(@inject(types.vscodeContext) context: vscode.ExtensionContext) {
    super();
    this.#context = context;
    this.#loadPinned();
    this.#observable.next(undefined);
    this.#initialized = this.#initialize();
    this.#context.secrets.onDidChange((e) => {
      void this.#loadAccounts();
    }, this.#context.subscriptions);
  }

  /** Resolves once stored data was loaded and migrated. */
  initialized() {
    return this.#initialized;
  }

  async #initialize() {
    await this.#migrateLegacyPinned();
    await this.#loadAccounts();
    await this.#sweepOrphanedAccountData();
  }

  #accountDataKeys() {
    return this.#context.globalState.keys().filter((key) => key.startsWith(accountDataKey + "-"));
  }

  override getAccountData(accountId: string, name: string): unknown {
    return this.#context.globalState.get(accountDataPrefix(accountId) + name);
  }

  override async updateAccountData(accountId: string, name: string, value: unknown) {
    await this.#context.globalState.update(accountDataPrefix(accountId) + name, value);
  }

  #savePinned(accountId: string) {
    const pinned: { type: string; object: string }[] = [];
    this.#items.forEach((objectMap, key) => {
      if (key[0] === accountId) {
        objectMap.forEach((name, object) => {
          pinned.push({ type: key[1], object: encodeStoredPin(name, object) });
        });
      }
    });
    return this.updateAccountData(accountId, pinnedName, pinned.length > 0 ? pinned : undefined);
  }

  #loadPinned() {
    this.#items.clear();
    for (const key of this.#accountDataKeys()) {
      if (!key.endsWith("-" + pinnedName)) {
        continue;
      }
      const accountId = key.slice(accountDataKey.length + 1, key.length - pinnedName.length - 1);
      try {
        for (const entry of Value.Parse(pinnedItemsSchema, this.#context.globalState.get(key))) {
          this.#addEntry(accountId, entry.type, entry.object);
        }
      } catch (error) {
        console.warn(`Ignoring invalid pinned items in ${key}`, error);
      }
    }
    // TODO(2027-06): remove
    for (const entry of this.#loadLegacyPinned()) {
      this.#addEntry(entry.accountId, entry.type, entry.object);
    }
  }

  // TODO(2027-06): remove
  #loadLegacyPinned() {
    const pinnedRaw = this.#context.globalState.get<string>(legacyPinnedKey);
    if (pinnedRaw === undefined) {
      return [];
    }
    try {
      return Value.Parse(legacyPinnedItemsSchema, JSON.parse(pinnedRaw));
    } catch {
      return [];
    }
  }

  /**
   * Pinned items used to be stored for all accounts under a single key.
   * They are already merged into memory by #loadPinned, so they only need to be written per account.
   */
  // TODO(2027-06): remove
  async #migrateLegacyPinned() {
    if (this.#context.globalState.get(legacyPinnedKey) === undefined) {
      return;
    }
    const accountIds = new Set(this.#loadLegacyPinned().map((entry) => entry.accountId));
    await Promise.all([...accountIds].map((accountId) => this.#savePinned(accountId)));
    await this.#context.globalState.update(legacyPinnedKey, undefined);
  }

  /**
   * Account data used to be left behind when an account was removed.
   * Uses the stored account keys, so data of accounts that could not be loaded is kept.
   */
  // TODO(2027-06): remove
  async #sweepOrphanedAccountData() {
    const accountIds = this.#context.globalState
      .keys()
      .filter((key) => key.startsWith(accountsKey + "-"))
      .map((key) => key.slice(accountsKey.length + 1));
    const orphanedKeys = this.#accountDataKeys().filter(
      (key) => !accountIds.some((accountId) => key.startsWith(accountDataPrefix(accountId))),
    );
    if (orphanedKeys.length === 0) {
      return;
    }
    await Promise.all(orphanedKeys.map((key) => this.#context.globalState.update(key, undefined)));
    this.#loadPinned();
    this.#observable.next(undefined);
  }

  #addEntry(accountId: string, type: string, encodedPin: string) {
    const key = [accountId, type] as [string, string];
    let objectMap = this.#items.get(key);
    if (objectMap === undefined) {
      objectMap = new Map<string, string>();
      this.#items.set(key, objectMap);
    }
    const { name, object } = decodeStoredPin(encodedPin);
    objectMap.set(object, name);
  }

  addPinned(accountId: string, type: string, object: string): void {
    this.#addEntry(accountId, type, object);
    this.#observable.next(undefined);
    void this.#savePinned(accountId);
  }

  getPinned(accountId: string, type: string) {
    const key = [accountId, type] as [string, string];
    return this.#observable.pipe(
      map((_) => {
        const objectMap = this.#items.get(key);
        if (!objectMap) {
          return new Set<string>();
        }
        return new Set([...objectMap.entries()].map(([object, name]) => encodeStoredPin(name, object)));
      }),
    );
  }

  removePinned(accountId: string, type: string, encodedPin: string): void {
    const key = [accountId, type] as [string, string];
    const objectMap = this.#items.get(key);
    if (objectMap) {
      const { object } = decodeStoredPin(encodedPin);
      objectMap.delete(object);
      if (objectMap.size === 0) {
        this.#items.delete(key);
      }
    }
    this.#observable.next(undefined);
    void this.#savePinned(accountId);
  }

  async #loadAccounts() {
    const loadCount = ++this.#accountsLoadCount;
    const keys = this.#context.globalState.keys().filter((key) => key.startsWith(accountsKey + "-"));
    const accounts: Account[] = [];
    for (const key of keys) {
      const result = migrateAccountEntry({
        entry: this.#context.globalState.get(key),
        secrets: await this.#context.secrets.get(key),
      });
      switch (result.kind) {
        case "newer":
          console.warn(`Skipping account ${key}, it was stored by a newer version (${result.version})`);
          break;
        case "invalid":
          console.warn(`Skipping invalid account ${key}`, result.error);
          break;
        case "migrated":
          // Secrets first: migrating them is idempotent, so an interrupted migration can run again.
          await this.#storeSecrets(key, result.secrets);
          await this.#context.globalState.update(key, result.entry);
          accounts.push(toAccount(result.entry, result.secrets));
          break;
        case "current":
          accounts.push(toAccount(result.entry, result.secrets));
          break;
      }
    }
    if (loadCount === this.#accountsLoadCount) {
      this.#accounts = accounts;
      this.#accountsObservable.next(undefined);
    }
  }

  async #storeSecrets(key: string, secrets: string | undefined) {
    if (secrets === undefined) {
      await this.#context.secrets.delete(key);
    } else {
      await this.#context.secrets.store(key, secrets);
    }
  }

  #putAccount(account: Account) {
    const exists = this.#accounts.some((a) => a.accountId === account.accountId);
    this.#accounts = exists
      ? this.#accounts.map((a) => (a.accountId === account.accountId ? account : a))
      : [...this.#accounts, account];
    this.#accountsObservable.next(undefined);
  }

  override async addAccount(account: Account) {
    const key = accountKey(account.accountId);
    // The entry is written first, so the account data of a new account is never considered orphaned.
    await this.#context.globalState.update(key, toAccountEntry(account));
    await this.#storeSecrets(key, account.secrets === undefined ? undefined : JSON.stringify(account.secrets));
    this.#putAccount(account);
  }

  override getAccounts() {
    return this.#accountsObservable.pipe(map((_) => this.#accounts));
  }

  override async deleteAccount(accountId: string) {
    this.#accounts = this.#accounts.filter((a) => a.accountId !== accountId);
    this.#accountsObservable.next(undefined);
    const pinnedKeys: [string, string][] = [];
    this.#items.forEach((_, key) => {
      if (key[0] === accountId) {
        pinnedKeys.push(key);
      }
    });
    pinnedKeys.forEach((key) => this.#items.delete(key));
    this.#observable.next(undefined);
    const key = accountKey(accountId);
    const accountDataKeys = this.#accountDataKeys().filter((dataKey) =>
      dataKey.startsWith(accountDataPrefix(accountId)),
    );
    await Promise.all([
      this.#context.globalState.update(key, undefined),
      this.#context.secrets.delete(key),
      ...accountDataKeys.map((dataKey) => this.#context.globalState.update(dataKey, undefined)),
    ]);
  }

  override async updateAccountAuthentication(accountId: string, configuration: AuthenticationConfiguration) {
    const account = this.#accounts.find((account) => account.accountId === accountId);
    if (!account) {
      return;
    }
    // A new object, so that consumers comparing accounts notice the change.
    const updated: Account = {
      ...account,
      authentication: configuration.authentication,
      secrets: configuration.secrets,
    };
    const key = accountKey(accountId);
    await this.#storeSecrets(key, updated.secrets === undefined ? undefined : JSON.stringify(updated.secrets));
    await this.#context.globalState.update(key, toAccountEntry(updated));
    this.#putAccount(updated);
  }
}
