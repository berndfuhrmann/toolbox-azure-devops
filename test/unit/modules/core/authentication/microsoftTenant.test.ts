import vscode from "vscode";
import { lookupTenant, promptForTenant } from "../../../../../src/modules/core/authentication/microsoftTenant";

describe("lookupTenant", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const respondWith = (headers: Record<string, string>) =>
    fetchMock.mockResolvedValue(new Response(null, { status: 401, headers }));

  test("reads the tenant from an unauthenticated request", async () => {
    respondWith({ "X-VSS-ResourceTenant": "tenant" });

    expect(await lookupTenant("https://dev.azure.com/org")).toBe("tenant");
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://dev.azure.com/org/_apis/connectionData");
    expect(init.headers).not.toHaveProperty("Authorization");
  });

  test.each([
    ["missing", {}],
    ["empty tenant", { "X-VSS-ResourceTenant": "00000000-0000-0000-0000-000000000000" }],
  ])("returns undefined if the tenant is %s", async (_, headers) => {
    respondWith(headers);

    expect(await lookupTenant("https://dev.azure.com/org")).toBeUndefined();
  });

  test("returns undefined if the request fails", async () => {
    fetchMock.mockRejectedValue(new Error("offline"));

    expect(await lookupTenant("https://dev.azure.com/org")).toBeUndefined();
  });
});

describe("promptForTenant", () => {
  test.each([
    [" tenant ", "tenant"],
    ["", ""],
    [undefined, undefined],
  ])("returns %j as %j", async (input, expected) => {
    vi.mocked(vscode.window.showInputBox).mockResolvedValueOnce(input);

    expect(await promptForTenant("org", undefined)).toBe(expected);
  });

  test("prefills the previous tenant and rejects spaces", async () => {
    vi.mocked(vscode.window.showInputBox).mockResolvedValueOnce(undefined);

    await promptForTenant("org", "old");

    const options = vi.mocked(vscode.window.showInputBox).mock.lastCall![0]!;
    expect(options.value).toBe("old");
    expect(options.validateInput!("a b")).toBeTruthy();
    expect(options.validateInput!("")).toBeUndefined();
  });
});
