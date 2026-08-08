import { Container } from "inversify";
import { randomUUID } from "crypto";
import { compareRefreshableItem, RefreshableItem } from "../../../src/common/items/RefreshableItem";
import { createTestContainer } from "./testContainer";

export function compareTestItem(a: TestItem, b: TestItem) {
  if (!compareRefreshableItem(a, b)) {
    return false;
  }
  if (a.container !== b.container) {
    return false;
  }
  return a.testData === b.testData;
}

export function createTestItemWithEmptyContainer(testData: string): TestItem {
  return {
    id: randomUUID(),
    container: createTestContainer(),
    refreshObservables: {},
    testData,
  };
}

export function createTestItem(container: Container, testData: string): TestItem {
  return {
    id: randomUUID(),
    container,
    refreshObservables: {},
    testData,
  };
}

export interface TestItem extends RefreshableItem {
  id: string;
  testData: string;
  container: Container;
}
