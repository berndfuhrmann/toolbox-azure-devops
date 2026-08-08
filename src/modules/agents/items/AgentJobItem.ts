import { TaskAgent, TaskAgentJobRequest } from "azure-devops-node-api/interfaces/TaskAgentInterfaces";
import { isDeepStrictEqual } from "node:util";
import { Subject } from "rxjs";
import { AgentPoolContext, compareAgentPoolContext } from "./AgentPoolItem";

export function isAgentJobItem(item: { type: string }): item is AgentJobItem {
  return item.type === "agentJob";
}

export function compareAgentJobItem(a: AgentJobItem, b: AgentJobItem) {
  if (!compareAgentPoolContext(a, b)) {
    return false;
  }
  if (!isDeepStrictEqual(a.agent, b.agent)) {
    return false;
  }
  return isDeepStrictEqual(a.jobRequest, b.jobRequest);
}

export interface AgentJobItem extends AgentPoolContext {
  readonly type: "agentJob";
  agent?: TaskAgent;
  jobRequest: TaskAgentJobRequest;
  isEqual(other: AgentJobItem): boolean;
}

export function createAgentJobItem(
  parent: AgentPoolContext,
  agent: TaskAgent | undefined,
  jobRequest: TaskAgentJobRequest,
  refreshObservables: Record<string, Subject<number>>,
): AgentJobItem {
  return {
    type: "agentJob",
    account: parent.account,
    container: parent.container,
    projectId: parent.projectId,
    agentPoolId: parent.agentPoolId,
    agent,
    refreshObservables,
    jobRequest,
    isEqual(other) {
      return compareAgentJobItem(this, other);
    },
  };
}
