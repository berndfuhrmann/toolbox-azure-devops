import { Build } from "azure-devops-node-api/interfaces/BuildInterfaces";
import { GitCommitRef, GitPullRequest } from "azure-devops-node-api/interfaces/GitInterfaces";
import { WorkItemRelation } from "azure-devops-node-api/interfaces/WorkItemTrackingInterfaces";
import { isDeepStrictEqual } from "node:util";
import { getBranchWebUrl, getBuildWebUrl, getCommitWebUrl, getPullRequestWebUrl } from "../WorkItemArtifactLink";
import { WorkItemContext, compareWorkItemContext, WorkItemItem } from "./WorkItemItem";

export function isWorkItemLinkedItemItem(item: { type: string }): item is WorkItemLinkedItemItem {
  return item.type === "workItemLinkedItem";
}

export function compareWorkItemLinkedItemItem(a: WorkItemLinkedItemItem, b: WorkItemLinkedItemItem) {
  if (!compareWorkItemContext(a, b)) {
    return false;
  }
  return isDeepStrictEqual(a.relation, b.relation);
}

export interface WorkItemLinkedItemItem extends WorkItemContext {
  readonly type: "workItemLinkedItem";
  relation: WorkItemRelation;
  commit?: GitCommitRef;
  branchName?: string;
  build?: Build;
  pullRequest?: GitPullRequest;
  isEqual(other: WorkItemLinkedItemItem): boolean;
}

export function openInWebGetUrl(data: WorkItemLinkedItemItem): string | undefined {
  return (
    getPullRequestWebUrl(data.account, data.relation) ??
    getCommitWebUrl(data.account, data.relation) ??
    getBranchWebUrl(data.account, data.relation) ??
    getBuildWebUrl(data.account, data.projectId, data.relation) ??
    undefined
  );
}

export function createWorkItemLinkedItemItem(parent: WorkItemItem, relation: WorkItemRelation): WorkItemLinkedItemItem {
  return {
    type: "workItemLinkedItem",
    account: parent.account,
    container: parent.container,
    projectId: parent.projectId,
    refreshObservables: parent.refreshObservables,
    workItemId: parent.workItemId,
    relation,
    isEqual(other) {
      return compareWorkItemLinkedItemItem(this, other);
    },
  };
}
