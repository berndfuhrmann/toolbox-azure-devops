import { GitRepository } from "azure-devops-node-api/interfaces/GitInterfaces";
import { isDeepStrictEqual } from "node:util";
import { Subject } from "rxjs";
import { compareProjectContext, ProjectContext } from "../../core/items/ProjectItem";

export function isGitRepositoryItem(item: { type: string }): item is GitRepositoryItem {
  return item.type === "gitRepository";
}

export function compareGitRepositoryContext(a: GitRepositoryContext, b: GitRepositoryContext) {
  if (!compareProjectContext(a, b)) {
    return false;
  }
  return a.gitRepositoryId === b.gitRepositoryId;
}

export function compareGitRepositoryItem(a: GitRepositoryItem, b: GitRepositoryItem) {
  if (!compareProjectContext(a, b)) {
    return false;
  }
  return isDeepStrictEqual(a.gitRepository, b.gitRepository);
}

export function getGitRepositoryItemKey(item: GitRepositoryContext): string {
  return item.account.accountId + "/" + item.gitRepositoryId;
}

export function openInWebGetUrl(data: GitRepositoryItem) {
  return data.gitRepository.webUrl;
}

export const refToDisplayString = (ref: string | undefined) => {
  if (ref === undefined) {
    return "undefined";
  }
  return ref.replace(/^refs\/heads\//, "");
};

export interface GitRepositoryContext extends ProjectContext {
  gitRepositoryId: string;
}

export interface GitRepositoryItem extends GitRepositoryContext {
  readonly type: "gitRepository";
  gitRepository: GitRepository;
  isEqual(other: GitRepositoryItem): boolean;
}

export function createGitRepositoryItem(
  parent: ProjectContext,
  gitRepository: GitRepository,
  refreshObservables: Record<string, Subject<number>>,
): GitRepositoryItem {
  return {
    type: "gitRepository",
    account: parent.account,
    container: parent.container,
    projectId: parent.projectId,
    gitRepositoryId: gitRepository.id!,
    refreshObservables,
    gitRepository,
    isEqual(other) {
      return compareGitRepositoryItem(this, other);
    },
  };
}
