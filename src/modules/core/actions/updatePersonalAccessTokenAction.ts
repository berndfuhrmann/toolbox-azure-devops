import vscode, { TreeItem } from "vscode";
import { AbstractStorageService } from "../../../common/storage/AbstractStorageService";
import { types } from "../../../generated/types";
import { getAccountFromItem } from "./accountUtilities";
import { Container } from "inversify";

export interface PinInfo {
  accountId: string;
  type: string;
  object: string;
}

export function updatePersonalAccessTokenAction(container: Container) {
  return async (item: TreeItem) => {
    const account = await getAccountFromItem(item, container);
    if (account) {
      const storageService = container.get<AbstractStorageService>(types.StorageService);
      const accountId = account.accountId;
      const newPersonalAccessToken = await promptForPersonalAccessToken();
      if (newPersonalAccessToken) {
        storageService.updateAccountPersonalAccessToken(accountId, newPersonalAccessToken);
      }
    }
  };
}

function promptForPersonalAccessToken(): Promise<string | undefined> {
  return new Promise((resolve) => {
    const inputBox = vscode.window.createInputBox();
    inputBox.title = "Enter your Personal Access Token";
    inputBox.placeholder = "Paste your PAT here";
    inputBox.ignoreFocusOut = true;

    inputBox.onDidAccept(() => {
      resolve(inputBox.value);
      inputBox.dispose();
    });

    inputBox.onDidHide(() => {
      resolve(undefined); // User cancelled
      inputBox.dispose();
    });

    inputBox.show();
  });
}
