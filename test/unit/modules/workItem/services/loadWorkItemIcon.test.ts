import { Container } from "inversify";
import { of, Subject } from "rxjs";
import { types } from "../../../../../src/generated/types";
import { createWorkItemItem, type WorkItemItem } from "../../../../../src/modules/workItem/items/WorkItemItem";
import { loadWorkItemIcon } from "../../../../../src/modules/workItem/services/WorkItemTypeIconService";

test("emits the work item without waiting for its icon", () => {
  const icon = new Subject<string | undefined>();
  const container = new Container();
  container.bind(types.WorkItemTypeIconService).toConstantValue({ workItemIconByType: () => icon });
  const context = { account: {}, container, projectId: "project", refreshObservables: {} };
  const workItem = { id: 42, fields: { "System.WorkItemType": "Bug" } };
  const icons: (string | undefined)[] = [];

  of(createWorkItemItem(context as any, 42, workItem, undefined, {}))
    .pipe(loadWorkItemIcon(() => ({ refreshObservables: {}, refreshObservable: new Subject<number>() })))
    .subscribe((item) => icons.push((item as WorkItemItem).iconSvg));
  expect(icons).toEqual([undefined]);

  icon.next("<svg></svg>");
  expect(icons).toEqual([undefined, "<svg></svg>"]);
});
