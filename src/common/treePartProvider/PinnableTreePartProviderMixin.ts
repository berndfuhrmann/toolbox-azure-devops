import { inject, injectFromBase, ServiceIdentifier } from "inversify";
import { distinctUntilChanged, map, Observable } from "rxjs";
import { types } from "../../generated/types";
import { Constructor } from "../constructor";
import { Exception } from "../Exception";
import { mapX, switchMapX } from "../exceptionOperators";
import { PinnedItem } from "../items/PinnedItem";
import { AbstractStorageService } from "../storage/AbstractStorageService";
import { ItemInformation } from "./TreePartProvider";
import { PinnedItemTreePartProvider } from "./PinnedTreePartProvider";
import { withItemObservable } from "./withItemObservable";

interface TreePartProviderLike<Item, Context> {
  getItems(context: Observable<Context>): Observable<ItemInformation<Item | Exception>>;
}

type NotException<T> = T extends Exception ? never : T;

export function PinnableTreePartProviderMixin<
  Item,
  Context,
  TTreePartProvider extends Constructor<TreePartProviderLike<NotException<Item>, Context>>,
>(cls: TTreePartProvider, typePinnedTreePartProvider: ServiceIdentifier) {
  @injectFromBase({
    extendConstructorArguments: true,
    extendProperties: false,
  })
  class PinnableTreePartProvider extends cls {
    @inject(types.StorageService)
    private storageService!: AbstractStorageService;
    @inject(typePinnedTreePartProvider)
    private pinnedTreePartProvider!: PinnedItemTreePartProvider<Item & PinnedItem>;
    override getItems(context: Observable<Context>): Observable<ItemInformation<NotException<Item> | Exception>> {
      const result = super.getItems(context);
      return result.pipe(
        withItemObservable((inputObservable) =>
          inputObservable.pipe(
            mapX((item) => {
              return (
                this.storageService
                  // Below is an ugly typecast, but here to fix
                  .getPinnedState(this.pinnedTreePartProvider.getPinInfo(item as Omit<Item & PinnedItem, "pinned">))
                  .pipe(
                    distinctUntilChanged(),
                    map((pinned) => ({
                      ...item,
                      pinned: pinned,
                    })),
                  )
              );
            }),
            switchMapX((x) => x),
          ),
        ),
      );
    }
  }
  return PinnableTreePartProvider;
}
