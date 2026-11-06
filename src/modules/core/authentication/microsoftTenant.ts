import vscode from "vscode";

/** Reported for organizations that are not connected to an Entra ID tenant. */
const emptyTenantId = "00000000-0000-0000-0000-000000000000";
const lookupTimeout = 10_000;

/**
 * Looks up the Entra ID tenant of an organization. Azure DevOps reports it even for unauthenticated requests.
 * Returns undefined if the tenant could not be determined.
 */
export async function lookupTenant(accountUrl: string): Promise<string | undefined> {
  try {
    const response = await fetch(`${accountUrl}/_apis/connectionData`, {
      headers: { "X-TFS-FedAuthRedirect": "Suppress" },
      redirect: "manual",
      signal: AbortSignal.timeout(lookupTimeout),
    });
    const tenantId = response.headers.get("X-VSS-ResourceTenant")?.trim();
    return tenantId && tenantId !== emptyTenantId ? tenantId : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Asks for the tenant if it could not be looked up.
 * Returns undefined if the user cancelled, and an empty string for the home tenant of the Microsoft account.
 */
export async function promptForTenant(organization: string, tenantId: string | undefined) {
  const value = await vscode.window.showInputBox({
    title: `Enter Tenant ID for ${organization}`,
    prompt:
      "The tenant of the organization could not be determined. Leave empty to use the home tenant of your account.",
    placeHolder: "Tenant ID",
    value: tenantId,
    ignoreFocusOut: true,
    validateInput: (value) => (/\s/.test(value.trim()) ? "The tenant ID must not contain spaces" : undefined),
  });
  return value?.trim();
}
