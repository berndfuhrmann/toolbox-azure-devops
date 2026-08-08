import { Container } from "inversify";
import vscode, { TreeItem } from "vscode";
import { firstValueFrom } from "rxjs";
import { AttachmentTreeItem } from "../treeItems/AttachmentTreeItem";
import { ApiService } from "../../../generated/ApiService";
import { types } from "../../../generated/types";
import { AccountContextProvider } from "../../core/AccountContextProvider";
import { isException } from "../../../common/Exception";
import { getAttachmentFileName } from "../items/AttachmentItem";
import * as fs from "fs";
import * as path from "path";

export function downloadAttachmentAction(container: Container) {
  return async (treeItem: TreeItem) => {
    if (!(treeItem instanceof AttachmentTreeItem)) {
      return;
    }

    const data = treeItem.data;
    const fileName = getAttachmentFileName(data.attachment);
    const attachmentUrl = data.attachment.url;

    if (!attachmentUrl) {
      vscode.window.showErrorMessage("Attachment URL is missing");
      return;
    }

    // Extract the attachment ID from the URL
    // URL format: https://{instance}/DefaultCollection/{project}/_apis/wit/attachments/{id}
    const match = attachmentUrl.match(/\/attachments\/([^/?]+)/);
    if (!match) {
      vscode.window.showErrorMessage("Could not parse attachment ID from URL");
      return;
    }
    const attachmentId = match[1];

    try {
      const accountContextProvider = container.get<AccountContextProvider>(types.AccountContextProvider);

      const workItemTrackingApi = await firstValueFrom(
        accountContextProvider
          .getAccountContainer(data.account.accountId)
          .get<ApiService>(types.ApiService)
          .workItemTrackingApi(),
      );

      if (isException(workItemTrackingApi)) {
        vscode.window.showErrorMessage(`Failed to get Work Item Tracking API: ${workItemTrackingApi.error.message}`);
        return;
      }

      // Ask user where to save the file
      const defaultUri = vscode.Uri.file(
        path.join(vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || process.cwd(), fileName),
      );

      const saveUri = await vscode.window.showSaveDialog({
        defaultUri,
        filters: {
          "All Files": ["*"],
        },
      });

      if (!saveUri) {
        return; // User cancelled
      }

      // Download the attachment
      await vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: `Downloading ${fileName}...`,
          cancellable: false,
        },
        async () => {
          const stream = await workItemTrackingApi.getAttachmentContent(attachmentId, fileName, data.projectId, true);

          // Write the stream to the file
          const writeStream = fs.createWriteStream(saveUri.fsPath);

          return new Promise<void>((resolve, reject) => {
            stream.on("error", reject);
            writeStream.on("error", reject);
            writeStream.on("finish", resolve);
            stream.pipe(writeStream);
          });
        },
      );

      vscode.window.showInformationMessage(`Downloaded ${fileName} to ${saveUri.fsPath}`);

      // Ask if user wants to open the file
      const openFile = await vscode.window.showInformationMessage(
        "Do you want to open the downloaded file?",
        "Open",
        "No",
      );

      if (openFile === "Open") {
        await vscode.commands.executeCommand("vscode.open", saveUri);
      }
    } catch (error) {
      vscode.window.showErrorMessage(
        `Failed to download attachment: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  };
}
