import { WorkItemClassificationNode } from "azure-devops-node-api/interfaces/WorkItemTrackingInterfaces";
import { Subject } from "rxjs";
import { compareProjectContext, ProjectContext } from "../../core/items/ProjectItem";

export interface WorkItemAreaPathItem extends ProjectContext {
  classificationNode: WorkItemClassificationNode;
  leafTypeNames: ReadonlySet<string>;
  isEqual(other: WorkItemAreaPathItem): boolean;
}

export function createWorkItemAreaPathItem(
  parent: ProjectContext,
  classificationNode: WorkItemClassificationNode,
  leafTypeNames: ReadonlySet<string>,
  refreshObservables: Record<string, Subject<number>>,
): WorkItemAreaPathItem {
  return {
    account: parent.account,
    container: parent.container,
    projectId: parent.projectId,
    refreshObservables,
    classificationNode,
    leafTypeNames,
    isEqual(other: WorkItemAreaPathItem) {
      return (
        compareProjectContext(this, other) &&
        this.classificationNode.id === (other as WorkItemAreaPathItem).classificationNode.id
      );
    },
  };
}
