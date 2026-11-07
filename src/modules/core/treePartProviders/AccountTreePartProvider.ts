import { Container, inject } from "inversify";
import { combineLatest, map, Observable, of, switchMap } from "rxjs";
import { convertIterableToMap, mapToMapChangeSet } from "../../../common/collections/observableMap";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { AbstractStorageService } from "../../../common/storage/AbstractStorageService";
import {
  createOrUpdateTreeItem,
  ItemInformation,
  TreePartProvider,
} from "../../../common/treePartProvider/TreePartProvider";
import { types } from "../../../generated/types";
import { Account } from "../account";
import { AccountContextProvider } from "../AccountContextProvider";
import { AuthenticationMethodRegistry } from "../authentication/AuthenticationMethodRegistry";
import { AccountItem, createAccountItem } from "../items/AccountItem";
import type { AccountTreeItem } from "../treeItems/AccountTreeItem";
import { Constructor } from "../../../common/constructor";
type Item = {
  account: Account;
  container: Container;
};

export class AccountTreePartProvider extends TreePartProvider<Item, undefined> {
  #storageService: AbstractStorageService;
  #AccountTreeItemConstructor: Constructor<AccountTreeItem>;
  #accountContextProvider: AccountContextProvider;
  #authenticationMethodRegistry: AuthenticationMethodRegistry;
  constructor(
    @inject(types.StorageService) storageService: AbstractStorageService,
    @inject(types.AccountContextProvider)
    accountContextProvider: AccountContextProvider,
    @inject(types.AccountTreeItem)
    AccountTreeItemConstructor: Constructor<AccountTreeItem>,
    @inject(types.AuthenticationMethodRegistry)
    authenticationMethodRegistry: AuthenticationMethodRegistry,
  ) {
    super();
    this.#storageService = storageService;
    this.#AccountTreeItemConstructor = AccountTreeItemConstructor;
    this.#accountContextProvider = accountContextProvider;
    this.#authenticationMethodRegistry = authenticationMethodRegistry;
  }

  override getItems(_context: Observable<undefined>): Observable<ItemInformation<Item>> {
    return this.#storageService.getAccounts().pipe(
      switchMap((accounts) => this.#createAccountItems(accounts)),
      convertIterableToMap((item) => item.account.accountId),
      mapToMapChangeSet((a, b) => a.isEqual(b)),
      map((changes) => ({ changes })),
    );
  }

  #createAccountItems(accounts: Account[]): Observable<AccountItem[]> {
    if (accounts.length === 0) {
      // combineLatest of nothing would never emit
      return of([]);
    }
    return combineLatest(
      accounts.map((account) =>
        this.#authenticationMethodRegistry
          .signInStatus(account)
          .pipe(
            map((signInStatus) =>
              createAccountItem(
                account,
                this.#accountContextProvider.getAccountContainer(account.accountId),
                signInStatus,
              ),
            ),
          ),
      ),
    );
  }

  override updateTreeItem(item: Item, key: string, oldTreeItem: AbstractTreeItem<any>) {
    return createOrUpdateTreeItem(oldTreeItem, this.#AccountTreeItemConstructor, item);
  }
}
