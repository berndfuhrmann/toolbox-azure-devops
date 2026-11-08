import { WebApi } from "azure-devops-node-api";
import { randomUUID } from "crypto";
import { Container } from "inversify";
import vscode from "vscode";
import { AbstractStorageService } from "../../../common/storage/AbstractStorageService";
import { types } from "../../../generated/types";
import { Account, buildAccountUrl } from "../account";
import { AuthenticationMethod } from "../authentication/AuthenticationMethod";
import { AuthenticationMethodRegistry } from "../authentication/AuthenticationMethodRegistry";
import { pickAuthenticationMethod } from "./accountUtilities";

const azureDevOpsHost = "dev.azure.com";

export function addOrganizationAction(container: Container) {
  return async () => {
    const urlAndOrganization = await promptForUrlAndOrganization();
    if (!urlAndOrganization) {
      return;
    }
    const { url, organization } = urlAndOrganization;
    const authenticationMethodRegistry = container.get<AuthenticationMethodRegistry>(
      types.AuthenticationMethodRegistry,
    );
    const authenticationMethod = await pickAuthenticationMethod(authenticationMethodRegistry.all(), url);
    if (!authenticationMethod) {
      return;
    }
    const accountId = randomUUID();
    const configuration = await authenticationMethod.configure(url, organization, accountId);
    if (!configuration) {
      return;
    }
    const account: Account = { accountId, url, organization, ...configuration };
    if (!(await confirmConnection(account, authenticationMethod))) {
      return;
    }
    const storageService = container.get<AbstractStorageService>(types.StorageService);
    await storageService.addAccount(account);
  };
}

/**
 * Splits a pasted organization URL like `https://dev.azure.com/{organization}` into host URL and organization.
 */
export function parseOrganizationUrl(url: string) {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return undefined;
  }
  const organization = parsed.pathname.split("/").filter((segment) => segment)[0];
  if (parsed.host !== azureDevOpsHost || !organization) {
    return undefined;
  }
  return { url: `${parsed.protocol}//${parsed.host}/`, organization: decodeURIComponent(organization) };
}

function validateUrl(value: string) {
  try {
    const url = new URL(value);
    if (url.protocol === "https:" || url.protocol === "http:") {
      return undefined;
    }
  } catch {}
  return "Enter a valid http or https URL";
}

/**
 * Asks for the URL, and for the organization only if the URL does not already contain it.
 */
async function promptForUrlAndOrganization() {
  const url = await promptForUrl();
  if (!url) {
    return undefined;
  }
  const parsed = parseOrganizationUrl(url);
  if (parsed) {
    return parsed;
  }
  const organization = await promptForOrganization();
  if (!organization) {
    return undefined;
  }
  return { url, organization };
}

function promptForUrl() {
  return vscode.window.showInputBox({
    title: "Enter URL",
    value: `https://${azureDevOpsHost}/`,
    placeHolder: "URL of TFS or Azure Devops Host",
    ignoreFocusOut: true,
    validateInput: validateUrl,
  });
}

async function promptForOrganization() {
  const organization = await vscode.window.showInputBox({
    title: "Enter Organization",
    ignoreFocusOut: true,
    validateInput: (value) => (value.trim() ? undefined : "The organization must not be empty"),
  });
  return organization?.trim();
}

/**
 * Tests the connection. If it fails, the user can still save the organization, e.g. if the server is not reachable right now.
 */
async function confirmConnection(account: Account, authenticationMethod: AuthenticationMethod) {
  const accountUrl = buildAccountUrl(account);
  try {
    await vscode.window.withProgress(
      { location: vscode.ProgressLocation.Notification, title: `Connecting to ${accountUrl}` },
      async () => {
        const requestHandler = await authenticationMethod.createRequestHandler(account);
        await new WebApi(accountUrl, requestHandler).connect();
      },
    );
    return true;
  } catch (error) {
    const saveAnyway = "Save anyway";
    const message = error instanceof Error ? error.message : String(error);
    const selection = await vscode.window.showWarningMessage(
      `Could not connect to ${accountUrl}: ${message}`,
      { modal: true },
      saveAnyway,
    );
    return selection === saveAnyway;
  }
}
