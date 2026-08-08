import { inject } from "inversify";
import { finalize, map, Observable, of, pipe, shareReplay, Subject, switchMap } from "rxjs";
import { isException } from "../../../common/Exception";
import { mapX, switchMapX } from "../../../common/exceptionOperators";
import { WorkItemTrackingService } from "../../../generated/services";
import { types } from "../../../generated/types";
import { getWorkItemType } from "../../workItemTracking/fields";
import { WorkItemItem } from "../items/WorkItemItem";

// TODO: work items types and icons should not refresh just when work items refresh
export function loadWorkItemIcon<Data extends WorkItemItem>(
  appendRefreshObservable: (item: Data) => {
    refreshObservables: Record<string, Subject<number>>;
    refreshObservable: Subject<number>;
  },
) {
  return pipe(
    mapX((item: Data) => {
      const workItem = item.workItem;
      if (!workItem) {
        return of(item);
      }
      const { refreshObservables, refreshObservable } = appendRefreshObservable(item);
      return item.container
        .get<WorkItemTypeIconService>(types.WorkItemTypeIconService)
        .workItemIconByType(item.projectId, getWorkItemType(workItem), refreshObservable)
        .pipe(
          map((svg) => ({
            ...item,
            iconSvg: svg,
            refreshObservables,
          })),
          finalize(() => refreshObservable.complete()),
        );
    }),
    switchMapX((x) => x),
  );
}

export class WorkItemTypeIconService {
  #iconSvgByKey = new Map<string, Observable<string | undefined>>();
  #workItemTrackingService: WorkItemTrackingService;
  constructor(@inject(types.WorkItemTrackingService) workItemTrackingService: WorkItemTrackingService) {
    this.#workItemTrackingService = workItemTrackingService;
  }

  workItemIconByType(
    projectId: string,
    workItemTypeName: string,
    refreshObservable: Observable<number>,
  ): Observable<string | undefined> {
    return this.#workItemTrackingService.workItemTypes(projectId, refreshObservable).pipe(
      switchMap((workItemTypes) => {
        if (isException(workItemTypes)) {
          return of(undefined);
        }

        const workItemType = workItemTypes.find((item) => item.name === workItemTypeName);
        if (workItemType?.icon?.id === undefined) {
          return of(undefined);
        }

        return this.#iconSvg(workItemType.icon.id, workItemType.color, refreshObservable);
      }),
    );
  }

  #iconSvg(iconId: string, color: string | undefined, refreshObservable: Observable<number>) {
    const iconKey = `${iconId}/${color ?? ""}`;

    const existingEntry = this.#iconSvgByKey.get(iconKey);
    if (existingEntry) {
      // Ensure this caller's refresh trigger is registered on the generated service cache entry.
      this.#workItemTrackingService.workItemIconSvg(iconId, color, undefined, refreshObservable);
      return existingEntry;
    }

    const newEntry = this.#workItemTrackingService.workItemIconSvg(iconId, color, undefined, refreshObservable).pipe(
      switchMap(async (value): Promise<string | undefined> => {
        if (isException(value)) {
          return undefined;
        }
        const chunks: Buffer[] = [];
        return new Promise<string>((resolve, reject) => {
          value.on("data", (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
          value.on("error", reject);
          value.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
        });
      }),
      shareReplay(1),
    );

    this.#iconSvgByKey.set(iconKey, newEntry);
    return newEntry;
  }
}
