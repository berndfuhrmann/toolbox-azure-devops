import { Container } from "inversify";
import { Uri } from "vscode";
import { IconService } from "../../../../../src/common/icons/IconService";
import { createWorkItemItem } from "../../../../../src/modules/workItem/items/WorkItemItem";
import { WorkItemTreeItem } from "../../../../../src/modules/workItem/treeItems/WorkItemTreeItem";

const iconService = new IconService(Uri.file("/test/extension"));
const svg = "<svg></svg>";

class TestWorkItemTreeItem extends WorkItemTreeItem {
  constructor() {
    super();
    this.setIconService(iconService);
  }
}

function createItem(iconSvg: string | undefined) {
  const context = { account: {}, container: new Container(), projectId: "project", refreshObservables: {} };
  return createWorkItemItem(context as any, 42, undefined, iconSvg, {});
}

test("shows a generic icon until the icon of the work item type is available", () => {
  const treeItem = new TestWorkItemTreeItem();
  expect(treeItem.updateFrom(createItem(undefined))).toBe(true);
  expect(treeItem.iconPath).toEqual(iconService.getNamedIcon("work-item"));

  expect(treeItem.updateFrom(createItem(svg))).toBe(true);
  expect(treeItem.iconPath).toEqual(iconService.getSvgIcon(svg));
  expect(treeItem.updateFrom(createItem(svg))).toBe(false);

  expect(treeItem.updateFrom(createItem(undefined))).toBe(true);
  expect(treeItem.iconPath).toEqual(iconService.getNamedIcon("work-item"));
});
