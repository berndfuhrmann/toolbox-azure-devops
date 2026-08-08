import { concat, finalize, map, of, Subject } from "rxjs";
import { isException } from "../../../common/Exception";
import { switchMapX } from "../../../common/exceptionOperators";
import { WorkItemTrackingService } from "../../../generated/services";
import { types } from "../../../generated/types";
import { WorkItemItem } from "../items/WorkItemItem";

export function loadWorkItem<Data extends WorkItemItem>(
  appendRefreshObservable: (item: Data) => {
    refreshObservables: Record<string, Subject<number>>;
    refreshObservable: Subject<number>;
  },
) {
  return switchMapX((item: Data) => {
    const { refreshObservables, refreshObservable } = appendRefreshObservable(item);
    return concat(
      of(item),
      item.container
        .get<WorkItemTrackingService>(types.WorkItemTrackingService)
        .workItem(item.workItemId, item.projectId, refreshObservable)
        .pipe(
          map((workItem) => ({
            ...item,
            workItem: isException(workItem) ? undefined : workItem,
            refreshObservables,
          })),
          finalize(() => refreshObservable.complete()),
        ),
    );
  });
}
