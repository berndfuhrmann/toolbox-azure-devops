import { describe, test, expect, vi, beforeEach } from "vitest";
import { handleOpenInWebAction, OpenInWebTreeItemMixin } from "../../../../src/common/items/OpenInWebTreeItemMixin";
import { AbstractTreeItem } from "../../../../src/common/treeItems/AbstractTreeItem";
import { env, Uri } from "vscode";
class TestTreeItem extends AbstractTreeItem<{ url?: string }> {
  constructor(data: { url?: string }) {
    super();
    this.data = data;
  }
}

describe("handleOpenInWebAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("calls openExternal with correct URL", () => {
    const url = "https://example.com";
    const Mixed = OpenInWebTreeItemMixin(TestTreeItem, (data: { url?: string }) => data.url);
    const item = new Mixed({ url });
    handleOpenInWebAction(item);
    expect(env.openExternal).toHaveBeenCalledWith(Uri.parse(url));
  });

  test("does not call openExternal if getUrl returns undefined", () => {
    const Mixed = OpenInWebTreeItemMixin(TestTreeItem, () => undefined);
    const item = new Mixed({});
    handleOpenInWebAction(item);
    expect(env.openExternal).not.toHaveBeenCalled();
  });
});
