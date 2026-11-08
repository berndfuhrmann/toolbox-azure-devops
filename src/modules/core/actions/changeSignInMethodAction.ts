import { Container } from "inversify";
import { TreeItem } from "vscode";
import { AbstractStorageService } from "../../../common/storage/AbstractStorageService";
import { types } from "../../../generated/types";
import { AuthenticationMethodRegistry } from "../authentication/AuthenticationMethodRegistry";
import { getAccountFromItem, pickAuthenticationMethod } from "./accountUtilities";

/**
 * Lets the user pick a sign-in method for an existing organization and runs its steps.
 * Secrets of the previous method are replaced by those of the new one, so they are deleted if it has none.
 */
export function changeSignInMethodAction(container: Container) {
  return async (item: TreeItem | undefined) => {
    const account = await getAccountFromItem(item, container);
    if (!account) {
      return;
    }
    const authenticationMethodRegistry = container.get<AuthenticationMethodRegistry>(
      types.AuthenticationMethodRegistry,
    );
    const authenticationMethod = await pickAuthenticationMethod(
      authenticationMethodRegistry.all(),
      account.url,
      account.authentication.type,
    );
    if (!authenticationMethod) {
      return;
    }
    const configuration = await authenticationMethod.configure(account.url, account.organization, account.accountId);
    if (configuration) {
      const storageService = container.get<AbstractStorageService>(types.StorageService);
      await storageService.updateAccountAuthentication(account.accountId, configuration);
    }
  };
}
