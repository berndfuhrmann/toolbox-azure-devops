import { describe, test, expect } from "vitest";
import { MissingTreeItem } from "../../../../src/common/treeItems/MissingTreeItem";
import { missingSymbol } from "../../../../src/common/items/MissingItem";
import { Uri } from "vscode";
import { IconService } from "../../../../src/common/icons/IconService";

describe("MissingTreeItem", () => {
  test("updateFrom sets label and icon from data", () => {
    const item = new MissingTreeItem();
    (item as any).setIconService(new IconService(Uri.file("/test/extension")));

    const testData = {
      name: "Test Item",
      icon: "test-icon",
      [missingSymbol]: true as const,
      pinInfo: {
        accountId: "test-account",
        type: "test-type",
        name: "Test Item",
        object: "test-object",
      },
      pinned: true,
    };

    const result = item.updateFrom(testData);

    expect(item.label).toBe("Missing: Test Item");
    expect(item.iconPath).toBeDefined();
    expect(result).toBe(true);
  });
});
