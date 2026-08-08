import { inject } from "inversify";
import { Observable, of } from "rxjs";
import { Exception } from "../../../common/Exception";
import { switchMapX } from "../../../common/exceptionOperators";
import { Constructor } from "../../../common/constructor";
import { SettingsService } from "../../../common/SettingsService";
import { WorkService } from "../../../generated/services";
import { types } from "../../../generated/types";
import { WorkItemTeamContext } from "../items/WorkItemTeamItem";
import {
  AbstractWorkItemQueryTreePartProvider,
  type WorkItemQueryParams,
} from "./AbstractWorkItemQueryTreePartProvider";
import { WorkItemTreeItem } from "../treeItems/WorkItemTreeItem";

export class BacklogContentTreePartProvider extends AbstractWorkItemQueryTreePartProvider<WorkItemTeamContext> {
  static #createBacklogQuery(areaPathConditions: string) {
    return {
      query: `SELECT [System.Id], [System.Title], [System.State], [System.WorkItemType], [System.AssignedTo], [System.IterationPath], [System.AreaPath]
              FROM WorkItems
              WHERE [System.TeamProject] = @project
              AND (${areaPathConditions})
              AND [System.IterationPath] = @project
              AND [System.State] <> 'Done'
              AND [System.State] <> 'Removed'
              ORDER BY [System.ChangedDate] DESC`,
    };
  }

  constructor(
    @inject(types.PinnableWorkItemTreeItem)
    treeItemConstructor: Constructor<WorkItemTreeItem>,
    @inject(types.SettingsService)
    settingsService: SettingsService,
  ) {
    super(treeItemConstructor, settingsService);
  }

  protected override getRefreshKey(): string {
    return "workItemBacklogContent";
  }

  protected override buildQuery(
    context: WorkItemTeamContext,
    refreshObservable: Observable<number>,
  ): Observable<WorkItemQueryParams | Exception | null> {
    const workService = context.container.get<WorkService>(types.WorkService);
    const teamContext = { projectId: context.projectId, teamId: context.team.id };

    return workService.teamFieldValues(teamContext, refreshObservable).pipe(
      switchMapX((teamFieldValues) => {
        const areaPathConditions = (teamFieldValues.values ?? [])
          .filter((value) => typeof value.value === "string")
          .map((value) => {
            const escaped = value.value!.replace(/'/g, "''");
            return value.includeChildren ? `[System.AreaPath] UNDER '${escaped}'` : `[System.AreaPath] = '${escaped}'`;
          })
          .join(" OR ");

        if (!areaPathConditions) {
          return of(null);
        }

        return of<WorkItemQueryParams | null>({
          query: BacklogContentTreePartProvider.#createBacklogQuery(areaPathConditions).query,
          teamContext: { project: context.projectId },
        });
      }),
    );
  }
}
