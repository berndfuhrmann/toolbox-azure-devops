import { TaskAgentPool } from "azure-devops-node-api/interfaces/TaskAgentInterfaces";
import { isDeepStrictEqual } from "node:util";
import { Subject } from "rxjs";
import { compareProjectContext, ProjectContext } from "../../core/items/ProjectItem";

export function isAgentPoolItem(item: { type: string }): item is AgentPoolItem {
  return item.type === "agentPool";
}

export function compareAgentPoolContext(a: AgentPoolContext, b: AgentPoolContext) {
  if (!compareProjectContext(a, b)) {
    return false;
  }
  return a.agentPoolId === b.agentPoolId;
}

export function compareAgentPoolItem(a: AgentPoolItem, b: AgentPoolItem) {
  if (!compareProjectContext(a, b)) {
    return false;
  }
  return isDeepStrictEqual(a.agentPool, b.agentPool);
}

export interface AgentPoolContext extends ProjectContext {
  agentPoolId: number;
}

export interface AgentPoolItem extends AgentPoolContext {
  readonly type: "agentPool";
  agentPool: TaskAgentPool;
  isEqual(other: AgentPoolItem): boolean;
}

export function createAgentPoolItem(
  parent: ProjectContext,
  agentPool: TaskAgentPool,
  refreshObservables: Record<string, Subject<number>>,
): AgentPoolItem {
  return {
    type: "agentPool",
    isEqual(other) {
      return compareAgentPoolItem(this, other);
    },
    account: parent.account,
    container: parent.container,
    projectId: parent.projectId,
    agentPoolId: agentPool.id!,
    refreshObservables,
    agentPool,
  };
}
