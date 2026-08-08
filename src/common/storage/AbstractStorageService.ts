import { map, Observable } from "rxjs";
import { Account } from "../../modules/core/account";
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
  abstract deleteAccount(accountId: string): Promise<void>;
  abstract updateAccountPersonalAccessToken(accountId: string, personalAccessToken: string): Promise<void>;
}
