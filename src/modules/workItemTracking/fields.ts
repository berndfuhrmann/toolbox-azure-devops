import { WorkItem } from "azure-devops-node-api/interfaces/WorkItemTrackingInterfaces";

export const WorkItemFieldSystemTitle = "System.Title";
export const WorkItemFieldSystemWorkItemType = "System.WorkItemType";
export const WorkItemFieldSystemState = "System.State";
export const WorkItemFieldSystemAssignedTo = "System.AssignedTo";
export const WorkItemFieldSystemCreatedBy = "System.CreatedBy";
export const WorkItemFieldSystemAreaPath = "System.AreaPath";
export const WorkItemFieldSystemIterationPath = "System.IterationPath";
export const WorkItemFieldSystemTags = "System.Tags";
export const WorkItemFieldEffort = "Microsoft.VSTS.Scheduling.Effort";

export function getTitle(workItem: WorkItem): string {
  return workItem.fields?.[WorkItemFieldSystemTitle] ?? "missing title";
}

export function getWorkItemType(workItem: WorkItem): string {
  return workItem.fields?.[WorkItemFieldSystemWorkItemType] ?? "Unknown";
}

export function getState(workItem: WorkItem): string {
  return workItem.fields?.[WorkItemFieldSystemState] ?? "Unknown";
}

export function getAssignedTo(workItem: WorkItem): string | undefined {
  const assignedTo = workItem.fields?.[WorkItemFieldSystemAssignedTo];
  if (typeof assignedTo === "string") {
    return assignedTo;
  }
  return assignedTo?.displayName ?? assignedTo?.uniqueName;
}

export function getCreatedBy(workItem: WorkItem): string | undefined {
  const createdBy = workItem.fields?.[WorkItemFieldSystemCreatedBy];
  if (typeof createdBy === "string") {
    return createdBy;
  }
  return createdBy?.displayName ?? createdBy?.uniqueName;
}

export function getAreaPath(workItem: WorkItem): string {
  return workItem.fields?.[WorkItemFieldSystemAreaPath] ?? "";
}

export function getIterationPath(workItem: WorkItem): string {
  return workItem.fields?.[WorkItemFieldSystemIterationPath] ?? "";
}

export function getTags(workItem: WorkItem): string[] {
  const tags = workItem.fields?.[WorkItemFieldSystemTags];
  if (typeof tags === "string") {
    return tags
      .split(";")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
  }
  return [];
}

export function getEffort(workItem: WorkItem): number | undefined {
  const effort = workItem.fields?.[WorkItemFieldEffort];
  if (typeof effort === "number") {
    return effort;
  }
  if (typeof effort === "string") {
    const parsed = Number.parseFloat(effort);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }
  return undefined;
}
