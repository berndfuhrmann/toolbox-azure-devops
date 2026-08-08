import { Container } from "inversify";
import vscode, { TreeItem } from "vscode";
import { PipelineRunTreeItem } from "../treeItems/PipelineRunTreeItem";
import { ApiService } from "../../../generated/ApiService";
import { types } from "../../../generated/types";
import { firstValueFrom } from "rxjs";
import { AccountContextProvider } from "../../core/AccountContextProvider";
import { isException } from "../../../common/Exception";
import { PipelineRunItem } from "../items/PipelineRunItem";
import { refreshRefreshable } from "../../../common/items/RefreshableItem";
import { BuildStatus } from "azure-devops-node-api/interfaces/BuildInterfaces";

async function pipelineUpdateBuild(container: Container, data: PipelineRunItem, updateFn: (build: any) => void) {
  const accountContextProvider = container.get<AccountContextProvider>(types.AccountContextProvider);

  const buildApi = await firstValueFrom(
    accountContextProvider.getAccountContainer(data.account.accountId).get<ApiService>(types.ApiService).buildApi(),
  );

  if (!isException(buildApi)) {
    const build = data.build;
    updateFn(build);
    await buildApi.updateBuild(build, data.projectId, build.id!);
    refreshRefreshable(data);
  }
}

export function pipelineCancelRunAction(container: Container) {
  return async (treeItem: TreeItem) => {
    if (treeItem instanceof PipelineRunTreeItem) {
      const buildNumber = treeItem.data.build.buildNumber;
      const buildStatus = treeItem.data.build.status;

      // Check if the build can be cancelled
      if (buildStatus === BuildStatus.Completed || buildStatus === BuildStatus.Cancelling) {
        vscode.window.showWarningMessage(
          `Build "${buildNumber}" cannot be cancelled (status: ${BuildStatus[buildStatus ?? BuildStatus.None]})`,
        );
        return;
      }

      const confirmation = await vscode.window.showWarningMessage(
        `Are you sure you want to cancel build "${buildNumber}"?`,
        { modal: true },
        "Cancel Build",
      );

      if (confirmation !== "Cancel Build") {
        return;
      }

      await pipelineUpdateBuild(container, treeItem.data, (build) => {
        build.status = BuildStatus.Cancelling;
      });

      vscode.window.showInformationMessage(`Build "${buildNumber}" is being cancelled`);
    }
  };
}

export function pipelineRerunRunAction(container: Container) {
  return async (treeItem: TreeItem) => {
    if (treeItem instanceof PipelineRunTreeItem) {
      const accountContextProvider = container.get<AccountContextProvider>(types.AccountContextProvider);

      const apiService = accountContextProvider
        .getAccountContainer(treeItem.data.account.accountId)
        .get<ApiService>(types.ApiService);

      const buildApi = await firstValueFrom(apiService.buildApi());

      if (isException(buildApi)) {
        vscode.window.showErrorMessage("Failed to access Build API");
        return;
      }

      const originalBuild = treeItem.data.build;
      const buildNumber = originalBuild.buildNumber;

      const confirmation = await vscode.window.showWarningMessage(
        `Re-run build "${buildNumber}"?`,
        { modal: true },
        "Re-run",
      );

      if (confirmation !== "Re-run") {
        return;
      }

      // Queue a new build with the same parameters
      const buildToQueue = {
        definition: { id: originalBuild.definition?.id },
        sourceBranch: originalBuild.sourceBranch,
        sourceVersion: originalBuild.sourceVersion,
        parameters: originalBuild.parameters,
      };

      try {
        await buildApi.queueBuild(buildToQueue, treeItem.data.projectId);
        vscode.window.showInformationMessage(`Build "${buildNumber}" has been queued for re-run`);
        refreshRefreshable(treeItem.data);
      } catch (error) {
        vscode.window.showErrorMessage(
          `Failed to re-run build: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }
  };
}
