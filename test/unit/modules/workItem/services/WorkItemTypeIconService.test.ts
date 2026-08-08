import { PassThrough } from "stream";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { firstValueFrom, of, Subject } from "rxjs";
import { createException } from "../../../../../src/common/Exception";
import { WorkItemTrackingService } from "../../../../../src/generated/services";
import { WorkItemTypeIconService } from "../../../../../src/modules/workItem/services/WorkItemTypeIconService";

describe("WorkItemTypeIconService", () => {
  let workItemTrackingService: WorkItemTrackingService;
  let service: WorkItemTypeIconService;

  beforeEach(() => {
    workItemTrackingService = {
      workItemTypes: vi.fn(),
      workItemIconSvg: vi.fn(),
    } as any;
    service = new WorkItemTypeIconService(workItemTrackingService);
  });

  function createIconStream(...chunks: string[]): PassThrough {
    const stream = new PassThrough();
    queueMicrotask(() => {
      for (const chunk of chunks) {
        stream.write(chunk);
      }
      stream.end();
    });
    return stream;
  }

  test("returns undefined when work item type lookup fails", async () => {
    const refreshObservable = new Subject<number>();
    vi.mocked(workItemTrackingService.workItemTypes as any).mockReturnValue(
      of(createException(new Error("work item types failed"))),
    );

    const result = await firstValueFrom(service.workItemIconByType("project-1", "Bug", refreshObservable));

    expect(result).toBeUndefined();
    expect(workItemTrackingService.workItemIconSvg).not.toHaveBeenCalled();
  });

  test("returns undefined when work item type has no icon id", async () => {
    const refreshObservable = new Subject<number>();
    vi.mocked(workItemTrackingService.workItemTypes as any).mockReturnValue(of([{ name: "Bug", color: "00ff00" }]));

    const result = await firstValueFrom(service.workItemIconByType("project-1", "Bug", refreshObservable));

    expect(result).toBeUndefined();
    expect(workItemTrackingService.workItemIconSvg).not.toHaveBeenCalled();
  });

  test("converts icon stream data to utf8 string", async () => {
    const refreshObservable = new Subject<number>();
    vi.mocked(workItemTrackingService.workItemTypes as any).mockReturnValue(
      of([{ name: "Bug", icon: { id: "icon-1" }, color: "00ff00" }]),
    );
    vi.mocked(workItemTrackingService.workItemIconSvg as any).mockReturnValue(
      of(createIconStream("<svg>", "bug", "</svg>")),
    );

    const result = await firstValueFrom(service.workItemIconByType("project-1", "Bug", refreshObservable));

    expect(result).toBe("<svg>bug</svg>");
  });

  test("returns undefined when icon svg lookup fails", async () => {
    const refreshObservable = new Subject<number>();
    vi.mocked(workItemTrackingService.workItemTypes as any).mockReturnValue(
      of([{ name: "Bug", icon: { id: "icon-1" }, color: "00ff00" }]),
    );
    vi.mocked(workItemTrackingService.workItemIconSvg as any).mockReturnValue(
      of(createException(new Error("icon failed"))),
    );

    const result = await firstValueFrom(service.workItemIconByType("project-1", "Bug", refreshObservable));

    expect(result).toBeUndefined();
  });

  test("reuses cached icon observable for same icon key", async () => {
    const firstRefreshObservable = new Subject<number>();
    const secondRefreshObservable = new Subject<number>();

    vi.mocked(workItemTrackingService.workItemTypes as any).mockReturnValue(
      of([{ name: "Bug", icon: { id: "icon-1" }, color: "00ff00" }]),
    );
    vi.mocked(workItemTrackingService.workItemIconSvg as any)
      .mockReturnValueOnce(of(createIconStream("<svg>first</svg>")))
      .mockReturnValueOnce(of(createIconStream("<svg>second</svg>")));

    const firstResult = await firstValueFrom(service.workItemIconByType("project-1", "Bug", firstRefreshObservable));
    const secondResult = await firstValueFrom(service.workItemIconByType("project-1", "Bug", secondRefreshObservable));

    expect(firstResult).toBe("<svg>first</svg>");
    expect(secondResult).toBe("<svg>first</svg>");
    expect(workItemTrackingService.workItemIconSvg).toHaveBeenCalledTimes(2);
    expect(workItemTrackingService.workItemIconSvg).toHaveBeenNthCalledWith(
      1,
      "icon-1",
      "00ff00",
      undefined,
      firstRefreshObservable,
    );
    expect(workItemTrackingService.workItemIconSvg).toHaveBeenNthCalledWith(
      2,
      "icon-1",
      "00ff00",
      undefined,
      secondRefreshObservable,
    );
  });
});
