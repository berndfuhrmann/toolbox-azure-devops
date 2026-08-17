import { processMapChangeSet, type MapChangeSet } from "../../../src/common/collections/observableMap";

describe("processMapChangeSet", () => {
  test("dispatches added and removed entries when no updated callback is provided", () => {
    const added = vi.fn();
    const removed = vi.fn();

    const process = processMapChangeSet<string, string>({
      added,
      removed,
    });

    const changeSet: MapChangeSet<string, string> = {
      added: new Map([
        ["add-1", "value-1"],
        ["shared", "new-value"],
      ]),
      removed: new Map([
        ["remove-1", "value-2"],
        ["shared", "old-value"],
      ]),
    };

    process(changeSet);

    expect(removed).toHaveBeenNthCalledWith(1, "remove-1", "value-2");
    expect(removed).toHaveBeenNthCalledWith(2, "shared", "old-value");
    expect(removed).toHaveBeenCalledTimes(2);

    expect(added).toHaveBeenNthCalledWith(1, "add-1", "value-1");
    expect(added).toHaveBeenNthCalledWith(2, "shared", "new-value");
    expect(added).toHaveBeenCalledTimes(2);
  });

  test("routes same-key remove and add pairs to updated when provided", () => {
    const added = vi.fn();
    const removed = vi.fn();
    const updated = vi.fn();

    const process = processMapChangeSet<string, string>({
      added,
      removed,
      updated,
    });

    const changeSet: MapChangeSet<string, string> = {
      added: new Map([
        ["add-1", "value-1"],
        ["shared", "new-value"],
      ]),
      removed: new Map([
        ["remove-1", "value-2"],
        ["shared", "old-value"],
      ]),
    };

    process(changeSet);

    expect(removed).toHaveBeenCalledOnce();
    expect(removed).toHaveBeenCalledWith("remove-1", "value-2");

    expect(added).toHaveBeenCalledOnce();
    expect(added).toHaveBeenCalledWith("add-1", "value-1");

    expect(updated).toHaveBeenCalledOnce();
    expect(updated).toHaveBeenCalledWith("shared", "old-value");
  });

  test("does not call updated for pure additions or pure removals", () => {
    const added = vi.fn();
    const removed = vi.fn();
    const updated = vi.fn();

    const process = processMapChangeSet<string, string>({
      added,
      removed,
      updated,
    });

    process({
      added: new Map([["add-1", "value-1"]]),
      removed: new Map(),
    });

    process({
      added: new Map(),
      removed: new Map([["remove-1", "value-2"]]),
    });

    expect(added).toHaveBeenCalledOnce();
    expect(added).toHaveBeenCalledWith("add-1", "value-1");

    expect(removed).toHaveBeenCalledOnce();
    expect(removed).toHaveBeenCalledWith("remove-1", "value-2");

    expect(updated).not.toHaveBeenCalled();
  });
});
