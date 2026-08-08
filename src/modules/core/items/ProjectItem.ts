import { TeamProjectReference } from "azure-devops-node-api/interfaces/CoreInterfaces";
import { isDeepStrictEqual } from "node:util";
import { Subject } from "rxjs";
import { AccountContext, compareAccountItem } from "./AccountItem";

export function isProjectItem(item: { type: string }): item is ProjectItem {
  return item.type === "project";
}

export function compareProjectItem(a: ProjectItem, b: ProjectItem) {
  if (!compareAccountItem(a, b)) {
    return false;
  }
  return isDeepStrictEqual(a.project, b.project);
}

export function compareProjectContext(a: ProjectContext, b: ProjectContext) {
  if (!compareAccountItem(a, b)) {
    return false;
  }
  return a.projectId === b.projectId;
}

export interface ProjectContext extends AccountContext {
  projectId: string;
}

export interface ProjectItem extends ProjectContext {
  readonly type: "project";
  project: TeamProjectReference;
  isEqual(other: ProjectItem): boolean;
}

export function createProjectItem(
  parent: AccountContext,
  project: TeamProjectReference,
  refreshObservables: Record<string, Subject<number>>,
): ProjectItem {
  return {
    type: "project",
    account: parent.account,
    container: parent.container,
    refreshObservables,
    projectId: project.id!,
    project,
    isEqual(other) {
      return compareProjectItem(this, other);
    },
  };
}
