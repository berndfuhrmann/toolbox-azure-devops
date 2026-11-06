import { Container } from "inversify";
import { firstValueFrom } from "rxjs";
import vscode, { TreeItem } from "vscode";
import { AbstractStorageService } from "../../../common/storage/AbstractStorageService";
import { types } from "../../../generated/types";
import { Account, AuthenticationType } from "../account";
import { AuthenticationMethod } from "../authentication/AuthenticationMethod";
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
  if (accounts.length === 0) {
    return undefined;
  } else if (accounts.length === 1) {
    return accounts[0];
  } else {
    return pickAccount(accounts);
  }
}

async function pickAccount(accounts: Account[]) {
  const picked = await vscode.window.showQuickPick(
    accounts.map((account) => ({ label: account.organization, description: account.url, account })),
    { title: "Select Organization", ignoreFocusOut: true },
  );
  return picked?.account;
}

/**
 * Lets the user pick one of the methods available for the URL, the suggested one first.
 * The picker is skipped if only one method is available.
 */
export async function pickAuthenticationMethod(
  allMethods: readonly AuthenticationMethod[],
  url: string,
  currentType?: AuthenticationType,
) {
  const methods = allMethods.filter((method) => method.isAvailableFor(url));
  if (methods.length <= 1) {
    return methods[0];
  }
  const suggested = methods.find((method) => method.isSuggestedFor(url));
  const items = methods.map((method) => ({
    label: method.label,
    description:
      [method.type === currentType && "current", method === suggested && "suggested"].filter(Boolean).join(", ") ||
      undefined,
    method,
  }));
  if (suggested) {
    items.sort((a, b) => Number(b.method === suggested) - Number(a.method === suggested));
  }
  const picked = await vscode.window.showQuickPick(items, { title: "Select Sign-in Method", ignoreFocusOut: true });
  return picked?.method;
}
