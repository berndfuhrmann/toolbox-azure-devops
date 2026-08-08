import { TupleMap } from "@nfi/tuplemap";
import { Type, type Static } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import { inject, injectable } from "inversify";
import { map, ReplaySubject } from "rxjs";
import vscode from "vscode";
import { types } from "../../generated/types";
import { Account } from "../../modules/core/account";
import { AbstractStorageService } from "./AbstractStorageService";
import { decodeStoredPin, encodeStoredPin } from "./pinEncoding";
import { extensionName } from "../../config";
const pinnedKey = extensionName + "-pinnedTreeItems";
const accountsKey = extensionName + "-accounts";

const accountSchema = Type.Object({
  accountId: Type.String(),
  url: Type.String(),
  organization: Type.String(),
});

const pinnedItemsSchema = Type.Array(
  Type.Object({
    accountId: Type.String(),
    type: Type.String(),
    object: Type.String(),
  }),
);

@injectable()
export class VSCodeStorageService extends AbstractStorageService {
  #items: TupleMap<[string, string], Map<string, string>, 2> = new TupleMap(2);
  #observable = new ReplaySubject<undefined>(1);
  #context: vscode.ExtensionContext;
  #accounts: Account[] = [];
  #accountsObservable = new ReplaySubject<undefined>(1);

  constructor(@inject(types.vscodeContext) context: vscode.ExtensionContext) {
    super();
    this.#observable.next(undefined);
    this.#context = context;
    this.#loadPinned();
    this.#loadAccounts();
    this.#context.secrets.onDidChange((e) => {
      void this.#loadAccounts();
    }, this.#context.subscriptions);
  }

  #savePinned() {
    const pinned: Static<typeof pinnedItemsSchema> = [];
    this.#items.forEach((objectMap, key) => {
      objectMap.forEach((name, object) => {
        pinned.push({ accountId: key[0], type: key[1], object: encodeStoredPin(name, object) });
      });
    });

    this.#context.globalState.update(pinnedKey, JSON.stringify(pinned));
  }

  #loadPinned() {
    const pinnedRaw = this.#context.globalState.get(pinnedKey, "[]");
    let pinnedParsed: Static<typeof pinnedItemsSchema>;
    try {
      pinnedParsed = Value.Parse(pinnedItemsSchema, JSON.parse(pinnedRaw));
    } catch {
      pinnedParsed = [];
    }

    this.#items.clear();
    for (const entry of pinnedParsed) {
      this.#addEntry(entry.accountId, entry.type, entry.object);
    }
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
    this.#savePinned();
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
    this.#savePinned();
  }

  async #loadAccounts() {
    const keys = this.#context.globalState.keys().filter((key) => key.startsWith(accountsKey + "-"));
    const accounts: Account[] = [];
    for (const key of keys) {
      const valueRaw = this.#context.globalState.get(key);
      try {
        const value = Value.Parse(accountSchema, valueRaw);
        accounts.push({
          accountId: value.accountId,
          url: value.url,
          organization: value.organization,
          personalAccessToken: (await this.#context.secrets.get(key)) as string,
        });
      } catch (error) {
        console.log(error);
        this.#context.globalState.update(key, undefined);
      }
    }
    this.#accounts = accounts;
    this.#accountsObservable.next(undefined);
  }

  override async addAccount(account: Account) {
    this.#accounts.push(account);
    this.#accountsObservable.next(undefined);
    const key = accountsKey + "-" + account.accountId;
    Promise.all([
      this.#context.globalState.update(key, {
        accountId: account.accountId,
        url: account.url,
        organization: account.organization,
      }),
      this.#context.secrets.store(key, account.personalAccessToken),
    ]);
  }

  override getAccounts() {
    return this.#accountsObservable.pipe(map((_) => this.#accounts));
  }

  override async deleteAccount(accountId: string) {
    this.#accounts = this.#accounts.filter((a) => a.accountId !== accountId);
    this.#accountsObservable.next(undefined);
    const key = accountsKey + "-" + accountId;
    await Promise.all([this.#context.globalState.update(key, undefined), this.#context.secrets.delete(key)]);
  }

  override async updateAccountPersonalAccessToken(accountId: string, personalAccessToken: string) {
    const key = accountsKey + "-" + accountId;
    await this.#context.secrets.store(key, personalAccessToken);
    const account = this.#accounts.find((account) => account.accountId === accountId);
    if (account) {
      account.personalAccessToken = personalAccessToken;
    }
    this.#accountsObservable.next(undefined);
  }
}
