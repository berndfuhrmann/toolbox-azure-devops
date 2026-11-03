import { Container } from "inversify";
import { firstValueFrom } from "rxjs";
import vscode from "vscode";
import { AbstractStorageService } from "../../../../../src/common/storage/AbstractStorageService";
import { types } from "../../../../../src/generated/types";
import {
  addOrganizationAction,
  parseOrganizationUrl,
} from "../../../../../src/modules/core/actions/addOrganizationAction";
import { AuthenticationMethod } from "../../../../../src/modules/core/authentication/AuthenticationMethod";
import { AuthenticationMethodRegistry } from "../../../../../src/modules/core/authentication/AuthenticationMethodRegistry";
import { PersonalAccessTokenAuthenticationMethod } from "../../../../../src/modules/core/authentication/PersonalAccessTokenAuthenticationMethod";
import { createTestContainer } from "../../../helper/testContainer";

const { connect } = vi.hoisted(() => ({ connect: vi.fn() }));

vi.mock("azure-devops-node-api", async (importOriginal) => ({
  ...(await importOriginal<typeof import("azure-devops-node-api")>()),
  WebApi: class {
    constructor(
      public url: string,
      public handler: unknown,
    ) {}
    connect = () => connect(this.url, this.handler);
  },
  getPersonalAccessTokenHandler: (token: string) => ({ token }),
}));

let container: Container;

beforeEach(() => {
  vi.clearAllMocks();
  connect.mockResolvedValue({});
  vi.mocked(vscode.window.withProgress).mockImplementation((_options, task) => task({} as any, {} as any) as any);
  container = createTestContainer();
});

const getAccounts = () => firstValueFrom(container.get<AbstractStorageService>(types.StorageService).getAccounts());
const mockInputs = (...values: (string | undefined)[]) =>
  values.forEach((value) => vi.mocked(vscode.window.showInputBox).mockResolvedValueOnce(value));

describe("parseOrganizationUrl", () => {
  test.each([
    ["https://dev.azure.com/my-org", { url: "https://dev.azure.com/", organization: "my-org" }],
    ["https://dev.azure.com/my-org/my-project/_build", { url: "https://dev.azure.com/", organization: "my-org" }],
    ["https://dev.azure.com/my%20org", { url: "https://dev.azure.com/", organization: "my org" }],
    ["https://dev.azure.com/", undefined],
    ["https://tfs.example.com/tfs/collection", undefined],
    ["not a url", undefined],
  ])("%s", (url, expected) => {
    expect(parseOrganizationUrl(url)).toEqual(expected);
  });
});

describe("addOrganizationAction", () => {
  test("takes the organization from a pasted organization URL", async () => {
    mockInputs("https://dev.azure.com/my-org", "pat");

    await addOrganizationAction(container)();

    expect(vscode.window.showInputBox).toHaveBeenCalledTimes(2);
    expect(await getAccounts()).toEqual([
      {
        accountId: expect.any(String),
        url: "https://dev.azure.com/",
        organization: "my-org",
        authentication: { type: "personalAccessToken" },
        secrets: { personalAccessToken: "pat" },
      },
    ]);
    expect(connect).toHaveBeenCalledWith("https://dev.azure.com/my-org", { token: "pat" });
  });

  test("asks for the organization if the URL does not contain one", async () => {
    mockInputs("https://tfs.example.com/tfs/", "collection", "pat");

    await addOrganizationAction(container)();

    expect(await getAccounts()).toEqual([
      expect.objectContaining({ url: "https://tfs.example.com/tfs/", organization: "collection" }),
    ]);
  });

  test("validates the URL", async () => {
    mockInputs(undefined);

    await addOrganizationAction(container)();

    const { validateInput } = vi.mocked(vscode.window.showInputBox).mock.calls[0][0]!;
    expect(validateInput!("not a url")).toBeTruthy();
    expect(validateInput!("ftp://example.com")).toBeTruthy();
    expect(validateInput!("https://example.com")).toBeUndefined();
  });

  test("stops if the URL prompt is cancelled", async () => {
    mockInputs(undefined);

    await addOrganizationAction(container)();

    expect(vscode.window.showInputBox).toHaveBeenCalledTimes(1);
    expect(await getAccounts()).toEqual([]);
  });

  test("stops if the organization prompt is cancelled", async () => {
    mockInputs("https://tfs.example.com/tfs/", undefined);

    await addOrganizationAction(container)();

    expect(vscode.window.showInputBox).toHaveBeenCalledTimes(2);
    expect(await getAccounts()).toEqual([]);
  });

  test("stops if the credentials prompt is cancelled", async () => {
    mockInputs("https://dev.azure.com/my-org", undefined);

    await addOrganizationAction(container)();

    expect(connect).not.toHaveBeenCalled();
    expect(await getAccounts()).toEqual([]);
  });

  test("saves anyway if the connection fails and the user wants to", async () => {
    mockInputs("https://dev.azure.com/my-org", "pat");
    connect.mockRejectedValue(new Error("unreachable"));
    vi.mocked(vscode.window.showWarningMessage).mockResolvedValue("Save anyway" as any);

    await addOrganizationAction(container)();

    expect(vscode.window.showWarningMessage).toHaveBeenCalledWith(
      expect.stringContaining("unreachable"),
      { modal: true },
      "Save anyway",
    );
    expect(await getAccounts()).toHaveLength(1);
  });

  test("does not save if the connection fails and the user cancels", async () => {
    mockInputs("https://dev.azure.com/my-org", "pat");
    connect.mockRejectedValue(new Error("unreachable"));
    vi.mocked(vscode.window.showWarningMessage).mockResolvedValue(undefined);

    await addOrganizationAction(container)();

    expect(await getAccounts()).toEqual([]);
  });

  describe("with several authentication methods", () => {
    const otherMethod: AuthenticationMethod = {
      type: "other" as any,
      label: "Other",
      isSuggestedFor: (url) => url.startsWith("https://dev.azure.com"),
      configure: vi.fn(),
      updateCredentials: vi.fn(),
      createRequestHandler: vi.fn(),
    };

    beforeEach(() => {
      container
        .rebindSync(types.AuthenticationMethodRegistry)
        .toConstantValue(
          new AuthenticationMethodRegistry([new PersonalAccessTokenAuthenticationMethod(), otherMethod]),
        );
    });

    test("offers the suggested method first", async () => {
      mockInputs("https://dev.azure.com/my-org");
      vi.mocked(vscode.window.showQuickPick).mockResolvedValue(undefined);

      await addOrganizationAction(container)();

      const items = vi.mocked(vscode.window.showQuickPick).mock.calls[0][0] as vscode.QuickPickItem[];
      expect(items.map((item) => [item.label, item.description])).toEqual([
        ["Other", "suggested"],
        ["Personal Access Token (PAT)", undefined],
      ]);
    });

    test("stops if the method picker is cancelled", async () => {
      mockInputs("https://dev.azure.com/my-org");
      vi.mocked(vscode.window.showQuickPick).mockResolvedValue(undefined);

      await addOrganizationAction(container)();

      expect(vscode.window.showInputBox).toHaveBeenCalledTimes(1);
      expect(otherMethod.configure).not.toHaveBeenCalled();
      expect(await getAccounts()).toEqual([]);
    });
  });
});
