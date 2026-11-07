import type { IHttpClient, IRequestInfo } from "azure-devops-node-api/interfaces/common/VsoBaseInterfaces";
import type { RequestOptions } from "http";
import {
  isMicrosoftAuthenticationHost,
  isMicrosoftAuthenticationUrl,
  MicrosoftRequestHandler,
} from "../../../../../src/modules/core/authentication/MicrosoftRequestHandler";

describe("isMicrosoftAuthenticationHost", () => {
  test.each([
    ["dev.azure.com", true],
    ["DEV.AZURE.COM", true],
    ["vsrm.dev.azure.com", true],
    ["my-org.visualstudio.com", true],
    ["evil-dev.azure.com", false],
    ["dev.azure.com.example.com", false],
    ["visualstudio.com.example.com", false],
    ["tfs.example.com", false],
    [undefined, false],
  ])("%s", (host, expected) => {
    expect(isMicrosoftAuthenticationHost(host)).toBe(expected);
  });
});

describe("isMicrosoftAuthenticationUrl", () => {
  test.each([
    ["https://dev.azure.com/", true],
    ["https://my-org.visualstudio.com/", true],
    ["http://dev.azure.com/", false],
    ["https://tfs.example.com/tfs/", false],
    ["not a url", false],
  ])("%s", (url, expected) => {
    expect(isMicrosoftAuthenticationUrl(url)).toBe(expected);
  });
});

describe("MicrosoftRequestHandler", () => {
  const requestOptions = (host: string): RequestOptions => ({ host, headers: {} });

  test("sends the token to Azure DevOps", () => {
    const options = requestOptions("dev.azure.com");
    new MicrosoftRequestHandler(() => "token", vi.fn(), vi.fn()).prepareRequest(options);
    expect(options.headers).toEqual({ Authorization: "Bearer token", "X-TFS-FedAuthRedirect": "Suppress" });
  });

  test("never sends the token to other hosts", () => {
    const options = requestOptions("example.com");
    options.headers = { Authorization: "Bearer stale" };
    new MicrosoftRequestHandler(() => "token", vi.fn(), vi.fn()).prepareRequest(options);
    expect(options.headers).toEqual({ "X-TFS-FedAuthRedirect": "Suppress" });
  });

  test("sends no token if there is none", () => {
    const options = requestOptions("dev.azure.com");
    new MicrosoftRequestHandler(() => undefined, vi.fn(), vi.fn()).prepareRequest(options);
    expect(options.headers).toEqual({ "X-TFS-FedAuthRedirect": "Suppress" });
  });

  test.each([
    [401, true],
    [403, false],
    [200, false],
  ])("handles status %s: %s", (statusCode, expected) => {
    const handler = new MicrosoftRequestHandler(() => "token", vi.fn(), vi.fn());
    expect(handler.canHandleAuthentication({ message: { statusCode } } as any)).toBe(expected);
  });

  test("retries once with a refreshed token", async () => {
    const response = { message: { statusCode: 200 } };
    const httpClient = { requestRaw: vi.fn().mockResolvedValue(response) } as unknown as IHttpClient;
    const requestInfo = {
      options: { host: "dev.azure.com", headers: { Authorization: "Bearer old" } },
    } as unknown as IRequestInfo;
    const rejectToken = vi.fn();
    const handler = new MicrosoftRequestHandler(
      () => "old",
      async () => "new",
      rejectToken,
    );

    expect(await handler.handleAuthentication(httpClient, requestInfo, "data")).toBe(response);
    expect(httpClient.requestRaw).toHaveBeenCalledWith(
      expect.objectContaining({
        options: expect.objectContaining({ headers: expect.objectContaining({ Authorization: "Bearer new" }) }),
      }),
      "data",
    );
    expect(rejectToken).not.toHaveBeenCalled();
  });

  const handleUnauthorizedRetry = async (token: string | undefined) => {
    const httpClient = {
      requestRaw: vi.fn().mockResolvedValue({ message: { statusCode: 401 } }),
    } as unknown as IHttpClient;
    const requestInfo = { options: { host: "dev.azure.com", headers: {} } } as unknown as IRequestInfo;
    const rejectToken = vi.fn();
    const handler = new MicrosoftRequestHandler(
      () => token,
      async () => token,
      rejectToken,
    );
    await handler.handleAuthentication(httpClient, requestInfo, undefined);
    return rejectToken;
  };

  test("reports the token as rejected if the retry fails too", async () => {
    expect(await handleUnauthorizedRetry("token")).toHaveBeenCalledWith("token");
  });

  test("reports nothing if there is no token, as the user is signed out anyway", async () => {
    expect(await handleUnauthorizedRetry(undefined)).not.toHaveBeenCalled();
  });
});
