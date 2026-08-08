import { GitItem, GitVersionDescriptor } from "azure-devops-node-api/interfaces/GitInterfaces";
import { isDeepStrictEqual } from "node:util";
import { Subject } from "rxjs";
import { compareGitRepositoryContext, GitRepositoryContext } from "./GitRepositoryItem";

export function isGitRepositoryItemItem(item: { type: string }): item is GitRepositoryItemItem {
  return item.type === "gitRepositoryItem";
}

export function compareGitRepositoryItemItem(a: GitRepositoryItemItem, b: GitRepositoryItemItem) {
  if (!compareGitRepositoryContext(a, b)) {
    return false;
  }
  return isDeepStrictEqual(a.versionDescriptor, b.versionDescriptor) && isDeepStrictEqual(a.item, b.item);
}

export interface GitRepositoryItemItem extends GitRepositoryContext {
  readonly type: "gitRepositoryItem";
  versionDescriptor: GitVersionDescriptor | undefined;
  item: GitItem;
  isEqual(other: GitRepositoryItemItem): boolean;
}

export function createGitRepositoryItemItem(
  parent: GitRepositoryContext,
  item: GitItem,
  versionDescriptor: GitVersionDescriptor | undefined,
  refreshObservables: Record<string, Subject<number>>,
): GitRepositoryItemItem {
  return {
    type: "gitRepositoryItem",
    account: parent.account,
    container: parent.container,
    projectId: parent.projectId,
    gitRepositoryId: parent.gitRepositoryId,
    refreshObservables,
    item,
    versionDescriptor,
    isEqual(other) {
      return compareGitRepositoryItemItem(this, other);
    },
  };
}
