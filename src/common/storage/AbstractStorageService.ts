import { map, Observable } from "rxjs";
import { Account } from "../../modules/core/account";
import { AuthenticationConfiguration } from "../../modules/core/authentication/AuthenticationMethod";
import { decodeStoredPin } from "./pinEncoding";

export abstract class AbstractStorageService {
  constructor() {}

  abstract addPinned(accountId: string, type: string, object: string): void;
  abstract getPinned(accountId: string, type: string): Observable<Set<string>>;
  abstract removePinned(accountId: string, type: string, object: string): void;

  getPinnedState({
    accountId,
    type,
    object,
  }: {
    accountId: string;
    type: string;
    name: string;
    object: string;
  }): Observable<boolean> {
    return this.getPinned(accountId, type).pipe(
      map((set) => [...set].some((entry) => decodeStoredPin(entry).object === object)),
    );
  }

  abstract addAccount(account: Account): Promise<void>;
  abstract getAccounts(): Observable<Account[]>;
  /** Deletes the account together with its secrets and all of its account data. */
  abstract deleteAccount(accountId: string): Promise<void>;
  abstract updateAccountAuthentication(accountId: string, configuration: AuthenticationConfiguration): Promise<void>;

  /**
   * Data that belongs to a single account. Everything stored here is removed together with the account.
   */
  abstract getAccountData(accountId: string, name: string): unknown;
  abstract updateAccountData(accountId: string, name: string, value: unknown): Promise<void>;
}
