import {
  PinnedTreeItemMixin,
  handlePinAction,
  handleUnpinAction,
  PinInfo,
} from "../../../../src/common/items/PinnedTreeItemMixin";
import { encodeStoredPin } from "../../../../src/common/storage/pinEncoding";
import { AbstractTreeItem } from "../../../../src/common/treeItems/AbstractTreeItem";
import { PinnedItem } from "../../../../src/common/items/PinnedItem";
import { MemoryStorageService } from "../../helper/MemoryStorageService";
import { firstValueFrom } from "rxjs";

type TestPinnedItem = PinnedItem & { info: PinInfo };

class TestTreeItem extends AbstractTreeItem<TestPinnedItem> {
  public override updateFrom(data: TestPinnedItem) {
    this.data = data;
    return true;
  }
}

describe("PinnedTreeItemMixin", () => {
  let storageService: MemoryStorageService;
  let getInfo: (item: TestPinnedItem) => PinInfo;
  let Mixed: any;
  let item: any;
  let pinInfo: PinInfo;

  beforeEach(() => {
    storageService = new MemoryStorageService();
    pinInfo = { accountId: "acc", type: "type", name: "test-name", object: "obj" };
    getInfo = (item) => item.info;
    Mixed = PinnedTreeItemMixin(TestTreeItem, getInfo, storageService);
    const pinnedItem: TestPinnedItem = { info: pinInfo, pinned: false };
    item = new Mixed(pinnedItem);
    item.updateFrom(pinnedItem);
  });

  test("updateFrom updates context tag based on pinned state", () => {
    // Initially not pinned
    item.updateFrom({ info: pinInfo, pinned: false });
    expect(item.hasTag("pinned")).toBeFalsy();

    // Now pinned
    item.updateFrom({ info: pinInfo, pinned: true });
    expect(item.hasTag("pinned")).toBeTruthy();
  });

  test("[pinAction] calls storageService.addPinned and updates state", async () => {
    handlePinAction(item);
    const pinnedSet = await firstValueFrom(storageService.getPinned("acc", "type"));
    expect(pinnedSet!.has(encodeStoredPin("test-name", "obj"))).toBeTruthy();
  });

  test("[unpinAction] calls storageService.removePinned and updates state", async () => {
    handlePinAction(item);
    handleUnpinAction(item);
    const pinnedSet = await firstValueFrom(storageService.getPinned("acc", "type"));
    expect(pinnedSet!.has(encodeStoredPin("test-name", "obj"))).toBeFalsy();
  });

  test("unpinning an item that is not pinned does not throw and leaves state unchanged", async () => {
    item.updateFrom({ info: pinInfo, pinned: false });
    handleUnpinAction(item);
    const pinnedSet = await firstValueFrom(storageService.getPinned("acc", "type"));
    expect(pinnedSet.has(encodeStoredPin("test-name", "obj"))).toBeFalsy();
  });

  test("updateFrom returns the base class's return value", () => {
    // The base class returns true
    const result = item.updateFrom({ info: pinInfo, pinned: false });
    expect(result).toBe(true);
  });

  test("addContextTag and removeContextTag are called appropriately", () => {
    const addSpy = vi.spyOn(item, "addContextTag");
    const removeSpy = vi.spyOn(item, "removeContextTag");
    // Pin
    item.updateFrom({ info: pinInfo, pinned: true });
    expect(addSpy).toHaveBeenCalledWith("pinned");
    // Unpin
    item.updateFrom({ info: pinInfo, pinned: false });
    expect(removeSpy).toHaveBeenCalledWith("pinned");
    addSpy.mockRestore();
    removeSpy.mockRestore();
  });

  test("mixin works with alternate getInfo implementation", async () => {
    // Use a different getInfo that returns different structure
    const altGetInfo = (item: TestPinnedItem) => ({
      accountId: item.info.accountId + "-alt",
      type: item.info.type + "-alt",
      name: item.info.name + "-alt",
      object: item.info.object + "-alt",
    });
    const AltMixed = PinnedTreeItemMixin(TestTreeItem, altGetInfo, storageService);
    const altItem = new AltMixed();
    altItem.updateFrom({ info: pinInfo, pinned: false });
    handlePinAction(altItem);
    const pinnedSet = await firstValueFrom(storageService.getPinned("acc-alt", "type-alt"));
    expect(pinnedSet!.has(encodeStoredPin("test-name-alt", "obj-alt"))).toBeTruthy();
  });
});
