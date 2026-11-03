import vscode from "vscode";
import { PersonalAccessTokenAuthenticationMethod } from "../../../../../src/modules/core/authentication/PersonalAccessTokenAuthenticationMethod";
import { Account } from "../../../../../src/modules/core/account";

vi.mock("azure-devops-node-api", async (importOriginal) => ({
  ...(await importOriginal<typeof import("azure-devops-node-api")>()),
  getPersonalAccessTokenHandler: (token: string) => ({ token }),
}));

const account: Account = {
  accountId: "id",
  url: "https://dev.azure.com/",
  organization: "org",
  authentication: { type: "personalAccessToken" },
  secrets: { personalAccessToken: "pat" },
};

let subject: PersonalAccessTokenAuthenticationMethod;

beforeEach(() => {
  vi.clearAllMocks();
  subject = new PersonalAccessTokenAuthenticationMethod();
});

describe("configure", () => {
  test("returns the entered token as secrets, trimmed", async () => {
    vi.mocked(vscode.window.showInputBox).mockResolvedValue("  new-pat  ");

    expect(await subject.configure("https://dev.azure.com/", "org")).toEqual({
      authentication: { type: "personalAccessToken" },
      secrets: { personalAccessToken: "new-pat" },
    });
    expect(vscode.window.showInputBox).toHaveBeenCalledWith(expect.objectContaining({ password: true }));
  });

  test("returns undefined if the user cancels", async () => {
    vi.mocked(vscode.window.showInputBox).mockResolvedValue(undefined);

    expect(await subject.configure("https://dev.azure.com/", "org")).toBeUndefined();
  });

  test("rejects empty input", async () => {
    vi.mocked(vscode.window.showInputBox).mockResolvedValue(undefined);
    await subject.configure("https://dev.azure.com/", "org");

    const { validateInput } = vi.mocked(vscode.window.showInputBox).mock.calls[0][0]!;
    expect(validateInput!("  ")).toBeTruthy();
    expect(validateInput!("pat")).toBeUndefined();
  });
});

describe("updateCredentials", () => {
  test("asks for a new token", async () => {
    vi.mocked(vscode.window.showInputBox).mockResolvedValue("new-pat");

    expect(await subject.updateCredentials(account)).toEqual({
      authentication: { type: "personalAccessToken" },
      secrets: { personalAccessToken: "new-pat" },
    });
    expect(vscode.window.showInputBox).toHaveBeenCalledWith(
      expect.objectContaining({ title: expect.stringContaining("org") }),
    );
  });
});

describe("createRequestHandler", () => {
  test("uses the stored token", () => {
    expect(subject.createRequestHandler(account)).toEqual({ token: "pat" });
  });

  test.each([undefined, "plain", { other: 1 }])("uses an empty token for invalid secrets %s", (secrets) => {
    expect(subject.createRequestHandler({ ...account, secrets })).toEqual({ token: "" });
  });
});
