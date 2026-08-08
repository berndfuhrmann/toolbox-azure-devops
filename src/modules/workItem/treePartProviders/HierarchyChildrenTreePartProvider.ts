import { inject } from "inversify";
import { Observable, of } from "rxjs";
import { Exception } from "../../../common/Exception";
import { Constructor } from "../../../common/constructor";
import { SettingsService } from "../../../common/SettingsService";
import { types } from "../../../generated/types";
import { WorkItemItem } from "../items/WorkItemItem";
import {
  AbstractWorkItemQueryTreePartProvider,
  type WorkItemQueryParams,
} from "./AbstractWorkItemQueryTreePartProvider";
import { WorkItemTreeItem } from "../treeItems/WorkItemTreeItem";

export class HierarchyChildrenTreePartProvider extends AbstractWorkItemQueryTreePartProvider<WorkItemItem> {
  static #createChildrenQuery(parentId: number) {
    return {
      query: `SELECT [System.Id], [System.Title], [System.State], [System.WorkItemType], [System.AssignedTo]
              FROM WorkItems
              WHERE [System.TeamProject] = @project
              AND [System.Parent] = ${parentId}
              AND [System.State] <> 'Done'
              AND [System.State] <> 'Removed'
              ORDER BY [System.Id] ASC`,
    };
  }

  constructor(
    @inject(types.WorkItemTreeItem)
    treeItemConstructor: Constructor<WorkItemTreeItem>,
    @inject(types.SettingsService)
    settingsService: SettingsService,
  ) {
    super(treeItemConstructor, settingsService);
  }

  protected override getRefreshKey(): string {
    return "hierarchyChildren";
  }

  protected override buildQuery(
    context: WorkItemItem,
    _refreshObservable: Observable<number>,
  ): Observable<WorkItemQueryParams | Exception | null> {
    const parentId = context.workItemId!;
    return of<WorkItemQueryParams | Exception | null>({
      query: HierarchyChildrenTreePartProvider.#createChildrenQuery(parentId).query,
      teamContext: { projectId: context.projectId },
    });
  }
}
