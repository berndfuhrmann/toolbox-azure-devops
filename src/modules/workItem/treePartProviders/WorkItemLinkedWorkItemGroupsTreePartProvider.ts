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
import { isCategorizedArtifactLink } from "../WorkItemArtifactLink";
import { WorkItemRelationGroupItem, createWorkItemRelationGroupItem } from "../items/WorkItemRelationGroupItem";
import { WorkItemItem } from "../items/WorkItemItem";
import type { WorkItemRelationGroupTreeItem } from "../treeItems/WorkItemRelationGroupTreeItem";

const AttachedFileRelationType = "AttachedFile";

function parseWorkItemIdFromUrl(url: string): number | undefined {
  const match = url.match(/\/workItems\/(\d+)$/);
  if (!match) {
    return undefined;
  }
  const id = parseInt(match[1], 10);
  return isNaN(id) ? undefined : id;
}

export class WorkItemLinkedWorkItemGroupsTreePartProvider extends TreePartProvider<
  WorkItemRelationGroupItem | Exception,
  WorkItemItem
> {
  #treeItemConstructor: Constructor<WorkItemRelationGroupTreeItem>;

  constructor(
    @inject(types.WorkItemRelationGroupTreeItem)
    treeItemConstructor: Constructor<WorkItemRelationGroupTreeItem>,
  ) {
    super();
    this.#treeItemConstructor = treeItemConstructor;
  }

  getItems(context: Observable<WorkItemItem>): Observable<ItemInformation<WorkItemRelationGroupItem | Exception>> {
    return context.pipe(
      switchMap((workItemItem) => {
        const relations =
          workItemItem.workItem?.relations?.filter(
            (relation) =>
              relation.rel !== AttachedFileRelationType &&
              !isCategorizedArtifactLink(relation) &&
              relation.url !== undefined &&
              parseWorkItemIdFromUrl(relation.url) !== undefined,
          ) ?? [];

        const groupMap = new Map<string, { relationType: string; displayName: string; ids: number[] }>();
        for (const relation of relations) {
          const relationType = relation.rel ?? "Unknown";
          const displayName = (relation.attributes?.["name"] as string | undefined) ?? relationType;
          const relatedId = parseWorkItemIdFromUrl(relation.url!);
          if (relatedId === undefined) {
            continue;
          }
          const existing = groupMap.get(relationType);
          if (existing) {
            existing.ids.push(relatedId);
          } else {
            groupMap.set(relationType, { relationType, displayName, ids: [relatedId] });
          }
        }

        const groups = Array.from(groupMap.values()).map(({ relationType, displayName, ids }) =>
          createWorkItemRelationGroupItem(workItemItem, relationType, displayName, ids),
        );

        return of(groups).pipe(
          fromArray((item: WorkItemRelationGroupItem) => `relation-group-${item.workItemId}-${item.relationType}`, {}),
        );
      }),
    );
  }

  override updateTreeItem(
    item: WorkItemRelationGroupItem | Exception,
    key: string,
    oldTreeItem: AbstractTreeItem<any> | undefined,
  ) {
    return (
      updateExceptionTreeItem(item, oldTreeItem) ??
      this.updateTreeItemImpl(item as WorkItemRelationGroupItem, key, oldTreeItem)
    );
  }

  updateTreeItemImpl(item: WorkItemRelationGroupItem, key: string, oldTreeItem: AbstractTreeItem<any> | undefined) {
    return createOrUpdateTreeItem(oldTreeItem, this.#treeItemConstructor, item);
  }
}
