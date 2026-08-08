import { describe, test, expect } from "vitest";
import { isDirectChildPath } from "../../../../../src/modules/pipeline/treePartProviders/PipelineFolderTreePartProvider";

describe("isDirectChildPath", () => {
  describe("root parent (\\)", () => {
    test("accepts direct child", () => {
      expect(isDirectChildPath("\\", "\\SomeFolder")).toBe(true);
    });

    test("rejects grandchild", () => {
      expect(isDirectChildPath("\\", "\\SomeFolder\\Nested")).toBe(false);
    });

    test("rejects root itself", () => {
      expect(isDirectChildPath("\\", "\\")).toBe(false);
    });
  });

  describe("non-root parent", () => {
    test("accepts direct child", () => {
      expect(isDirectChildPath("\\SomeFolder", "\\SomeFolder\\SomeFolder")).toBe(true);
    });

    test("accepts sibling with different name (no prefix overlap)", () => {
      expect(isDirectChildPath("\\SomeFolder\\SomeFolder", "\\SomeFolder\\SomeFolder 2")).toBe(false);
    });

    test("rejects sibling whose name starts with the parent folder name", () => {
      expect(isDirectChildPath("\\SomeFolder\\SomeFolder", "\\SomeFolder\\SomeFolder 2")).toBe(false);
    });

    test("accepts child of folder whose name is a prefix of a sibling", () => {
      expect(isDirectChildPath("\\SomeFolder", "\\SomeFolder\\SomeFolder 2")).toBe(true);
    });

    test("rejects grandchild", () => {
      expect(isDirectChildPath("\\SomeFolder", "\\SomeFolder\\SomeOther\\Sub")).toBe(false);
    });

    test("rejects parent itself", () => {
      expect(isDirectChildPath("\\SomeFolder\\SomeFolder", "\\SomeFolder\\SomeFolder")).toBe(false);
    });

    test("rejects unrelated path", () => {
      expect(isDirectChildPath("\\SomeFolder", "\\Other\\Folder")).toBe(false);
    });
  });
});
