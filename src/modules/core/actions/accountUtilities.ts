import { Container } from "inversify";
import { firstValueFrom } from "rxjs";
import vscode, { TreeItem } from "vscode";
import { AbstractStorageService } from "../../../common/storage/AbstractStorageService";
import { types } from "../../../generated/types";
import { Account } from "../account";
import { AccountItem } from "../items/AccountItem";
import { AccountTreeItem } from "../treeItems/AccountTreeItem";

/**
 * Finds the account a command was invoked for. If the item does not belong to a known account
 * (no item, or an item like an error that does not know its account), the single account is used,
 * or the user picks one if there are several.
 */
export async function getAccountFromItem(item: TreeItem | undefined, container: Container) {
  if (item instanceof AccountTreeItem) {
    return (item.data as AccountItem).account;
  }
  const storageService = container.get<AbstractStorageService>(types.StorageService);
  const accounts = await firstValueFrom(storageService.getAccounts());
  if (accounts.length <= 1) {
    return accounts[0];
  }
  return pickAccount(accounts);
}

async function pickAccount(accounts: Account[]) {
  const picked = await vscode.window.showQuickPick(
    accounts.map((account) => ({ label: account.organization, description: account.url, account })),
    { title: "Select Organization", ignoreFocusOut: true },
  );
  return picked?.account;
}
