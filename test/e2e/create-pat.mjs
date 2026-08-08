// On an Azure DevOps Server Express instance, it creates a PAT for the vagrant user.
// Runs on the host machine; authenticates via NTLM to the VM.
// Prints the PAT token to stdout so callers can capture it.
//
// Usage:
//   node test/e2e/seed-server.mjs http://<vm-ip>:8080

import { randomUUID } from "node:crypto";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const httpntlm = require("httpntlm"); // pure-JS DES+MD4, works with OpenSSL 3 / Node v17+

const serverUrl = process.argv[2] ?? process.env.AZURE_DEVOPS_HOST;
const collection = process.argv[3] ?? "DefaultCollection";
const patName = process.argv[4] ?? "toolbox-azure-devops-extension";

if (!serverUrl) {
  console.error("Usage: node seed-server.mjs http://<vm-ip>:8080 [collection] [pat-name]");
  process.exit(1);
}

const base = `${serverUrl}/${collection}`;
const ntlmOptions = { username: "vagrant", password: "vagrant", workstation: "", domain: "" };

// Returns the raw httpntlm response object (statusCode, headers, body).
function ntlmRaw(url, method = "GET", body = null, extraHeaders = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      ...ntlmOptions,
      url,
      headers: { "Content-Type": "application/json", ...extraHeaders },
      ...(body != null ? { body } : {}),
    };
    httpntlm[method.toLowerCase()](options, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });
}

// ------------------------------------------------------------------
// 1. Verify connectivity
// ------------------------------------------------------------------
process.stderr.write(`Connecting to ${base} ...\n`);
const connectRes = await ntlmRaw(`${base}/_apis/projects?api-version=5.0`);
if (connectRes.statusCode >= 400) {
  throw new Error(`Connectivity check failed (${connectRes.statusCode}): ${connectRes.body.slice(0, 200)}`);
}
process.stderr.write("Connection OK.\n");

// ------------------------------------------------------------------
// 2. Load the collection home page to obtain __RequestVerificationToken
// CSRF cookies. TFS sets these on any authenticated page response and
// the HierarchyQuery PAT creation endpoint validates them.
// ------------------------------------------------------------------
process.stderr.write("Fetching CSRF token...\n");
const homeRes = await ntlmRaw(base);
const rawSetCookie = homeRes.headers?.["set-cookie"] ?? [];
const setCookieList = Array.isArray(rawSetCookie) ? rawSetCookie : [rawSetCookie];
const csrfCookies = setCookieList.filter((c) => c.startsWith("__RequestVerificationToken")).map((c) => c.split(";")[0]);
const cookieHeader = csrfCookies.join("; ");
process.stderr.write(`  CSRF cookies: ${csrfCookies.length} obtained\n`);

// ------------------------------------------------------------------
// 3. Resolve the collection GUID — required in targetAccounts.
// ------------------------------------------------------------------
const collectionsRes = await ntlmRaw(`${serverUrl}/_apis/projectCollections?api-version=5.0`);
const collectionsData = JSON.parse(collectionsRes.body);
const collectionInfo = collectionsData.value?.find((c) => c.name === collection) ?? collectionsData.value?.[0];
if (!collectionInfo) {
  throw new Error(`Collection '${collection}' not found`);
}
const collectionId = collectionInfo.id;
process.stderr.write(`  Collection ID: ${collectionId}\n`);

// ------------------------------------------------------------------
// 4. Create the PAT via the contribution data provider.
// Browser network capture confirmed TFS uses _apis/Contribution/HierarchyQuery
// with ms.vss-token-web.personal-access-token-issue-session-token-provider,
// NOT the _apis/tokens/pats endpoint which requires a different auth context.
// ------------------------------------------------------------------
process.stderr.write(`Creating PAT '${patName}'...\n`);

const validTo = new Date();
validTo.setFullYear(validTo.getFullYear() + 1);

const sessionId = randomUUID();
const hierarchyBody = JSON.stringify({
  contributionIds: ["ms.vss-token-web.personal-access-token-issue-session-token-provider"],
  dataProviderContext: {
    properties: {
      displayName: patName,
      validTo: validTo.toISOString(),
      scope: "app_token",
      targetAccounts: [collectionId],
      sourcePage: {
        url: `${base}/_usersSettings/tokens`,
        routeId: "ms.vss-admin-web.user-admin-hub-route",
        routeValues: {
          adminPivot: "tokens",
          controller: "ContributedPage",
          action: "Execute",
          serviceHost: `${collectionId} (${collection})`,
        },
      },
    },
  },
});

const hierarchyRes = await ntlmRaw(`${base}/_apis/Contribution/HierarchyQuery`, "POST", hierarchyBody, {
  accept:
    "application/json;api-version=5.0-preview.1;excludeUrls=true;enumsAsNumbers=true;msDateFormat=true;noArrayWrap=true",
  "x-requested-with": "Vss-Fetch",
  "x-tfs-session": sessionId,
  Origin: serverUrl,
  Referer: `${base}/_usersSettings/tokens`,
  ...(cookieHeader ? { Cookie: cookieHeader } : {}),
});

process.stderr.write(`  HierarchyQuery status: ${hierarchyRes.statusCode}\n`);

let hierarchyResult;
try {
  hierarchyResult = JSON.parse(hierarchyRes.body);
} catch {
  throw new Error(`Non-JSON response (${hierarchyRes.statusCode}): ${hierarchyRes.body.slice(0, 300)}`);
}

if (hierarchyRes.statusCode >= 400) {
  throw new Error(`PAT creation failed (${hierarchyRes.statusCode}): ${JSON.stringify(hierarchyResult)}`);
}

const providerKey = "ms.vss-token-web.personal-access-token-issue-session-token-provider";
const providerData = hierarchyResult?.dataProviders?.[providerKey];
if (!providerData?.token) {
  throw new Error(
    `PAT token not in response. dataProviders keys: ${Object.keys(hierarchyResult?.dataProviders ?? {}).join(", ")}\n` +
      `Full response: ${JSON.stringify(hierarchyResult).slice(0, 500)}`,
  );
}

const { token, displayName, validTo: expiresAt } = providerData;
process.stderr.write(`PAT '${displayName}' created, valid until ${expiresAt}\n`);
// Print token to stdout only — easy to capture with $(node seed-server.mjs ...)
process.stdout.write(token + "\n");
