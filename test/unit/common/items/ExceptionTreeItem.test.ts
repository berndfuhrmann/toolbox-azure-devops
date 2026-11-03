import { Uri } from "vscode";
import { createException } from "../../../../src/common/Exception";
import { IconService } from "../../../../src/common/icons/IconService";
import { authenticationErrorContextTag, ExceptionTreeItem } from "../../../../src/common/treeItems/ExceptionTreeItem";

const httpError = (statusCode: number) => Object.assign(new Error("{}"), { statusCode });

let subject: ExceptionTreeItem;

beforeEach(() => {
  subject = new ExceptionTreeItem();
  (subject as any).setIconService(new IconService(Uri.file("/test/extension")));
});

test("tags 401 errors as authentication errors", () => {
  subject.updateFrom(createException(httpError(401)));
  expect(subject.hasTag(authenticationErrorContextTag)).toBe(true);
});

test.each([403, 404, 500])("does not tag %s errors", (statusCode) => {
  subject.updateFrom(createException(httpError(statusCode)));
  expect(subject.hasTag(authenticationErrorContextTag)).toBe(false);
});

test("does not tag errors without status code", () => {
  subject.updateFrom(createException(new Error("boom")));
  expect(subject.hasTag(authenticationErrorContextTag)).toBe(false);
});

test("removes the tag when the error changes", () => {
  subject.updateFrom(createException(httpError(401)));
  expect(subject.updateFrom(createException(httpError(500)))).toBe(true);
  expect(subject.hasTag(authenticationErrorContextTag)).toBe(false);
});
