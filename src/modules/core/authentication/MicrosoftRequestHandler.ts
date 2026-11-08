import type {
  IHttpClient,
  IHttpClientResponse,
  IRequestHandler,
  IRequestInfo,
} from "azure-devops-node-api/interfaces/common/VsoBaseInterfaces";
import type { OutgoingHttpHeaders, RequestOptions } from "http";

/**
 * Hosts that may receive a Microsoft token for Azure DevOps. Such a token works for every organization the user can
 * reach, so it must never be sent anywhere else.
 */
export function isMicrosoftAuthenticationHost(host: string | null | undefined) {
  const hostname = host?.toLowerCase();
  return (
    hostname === "dev.azure.com" ||
    hostname?.endsWith(".dev.azure.com") === true ||
    hostname?.endsWith(".visualstudio.com") === true
  );
}

export function isMicrosoftAuthenticationUrl(url: string) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && isMicrosoftAuthenticationHost(parsed.hostname);
  } catch {
    return false;
  }
}

/**
 * Sends the current Microsoft token. `prepareRequest` is synchronous, so the token comes from a cache that is kept up
 * to date by the authentication method. On a 401, the token is fetched again and the request is retried once.
 */
export class MicrosoftRequestHandler implements IRequestHandler {
  #getToken: () => string | undefined;
  #refreshToken: () => Promise<string | undefined>;
  #rejectToken: (token: string) => void;

  /**
   * @param rejectToken called if a token was not accepted even after refreshing it
   */
  constructor(
    getToken: () => string | undefined,
    refreshToken: () => Promise<string | undefined>,
    rejectToken: (token: string) => void,
  ) {
    this.#getToken = getToken;
    this.#refreshToken = refreshToken;
    this.#rejectToken = rejectToken;
  }

  prepareRequest(options: RequestOptions) {
    this.#setAuthorization(options, this.#getToken());
  }

  canHandleAuthentication(response: IHttpClientResponse) {
    return response.message.statusCode === 401;
  }

  async handleAuthentication(httpClient: IHttpClient, requestInfo: IRequestInfo, data: any) {
    const sentToken = this.#setAuthorization(requestInfo.options, await this.#refreshToken());
    // requestRaw does not handle authentication again, so there is at most one retry
    const response = await httpClient.requestRaw(requestInfo, data);
    // a host that did not get the token, e.g. one missing from the allowlist, cannot have rejected it
    if (sentToken && response.message.statusCode === 401) {
      this.#rejectToken(sentToken);
    }
    return response;
  }

  /** Returns the token if it was set, undefined if there is none or the host must not get it. */
  #setAuthorization(options: RequestOptions, token: string | undefined) {
    const headers = (options.headers ??= {}) as OutgoingHttpHeaders;
    delete headers["Authorization"];
    // without this, Azure DevOps answers unauthenticated requests with a redirect to the sign-in page
    headers["X-TFS-FedAuthRedirect"] = "Suppress";
    if (token && isMicrosoftAuthenticationHost(options.hostname ?? options.host)) {
      headers["Authorization"] = `Bearer ${token}`;
      return token;
    }
    return undefined;
  }
}
