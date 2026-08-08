import { describe, it, expect, vi } from "vitest";
import { MemoryStorageService } from "./helper/MemoryStorageService";

vi.mock("../../src/common/storage/VSCodeStorageService", () => ({
  VSCodeStorageService: MemoryStorageService,
}));

import { createContainer } from "../../src/container";
import { types } from "../../src/generated/types";

const mockContext = {
  globalState: {},
  subscriptions: [],
  workspaceState: {},
  extensionPath: "",
  asAbsolutePath: (p: string) => p,
  storagePath: "",
  logPath: "",
  extensionUri: {},
  environmentVariableCollection: {},
  extensionMode: 1,
  extension: {},
  secrets: {},
  storageUri: {},
  logUri: {},
  globalStorageUri: {},
  workspaceStateUri: {},
} as any;

describe("createContainer", () => {
  it("should create a container and bind expected services (with MemoryStorageService)", () => {
    const container = createContainer(mockContext);
    expect(container).toBeDefined();
    expect(container.get(types.vscodeContext)).toBe(mockContext);
    expect(container.get(types.Container)).toBe(container);
    expect(container.isBound(types.SettingsService)).toBe(true);
    expect(container.isBound(types.StorageService)).toBe(true);
  });
});
