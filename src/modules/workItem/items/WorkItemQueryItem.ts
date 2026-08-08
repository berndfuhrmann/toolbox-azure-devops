import { QueryHierarchyItem } from "azure-devops-node-api/interfaces/WorkItemTrackingInterfaces";
import { Subject } from "rxjs";
import { compareProjectContext, ProjectContext } from "../../core/items/ProjectItem";

export interface WorkItemQueryItem extends ProjectContext {
  queryItem: QueryHierarchyItem;
  isEqual(other: WorkItemQueryItem): boolean;
}

export function createWorkItemQueryItem(
  parent: ProjectContext,
  queryItem: QueryHierarchyItem,
  refreshObservables: Record<string, Subject<number>>,
): WorkItemQueryItem {
  return {
    account: parent.account,
    container: parent.container,
    projectId: parent.projectId,
    refreshObservables,
    queryItem,
    isEqual(other) {
      return compareProjectContext(this, other) && this.queryItem.id === other.queryItem.id;
    },
  };
}
