import { createContainer } from "../../../src/container";
import { types } from "../../../src/generated/types";
import { SettingsService } from "../../../src/common/SettingsService";
import { createMockContext } from "../mocks/mockContext";
import { MockSettingsService } from "../mocks/MockSettingsService";
import { MemoryStorageService } from "./MemoryStorageService";

export function createTestContainer() {
  const container = createContainer(createMockContext());
  container.rebindSync<SettingsService>(types.SettingsService).to(MockSettingsService).inSingletonScope();
  container.rebindSync<MemoryStorageService>(types.StorageService).to(MemoryStorageService).inSingletonScope();
  return container;
}
