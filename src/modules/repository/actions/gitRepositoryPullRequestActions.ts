import { GitPullRequest, PullRequestStatus } from "azure-devops-node-api/interfaces/GitInterfaces";
import { Container } from "inversify";
import { firstValueFrom } from "rxjs";
import vscode, { TreeItem } from "vscode";
import { isException } from "../../../common/Exception";
import { refreshRefreshable } from "../../../common/items/RefreshableItem";
import { ApiService } from "../../../generated/ApiService";
import { types } from "../../../generated/types";
import { AccountContextProvider } from "../../core/AccountContextProvider";
import { GitRepositoryPullRequestItem } from "../items/GitRepositoryPullRequestItem";
import { GitRepositoryPullRequestTreeItem } from "../treeItems/GitRepositoryPullRequestTreeItem";

async function gitRepositoryPullRequestUpdate(
  container: Container,
  data: GitRepositoryPullRequestItem,
  update: GitPullRequest,
) {
  const accountContextProvider = container.get<AccountContextProvider>(types.AccountContextProvider);

  const gitApi = await firstValueFrom(
    accountContextProvider.getAccountContainer(data.account.accountId).get<ApiService>(types.ApiService).gitApi(),
  );
  if (!isException(gitApi)) {
    await gitApi.updatePullRequest(update, data.gitRepositoryId, data.pullRequestId, data.projectId);
    refreshRefreshable(data);
  }
}

export function gitRepositoryPullRequestSetTitleAction(container: Container) {
  return async (treeItem: TreeItem) => {
    if (treeItem instanceof GitRepositoryPullRequestTreeItem) {
      const data: GitRepositoryPullRequestItem = treeItem.data;
      const title = await vscode.window.showInputBox({
        prompt: "Enter new title",
        title: "Change Pull Request title",
        value: data.pullRequest.title ?? "",
      });
      if (title === undefined) {
        return;
      }
      await gitRepositoryPullRequestUpdate(container, data, { title });
    }
  };
}

export function gitRepositoryPullRequestAbandonAction(container: Container) {
  return async (treeItem: TreeItem) => {
    if (treeItem instanceof GitRepositoryPullRequestTreeItem) {
      const data: GitRepositoryPullRequestItem = treeItem.data;
      const decision = await vscode.window.showQuickPick(["Abandon Pull Request", "Abort Operation"]);
      if (decision === "Abort Operation") {
        return;
      }

      await gitRepositoryPullRequestUpdate(container, data, {
        status: PullRequestStatus.Abandoned,
      });
    }
  };
}
