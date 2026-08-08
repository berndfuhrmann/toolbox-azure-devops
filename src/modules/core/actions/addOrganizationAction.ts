import vscode from "vscode";
import { types } from "../../../generated/types";
import { Container } from "inversify";
import { AbstractStorageService } from "../../../common/storage/AbstractStorageService";
import { randomUUID } from "crypto";
export function addOrganizationAction(container: Container) {
  return async () => {
    const url = await vscode.window.showInputBox({
      title: "Enter URL",
      value: "https://dev.azure.com/",
      placeHolder: "URL of TFS or Azure Devops Host",
      ignoreFocusOut: true,
    });

    const organization = await vscode.window.showInputBox({
      title: "Enter Organization",
      ignoreFocusOut: true,
    });
    const personalAccessToken = await vscode.window.showInputBox({
      title: "Enter Personal Access Token (PAT)",
      password: true,
      ignoreFocusOut: true,
    });
    if (url && organization && personalAccessToken) {
      const storageService = container.get<AbstractStorageService>(types.StorageService);
      storageService.addAccount({
        accountId: randomUUID(),
        url,
        organization,
        personalAccessToken,
      });
    }
  };
}
