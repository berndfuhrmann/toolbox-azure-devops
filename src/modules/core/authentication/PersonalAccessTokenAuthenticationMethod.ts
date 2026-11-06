import { Type } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import { getPersonalAccessTokenHandler } from "azure-devops-node-api";
import { injectable } from "inversify";
import vscode from "vscode";
import { Account } from "../account";
import { of } from "rxjs";
import { AuthenticationConfiguration, AuthenticationMethod, SignInStatus } from "./AuthenticationMethod";

export const personalAccessTokenSecretsSchema = Type.Object({
  personalAccessToken: Type.String(),
});

@injectable()
export class PersonalAccessTokenAuthenticationMethod implements AuthenticationMethod {
  readonly type = "personalAccessToken";
  readonly label = "Personal Access Token (PAT)";

  isAvailableFor(_url: string) {
    return true;
  }

  isSuggestedFor(_url: string) {
    return false;
  }

  configure(_url: string, organization: string) {
    return this.#prompt(organization);
  }

  updateCredentials(account: Account) {
    return this.#prompt(account.organization);
  }

  async createRequestHandler(account: Pick<Account, "secrets">) {
    // Invalid secrets lead to an authentication error, which offers the user to update the credentials.
    const personalAccessToken = Value.Check(personalAccessTokenSecretsSchema, account.secrets)
      ? account.secrets.personalAccessToken
      : "";
    return getPersonalAccessTokenHandler(personalAccessToken);
  }

  signInStatus(_account: Account) {
    // a PAT cannot be signed out; an invalid one shows up as authentication error
    return of<SignInStatus>("signedIn");
  }

  async #prompt(organization: string): Promise<AuthenticationConfiguration | undefined> {
    const personalAccessToken = await vscode.window.showInputBox({
      title: `Enter Personal Access Token (PAT) for ${organization}`,
      placeHolder: "Paste your PAT here",
      password: true,
      ignoreFocusOut: true,
      validateInput: (value) => (value.trim() ? undefined : "The Personal Access Token must not be empty"),
    });
    if (!personalAccessToken) {
      return undefined;
    }
    return {
      authentication: { type: this.type },
      secrets: { personalAccessToken: personalAccessToken.trim() },
    };
  }
}
