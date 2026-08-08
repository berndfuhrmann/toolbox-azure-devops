import { inject } from "inversify";
import { Observable, of } from "rxjs";
import { Exception } from "../../../common/Exception";
import { Constructor } from "../../../common/constructor";
import { SettingsService } from "../../../common/SettingsService";
import { types } from "../../../generated/types";
import { WorkItemAreaPathItem } from "../items/WorkItemAreaPathItem";
import {
  AbstractWorkItemQueryTreePartProvider,
  type WorkItemQueryParams,
} from "./AbstractWorkItemQueryTreePartProvider";
import { WorkItemTreeItem } from "../treeItems/WorkItemTreeItem";

const EpicCategoryReferenceName = "Microsoft.EpicCategory";

export class AreaPathHierarchyRootTreePartProvider extends AbstractWorkItemQueryTreePartProvider<WorkItemAreaPathItem> {
  static #createEpicQuery(areaPath: string) {
    const escaped = areaPath.replace(/'/g, "''");
    return {
      query: `SELECT [System.Id], [System.Title], [System.State], [System.WorkItemType], [System.AssignedTo]
              FROM WorkItems
              WHERE [System.TeamProject] = @project
              AND [System.WorkItemType] IN GROUP '${EpicCategoryReferenceName}'
              AND [System.AreaPath] = '${escaped}'
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
    return "areaPathHierarchyRoot";
  }

  protected override buildQuery(
    context: WorkItemAreaPathItem,
    _refreshObservable: Observable<number>,
  ): Observable<WorkItemQueryParams | Exception | null> {
    const pathSegments = (context.classificationNode.path ?? "").split("\\").filter(Boolean);
    // TFS classification node paths are \Project\Area\UserPath but WIQL expects Project\UserPath
    const areaPath = [pathSegments[0], ...pathSegments.slice(2)].filter(Boolean).join("\\");

    return of<WorkItemQueryParams | Exception | null>({
      query: AreaPathHierarchyRootTreePartProvider.#createEpicQuery(areaPath).query,
      teamContext: { projectId: context.projectId },
    });
  }
}
