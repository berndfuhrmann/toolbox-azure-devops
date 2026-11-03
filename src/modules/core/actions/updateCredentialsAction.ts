import { Container } from "inversify";
import { TreeItem } from "vscode";
import { AbstractStorageService } from "../../../common/storage/AbstractStorageService";
import { types } from "../../../generated/types";
import { AuthenticationMethodRegistry } from "../authentication/AuthenticationMethodRegistry";
import { getAccountFromItem } from "./accountUtilities";

export function updateCredentialsAction(container: Container) {
  return async (item: TreeItem | undefined) => {
    const account = await getAccountFromItem(item, container);
    if (!account) {
      return;
    }
    const authenticationMethodRegistry = container.get<AuthenticationMethodRegistry>(
      types.AuthenticationMethodRegistry,
    );
    const configuration = await authenticationMethodRegistry
      .get(account.authentication.type)
      .updateCredentials(account);
    if (configuration) {
      const storageService = container.get<AbstractStorageService>(types.StorageService);
      await storageService.updateAccountAuthentication(account.accountId, configuration);
    }
  };
}
