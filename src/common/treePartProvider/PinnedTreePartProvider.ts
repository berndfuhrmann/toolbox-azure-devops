import { Container, inject, unmanaged } from "inversify";
import { combineLatest, map, mergeMap, Observable, of, pipe, startWith, switchMap } from "rxjs";
import { types } from "../../generated/types";
import { Account } from "../../modules/core/account";
import { AccountContextProvider } from "../../modules/core/AccountContextProvider";
import { Constructor } from "../constructor";
import { Exception, isException } from "../Exception";
import { mapX, switchMapX } from "../exceptionOperators";
import { isLoadingItem, LoadingItem, loadingSymbol } from "../items/LoadingItem";
import { isMissingItem, MissingItem } from "../items/MissingItem";
import { PinnedItem } from "../items/PinnedItem";
import { createPinnedSerializedItem, PinnedSerializedItem } from "../items/PinnedSerializedItem";
import { PinInfo, PinnableException } from "../items/PinnedTreeItemMixin";
import { AbstractStorageService } from "../storage/AbstractStorageService";
import { decodeStoredPin } from "../storage/pinEncoding";
import { AbstractTreeItem } from "../treeItems/AbstractTreeItem";
import { ExceptionTreeItem } from "../treeItems/ExceptionTreeItem";
import { LoadingTreeItem } from "../treeItems/LoadingTreeItem";
import { MissingTreeItem } from "../treeItems/MissingTreeItem";
import { filterObservable } from "./filterObservable";
import { fromArray } from "./fromArray";
import { createOrUpdateTreeItem, ItemInformation, TreePartProvider } from "./TreePartProvider";
import { withItemObservable } from "./withItemObservable";

export const getPinned = (storageService: AbstractStorageService, type: string) => {
  return storageService.getAccounts().pipe(
    mergeMap((accounts) =>
      combineLatest(
        accounts.map((account) =>
          storageService
            .getPinned(account.accountId, type)
            .pipe(map((pinnedSet) => [...pinnedSet].map((pinned) => createPinnedSerializedItem(account, pinned)))),
        ),
      ),
    ),
    map((x) => x.flatMap((y) => y)),
  );
};

export const getPinnedObservableMap = (storageService: AbstractStorageService, type: string) => {
  return pipe(
    switchMap((x) => getPinned(storageService, type)),
    fromArray((item: PinnedSerializedItem) => {
      return item.account.accountId + "/" + decodeStoredPin(item.pinned).object;
    }, {}),
  );
};

export abstract class PinnedItemTreePartProvider<Item extends PinnedItem> extends TreePartProvider<
  Item | MissingItem | Exception | LoadingItem,
  undefined
> {
  protected type: string;
  #exceptionTreeItem!: Constructor<ExceptionTreeItem<PinnableException>>;
  #missingItem!: Constructor<MissingTreeItem>;
  #loadingItem!: Constructor<LoadingTreeItem>;
  #storageService!: AbstractStorageService;
  #container!: Container;

  @inject(types.PinnedExceptionTreeItem)
  set exceptionTreeItem(value: Constructor<ExceptionTreeItem<PinnableException>>) {
    this.#exceptionTreeItem = value;
  }

  @inject(types.PinnedMissingTreeItem)
  set missingItem(value: Constructor<MissingTreeItem>) {
    this.#missingItem = value;
  }

  @inject(types.LoadingTreeItem)
  set loadingItem(value: Constructor<LoadingTreeItem>) {
    this.#loadingItem = value;
  }

  @inject(types.Container)
  set container(value: Container) {
    this.#container = value;
  }

  @inject(types.StorageService)
  set storageService(value: AbstractStorageService) {
    this.#storageService = value;
  }

  constructor(
    @unmanaged()
    type: string,
  ) {
    super();
    this.type = type;
  }

  protected getAccountContext(container: Container, pinInfo: PinInfo) {
    const accountContextProvider = container.get<AccountContextProvider>(types.AccountContextProvider);
    const accountContainer = accountContextProvider.getAccountContainer(pinInfo.accountId);
    const account = accountContainer.get<Observable<Account>>(types.Account);
    return { accountContainer, account };
  }

  getItems(context: Observable<undefined>): Observable<ItemInformation<Item | MissingItem | Exception | LoadingItem>> {
    return context.pipe(
      getPinnedObservableMap(this.#storageService, this.type),
      withItemObservable((inputObservable) =>
        inputObservable.pipe(
          mapX((item) => {
            try {
              const { name, object } = decodeStoredPin(item.pinned);
              return this.retrievePinned(this.#container, {
                accountId: item.account.accountId,
                name,
                object,
                type: this.type,
              }).pipe(
                map((item) => ({
                  ...item,
                  pinnedInstance: true as true,
                })),
              );
            } catch {
              return of(undefined);
            }
          }),
          switchMapX((x) => x),
          startWith({
            [loadingSymbol]: true,
            icon: "loading",
            name: "loading",
          } as LoadingItem),
        ),
      ),
      filterObservable((x) => x !== undefined),
    );
  }

  override updateTreeItem(
    item: Item | MissingItem | LoadingItem | Exception,
    key: string,
    oldTreeItem: AbstractTreeItem<any> | undefined,
  ) {
    return (
      (isException(item) && createOrUpdateTreeItem(oldTreeItem, this.#exceptionTreeItem, item)) ||
      (isMissingItem(item) && createOrUpdateTreeItem(oldTreeItem, this.#missingItem, item)) ||
      (isLoadingItem(item) && createOrUpdateTreeItem(oldTreeItem, this.#loadingItem, item)) ||
      this.updateTreeItemImpl(item as Item, key, oldTreeItem)
    );
  }

  abstract updateTreeItemImpl(
    item: Item,
    key: string,
    oldTreeItem: AbstractTreeItem<any> | undefined,
  ): { treeItem: AbstractTreeItem<any>; updated: boolean };

  abstract retrievePinned(
    container: Container,
    pinInfo: PinInfo,
  ): Observable<Exception | Item | MissingItem | LoadingItem>;

  abstract getPinInfo(data: Omit<Item, "pinned"> | MissingItem): PinInfo;
}
