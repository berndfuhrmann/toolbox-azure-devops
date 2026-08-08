import { inject } from "inversify";
import { Observable, switchMap } from "rxjs";
import {
  TreeStructureGroup,
  WorkItemClassificationNode,
} from "azure-devops-node-api/interfaces/WorkItemTrackingInterfaces";
import { Constructor } from "../../../common/constructor";
import { Exception } from "../../../common/Exception";
import { combineLatestX, mapX } from "../../../common/exceptionOperators";
import { autoRefresh } from "../../../common/operators";
import { SettingsService } from "../../../common/SettingsService";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { fromArray } from "../../../common/treePartProvider/fromArray";
import {
  ItemInformation,
  createOrUpdateTreeItem,
  TreePartProvider,
} from "../../../common/treePartProvider/TreePartProvider";
import { updateExceptionTreeItem } from "../../../common/treePartProvider/updateExceptionTreeItem";
import { WorkItemTrackingService } from "../../../generated/services";
import { types } from "../../../generated/types";
import { createWorkItemAreaPathItem, WorkItemAreaPathItem } from "../items/WorkItemAreaPathItem";
import type { ProjectContext } from "../../core/items/ProjectItem";
import { WorkItemAreaPathTreeItem } from "../treeItems/WorkItemAreaPathTreeItem";

const TaskCategoryReferenceName = "Microsoft.TaskCategory";
const areaPathDepth = 20;

export class AreaPathsContentTreePartProvider extends TreePartProvider<
  WorkItemAreaPathItem | Exception,
  ProjectContext
> {
  #treeItemConstructor: Constructor<WorkItemAreaPathTreeItem>;
  #settingsService: SettingsService;

  constructor(
    @inject(types.PinnableWorkItemAreaPathTreeItem)
    treeItemConstructor: Constructor<WorkItemAreaPathTreeItem>,
    @inject(types.SettingsService)
    settingsService: SettingsService,
  ) {
    super();
    this.#treeItemConstructor = treeItemConstructor;
    this.#settingsService = settingsService;
  }

  getItems(context: Observable<ProjectContext>): Observable<ItemInformation<WorkItemAreaPathItem | Exception>> {
    return context.pipe(
      switchMap((context) => {
        const { refreshObservables, refreshObservable } = this.createRefreshObservables("areaPathsContent");
        const workItemTrackingService = context.container.get<WorkItemTrackingService>(types.WorkItemTrackingService);

        return combineLatestX([
          workItemTrackingService.workItemTypeCategories(context.projectId, refreshObservable),
          workItemTrackingService.classificationNode(
            context.projectId,
            TreeStructureGroup.Areas,
            undefined,
            areaPathDepth,
            refreshObservable,
          ),
        ]).pipe(
          mapX(([categories, rootNode]) => {
            const leafTypeNames = new Set<string>(
              (categories.find((c) => c.referenceName === TaskCategoryReferenceName)?.workItemTypes ?? [])
                .map((t) => t.name)
                .filter((name) => typeof name === "string"),
            );
            const listValue = (rootNode as any).value as WorkItemClassificationNode[] | undefined;
            const containerNode = listValue?.[0] ?? rootNode;
            const nodes = containerNode.children ?? [];
            return nodes.map((child) => createWorkItemAreaPathItem(context, child, leafTypeNames, refreshObservables));
          }),
          autoRefresh(refreshObservable, this.#settingsService.autoRefreshInterval()),
          fromArray((item: WorkItemAreaPathItem) => `${item.classificationNode.id}`, { refreshObservables }),
        );
      }),
    );
  }

  override updateTreeItem(
    item: WorkItemAreaPathItem | Exception,
    _key: string,
    oldTreeItem: AbstractTreeItem<any> | undefined,
  ) {
    return (
      updateExceptionTreeItem(item, oldTreeItem) ??
      createOrUpdateTreeItem(oldTreeItem, this.#treeItemConstructor, item as WorkItemAreaPathItem)
    );
  }
}
