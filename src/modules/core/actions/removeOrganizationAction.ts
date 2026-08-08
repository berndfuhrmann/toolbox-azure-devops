import { Container } from "inversify";
import vscode, { TreeItem } from "vscode";
import { AbstractStorageService } from "../../../common/storage/AbstractStorageService";
import { types } from "../../../generated/types";
import { getAccountFromItem } from "./accountUtilities";

export function removeOrganizationAction(container: Container) {
  return async (item: TreeItem) => {
    const account = await getAccountFromItem(item, container);
    if (account) {
      const storageService = container.get<AbstractStorageService>(types.StorageService);
      const display = `${account.organization} on ${account.url}`;
      const choiceYes = "Yes";
      const choiceNo = "No";

      void vscode.window
        .showInformationMessage(
          `Are you sure you want to remove the organization '${display}' from this extension?`,
          { modal: true },
          choiceYes,
          choiceNo,
        )
        .then((selection) => {
          if (selection === choiceYes) {
            storageService.deleteAccount(account.accountId);
          }
        });
    }
  };
}
