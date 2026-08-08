import { inject } from "inversify";
import { Observable, of, switchMap } from "rxjs";
import { Constructor } from "../../../common/constructor";
import { Exception } from "../../../common/Exception";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { fromArray } from "../../../common/treePartProvider/fromArray";
import {
  ItemInformation,
  createOrUpdateTreeItem,
  TreePartProvider,
} from "../../../common/treePartProvider/TreePartProvider";
import { updateExceptionTreeItem } from "../../../common/treePartProvider/updateExceptionTreeItem";
import { types } from "../../../generated/types";
import { AttachmentItem, createAttachmentItem } from "../items/AttachmentItem";
import { WorkItemItem } from "../items/WorkItemItem";
import type { AttachmentTreeItem } from "../treeItems/AttachmentTreeItem";

const AttachedFileRelationType = "AttachedFile";

export class AttachmentTreePartProvider extends TreePartProvider<AttachmentItem | Exception, WorkItemItem> {
  #attachmentTreeItemConstructor: Constructor<AttachmentTreeItem>;

  constructor(
    @inject(types.AttachmentTreeItem)
    AttachmentTreeItemConstructor: Constructor<AttachmentTreeItem>,
  ) {
    super();
    this.#attachmentTreeItemConstructor = AttachmentTreeItemConstructor;
  }

  getItems(context: Observable<WorkItemItem>): Observable<ItemInformation<AttachmentItem | Exception>> {
    return context.pipe(
      switchMap((context) => {
        const workItem = context.workItem;
        const attachments = workItem?.relations?.filter((relation) => relation.rel === AttachedFileRelationType) ?? [];

        return of(attachments.map((attachment) => createAttachmentItem(context, attachment))).pipe(
          fromArray((item: AttachmentItem) => item.attachment.url ?? `attachment-${item.workItemId}`, {}),
        );
      }),
    );
  }

  override updateTreeItem(
    item: AttachmentItem | Exception,
    key: string,
    oldTreeItem: AbstractTreeItem<any> | undefined,
  ) {
    return (
      updateExceptionTreeItem(item, oldTreeItem) ?? this.updateTreeItemImpl(item as AttachmentItem, key, oldTreeItem)
    );
  }

  updateTreeItemImpl(item: AttachmentItem, key: string, oldTreeItem: AbstractTreeItem<any> | undefined) {
    return createOrUpdateTreeItem(oldTreeItem, this.#attachmentTreeItemConstructor, item);
  }
}
