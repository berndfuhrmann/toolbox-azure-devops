import { inject } from "inversify";
import { Observable, of } from "rxjs";
import { Exception } from "../../../common/Exception";
import { Constructor } from "../../../common/constructor";
import { SettingsService } from "../../../common/SettingsService";
import { types } from "../../../generated/types";
import { WorkItemHierarchyItem } from "../items/WorkItemProjectRootItem";
import {
  AbstractWorkItemQueryTreePartProvider,
  type WorkItemQueryParams,
} from "./AbstractWorkItemQueryTreePartProvider";
import { WorkItemTreeItem } from "../treeItems/WorkItemTreeItem";

const EpicCategoryReferenceName = "Microsoft.EpicCategory";

export class HierarchyRootContentTreePartProvider extends AbstractWorkItemQueryTreePartProvider<WorkItemHierarchyItem> {
  static #rootQuery = {
    query: `SELECT [System.Id], [System.Title], [System.State], [System.WorkItemType], [System.AssignedTo]
            FROM WorkItems
            WHERE [System.TeamProject] = @project
            AND [System.WorkItemType] IN GROUP '${EpicCategoryReferenceName}'
            AND [System.State] <> 'Done'
            AND [System.State] <> 'Removed'
            ORDER BY [System.Id] ASC`,
  };

  constructor(
    @inject(types.WorkItemTreeItem)
    treeItemConstructor: Constructor<WorkItemTreeItem>,
    @inject(types.SettingsService)
    settingsService: SettingsService,
  ) {
    super(treeItemConstructor, settingsService);
  }

  protected override getRefreshKey(): string {
    return "hierarchyRoot";
  }

  protected override buildQuery(
    context: WorkItemHierarchyItem,
    _refreshObservable: Observable<number>,
  ): Observable<WorkItemQueryParams | Exception | null> {
    return of<WorkItemQueryParams | Exception | null>({
      query: HierarchyRootContentTreePartProvider.#rootQuery.query,
      teamContext: { projectId: context.projectId },
    });
  }
}
