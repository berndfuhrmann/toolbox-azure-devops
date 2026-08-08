import { Container } from "inversify";
import { firstValueFrom } from "rxjs";
import { TreeItem } from "vscode";
import { AbstractStorageService } from "../../../common/storage/AbstractStorageService";
import { types } from "../../../generated/types";
import { AccountItem } from "../items/AccountItem";
import { AccountTreeItem } from "../treeItems/AccountTreeItem";

export async function getAccountFromItem(item: TreeItem | undefined, container: Container) {
  if (item instanceof AccountTreeItem) {
    return (item.data as AccountItem).account;
  } else {
    if (item === undefined) {
      const storageService = container.get<AbstractStorageService>(types.StorageService);
      const accounts = await firstValueFrom(storageService.getAccounts());
      if (accounts.length === 1) {
        return accounts[0];
      }
    }
  }
}
