import type { RequestOptions } from "http";
import { BehaviorSubject } from "rxjs";
import vscode from "vscode";
import { AbstractTreeProvider } from "../../../../src/common/AbstractTreeProvider";
import { SettingsService } from "../../../../src/common/SettingsService";
import { AbstractStorageService } from "../../../../src/common/storage/AbstractStorageService";
import { registerTreeProviderResolver } from "../../../../src/generated/register";
import { types } from "../../../../src/generated/types";
import { createTestContainer } from "../../helper/testContainer";

const { requests } = vi.hoisted(() => ({ requests: [] as string[] }));

// a server that only answers requests with a token, like Azure DevOps for a private organization
vi.mock("azure-devops-node-api", async (importOriginal) => ({
  ...(await importOriginal<typeof import("azure-devops-node-api")>()),
  WebApi: class {
    constructor(
      public url: string,
      public handler: { prepareRequest(options: RequestOptions): void },
    ) {}
    async getCoreApi() {
      return {
        getProjects: async () => {
          const options: RequestOptions = { host: "dev.azure.com", headers: {} };
          this.handler.prepareRequest(options);
          const authorization = (options.headers as Record<string, string>)["Authorization"];
          requests.push(authorization ?? "anonymous");
          if (!authorization) {
            throw Object.assign(new Error("TF400813: The user is not authorized to access this resource."), {
              statusCode: 401,
            });
          }
          return [
            { id: "p1", name: "Project 1" },
            { id: "p2", name: "Project 2" },
          ];
        },
      };
    }
  },
}));

vi.mock("../../../../src/modules/core/authentication/microsoftTenant", () => ({
  lookupTenant: vi.fn().mockResolvedValue(undefined),
  promptForTenant: vi.fn(),
}));

let session: vscode.AuthenticationSession | undefined;
let fireDidChangeSessions: (event: vscode.AuthenticationSessionsChangeEvent) => void;
let tree: AbstractTreeProvider;

const signIn = (accessToken: string) => {
  session = { id: "session", accessToken, account: { id: "ms-id", label: "user" }, scopes: [] };
  fireDidChangeSessions({ provider: { id: "microsoft", label: "Microsoft" } });
};

const signOut = () => {
  session = undefined;
  fireDidChangeSessions({ provider: { id: "microsoft", label: "Microsoft" } });
};

const labels = async (element?: any) => ((await tree.getChildren(element)) ?? []).map((item) => String(item.label));

const accountChildren = async () => {
  const accountItem = (await tree.getChildren(undefined))?.find((item) => item.data?.type === "account");
  return labels(accountItem);
};

beforeEach(async () => {
  requests.length = 0;
  vi.mocked(vscode.authentication.onDidChangeSessions).mockImplementation((listener: any) => {
    fireDidChangeSessions = listener;
    return { dispose: vi.fn() };
  });
  vi.mocked(vscode.authentication.getSession).mockImplementation(async () => session);
  session = { id: "session", accessToken: "token-1", account: { id: "ms-id", label: "user" }, scopes: [] };

  const container = createTestContainer();
  registerTreeProviderResolver(container);
  // keeps the organization visible, so that its children can be checked
  (container.get<SettingsService>(types.SettingsService).unwrapAccounts() as BehaviorSubject<boolean>).next(false);
  await container.get<AbstractStorageService>(types.StorageService).addAccount({
    accountId: "account-1",
    url: "https://dev.azure.com/",
    organization: "org",
    authentication: { type: "microsoft", microsoftAccountId: "ms-id", microsoftAccountLabel: "user" },
  });
  tree = container.get<AbstractTreeProvider>(types.RepositoryTreeProvider);
});

test("shows the projects again after signing out and in", async () => {
  await vi.waitFor(async () => expect(await accountChildren()).toEqual(["Project 1", "Project 2"]));

  signOut();
  await vi.waitFor(async () => expect(await accountChildren()).toEqual([]));

  signIn("token-2");
  await vi.waitFor(async () => expect(await accountChildren()).toEqual(["Project 1", "Project 2"]));
});

test("sends no requests without a token while signed out", async () => {
  await vi.waitFor(async () => expect(await accountChildren()).toEqual(["Project 1", "Project 2"]));

  signOut();
  await vi.waitFor(async () => expect(await accountChildren()).toEqual([]));
  signIn("token-2");
  await vi.waitFor(async () => expect(await accountChildren()).toEqual(["Project 1", "Project 2"]));

  expect(requests).toEqual(["Bearer token-1", "Bearer token-2"]);
});
