import { Account, buildAccountUrl, compareAccount } from "../../../../src/modules/core/account";

const baseAccount: Account = {
  accountId: "1",
  url: "https://dev.azure.com/org",
  organization: "org",
  personalAccessToken: "token123",
};

describe("compareAccount", () => {
  test("returns true for accounts with same url, organization, and personalAccessToken", () => {
    const a = { ...baseAccount };
    const b = { ...baseAccount };
    expect(compareAccount(a, b)).toBeTruthy();
  });

  test("returns false if url differs", () => {
    const a = { ...baseAccount };
    const b = { ...baseAccount, url: "https://dev.azure.com/other" };
    expect(compareAccount(a, b)).toBeFalsy();
  });

  test("returns false if organization differs", () => {
    const a = { ...baseAccount };
    const b = { ...baseAccount, organization: "otherOrg" };
    expect(compareAccount(a, b)).toBeFalsy();
  });

  test("returns false if personalAccessToken differs", () => {
    const a = { ...baseAccount };
    const b = { ...baseAccount, personalAccessToken: "otherToken" };
    expect(compareAccount(a, b)).toBeFalsy();
  });

  test("returns true even if accountId differs", () => {
    const a = { ...baseAccount };
    const b = { ...baseAccount, accountId: "2" };
    expect(compareAccount(a, b)).toBeTruthy();
  });
});

describe("buildAccountUrl", () => {
  const account = (url: string, organization: string): Account => ({
    accountId: "1",
    url,
    organization,
    personalAccessToken: "token",
  });

  test("joins url with trailing slash and organization without leading slash", () => {
    expect(buildAccountUrl(account("https://dev.azure.com/", "myorg"))).toBe("https://dev.azure.com/myorg");
  });

  test("adds missing trailing slash to url", () => {
    expect(buildAccountUrl(account("https://dev.azure.com", "myorg"))).toBe("https://dev.azure.com/myorg");
  });

  test("removes extra leading slash from organization", () => {
    expect(buildAccountUrl(account("https://dev.azure.com/", "/myorg"))).toBe("https://dev.azure.com/myorg");
  });

  test("handles both missing trailing slash on url and leading slash on organization", () => {
    expect(buildAccountUrl(account("https://dev.azure.com", "/myorg"))).toBe("https://dev.azure.com/myorg");
  });

  test("works with on-premises TFS urls", () => {
    expect(buildAccountUrl(account("https://tfs.example.com/tfs/", "MyOrg"))).toBe("https://tfs.example.com/tfs/MyOrg");
  });
});
