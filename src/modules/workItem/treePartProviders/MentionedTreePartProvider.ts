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

export class MentionedTreePartProvider extends AbstractWorkItemQueryTreePartProvider<ProjectContext> {
  static #workItemQuery = {
    query: `SELECT [System.Id], [System.Title], [System.State], [System.WorkItemType], [System.AssignedTo]
            FROM WorkItems
            WHERE [System.TeamProject] = @project
            AND [System.AssignedTo] = @me
            AND [System.ChangedBy] <> @me
            AND [System.State] <> 'Done'
            AND [System.State] <> 'Removed'
            AND [System.ChangedDate] >= @Today - 14
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
    return "mentionedWorkItem";
  }

  protected override buildQuery(
    context: ProjectContext,
    _refreshObservable: Observable<number>,
  ): Observable<WorkItemQueryParams | Exception | null> {
    return of<WorkItemQueryParams | Exception | null>({
      query: MentionedTreePartProvider.#workItemQuery.query,
      teamContext: { project: context.projectId },
      top: 50,
    });
  }
}
