import { Container, inject } from "inversify";
import { map, Observable } from "rxjs";
import { convertIterableToMap, mapChangeSetMap, mapToMapChangeSet } from "../../../common/collections/observableMap";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { AbstractStorageService } from "../../../common/storage/AbstractStorageService";
import {
  createOrUpdateTreeItem,
  ItemInformation,
  TreePartProvider,
} from "../../../common/treePartProvider/TreePartProvider";
import { types } from "../../../generated/types";
import { Account, compareAccount } from "../account";
import { AccountContextProvider } from "../AccountContextProvider";
import { createAccountItem } from "../items/AccountItem";
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
  constructor(
    @inject(types.StorageService) storageService: AbstractStorageService,
    @inject(types.AccountContextProvider)
    accountContextProvider: AccountContextProvider,
    @inject(types.AccountTreeItem)
    AccountTreeItemConstructor: Constructor<AccountTreeItem>,
  ) {
    super();
    this.#storageService = storageService;
    this.#AccountTreeItemConstructor = AccountTreeItemConstructor;
    this.#accountContextProvider = accountContextProvider;
  }

  override getItems(_context: Observable<undefined>): Observable<ItemInformation<Item>> {
    return this.#storageService.getAccounts().pipe(
      convertIterableToMap((item) => item.accountId),
      mapToMapChangeSet(compareAccount),
      mapChangeSetMap((input) =>
        createAccountItem(input, this.#accountContextProvider.getAccountContainer(input.accountId)),
      ),
      map((changes) => ({ changes })),
    );
  }

  override updateTreeItem(item: Item, key: string, oldTreeItem: AbstractTreeItem<any>) {
    return createOrUpdateTreeItem(oldTreeItem, this.#AccountTreeItemConstructor, item);
  }
}
