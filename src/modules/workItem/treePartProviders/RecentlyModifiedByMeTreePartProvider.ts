import { inject } from "inversify";
import { Observable, of } from "rxjs";
import { Exception } from "../../../common/Exception";
import { Constructor } from "../../../common/constructor";
import { SettingsService } from "../../../common/SettingsService";
import { types } from "../../../generated/types";
import type { ProjectContext } from "../../core/items/ProjectItem";
import {
  AbstractWorkItemQueryTreePartProvider,
  type WorkItemQueryParams,
} from "./AbstractWorkItemQueryTreePartProvider";
import type { WorkItemTreeItem } from "../treeItems/WorkItemTreeItem";

export class RecentlyModifiedByMeTreePartProvider extends AbstractWorkItemQueryTreePartProvider<ProjectContext> {
  static #workItemQuery = {
    query: `SELECT [System.Id], [System.Title], [System.State], [System.WorkItemType]
            FROM WorkItems
            WHERE [System.TeamProject] = @project
            AND [System.ChangedBy] = @me
            AND [System.State] <> 'Removed'
            ORDER BY [System.ChangedDate] DESC`,
  };

  constructor(
    @inject(types.PinnableWorkItemTreeItem)
    treeItemConstructor: Constructor<WorkItemTreeItem>,
    @inject(types.SettingsService)
    settingsService: SettingsService,
  ) {
    super(treeItemConstructor, settingsService);
  }

  protected override getRefreshKey(): string {
    return "recentlyModifiedWorkItem";
  }

  protected override buildQuery(
    context: ProjectContext,
    _refreshObservable: Observable<number>,
  ): Observable<WorkItemQueryParams | Exception | null> {
    return of<WorkItemQueryParams | Exception | null>({
      query: RecentlyModifiedByMeTreePartProvider.#workItemQuery.query,
      teamContext: { project: context.projectId },
      top: 50,
    });
  }
}
