import { TupleMap } from "@nfi/tuplemap";
import { injectable } from "inversify";
import { map, Observable, ReplaySubject } from "rxjs";
import { AbstractStorageService } from "../../../src/common/storage/AbstractStorageService";
import { Account } from "../../../src/modules/core/account";
import { AuthenticationConfiguration } from "../../../src/modules/core/authentication/AuthenticationMethod";

@injectable()
export class MemoryStorageService extends AbstractStorageService {
  #pinnedItems: TupleMap<[string, string], Set<string>, 2> = new TupleMap(2);
  #pinnedItemsObservable = new ReplaySubject<undefined>(1);
  #accounts: Account[] = [];
  #accountsObservable = new ReplaySubject<undefined>(1);
  #accountData = new Map<string, unknown>();

  constructor() {
    super();
    this.#pinnedItemsObservable.next(undefined);
    this.#accountsObservable.next(undefined);
  }

  addPinned(accountId: string, type: string, object: string): void {
    const key = [accountId, type] as [string, string];
    let objects = this.#pinnedItems.get(key);
    if (objects === undefined) {
      objects = new Set<string>();
      this.#pinnedItems.set(key, objects);
    }
    objects.add(object);
    this.#pinnedItemsObservable.next(undefined);
  }

  getPinned(accountId: string, type: string) {
    const key = [accountId, type] as [string, string];
    return this.#pinnedItemsObservable.pipe(map((_) => this.#pinnedItems.get(key) ?? new Set<string>()));
  }

  removePinned(accountId: string, type: string, object: string): void {
    const key = [accountId, type] as [string, string];
    const objects = this.#pinnedItems.get(key);
    if (objects) {
      objects.delete(object);
      if (objects.size === 0) {
        this.#pinnedItems.delete(key);
      }
    }
    this.#pinnedItemsObservable.next(undefined);
  }

  override async addAccount(access: Account) {
    this.#accounts.push(access);
    this.#accountsObservable.next(undefined);
  }

  override getAccounts(): Observable<Account[]> {
    return this.#accountsObservable.pipe(map((_) => this.#accounts));
  }

  override async deleteAccount(accountId: string) {
    this.#accounts = this.#accounts.filter((a) => a.accountId !== accountId);
    this.#accountsObservable.next(undefined);
    for (const key of [...this.#accountData.keys()]) {
      if (key.startsWith(accountId + "/")) {
        this.#accountData.delete(key);
      }
    }
    const pinnedKeys: [string, string][] = [];
    this.#pinnedItems.forEach((_, key) => {
      if (key[0] === accountId) {
        pinnedKeys.push(key);
      }
    });
    pinnedKeys.forEach((key) => this.#pinnedItems.delete(key));
    this.#pinnedItemsObservable.next(undefined);
  }

  override async updateAccountAuthentication(accountId: string, configuration: AuthenticationConfiguration) {
    this.#accounts = this.#accounts.map((account) =>
      account.accountId === accountId
        ? { ...account, authentication: configuration.authentication, secrets: configuration.secrets }
        : account,
    );
    this.#accountsObservable.next(undefined);
  }

  override getAccountData(accountId: string, name: string): unknown {
    return this.#accountData.get(accountId + "/" + name);
  }

  override async updateAccountData(accountId: string, name: string, value: unknown) {
    if (value === undefined) {
      this.#accountData.delete(accountId + "/" + name);
    } else {
      this.#accountData.set(accountId + "/" + name, value);
    }
  }
}
