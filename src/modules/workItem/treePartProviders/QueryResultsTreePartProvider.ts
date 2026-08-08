import { inject } from "inversify";
import { Observable, of } from "rxjs";
import { Exception } from "../../../common/Exception";
import { Constructor } from "../../../common/constructor";
import { SettingsService } from "../../../common/SettingsService";
import { types } from "../../../generated/types";
import { WorkItemQueryItem } from "../items/WorkItemQueryItem";
import {
  AbstractWorkItemQueryTreePartProvider,
  type WorkItemQueryParams,
} from "./AbstractWorkItemQueryTreePartProvider";
import { WorkItemTreeItem } from "../treeItems/WorkItemTreeItem";

export class QueryResultsTreePartProvider extends AbstractWorkItemQueryTreePartProvider<WorkItemQueryItem> {
  constructor(
    @inject(types.WorkItemTreeItem)
    treeItemConstructor: Constructor<WorkItemTreeItem>,
    @inject(types.SettingsService)
    settingsService: SettingsService,
  ) {
    super(treeItemConstructor, settingsService);
  }

  protected override getRefreshKey(): string {
    return "queryResults";
  }

  protected override buildQuery(
    context: WorkItemQueryItem,
    _refreshObservable: Observable<number>,
  ): Observable<WorkItemQueryParams | Exception | null> {
    const wiql = context.queryItem.wiql;
    if (!wiql) {
      return of(null);
    }
    return of<WorkItemQueryParams | Exception | null>({
      query: wiql,
      teamContext: { projectId: context.projectId },
    });
  }
}
