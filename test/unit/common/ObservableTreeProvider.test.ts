import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { createTestContainer } from "../helper/testContainer";
import { TestTreeProvider } from "../helper/TestTreeProvider";

beforeEach(() => {
  vi.useFakeTimers();
  const date = new Date(2020, 1, 1, 0);
  vi.setSystemTime(date);
});

afterEach(() => {
  vi.useRealTimers();
});
let call = 0;
beforeEach(() => (call = 0));

describe("getChildren", () => {
  test("no content", async () => {
    const container = createTestContainer();
    container.bind<TestTreeProvider>("subject").to(TestTreeProvider).inSingletonScope();
    const subject = container.get<TestTreeProvider>("subject");
    const children = await subject.getChildren(undefined);
    expect(children).toBeUndefined();
  });
});
