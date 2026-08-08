import { Container } from "inversify";
import vscode, { TreeItem } from "vscode";
import { PipelineTreeItem } from "../treeItems/PipelineTreeItem";
import { ApiService } from "../../../generated/ApiService";
import { types } from "../../../generated/types";
import { firstValueFrom } from "rxjs";
import { AccountContextProvider } from "../../core/AccountContextProvider";
import { isException } from "../../../common/Exception";
import { PipelineItem } from "../items/PipelineItem";
import { RepositoryTreeProvider } from "../../repository/RepositoryTreeProvider";
import { refreshRefreshable } from "../../../common/items/RefreshableItem";
import { PipelineFolderItem } from "../items/PipelineFolderItem";

async function revealPipelineRepository(container: Container, data: PipelineItem) {
  const accountContextProvider = container.get<AccountContextProvider>(types.AccountContextProvider);

  const buildApi = await firstValueFrom(
    accountContextProvider.getAccountContainer(data.account.accountId).get<ApiService>(types.ApiService).buildApi(),
  );

  if (!isException(buildApi)) {
    const definition = await buildApi.getDefinition(data.projectId, data.pipelineId);

    if (definition && definition.repository && definition.repository.id) {
      const repositoryTreeProvider = container.get<RepositoryTreeProvider>(types.RepositoryTreeProvider);
      await repositoryTreeProvider.findAndRevealRepository(
        definition.repository.id,
        data.account.accountId,
        data.projectId,
      );
    }
  }
}

async function pipelineUpdateDefinition(container: Container, data: PipelineItem, updateFn: (definition: any) => void) {
  const accountContextProvider = container.get<AccountContextProvider>(types.AccountContextProvider);

  const buildApi = await firstValueFrom(
    accountContextProvider.getAccountContainer(data.account.accountId).get<ApiService>(types.ApiService).buildApi(),
  );

  if (!isException(buildApi)) {
    const definition = await buildApi.getDefinition(data.projectId, data.pipelineId);

    if (definition) {
      updateFn(definition);
      await buildApi.updateDefinition(definition, data.projectId, data.pipelineId);
      refreshRefreshable(data);
    }
  }
}

async function pipelineDeleteDefinition(container: Container, data: PipelineItem) {
  const accountContextProvider = container.get<AccountContextProvider>(types.AccountContextProvider);

  const buildApi = await firstValueFrom(
    accountContextProvider.getAccountContainer(data.account.accountId).get<ApiService>(types.ApiService).buildApi(),
  );

  if (!isException(buildApi)) {
    await buildApi.deleteDefinition(data.projectId, data.pipelineId);
    refreshRefreshable(data);
  }
}

export async function pipelineMovePipeline(
  container: Container,
  sourcePipelineItem: PipelineItem,
  targetFolderItem: PipelineFolderItem | undefined,
) {
  const pipelineName = sourcePipelineItem.pipeline.name;

  // Determine the target path (undefined = root)
  const targetPath = targetFolderItem?.folder.path ?? "\\";

  // Show confirmation dialog
  const confirmation = await vscode.window.showWarningMessage(
    `Move pipeline "${pipelineName}" to "${targetPath === "\\" ? "root" : targetPath}"?`,
    { modal: true },
    "Move",
  );

  if (confirmation !== "Move") {
    return;
  }

  // Update the pipeline path
  await pipelineUpdateDefinition(container, sourcePipelineItem, (definition) => {
    definition.path = targetPath;
  });
}

export function pipelineRevealRepositoryAction(container: Container) {
  return async (treeItem: TreeItem) => {
    if (treeItem instanceof PipelineTreeItem) {
      await revealPipelineRepository(container, treeItem.data);
    }
  };
}

export function pipelineRenamePipelineAction(container: Container) {
  return async (treeItem: TreeItem) => {
    if (treeItem instanceof PipelineTreeItem) {
      const currentName = treeItem.data.pipeline.name;

      const newPipelineName = await vscode.window.showInputBox({
        prompt: "Enter new pipeline name",
        title: "Rename Pipeline",
        value: currentName,
      });

      if (newPipelineName === undefined) {
        return;
      }

      await pipelineUpdateDefinition(container, treeItem.data, (definition) => {
        definition.name = newPipelineName;
      });
    }
  };
}

export function pipelineDeletePipelineAction(container: Container) {
  return async (treeItem: TreeItem) => {
    if (treeItem instanceof PipelineTreeItem) {
      const pipelineName = treeItem.data.pipeline.name;

      const confirmation = await vscode.window.showWarningMessage(
        `Are you sure you want to delete the pipeline "${pipelineName}"?`,
        { modal: true },
        "Delete",
      );

      if (confirmation !== "Delete") {
        return;
      }

      await pipelineDeleteDefinition(container, treeItem.data);
    }
  };
}

export function pipelineRunPipelineAction(container: Container) {
  return async (treeItem: TreeItem) => {
    if (treeItem instanceof PipelineTreeItem) {
      await runPipeline(container, treeItem.data);
    }
  };
}

async function runPipeline(container: Container, data: PipelineItem) {
  const accountContextProvider = container.get<AccountContextProvider>(types.AccountContextProvider);

  const apiService = accountContextProvider
    .getAccountContainer(data.account.accountId)
    .get<ApiService>(types.ApiService);

  // Get the build API
  const buildApi = await firstValueFrom(apiService.buildApi());

  if (isException(buildApi)) {
    vscode.window.showErrorMessage("Failed to access Build API");
    return;
  }

  // Get pipeline definition to find repository
  const definition = await buildApi.getDefinition(data.projectId, data.pipelineId);

  if (!definition || !definition.repository || !definition.repository.id) {
    vscode.window.showErrorMessage("Pipeline repository not found");
    return;
  }

  // Get Git API to fetch branches
  const gitApi = await firstValueFrom(apiService.gitApi());

  if (isException(gitApi)) {
    vscode.window.showErrorMessage("Failed to access Git API");
    return;
  }

  // Get branches
  const branches = await gitApi.getBranches(definition.repository.id, data.projectId);

  if (!branches || branches.length === 0) {
    vscode.window.showErrorMessage("No branches found for this repository");
    return;
  }

  // Create quick pick items from branches
  const branchItems = branches
    .map((branch) => {
      const branchName = branch.name || "";
      const displayName = branchName.replace("refs/heads/", "");
      return {
        label: displayName,
        description: branchName,
        branchName: branchName,
      };
    })
    .sort((a, b) => {
      // Sort with 'main' and 'master' at the top
      if (a.label === "main") {
        return -1;
      }
      if (b.label === "main") {
        return 1;
      }
      if (a.label === "master") {
        return -1;
      }
      if (b.label === "master") {
        return 1;
      }
      return a.label.localeCompare(b.label);
    });

  // Show branch selection
  const selectedBranch = await vscode.window.showQuickPick(branchItems, {
    placeHolder: "Select branch to run pipeline on",
    title: `Run Pipeline: ${data.pipeline.name}`,
  });

  if (!selectedBranch) {
    return; // User cancelled
  }

  // Queue the build
  const buildToQueue = {
    definition: { id: data.pipelineId },
    sourceBranch: selectedBranch.branchName,
  };

  try {
    await buildApi.queueBuild(buildToQueue, data.projectId);
    vscode.window.showInformationMessage(`Pipeline "${data.pipeline.name}" queued on branch "${selectedBranch.label}"`);
    refreshRefreshable(data);
  } catch (error) {
    vscode.window.showErrorMessage(
      `Failed to queue pipeline: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}
