import { describe, test, expect, beforeEach } from "vitest";
import { MarkdownString, Uri } from "vscode";
import { WorkItemCommentTreeItem } from "../../../../../src/modules/workItem/treeItems/WorkItemCommentTreeItem";
import { WorkItemCommentItem } from "../../../../../src/modules/workItem/items/WorkItemCommentItem";
import { IconService } from "../../../../../src/common/icons/IconService";
import { Container } from "inversify";

const sampleAccount = {
  accountId: "acc-123",
  url: "https://dev.azure.com/org",
  organization: "TestOrg",
  personalAccessToken: "token123",
};

function createTestCommentItem(comment: Partial<WorkItemCommentItem["comment"]> = {}): WorkItemCommentItem {
  return {
    type: "workItemComment",
    account: sampleAccount,
    container: new Container(),
    projectId: "project-123",
    refreshObservables: {},
    workItemId: 42,
    comment: {
      id: 1,
      text: "This is a comment",
      createdBy: { displayName: "John Doe" },
      createdDate: new Date("2024-06-15T10:30:00Z"),
      ...comment,
    } as WorkItemCommentItem["comment"],
    isEqual() {
      return false;
    },
  };
}

let subject: WorkItemCommentTreeItem;

beforeEach(() => {
  subject = new WorkItemCommentTreeItem();
  (subject as any).setIconService(new IconService(Uri.file("/test/extension")));
});

test("constructor sets defaults", () => {
  expect(subject.collapsibleState).toBe(0); // TreeItemCollapsibleState.None
  expect(subject.iconPath).toBeDefined();
});

test("updateFrom sets label to author and date", () => {
  const data = createTestCommentItem();
  subject.updateFrom(data);
  expect(subject.label).toMatch(/^John Doe - .+2024$/);
});

test("updateFrom sets tooltip to MarkdownString with renderedText", () => {
  const data = createTestCommentItem({ renderedText: "<p>This is a comment</p>" });
  subject.updateFrom(data);
  expect(subject.tooltip).toMatchObject(new MarkdownString("<p>This is a comment</p>"));
});

test("updateFrom falls back to text when renderedText is missing", () => {
  const data = createTestCommentItem({ text: "Fallback text" });
  subject.updateFrom(data);
  expect(subject.tooltip).toMatchObject(new MarkdownString("Fallback text"));
});

test("updateFrom uses renderedText over text", () => {
  const data = createTestCommentItem({
    renderedText: "<p>Rendered HTML</p>",
    text: "Raw markdown",
  });
  subject.updateFrom(data);
  expect(subject.tooltip).toMatchObject(new MarkdownString("<p>Rendered HTML</p>"));
});

test("updateFrom handles unknown author", () => {
  const data = createTestCommentItem({ createdBy: undefined });
  subject.updateFrom(data);
  expect(subject.label).toMatch(/^Unknown - .+2024$/);
});

test("updateFrom handles missing date", () => {
  const data = createTestCommentItem({ createdDate: undefined });
  subject.updateFrom(data);
  expect(subject.label).toBe("John Doe - ");
});

test("updateFrom handles empty renderedText", () => {
  const data = createTestCommentItem({ renderedText: "" });
  subject.updateFrom(data);
  expect(subject.tooltip).toMatchObject(new MarkdownString(""));
});

test("updateFrom handles empty text when renderedText is missing", () => {
  const data = createTestCommentItem({ text: "" });
  subject.updateFrom(data);
  expect(subject.tooltip).toMatchObject(new MarkdownString(""));
});

test("updateFrom returns true if tooltip changes", () => {
  const data = createTestCommentItem({ renderedText: "First" });
  subject.updateFrom(data);
  const newData = createTestCommentItem({ renderedText: "Second" });
  const result = subject.updateFrom(newData);
  expect(result).toBeTruthy();
  expect(subject.tooltip).toMatchObject(new MarkdownString("Second"));
});

test("updateFrom returns false if nothing changes", () => {
  const data = createTestCommentItem();
  subject.updateFrom(data);
  const result = subject.updateFrom(data);
  expect(result).toBeFalsy();
});
