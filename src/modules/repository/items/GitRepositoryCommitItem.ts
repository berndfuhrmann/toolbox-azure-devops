import { GitCommitRef } from "azure-devops-node-api/interfaces/GitInterfaces";
import { isDeepStrictEqual } from "node:util";
import { Subject } from "rxjs";
import { compareGitRepositoryContext, GitRepositoryContext } from "./GitRepositoryItem";

export function isGitRepositoryCommitItem(item: { type: string }): item is GitRepositoryCommitItem {
  return item.type === "gitRepositoryCommit";
}

export function compareGitRepositoryCommitItem(a: GitRepositoryCommitItem, b: GitRepositoryCommitItem) {
  if (!compareGitRepositoryContext(a, b)) {
    return false;
  }
  return isDeepStrictEqual(a.commit, b.commit);
}

export interface GitRepositoryCommitItem extends GitRepositoryContext {
  readonly type: "gitRepositoryCommit";
  commit: GitCommitRef;
  isEqual(other: GitRepositoryCommitItem): boolean;
}

export function createGitRepositoryCommitItem(
  parent: GitRepositoryContext,
  commit: GitCommitRef,
  refreshObservables: Record<string, Subject<number>>,
): GitRepositoryCommitItem {
  return {
    type: "gitRepositoryCommit",
    account: parent.account,
    container: parent.container,
    projectId: parent.projectId,
    gitRepositoryId: parent.gitRepositoryId,
    refreshObservables,
    commit,
    isEqual(other) {
      return compareGitRepositoryCommitItem(this, other);
    },
  };
}
