import { TaskAgent } from "azure-devops-node-api/interfaces/TaskAgentInterfaces";
import { isDeepStrictEqual } from "node:util";
import { Subject } from "rxjs";
import { AgentPoolContext, compareAgentPoolContext } from "./AgentPoolItem";

export function isAgentItem(item: { type: string }): item is AgentItem {
  return item.type === "agent";
}

export function compareAgentItem(a: AgentItem, b: AgentItem) {
  if (!compareAgentPoolContext(a, b)) {
    return false;
  }
  return isDeepStrictEqual(a.agent, b.agent);
}

export interface AgentItem extends AgentPoolContext {
  readonly type: "agent";
  agent: TaskAgent;
  isEqual(other: AgentItem): boolean;
}

export function createAgentItem(
  parent: AgentPoolContext,
  agent: TaskAgent,
  refreshObservables: Record<string, Subject<number>>,
): AgentItem {
  return {
    type: "agent",
    account: parent.account,
    container: parent.container,
    projectId: parent.projectId,
    agentPoolId: parent.agentPoolId,
    refreshObservables,
    agent,
    isEqual(other) {
      return compareAgentItem(this, other);
    },
  };
}
