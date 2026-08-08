import { expect, test, beforeEach } from "vitest";
import { ProjectTreeItem } from "../../../../../src/modules/core/treeItems/ProjectTreeItem";
import { createProjectItem } from "../../../../../src/modules/core/items/ProjectItem";
import { createAccountItem } from "../../../../../src/modules/core/items/AccountItem";
import { Account } from "../../../../../src/modules/core/account";
import { Container } from "inversify";
import vscode, { Uri } from "vscode";
import { IconService } from "../../../../../src/common/icons/IconService";
import { TeamProjectReference } from "azure-devops-node-api/interfaces/CoreInterfaces";

const sampleAccount: Account = {
  accountId: "acc-123",
  url: "https://dev.azure.com/org",
  organization: "TestOrg",
  personalAccessToken: "token123",
};

const sampleProject: TeamProjectReference = {
  name: "SampleProject",
};

const createTestProjectItem = () =>
  createProjectItem(createAccountItem(sampleAccount, new Container()), sampleProject, {});

let subject: ProjectTreeItem;

beforeEach(() => {
  subject = new ProjectTreeItem();
  (subject as any).setIconService(new IconService(Uri.file("/test/extension")));
});

test("constructor sets defaults", () => {
  expect(subject.collapsibleState).toBe(vscode.TreeItemCollapsibleState.Collapsed);
  expect(subject.iconPath).toBeDefined();
});

test("updateFrom sets label from project.name", () => {
  const data = createTestProjectItem();
  subject.updateFrom(data);
  expect(subject.label).toBe("SampleProject");
});

test("updateFrom sets label to 'Unknown' if project.name is missing", () => {
  const data = createTestProjectItem();
  data.project = {};
  subject.updateFrom(data);
  expect(subject.label).toBe("Unknown");
});

test("updateFrom returns true if label changes", () => {
  const data = createTestProjectItem();
  subject.updateFrom(data);
  // Supply a new data object with a different project name
  const newData = createTestProjectItem();
  newData.project = { ...data.project, name: "AnotherProject" };
  const result = subject.updateFrom(newData);
  expect(result).toBeTruthy();
  expect(subject.label).toBe("AnotherProject");
});

test("updateFrom returns false if nothing changes", () => {
  const data = createTestProjectItem();
  subject.updateFrom(data);
  const result = subject.updateFrom(data);
  expect(result).toBeFalsy();
});
