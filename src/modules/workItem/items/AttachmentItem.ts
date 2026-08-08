import { WorkItemRelation } from "azure-devops-node-api/interfaces/WorkItemTrackingInterfaces";
import { isDeepStrictEqual } from "node:util";
import { ProjectContext, compareProjectContext } from "../../core/items/ProjectItem";
import { WorkItemItem } from "./WorkItemItem";

export function isAttachmentItem(item: { type: string }): item is AttachmentItem {
  return item.type === "attachment";
}

export function compareAttachmentItem(a: AttachmentItem, b: AttachmentItem) {
  if (!compareProjectContext(a, b)) {
    return false;
  }
  if (a.workItemId !== b.workItemId) {
    return false;
  }
  return isDeepStrictEqual(a.attachment, b.attachment);
}

export function getAttachmentFileName(attachment: WorkItemRelation): string {
  return attachment.attributes?.["name"] ?? "unknown";
}

export function getAttachmentSize(attachment: WorkItemRelation): number {
  return attachment.attributes?.["resourceSize"] ?? 0;
}

export interface AttachmentItem extends ProjectContext {
  readonly type: "attachment";
  workItemId: number;
  attachment: WorkItemRelation;
  isEqual(other: AttachmentItem): boolean;
}

export function createAttachmentItem(parent: WorkItemItem, attachment: WorkItemRelation): AttachmentItem {
  return {
    type: "attachment",
    account: parent.account,
    container: parent.container,
    projectId: parent.projectId,
    refreshObservables: parent.refreshObservables,
    workItemId: parent.workItemId,
    attachment,
    isEqual(other) {
      return compareAttachmentItem(this, other);
    },
  };
}
