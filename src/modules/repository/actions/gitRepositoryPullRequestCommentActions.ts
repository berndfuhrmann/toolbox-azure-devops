import type { IGitApi } from "azure-devops-node-api/GitApi";
import { Container } from "inversify";
import { firstValueFrom } from "rxjs";
import vscode, { TreeItem } from "vscode";
import { isException } from "../../../common/Exception";
import { refreshRefreshable } from "../../../common/items/RefreshableItem";
import { ApiService } from "../../../generated/ApiService";
import { types } from "../../../generated/types";
import { AccountContextProvider } from "../../core/AccountContextProvider";
import { GitRepositoryPullRequestContext } from "../items/GitRepositoryPullRequestItem";
import { commentThreadStatuses } from "../services/pullRequestComments";
import { GitRepositoryPullRequestCommentThreadTreeItem } from "../treeItems/GitRepositoryPullRequestCommentThreadTreeItem";
import { GitRepositoryPullRequestCommentTreeItem } from "../treeItems/GitRepositoryPullRequestCommentTreeItem";

async function updateComments(
  container: Container,
  data: GitRepositoryPullRequestContext,
  errorMessage: string,
  update: (gitApi: IGitApi) => Promise<unknown>,
) {
  try {
    const accountContextProvider = container.get<AccountContextProvider>(types.AccountContextProvider);
    const gitApi = await firstValueFrom(
      accountContextProvider.getAccountContainer(data.account.accountId).get<ApiService>(types.ApiService).gitApi(),
    );
    if (isException(gitApi)) {
      throw gitApi.error;
    }
    await update(gitApi);
    refreshRefreshable(data);
  } catch (error) {
    vscode.window.showErrorMessage(`${errorMessage}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export function gitRepositoryPullRequestCommentThreadSetStatusAction(container: Container) {
  return async (treeItem: TreeItem) => {
    if (treeItem instanceof GitRepositoryPullRequestCommentThreadTreeItem) {
      const data = treeItem.data;
      const currentStatus = data.commentThread.status;
      const selected = await vscode.window.showQuickPick(
        commentThreadStatuses.map(({ status, label }) => ({
          label,
          description: status === currentStatus ? "Current" : undefined,
          status,
        })),
        { title: "Set Comment Status", placeHolder: "Select new status" },
      );
      if (!selected || selected.status === currentStatus) {
        return;
      }
      await updateComments(container, data, "Failed to set comment status", (gitApi) =>
        gitApi.updateThread(
          { status: selected.status },
          data.gitRepositoryId,
          data.pullRequestId,
          data.threadId,
          data.projectId,
        ),
      );
    }
  };
}

function getComment(treeItem: TreeItem) {
  if (treeItem instanceof GitRepositoryPullRequestCommentThreadTreeItem) {
    return { data: treeItem.data, comment: treeItem.data.firstComment };
  }
  if (treeItem instanceof GitRepositoryPullRequestCommentTreeItem) {
    return { data: treeItem.data, comment: treeItem.data.comment };
  }
  return undefined;
}

function likeAction(container: Container, method: "createLike" | "deleteLike", errorMessage: string) {
  return async (treeItem: TreeItem) => {
    const target = getComment(treeItem);
    if (target && !target.comment.isDeleted) {
      const { data, comment } = target;
      await updateComments(container, data, errorMessage, (gitApi) =>
        gitApi[method](data.gitRepositoryId, data.pullRequestId, data.threadId, comment.id!, data.projectId),
      );
    }
  };
}

export function gitRepositoryPullRequestCommentLikeAction(container: Container) {
  return likeAction(container, "createLike", "Failed to like comment");
}

export function gitRepositoryPullRequestCommentRemoveLikeAction(container: Container) {
  return likeAction(container, "deleteLike", "Failed to remove like");
}
