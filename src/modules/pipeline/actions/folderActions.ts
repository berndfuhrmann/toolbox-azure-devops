import { Container } from "inversify";
import vscode, { TreeItem } from "vscode";
import { PipelineFolderItem } from "../items/PipelineFolderItem";
import { PipelineFolderTreeItem } from "../treeItems/PipelineFolderTreeItem";
import { ApiService } from "../../../generated/ApiService";
import { types } from "../../../generated/types";
import { firstValueFrom } from "rxjs";
import { AccountContextProvider } from "../../core/AccountContextProvider";
import { isException } from "../../../common/Exception";
import { Folder } from "azure-devops-node-api/interfaces/BuildInterfaces";
import { refreshRefreshable } from "../../../common/items/RefreshableItem";
import { ProjectTreeItem } from "../../core/treeItems/ProjectTreeItem";
import { ProjectItem } from "../../core/items/ProjectItem";

async function pipelineFolderUpdate(container: Container, data: PipelineFolderItem, update: Folder) {
  const accountContextProvider = container.get<AccountContextProvider>(types.AccountContextProvider);

  const buildApi = await firstValueFrom(
    accountContextProvider.getAccountContainer(data.account.accountId).get<ApiService>(types.ApiService).buildApi(),
  );
  if (!isException(buildApi)) {
    await buildApi.updateFolder(update, data.projectId, data.folder.path!);
    refreshRefreshable(data);
  }
}

async function pipelineCreateFolder(container: Container, data: ProjectItem, path: string, folder: Folder) {
  const accountContextProvider = container.get<AccountContextProvider>(types.AccountContextProvider);

  const buildApi = await firstValueFrom(
    accountContextProvider.getAccountContainer(data.account.accountId).get<ApiService>(types.ApiService).buildApi(),
  );
  if (!isException(buildApi)) {
    await buildApi.createFolder(folder, data.projectId, path);
    refreshRefreshable(data);
  }
}

async function pipelineDeleteFolder(container: Container, data: PipelineFolderItem) {
  const accountContextProvider = container.get<AccountContextProvider>(types.AccountContextProvider);

  const buildApi = await firstValueFrom(
    accountContextProvider.getAccountContainer(data.account.accountId).get<ApiService>(types.ApiService).buildApi(),
  );
  if (!isException(buildApi)) {
    await buildApi.deleteFolder(data.projectId, data.folder.path!);
    refreshRefreshable(data);
  }
}

export async function pipelineMoveFolder(
  container: Container,
  sourceFolderItem: PipelineFolderItem,
  targetFolderItem: PipelineFolderItem | undefined,
) {
  const sourcePath = sourceFolderItem.folder.path;
  if (!sourcePath?.startsWith("\\")) {
    return;
  }

  // Get the folder name from the source path
  const lastBackslash = sourcePath.lastIndexOf("\\");
  const folderName = sourcePath.substring(lastBackslash + 1);

  // Determine the target path
  const targetPath = targetFolderItem?.folder.path ?? "";

  // Create the new path
  const newPath = `${targetPath}\\${folderName}`;

  // Show confirmation dialog
  const confirmation = await vscode.window.showWarningMessage(
    `Move folder "${folderName}" to "${targetPath || "root"}"?`,
    { modal: true },
    "Move",
  );

  if (confirmation !== "Move") {
    return;
  }

  // Update the folder path
  await pipelineFolderUpdate(container, sourceFolderItem, { path: newPath });
}

export function pipelineRenameFolderAction(container: Container) {
  return async (treeItem: TreeItem) => {
    if (treeItem instanceof PipelineFolderTreeItem) {
      const currentPath = (treeItem as PipelineFolderTreeItem).data.folder.path;
      if (currentPath !== undefined && currentPath.startsWith("\\")) {
        const lastBackslash = currentPath.lastIndexOf("\\");
        const folderName = currentPath.substring(lastBackslash + 1);
        const parentPath = currentPath.substring(0, lastBackslash);

        const newFolderName = await vscode.window.showInputBox({
          prompt: "Enter new folder name",
          title: "Rename Folder",
          value: folderName,
        });

        if (newFolderName === undefined) {
          return;
        }

        const newPath = `${parentPath}\\${newFolderName}`;

        await pipelineFolderUpdate(container, treeItem.data, { path: newPath });
      }
    }
  };
}

export function pipelineCreateFolderAction(container: Container) {
  return async (treeItem: TreeItem) => {
    if (treeItem instanceof PipelineFolderTreeItem || treeItem instanceof ProjectTreeItem) {
      const newFolderName = await vscode.window.showInputBox({
        prompt: "Enter new folder name",
        title: "Create Folder",
        value: "",
      });

      if (newFolderName === undefined) {
        return;
      }

      let path = "";
      if (treeItem instanceof PipelineFolderTreeItem) {
        path = (treeItem.data as PipelineFolderItem).folder.path!;
      }
      const newPath = `${path}\\${newFolderName}`;
      await pipelineCreateFolder(container, treeItem.data, newPath, {
        path: newPath,
      });
    }
  };
}

export function pipelineDeleteFolderAction(container: Container) {
  return async (treeItem: TreeItem) => {
    if (treeItem instanceof PipelineFolderTreeItem) {
      const folderPath = treeItem.data.folder.path;
      if (folderPath === undefined) {
        return;
      }

      const folderName = folderPath.substring(folderPath.lastIndexOf("\\") + 1);

      const confirmation = await vscode.window.showWarningMessage(
        `Are you sure you want to delete the folder "${folderName}"?`,
        { modal: true },
        "Delete",
      );

      if (confirmation !== "Delete") {
        return;
      }

      await pipelineDeleteFolder(container, treeItem.data);
    }
  };
}
