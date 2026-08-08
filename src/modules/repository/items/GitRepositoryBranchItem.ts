import { GitBranchStats, GitRepository } from "azure-devops-node-api/interfaces/GitInterfaces";
import { isDeepStrictEqual } from "node:util";
import { Subject } from "rxjs";
import { compareGitRepositoryContext, GitRepositoryContext } from "./GitRepositoryItem";

export function isGitRepositoryBranchItem(item: { type: string }): item is GitRepositoryBranchItem {
  return item.type === "gitRepositoryBranch";
}

export function compareGitRepositoryBranchItem(a: GitRepositoryBranchItem, b: GitRepositoryBranchItem) {
  if (!compareGitRepositoryContext(a, b)) {
    return false;
  }
  return isDeepStrictEqual(a.branch, b.branch);
}

export interface GitRepositoryBranchItem extends GitRepositoryContext {
  readonly type: "gitRepositoryBranch";
  gitRepository: GitRepository;
  branch: GitBranchStats;
  isEqual(other: GitRepositoryBranchItem): boolean;
}

export function createGitRepositoryBranchItem(
  parent: GitRepositoryContext,
  gitRepository: GitRepository,
  branch: GitBranchStats,
  refreshObservables: Record<string, Subject<number>>,
): GitRepositoryBranchItem {
  return {
    type: "gitRepositoryBranch",
    account: parent.account,
    container: parent.container,
    projectId: parent.projectId,
    gitRepositoryId: parent.gitRepositoryId,
    refreshObservables,
    gitRepository,
    branch,
    isEqual(other) {
      return compareGitRepositoryBranchItem(this, other);
    },
  };
}
