# Manual Test Plan: Microsoft Sign-in

Covers the parts of the Microsoft sign-in that unit tests cannot: the real browser sign-in, real Entra ID tenants and real Azure DevOps responses. Unit tests with a mocked `vscode.authentication` cover the logic behind each case.

Run the extension from source (F5) or install a VSIX built from the branch. Record the result, VS Code version and date in the table at the end and copy it into the pull request.

## Setup

| Name    | What                                                                                        | Needed for    |
| ------- | ------------------------------------------------------------------------------------------- | ------------- |
| `work`  | Work or school account that is a member of a cloud organization (`ORG`)                     | all cases     |
| `other` | A second Microsoft account, e.g. a free personal outlook.com account                        | M3, M12       |
| `guest` | An organization in another tenant, where `work` is invited as a guest                       | M4            |
| `none`  | An organization in the same tenant as `ORG` where `work` is not a member, or can be removed | M13, M14, M15 |
| `pat`   | A PAT for `ORG`                                                                             | M10, M11, M19 |
| `ads`   | An Azure DevOps Server / TFS instance, e.g. the Vagrant box in `test/e2e`                   | M17           |

Before starting, remove all organizations from the extension. Cases marked _one account_ need only `work` and `ORG`.

## Cases

### Adding an organization

**M1 – Add with Microsoft account** _(one account)_

1. Sign out of all Microsoft accounts in VS Code (Accounts menu).
2. Run "Add Organization", paste `https://dev.azure.com/ORG`.
3. Pick "Microsoft Account" (it is preselected).

Expected: The browser opens for sign-in. After signing in, the connection test succeeds, the organization appears and its projects load. No PAT prompt.

**M2 – Add while already signed in** _(one account)_

1. Remove `ORG` again, stay signed in with `work`.
2. Add `ORG` with Microsoft account.

Expected: No browser. VS Code may show its own account picker with `work`; the organization loads.

**M3 – Account picker with several accounts**

1. Sign in to VS Code with `work` and `other` (Accounts menu → sign in with another account).
2. Remove `ORG`, add it again with Microsoft account.

Expected: An account picker shows both accounts. Picking `work` loads the organization. Repeat with `other`: the organization shows as signed in but gives 401 errors, or is signed out (see M13).

**M4 – Guest tenant**

1. Add `guest` with Microsoft account, signed in as `work`.

Expected: No tenant prompt; the organization loads. If VS Code asks to sign in again for the other tenant, that is expected once.

**M5 – Tenant lookup fails** _(one account)_

1. Disconnect from the network.
2. Run "Add Organization" with `ORG` and Microsoft account.

Expected: An input for the tenant ID appears. Cancelling ends the flow without adding anything. Entering nothing continues with the home tenant (the connection test then fails offline; "Cancel").

### Signed-out state

**M6 – Sign out in VS Code** _(one account)_

1. With `ORG` added via Microsoft account, sign out of `work` in the Accounts menu.

Expected: Within a few seconds `ORG` shows "Signed out" with a sign-in icon and cannot be expanded. The Accounts menu shows a badge asking to sign in. Clicking the organization (or the icon) opens the sign-in; afterwards it loads again without a restart.

**M7 – Restart while signed out** _(one account)_

1. Sign out as in M6, close VS Code, start it again.

Expected: No sign-in prompt or browser at startup. `ORG` shows "Signed out".

**M8 – No unwrapping while signed out** _(one account)_

1. Enable "Unwrap accounts" in the settings; have only `ORG` configured.
2. Signed in: the projects are shown at the top level.
3. Sign out of `work`.

Expected: The tree shows the signed-out `ORG` item instead of an empty or broken list. After signing in, the projects are shown at the top level again.

**M9 – Removed account** _(one account)_

1. Sign out of `work` in VS Code completely (Accounts menu → `work` → Sign Out).
2. Click "Sign In" on `ORG`.

Expected: An account picker appears with `work` preselected. Signing in loads the organization.

### Changing the method

**M10 – PAT → Microsoft** _(one account)_

1. Add `ORG` with PAT.
2. Run "Change Sign-in Method", pick "Microsoft Account".

Expected: The picker marks "Personal Access Token" as current. After signing in, the organization loads. Running "Change Sign-in Method" back to PAT asks for a new PAT (the old one was deleted).

**M11 – Microsoft → PAT** _(one account)_

1. With `ORG` on Microsoft account, run "Change Sign-in Method", pick PAT, enter `pat`.

Expected: The organization loads with the PAT. The Accounts menu still shows `work` as signed in.

**M12 – Change method on a different Microsoft account**

1. With `ORG` on Microsoft account as `work`, run "Change Sign-in Method", pick "Microsoft Account" and choose `other`.

Expected: The organization now uses `other` (401 errors or "Signed out" if `other` has no access).

### Errors

**M13 – No access**

1. Add `none` with Microsoft account as `work` ("Save anyway" when the connection test fails), or remove `work` from an added organization.

Expected: A few requests fail, then the organization shows "Signed out". No endless retries: the Output channel / network shows no repeated requests afterwards. "Update Credentials" or "Sign In" signs in again; with no access the organization ends up "Signed out" again.

**M14 – Access restored**

1. Continue M13 while VS Code keeps running: an admin adds `work` back to the organization.
2. Click "Sign In".

Expected: The organization loads. Repeat with "Change Sign-in Method" → Microsoft → `work` instead of "Sign In": loads as well.

**M15 – Restart after rejection**

1. Continue M13 (organization "Signed out" because of no access), restart VS Code.

Expected: A few 401 requests at startup, then "Signed out" again. No prompt.

### Other

**M16 – Remove organization** _(one account)_

1. Pin a project or pipeline of `ORG` (on Microsoft account).
2. Remove `ORG`, add it again.

Expected: No pinned items after re-adding. The Accounts menu still shows `work` as signed in.

**M17 – Azure DevOps Server**

1. Run "Add Organization" with the `ads` URL.

Expected: No method picker, only the PAT prompt (Microsoft account is only offered for `https://dev.azure.com` and `https://*.visualstudio.com`).

**M18 – visualstudio.com organization** _(if available)_

1. Add `https://ORG.visualstudio.com` (organization `DefaultCollection` or as prompted) with Microsoft account.

Expected: The organization loads. Note how the URL and organization had to be entered.

**M19 – PAT regression** _(one account)_

1. Add `ORG` with `pat`. Restart VS Code.

Expected: Loads as before, without any Microsoft sign-in prompts. "Update Credentials" asks for a new PAT.

## Results

| Case | Result | Notes |
| ---- | ------ | ----- |
| M1   |        |       |
| M2   |        |       |
| M3   |        |       |
| M4   |        |       |
| M5   |        |       |
| M6   |        |       |
| M7   |        |       |
| M8   |        |       |
| M9   |        |       |
| M10  |        |       |
| M11  |        |       |
| M12  |        |       |
| M13  |        |       |
| M14  |        |       |
| M15  |        |       |
| M16  |        |       |
| M17  |        |       |
| M18  |        |       |
| M19  |        |       |

VS Code version: Date: Tester:
