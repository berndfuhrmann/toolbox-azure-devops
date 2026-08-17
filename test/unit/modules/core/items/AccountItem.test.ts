import { Container } from "inversify";
import { BehaviorSubject, Subject } from "rxjs";
import { Account } from "../../../../../src/modules/core/account";
import { AccountItem, compareAccountItem, createAccountItem } from "../../../../../src/modules/core/items/AccountItem";

describe("compareAccountItem", () => {
  function createAccount(accountId: string, url: string, organization: string, personalAccessToken: string): Account {
    return { accountId, url, organization, personalAccessToken };
  }

  function createContainer(): Container {
    return new Container();
  }

  function createTestAccountItem(
    account: Account,
    container: Container,
    refreshObservables?: Record<string, Subject<number>>,
  ) {
    const result = createAccountItem(account, container);
    if (refreshObservables) {
      Object.assign(result.refreshObservables, refreshObservables);
    }
    return result;
  }

  test("returns true for identical AccountItems", () => {
    const account = createAccount("1", "url", "org", "pat");
    const container = createContainer();
    const refreshObservables = { key: new BehaviorSubject<number>(0) };
    const a = createTestAccountItem(account, container, refreshObservables);
    const b = createTestAccountItem(account, container, refreshObservables);
    expect(compareAccountItem(a, b)).toBe(true);
  });

  test("returns false if accounts differ", () => {
    const container = createContainer();
    const refreshObservables = { key: new BehaviorSubject<number>(0) };
    const a = createTestAccountItem(createAccount("1", "urlA", "orgA", "patA"), container, refreshObservables);
    const b = createTestAccountItem(createAccount("2", "urlB", "orgB", "patB"), container, refreshObservables);
    expect(compareAccountItem(a, b)).toBe(false);
  });

  test("returns false if containers differ", () => {
    const account = createAccount("1", "url", "org", "pat");
    const refreshObservables = { key: new BehaviorSubject<number>(0) };
    const a = createTestAccountItem(account, createContainer(), refreshObservables);
    const b = createTestAccountItem(account, createContainer(), refreshObservables);
    expect(compareAccountItem(a, b)).toBe(false);
  });

  test("returns false if RefreshableItem comparison fails", () => {
    const account = createAccount("1", "url", "org", "pat");
    const container = createContainer();
    const a = createTestAccountItem(account, container, { key: new BehaviorSubject<number>(0) });
    const b = createTestAccountItem(account, container, { key: new BehaviorSubject<number>(0) });
    expect(compareAccountItem(a, b)).toBe(false);
  });
});
