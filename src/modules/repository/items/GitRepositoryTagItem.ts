import { GitRef } from "azure-devops-node-api/interfaces/GitInterfaces";
import { isDeepStrictEqual } from "node:util";
import { Subject } from "rxjs";
import { compareGitRepositoryContext, GitRepositoryContext } from "./GitRepositoryItem";

export function isGitRepositoryTagItem(item: { type: string }): item is GitRepositoryTagItem {
  return item.type === "gitRepositoryTag";
}

export function compareGitRepositoryTagItem(a: GitRepositoryTagItem, b: GitRepositoryTagItem) {
  if (!compareGitRepositoryContext(a, b)) {
    return false;
  }
  return isDeepStrictEqual(a.ref, b.ref);
}

export interface GitRepositoryTagItem extends GitRepositoryContext {
  readonly type: "gitRepositoryTag";
  ref: GitRef;
  isEqual(other: GitRepositoryTagItem): boolean;
}

export function createGitRepositoryTagItem(
  parent: GitRepositoryContext,
  ref: GitRef,
  refreshObservables: Record<string, Subject<number>>,
): GitRepositoryTagItem {
  return {
    type: "gitRepositoryTag",
    account: parent.account,
    container: parent.container,
    projectId: parent.projectId,
    gitRepositoryId: parent.gitRepositoryId,
    refreshObservables,
    ref,
    isEqual(other) {
      return compareGitRepositoryTagItem(this, other);
    },
  };
}
