import { createVSCodeMock } from "jest-mock-vscode";
import { vi } from "vitest";

const vscodeMock = createVSCodeMock(vi);

vscodeMock.env = {
  openExternal: vi.fn(),
};

vscodeMock.window.createQuickPick = vi.fn(() => {
  const eventHandlers = {
    onDidAccept: [],
    onDidHide: [],
  };

  return {
    busy: false,
    placeholder: "",
    title: "",
    items: [],
    selectedItems: [],
    show: vi.fn(),
    hide: vi.fn(),
    dispose: vi.fn(),
    onDidAccept: vi.fn((handler) => {
      eventHandlers.onDidAccept.push(handler);
      return { dispose: vi.fn() };
    }),
    onDidHide: vi.fn((handler) => {
      eventHandlers.onDidHide.push(handler);
      return { dispose: vi.fn() };
    }),
    _fireDidAccept: () => eventHandlers.onDidAccept.forEach((h) => h()),
    _fireDidHide: () => eventHandlers.onDidHide.forEach((h) => h()),
  };
});

module.exports = vscodeMock;
