import type * as VSSInterfaces from "azure-devops-node-api/interfaces/common/VSSInterfaces";
import type { WorkItemClassificationNode } from "azure-devops-node-api/interfaces/WorkItemTrackingInterfaces";
import { TreeStructureGroup } from "azure-devops-node-api/interfaces/WorkItemTrackingInterfaces";
import { Container } from "inversify";
import { firstValueFrom } from "rxjs";
import vscode, { TreeItem } from "vscode";
import { isException } from "../../../common/Exception";
import { refreshRefreshable } from "../../../common/items/RefreshableItem";
import { nowOrEarlier } from "../../../common/operators";
import { ApiService } from "../../../generated/ApiService";
import { WorkItemTrackingService } from "../../../generated/services";
import { types } from "../../../generated/types";
import { AccountContextProvider } from "../../core/AccountContextProvider";
import {
  getAssignedTo,
  getEffort,
  getIterationPath,
  getState,
  getTitle,
  getWorkItemType,
  WorkItemFieldEffort,
  WorkItemFieldSystemAssignedTo,
  WorkItemFieldSystemIterationPath,
  WorkItemFieldSystemState,
  WorkItemFieldSystemTitle,
} from "../../workItemTracking/fields";
import { WorkItemItem } from "../items/WorkItemItem";
import { WorkItemTreeItem } from "../treeItems/WorkItemTreeItem";

interface StateQuickPickItem extends vscode.QuickPickItem {
  state: string;
}

interface AssigneeQuickPickItem extends vscode.QuickPickItem {
  assigneeValue: string | VSSInterfaces.IdentityRef | undefined;
}

interface SprintQuickPickItem extends vscode.QuickPickItem {
  sprintValue: string | undefined;
}

function normalizeClassificationPath(path: string): string {
  return path.replace(/^\\/, "").replace(/\\$/, "");
}

function collectIterationPaths(node: WorkItemClassificationNode): string[] {
  const paths: string[] = [];
  if (node.children) {
    for (const child of node.children) {
      if (child.path) {
        paths.push(normalizeClassificationPath(child.path));
      }
      paths.push(...collectIterationPaths(child));
    }
  }
  return paths;
}

async function getWorkItemFromWorkItemItem(data: WorkItemItem, workItemTrackingService: WorkItemTrackingService) {
  if (data.workItem) {
    return data.workItem;
  }

  const workItem = await firstValueFrom(
    workItemTrackingService.workItem(data.workItemId, data.projectId, nowOrEarlier),
  );
  if (isException(workItem)) {
    vscode.window.showErrorMessage(`Failed to load work item: ${workItem.error.message}`);
    return;
  }
  return workItem;
}

export function workItemSetStateAction(container: Container) {
  return async (treeItem: TreeItem) => {
    if (treeItem instanceof WorkItemTreeItem) {
      const data: WorkItemItem = treeItem.data;
      const workItemId = data.workItemId;
      const projectId = data.projectId;

      const accountContextProvider = container.get<AccountContextProvider>(types.AccountContextProvider);

      const accountContainer = accountContextProvider.getAccountContainer(data.account.accountId);
      const workItemTrackingApi = await firstValueFrom(
        accountContainer.get<ApiService>(types.ApiService).workItemTrackingApi(),
      );

      if (isException(workItemTrackingApi)) {
        vscode.window.showErrorMessage(`Failed to get Work Item Tracking API: ${workItemTrackingApi.error.message}`);
        return;
      }

      const workItemTrackingService = accountContainer.get<WorkItemTrackingService>(types.WorkItemTrackingService);
      const workItem = await getWorkItemFromWorkItemItem(data, workItemTrackingService);
      if (workItem) {
        const workItemType = getWorkItemType(workItem);
        const currentState = getState(workItem);

        try {
          const stateDefinitions = await firstValueFrom(
            workItemTrackingService.workItemTypeStates(projectId, workItemType, nowOrEarlier),
          );

          if (isException(stateDefinitions)) {
            vscode.window.showErrorMessage(`Failed to load work item states: ${stateDefinitions.error.message}`);
            return;
          }

          const stateNames = [
            ...new Set(
              stateDefinitions
                .map(
                  (stateDefinition: { name?: string; state?: string }) => stateDefinition.name ?? stateDefinition.state,
                )
                .filter((stateName): stateName is string => typeof stateName === "string" && stateName.length > 0),
            ),
          ];

          if (stateNames.length === 0) {
            vscode.window.showErrorMessage(`No states found for work item type "${workItemType}"`);
            return;
          }

          if (!stateNames.includes(currentState)) {
            stateNames.push(currentState);
          }

          const stateItems: StateQuickPickItem[] = stateNames
            .sort((left, right) => {
              if (left === currentState) {
                return -1;
              }
              if (right === currentState) {
                return 1;
              }
              return left.localeCompare(right);
            })
            .map((state) => ({
              label: state,
              description: state === currentState ? "Current" : undefined,
              state,
            }));

          const selectedState = await vscode.window.showQuickPick(stateItems, {
            placeHolder: `Select new state for work item #${workItemId}`,
            title: `Set Work Item State: ${workItemId}`,
          });

          if (!selectedState || selectedState.state === currentState) {
            return;
          }

          const patchDocument = [
            {
              op: "add",
              path: `/fields/${WorkItemFieldSystemState}`,
              value: selectedState.state,
            },
          ];

          await workItemTrackingApi.updateWorkItem(undefined, patchDocument, workItemId, projectId);
          refreshRefreshable(data);
          vscode.window.showInformationMessage(`Work item #${workItemId} state changed to "${selectedState.state}"`);
        } catch (error) {
          vscode.window.showErrorMessage(
            `Failed to set work item state: ${error instanceof Error ? error.message : String(error)}`,
          );
        }
      }
    }
  };
}

export function workItemSetTitleAction(container: Container) {
  return async (treeItem: TreeItem) => {
    if (treeItem instanceof WorkItemTreeItem) {
      const data: WorkItemItem = treeItem.data;
      const workItemId = data.workItemId;
      const projectId = data.projectId;

      const accountContextProvider = container.get<AccountContextProvider>(types.AccountContextProvider);

      const accountContainer = accountContextProvider.getAccountContainer(data.account.accountId);

      const workItemTrackingApi = await firstValueFrom(
        accountContainer.get<ApiService>(types.ApiService).workItemTrackingApi(),
      );

      if (isException(workItemTrackingApi)) {
        vscode.window.showErrorMessage(`Failed to get Work Item Tracking API: ${workItemTrackingApi.error.message}`);
        return;
      }
      const workItem = await getWorkItemFromWorkItemItem(
        data,
        accountContainer.get<WorkItemTrackingService>(types.WorkItemTrackingService),
      );
      if (workItem) {
        const currentTitle = getTitle(workItem);

        const title = await vscode.window.showInputBox({
          prompt: "Enter new title",
          title: `Change Work Item Title: ${workItemId}`,
          value: currentTitle,
        });

        if (title === undefined || title === currentTitle) {
          return;
        }

        const patchDocument = [
          {
            op: "add",
            path: `/fields/${WorkItemFieldSystemTitle}`,
            value: title,
          },
        ];

        try {
          await workItemTrackingApi.updateWorkItem(undefined, patchDocument, workItemId, projectId);
          refreshRefreshable(data);
          vscode.window.showInformationMessage(`Work item #${workItemId} title updated`);
        } catch (error) {
          vscode.window.showErrorMessage(
            `Failed to set work item title: ${error instanceof Error ? error.message : String(error)}`,
          );
        }
      }
    }
  };
}

export function workItemSetEffortAction(container: Container) {
  return async (treeItem: TreeItem) => {
    if (treeItem instanceof WorkItemTreeItem) {
      const data: WorkItemItem = treeItem.data;
      const workItemId = data.workItemId;
      const projectId = data.projectId;

      const accountContextProvider = container.get<AccountContextProvider>(types.AccountContextProvider);

      const accountContainer = accountContextProvider.getAccountContainer(data.account.accountId);

      const workItemTrackingApi = await firstValueFrom(
        accountContainer.get<ApiService>(types.ApiService).workItemTrackingApi(),
      );

      if (isException(workItemTrackingApi)) {
        vscode.window.showErrorMessage(`Failed to get Work Item Tracking API: ${workItemTrackingApi.error.message}`);
        return;
      }
      const workItem = await getWorkItemFromWorkItemItem(
        data,
        accountContainer.get<WorkItemTrackingService>(types.WorkItemTrackingService),
      );
      if (workItem) {
        const currentEffort = getEffort(workItem);

        const effort = await vscode.window.showInputBox({
          prompt: "Enter effort",
          title: `Set Work Item Effort: ${workItemId}`,
          value: currentEffort !== undefined ? String(currentEffort) : "",
          validateInput: (input) => {
            if (input.trim().length === 0) {
              return undefined;
            }
            const parsed = Number.parseFloat(input);
            if (Number.isNaN(parsed)) {
              return "Please enter a valid number";
            }
            return undefined;
          },
        });

        if (effort === undefined) {
          return;
        }

        const effortValue = effort.trim().length === 0 ? undefined : Number.parseFloat(effort);
        if (effortValue === currentEffort) {
          return;
        }

        const patchDocument = [
          {
            op: "add",
            path: `/fields/${WorkItemFieldEffort}`,
            value: effortValue,
          },
        ];

        try {
          await workItemTrackingApi.updateWorkItem(undefined, patchDocument, workItemId, projectId);
          refreshRefreshable(data);
          vscode.window.showInformationMessage(`Work item #${workItemId} effort updated`);
        } catch (error) {
          vscode.window.showErrorMessage(
            `Failed to set work item effort: ${error instanceof Error ? error.message : String(error)}`,
          );
        }
      }
    }
  };
}

export function workItemSetAssignedToAction(container: Container) {
  return async (treeItem: TreeItem) => {
    if (treeItem instanceof WorkItemTreeItem) {
      const data: WorkItemItem = treeItem.data;
      const workItemId = data.workItemId;
      const projectId = data.projectId;

      const accountContextProvider = container.get<AccountContextProvider>(types.AccountContextProvider);

      const accountContainer = accountContextProvider.getAccountContainer(data.account.accountId);

      const workItemTrackingApi = await firstValueFrom(
        accountContainer.get<ApiService>(types.ApiService).workItemTrackingApi(),
      );

      if (isException(workItemTrackingApi)) {
        vscode.window.showErrorMessage(`Failed to get Work Item Tracking API: ${workItemTrackingApi.error.message}`);
        return;
      }
      const workItem = await getWorkItemFromWorkItemItem(
        data,
        accountContainer.get<WorkItemTrackingService>(types.WorkItemTrackingService),
      );
      if (workItem) {
        const currentAssignedTo = getAssignedTo(workItem) ?? "";

        let selectedItem: AssigneeQuickPickItem | undefined;

        const quickPick = vscode.window.createQuickPick<AssigneeQuickPickItem>();
        quickPick.busy = true;
        quickPick.placeholder = `Loading project members for work item #${workItemId}...`;
        quickPick.title = `Assign Work Item: ${workItemId}`;
        const disposables: vscode.Disposable[] = [];

        try {
          quickPick.show();

          const coreApi = await firstValueFrom(accountContainer.get<ApiService>(types.ApiService).coreApi());
          if (!isException(coreApi)) {
            const teams = await coreApi.getTeams(projectId, false, 1000);
            if (teams && teams.length > 0) {
              const memberLists = await Promise.all(
                teams.map(async (team) => {
                  try {
                    return await coreApi.getTeamMembersWithExtendedProperties(projectId, team.id!, 1000);
                  } catch {
                    return [];
                  }
                }),
              );

              const memberMap = new Map<string, VSSInterfaces.IdentityRef>();
              for (const members of memberLists) {
                for (const member of members) {
                  if (member.identity) {
                    const key = member.identity.id ?? member.identity.uniqueName ?? member.identity.displayName;
                    if (key && !memberMap.has(key)) {
                      memberMap.set(key, member.identity);
                    }
                  }
                }
              }

              const quickPickItems: AssigneeQuickPickItem[] = Array.from(memberMap.values())
                .map((identity) => ({
                  label: identity.displayName ?? identity.uniqueName ?? "Unknown",
                  description: identity.uniqueName,
                  assigneeValue: identity,
                }))
                .sort((left, right) => left.label.localeCompare(right.label));

              // Add current assignee if not already in the list
              if (currentAssignedTo && !quickPickItems.some((item) => item.label === currentAssignedTo)) {
                quickPickItems.unshift({
                  label: currentAssignedTo,
                  description: "Current",
                  assigneeValue: currentAssignedTo,
                });
              }

              // Add unassigned option at the top
              quickPickItems.unshift({
                label: "$(circle-slash) Unassigned",
                description: currentAssignedTo ? undefined : "Current",
                assigneeValue: undefined,
              });

              quickPick.items = quickPickItems;
              quickPick.busy = false;
              quickPick.placeholder = `Select assignee for work item #${workItemId}`;

              selectedItem = await new Promise<AssigneeQuickPickItem | undefined>((resolve) => {
                disposables.push(
                  quickPick.onDidAccept(() => {
                    resolve(quickPick.selectedItems[0]);
                    quickPick.hide();
                  }),
                );

                disposables.push(
                  quickPick.onDidHide(() => {
                    resolve(undefined);
                    quickPick.dispose();
                  }),
                );
              });
            }
          }
        } catch {
          // Fall through to input box fallback
        } finally {
          quickPick.hide();
          quickPick.dispose();
          disposables.forEach((d) => d.dispose());
        }

        if (!selectedItem) {
          const assignedTo = await vscode.window.showInputBox({
            prompt: "Enter assignee (name or email). Leave empty to unassign.",
            title: `Assign Work Item: ${workItemId}`,
            value: currentAssignedTo,
          });

          if (assignedTo === undefined) {
            return;
          }

          const assignedToValue = assignedTo.trim().length > 0 ? assignedTo.trim() : undefined;
          if (assignedToValue === currentAssignedTo || (assignedToValue === undefined && currentAssignedTo === "")) {
            return;
          }

          selectedItem = {
            label: assignedToValue ?? "",
            assigneeValue: assignedToValue,
          };
        } else {
          if (selectedItem.assigneeValue === undefined) {
            if (currentAssignedTo === "") {
              return;
            }
          } else if (typeof selectedItem.assigneeValue === "string") {
            if (selectedItem.assigneeValue === currentAssignedTo) {
              return;
            }
          } else if (selectedItem.assigneeValue.displayName === currentAssignedTo) {
            return;
          }
        }

        const patchDocument = [
          {
            op: "add",
            path: `/fields/${WorkItemFieldSystemAssignedTo}`,
            value: selectedItem.assigneeValue,
          },
        ];

        try {
          await workItemTrackingApi.updateWorkItem(undefined, patchDocument, workItemId, projectId);
          refreshRefreshable(data);
          vscode.window.showInformationMessage(`Work item #${workItemId} assignee updated`);
        } catch (error) {
          vscode.window.showErrorMessage(
            `Failed to assign work item: ${error instanceof Error ? error.message : String(error)}`,
          );
        }
      }
    }
  };
}

export function workItemSetSprintAction(container: Container) {
  return async (treeItem: TreeItem) => {
    if (treeItem instanceof WorkItemTreeItem) {
      const data: WorkItemItem = treeItem.data;
      const workItemId = data.workItemId;
      const projectId = data.projectId;

      const accountContextProvider = container.get<AccountContextProvider>(types.AccountContextProvider);

      const accountContainer = accountContextProvider.getAccountContainer(data.account.accountId);

      const workItemTrackingApi = await firstValueFrom(
        accountContainer.get<ApiService>(types.ApiService).workItemTrackingApi(),
      );

      if (isException(workItemTrackingApi)) {
        vscode.window.showErrorMessage(`Failed to get Work Item Tracking API: ${workItemTrackingApi.error.message}`);
        return;
      }
      const workItem = await getWorkItemFromWorkItemItem(
        data,
        accountContainer.get<WorkItemTrackingService>(types.WorkItemTrackingService),
      );
      if (workItem) {
        const currentIterationPath = getIterationPath(workItem);

        let selectedItem: SprintQuickPickItem | undefined;

        const quickPick = vscode.window.createQuickPick<SprintQuickPickItem>();
        quickPick.busy = true;
        quickPick.placeholder = `Loading project sprints for work item #${workItemId}...`;
        quickPick.title = `Set Work Item Sprint: ${workItemId}`;
        const disposables: vscode.Disposable[] = [];

        try {
          quickPick.show();

          const classificationNode = await workItemTrackingApi.getClassificationNode(
            projectId,
            TreeStructureGroup.Iterations,
            undefined,
            10,
          );

          if (classificationNode) {
            const iterationPaths = collectIterationPaths(classificationNode);

            const quickPickItems: SprintQuickPickItem[] = iterationPaths
              .map((path) => ({
                label: path,
                description: path === currentIterationPath ? "Current" : undefined,
                sprintValue: path,
              }))
              .sort((left, right) => left.label.localeCompare(right.label));

            quickPickItems.unshift({
              label: "$(circle-slash) Clear Sprint",
              description: currentIterationPath === "" ? "Current" : undefined,
              sprintValue: undefined,
            });

            quickPick.items = quickPickItems;
            quickPick.busy = false;
            quickPick.placeholder = `Select sprint for work item #${workItemId}`;

            selectedItem = await new Promise<SprintQuickPickItem | undefined>((resolve) => {
              disposables.push(
                quickPick.onDidAccept(() => {
                  resolve(quickPick.selectedItems[0]);
                  quickPick.hide();
                }),
              );

              disposables.push(
                quickPick.onDidHide(() => {
                  resolve(undefined);
                  quickPick.dispose();
                }),
              );
            });
          }
        } catch {
          // Fall through to input box fallback
        } finally {
          quickPick.hide();
          quickPick.dispose();
          disposables.forEach((d) => d.dispose());
        }

        if (!selectedItem) {
          const iterationPath = await vscode.window.showInputBox({
            prompt: "Enter iteration path (e.g., Project\\Sprint 1). Leave empty to clear.",
            title: `Set Work Item Sprint: ${workItemId}`,
            value: currentIterationPath,
          });

          if (iterationPath === undefined) {
            return;
          }

          const iterationPathValue = iterationPath.trim().length > 0 ? iterationPath.trim() : undefined;
          if (
            iterationPathValue === currentIterationPath ||
            (iterationPathValue === undefined && currentIterationPath === "")
          ) {
            return;
          }

          selectedItem = {
            label: iterationPathValue ?? "",
            sprintValue: iterationPathValue,
          };
        } else {
          const sprintValue = selectedItem.sprintValue;
          if (sprintValue === currentIterationPath || (sprintValue === undefined && currentIterationPath === "")) {
            return;
          }
        }

        const patchDocument = [
          {
            op: "add",
            path: `/fields/${WorkItemFieldSystemIterationPath}`,
            value: selectedItem.sprintValue,
          },
        ];

        try {
          await workItemTrackingApi.updateWorkItem(undefined, patchDocument, workItemId, projectId);
          refreshRefreshable(data);
          vscode.window.showInformationMessage(`Work item #${workItemId} sprint updated`);
        } catch (error) {
          vscode.window.showErrorMessage(
            `Failed to set work item sprint: ${error instanceof Error ? error.message : String(error)}`,
          );
        }
      }
    }
  };
}

export async function workItemCopyIdAction(treeItem: TreeItem) {
  if (treeItem instanceof WorkItemTreeItem) {
    const data: WorkItemItem = treeItem.data;
    const workItemId = data.workItemId;
    await vscode.env.clipboard.writeText(String(workItemId));
    vscode.window.showInformationMessage(`Copied work item #${workItemId} to clipboard`);
  }
}
