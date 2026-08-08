import { combineLatest, Observable, of, Subject } from "rxjs";
import { map } from "rxjs/operators";
import { WorkItem } from "azure-devops-node-api/interfaces/WorkItemTrackingInterfaces";
import { Exception, isException } from "../../common/Exception";
import { WorkItemTrackingService } from "../../generated/services";

const WorkItemBatchSize = 200;

// TODO: Potentially, we're loading huge amounts of work items here. Could lead to crashes or undesired
// many parallel requests.
export function fetchWorkItemsInBatches(
  ids: number[],
  projectId: string,
  workItemTrackingService: WorkItemTrackingService,
  refreshObservable: Subject<number>,
): Observable<WorkItem[] | Exception> {
  if (ids.length === 0) {
    return of([]);
  }

  const batches: number[][] = [];
  for (let i = 0; i < ids.length; i += WorkItemBatchSize) {
    batches.push(ids.slice(i, i + WorkItemBatchSize));
  }

  return combineLatest(
    batches.map((batch) => workItemTrackingService.workItems(batch, projectId, refreshObservable)),
  ).pipe(
    map((results) => {
      const exception = results.find((r): r is Exception => isException(r));
      if (exception) {
        return exception;
      }
      return (results as WorkItem[][]).flatMap((batch) => batch ?? []);
    }),
  );
}
