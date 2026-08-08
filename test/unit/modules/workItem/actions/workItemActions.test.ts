import { beforeEach, describe, expect, test, vi } from "vitest";
import { Container } from "inversify";
import vscode from "vscode";
import { of } from "rxjs";
import { ApiService } from "../../../../../src/generated/ApiService";
import { WorkItemTrackingService } from "../../../../../src/generated/services";
import { types } from "../../../../../src/generated/types";
import { createException } from "../../../../../src/common/Exception";
import { refreshRefreshable } from "../../../../../src/common/items/RefreshableItem";
import { AccountContextProvider } from "../../../../../src/modules/core/AccountContextProvider";
import { Account } from "../../../../../src/modules/core/account";
import { createProjectItem as createProjectItemFactory } from "../../../../../src/modules/core/items/ProjectItem";
import {
  workItemCopyIdAction,
  workItemSetAssignedToAction,
  workItemSetEffortAction,
  workItemSetSprintAction,
  workItemSetStateAction,
  workItemSetTitleAction,
} from "../../../../../src/modules/workItem/actions/workItemActions";
import {
  createWorkItemItem as createWorkItemItemFactory,
  WorkItemItem,
} from "../../../../../src/modules/workItem/items/WorkItemItem";
import { WorkItemTreeItem } from "../../../../../src/modules/workItem/treeItems/WorkItemTreeItem";

vi.mock("../../../../../src/common/items/RefreshableItem", () => ({
  refreshRefreshable: vi.fn(),
}));

let container: Container;
let accountContainer: Container;
let accountContextProvider: AccountContextProvider;
let apiService: ApiService;
let workItemTrackingService: WorkItemTrackingService;
let workItemTrackingApi: {
  updateWorkItem: ReturnType<typeof vi.fn>;
  getClassificationNode: ReturnType<typeof vi.fn>;
};

beforeEach(() => {
  vi.clearAllMocks();
  container = new Container();
  accountContainer = new Container();

  workItemTrackingApi = {
    updateWorkItem: vi.fn().mockResolvedValue(undefined),
    getClassificationNode: vi.fn().mockRejectedValue(new Error("No classification API")),
  };

  workItemTrackingService = {
    workItemTypeStates: vi.fn(),
  } as any;

  apiService = {
    workItemTrackingApi: vi.fn().mockReturnValue(of(workItemTrackingApi)),
    coreApi: vi.fn().mockReturnValue(of(createException(new Error("No core API")))),
  } as any;

  accountContextProvider = {
    getAccountContainer: vi.fn().mockReturnValue(accountContainer),
  } as any;

  accountContainer.bind(types.ApiService).toConstantValue(apiService);
  accountContainer.bind(types.WorkItemTrackingService).toConstantValue(workItemTrackingService);
  container.bind(types.AccountContextProvider).toConstantValue(accountContextProvider);
});

function createWorkItemItem(state: string, extraFields: Record<string, unknown> = {}): WorkItemItem {
  const account: Account = {
    accountId: "account-1",
    url: "https://dev.azure.com/org",
    organization: "org",
    personalAccessToken: "pat",
  };

  const projectItem = createProjectItemFactory(
    { account, container: new Container(), refreshObservables: {} },
    { id: "project-1", name: "Project" },
    {},
  );

  return createWorkItemItemFactory(
    projectItem,
    123,
    {
      id: 123,
      fields: {
        "System.Title": "My work item",
        "System.WorkItemType": "Bug",
        "System.State": state,
        ...extraFields,
      },
    } as any,
    undefined,
    {},
  );
}

function createTreeItem(data: WorkItemItem): WorkItemTreeItem {
  const treeItem = new WorkItemTreeItem();
  treeItem.updateFrom(data);
  return treeItem;
}

describe("workItemSetStateAction", () => {
  test("updates work item state after selection", async () => {
    const treeItem = createTreeItem(createWorkItemItem("Active"));

    vi.mocked(workItemTrackingService.workItemTypeStates as any).mockReturnValue(
      of([{ name: "New" }, { name: "Closed" }, { name: "Active" }]),
    );

    vi.mocked(vscode.window.showQuickPick).mockResolvedValue({
      label: "Closed",
      state: "Closed",
    } as any);

    const action = workItemSetStateAction(container);
    await action(treeItem);

    const [stateItems] = vi.mocked(vscode.window.showQuickPick).mock.calls[0];
    expect((stateItems as unknown as Array<{ state: string }>)[0].state).toBe("Active");

    expect(workItemTrackingApi.updateWorkItem).toHaveBeenCalledWith(
      undefined,
      [
        {
          op: "add",
          path: "/fields/System.State",
          value: "Closed",
        },
      ],
      123,
      "project-1",
    );

    expect(refreshRefreshable).toHaveBeenCalledWith(treeItem.data);
    expect(vscode.window.showInformationMessage).toHaveBeenCalledWith('Work item #123 state changed to "Closed"');
  });

  test("does nothing when user cancels selection", async () => {
    const treeItem = createTreeItem(createWorkItemItem("Active"));

    vi.mocked(workItemTrackingService.workItemTypeStates as any).mockReturnValue(
      of([{ name: "Active" }, { name: "Closed" }]),
    );
    vi.mocked(vscode.window.showQuickPick).mockResolvedValue(undefined);

    const action = workItemSetStateAction(container);
    await action(treeItem);

    expect(workItemTrackingApi.updateWorkItem).not.toHaveBeenCalled();
    expect(refreshRefreshable).not.toHaveBeenCalled();
  });

  test("does nothing when selected state is unchanged", async () => {
    const treeItem = createTreeItem(createWorkItemItem("Active"));

    vi.mocked(workItemTrackingService.workItemTypeStates as any).mockReturnValue(
      of([{ name: "Active" }, { name: "Closed" }]),
    );
    vi.mocked(vscode.window.showQuickPick).mockResolvedValue({
      label: "Active",
      state: "Active",
    } as any);

    const action = workItemSetStateAction(container);
    await action(treeItem);

    expect(workItemTrackingApi.updateWorkItem).not.toHaveBeenCalled();
    expect(refreshRefreshable).not.toHaveBeenCalled();
  });

  test("shows error when work item tracking api cannot be loaded", async () => {
    const treeItem = createTreeItem(createWorkItemItem("Active"));

    vi.mocked(apiService.workItemTrackingApi as any).mockReturnValue(of(createException(new Error("No API"))));

    const action = workItemSetStateAction(container);
    await action(treeItem);

    expect(vscode.window.showErrorMessage).toHaveBeenCalledWith("Failed to get Work Item Tracking API: No API");
    expect(workItemTrackingApi.updateWorkItem).not.toHaveBeenCalled();
  });

  test("shows error when state lookup fails", async () => {
    const treeItem = createTreeItem(createWorkItemItem("Active"));

    vi.mocked(workItemTrackingService.workItemTypeStates as any).mockReturnValue(
      of(createException(new Error("No states"))),
    );

    const action = workItemSetStateAction(container);
    await action(treeItem);

    expect(vscode.window.showErrorMessage).toHaveBeenCalledWith("Failed to load work item states: No states");
    expect(workItemTrackingApi.updateWorkItem).not.toHaveBeenCalled();
  });

  test("does nothing when tree item type does not match", async () => {
    const action = workItemSetStateAction(container);
    await action({} as any);

    expect(vscode.window.showQuickPick).not.toHaveBeenCalled();
    expect(workItemTrackingApi.updateWorkItem).not.toHaveBeenCalled();
  });
});

describe("workItemSetTitleAction", () => {
  test("updates work item title after input", async () => {
    const treeItem = createTreeItem(createWorkItemItem("Active"));

    vi.mocked(vscode.window.showInputBox).mockResolvedValue("New title");

    const action = workItemSetTitleAction(container);
    await action(treeItem);

    expect(vscode.window.showInputBox).toHaveBeenCalledWith({
      prompt: "Enter new title",
      title: "Change Work Item Title: 123",
      value: "My work item",
    });

    expect(workItemTrackingApi.updateWorkItem).toHaveBeenCalledWith(
      undefined,
      [
        {
          op: "add",
          path: "/fields/System.Title",
          value: "New title",
        },
      ],
      123,
      "project-1",
    );

    expect(refreshRefreshable).toHaveBeenCalledWith(treeItem.data);
    expect(vscode.window.showInformationMessage).toHaveBeenCalledWith("Work item #123 title updated");
  });

  test("does nothing when user cancels input", async () => {
    const treeItem = createTreeItem(createWorkItemItem("Active"));

    vi.mocked(vscode.window.showInputBox).mockResolvedValue(undefined);

    const action = workItemSetTitleAction(container);
    await action(treeItem);

    expect(workItemTrackingApi.updateWorkItem).not.toHaveBeenCalled();
    expect(refreshRefreshable).not.toHaveBeenCalled();
  });

  test("does nothing when title is unchanged", async () => {
    const treeItem = createTreeItem(createWorkItemItem("Active"));

    vi.mocked(vscode.window.showInputBox).mockResolvedValue("My work item");

    const action = workItemSetTitleAction(container);
    await action(treeItem);

    expect(workItemTrackingApi.updateWorkItem).not.toHaveBeenCalled();
    expect(refreshRefreshable).not.toHaveBeenCalled();
  });

  test("shows error when work item tracking api cannot be loaded", async () => {
    const treeItem = createTreeItem(createWorkItemItem("Active"));

    vi.mocked(apiService.workItemTrackingApi as any).mockReturnValue(of(createException(new Error("No API"))));

    const action = workItemSetTitleAction(container);
    await action(treeItem);

    expect(vscode.window.showErrorMessage).toHaveBeenCalledWith("Failed to get Work Item Tracking API: No API");
    expect(workItemTrackingApi.updateWorkItem).not.toHaveBeenCalled();
  });

  test("does nothing when tree item type does not match", async () => {
    const action = workItemSetTitleAction(container);
    await action({} as any);

    expect(vscode.window.showInputBox).not.toHaveBeenCalled();
    expect(workItemTrackingApi.updateWorkItem).not.toHaveBeenCalled();
  });
});

describe("workItemSetEffortAction", () => {
  test("updates work item effort after input", async () => {
    const treeItem = createTreeItem(createWorkItemItem("Active", { "Microsoft.VSTS.Scheduling.Effort": 5 }));

    vi.mocked(vscode.window.showInputBox).mockResolvedValue("8");

    const action = workItemSetEffortAction(container);
    await action(treeItem);

    expect(vscode.window.showInputBox).toHaveBeenCalledWith(
      expect.objectContaining({
        prompt: "Enter effort",
        title: "Set Work Item Effort: 123",
        value: "5",
      }),
    );

    expect(workItemTrackingApi.updateWorkItem).toHaveBeenCalledWith(
      undefined,
      [
        {
          op: "add",
          path: "/fields/Microsoft.VSTS.Scheduling.Effort",
          value: 8,
        },
      ],
      123,
      "project-1",
    );

    expect(refreshRefreshable).toHaveBeenCalledWith(treeItem.data);
    expect(vscode.window.showInformationMessage).toHaveBeenCalledWith("Work item #123 effort updated");
  });

  test("clears effort when empty string is entered", async () => {
    const treeItem = createTreeItem(createWorkItemItem("Active", { "Microsoft.VSTS.Scheduling.Effort": 5 }));

    vi.mocked(vscode.window.showInputBox).mockResolvedValue("");

    const action = workItemSetEffortAction(container);
    await action(treeItem);

    expect(workItemTrackingApi.updateWorkItem).toHaveBeenCalledWith(
      undefined,
      [
        {
          op: "add",
          path: "/fields/Microsoft.VSTS.Scheduling.Effort",
          value: undefined,
        },
      ],
      123,
      "project-1",
    );

    expect(refreshRefreshable).toHaveBeenCalledWith(treeItem.data);
  });

  test("does nothing when user cancels input", async () => {
    const treeItem = createTreeItem(createWorkItemItem("Active"));

    vi.mocked(vscode.window.showInputBox).mockResolvedValue(undefined);

    const action = workItemSetEffortAction(container);
    await action(treeItem);

    expect(workItemTrackingApi.updateWorkItem).not.toHaveBeenCalled();
    expect(refreshRefreshable).not.toHaveBeenCalled();
  });

  test("does nothing when effort is unchanged", async () => {
    const treeItem = createTreeItem(createWorkItemItem("Active", { "Microsoft.VSTS.Scheduling.Effort": 5 }));

    vi.mocked(vscode.window.showInputBox).mockResolvedValue("5");

    const action = workItemSetEffortAction(container);
    await action(treeItem);

    expect(workItemTrackingApi.updateWorkItem).not.toHaveBeenCalled();
    expect(refreshRefreshable).not.toHaveBeenCalled();
  });

  test("shows error when work item tracking api cannot be loaded", async () => {
    const treeItem = createTreeItem(createWorkItemItem("Active"));

    vi.mocked(apiService.workItemTrackingApi as any).mockReturnValue(of(createException(new Error("No API"))));

    const action = workItemSetEffortAction(container);
    await action(treeItem);

    expect(vscode.window.showErrorMessage).toHaveBeenCalledWith("Failed to get Work Item Tracking API: No API");
    expect(workItemTrackingApi.updateWorkItem).not.toHaveBeenCalled();
  });

  test("does nothing when tree item type does not match", async () => {
    const action = workItemSetEffortAction(container);
    await action({} as any);

    expect(vscode.window.showInputBox).not.toHaveBeenCalled();
    expect(workItemTrackingApi.updateWorkItem).not.toHaveBeenCalled();
  });
});

describe("workItemSetAssignedToAction", () => {
  test("updates assigned to after input", async () => {
    const treeItem = createTreeItem(
      createWorkItemItem("Active", {
        "System.AssignedTo": { displayName: "John Doe", uniqueName: "john@example.com" },
      }),
    );

    vi.mocked(vscode.window.showInputBox).mockResolvedValue("Jane Doe");

    const action = workItemSetAssignedToAction(container);
    await action(treeItem);

    expect(vscode.window.createQuickPick).toHaveBeenCalled();
    expect(vscode.window.showInputBox).toHaveBeenCalledWith({
      prompt: "Enter assignee (name or email). Leave empty to unassign.",
      title: "Assign Work Item: 123",
      value: "John Doe",
    });

    expect(workItemTrackingApi.updateWorkItem).toHaveBeenCalledWith(
      undefined,
      [
        {
          op: "add",
          path: "/fields/System.AssignedTo",
          value: "Jane Doe",
        },
      ],
      123,
      "project-1",
    );

    expect(refreshRefreshable).toHaveBeenCalledWith(treeItem.data);
    expect(vscode.window.showInformationMessage).toHaveBeenCalledWith("Work item #123 assignee updated");
  });

  test("unassigns when empty string is entered", async () => {
    const treeItem = createTreeItem(
      createWorkItemItem("Active", {
        "System.AssignedTo": { displayName: "John Doe", uniqueName: "john@example.com" },
      }),
    );

    vi.mocked(vscode.window.showInputBox).mockResolvedValue("");

    const action = workItemSetAssignedToAction(container);
    await action(treeItem);

    expect(vscode.window.createQuickPick).toHaveBeenCalled();
    expect(workItemTrackingApi.updateWorkItem).toHaveBeenCalledWith(
      undefined,
      [
        {
          op: "add",
          path: "/fields/System.AssignedTo",
          value: undefined,
        },
      ],
      123,
      "project-1",
    );

    expect(refreshRefreshable).toHaveBeenCalledWith(treeItem.data);
  });

  test("does nothing when user cancels input", async () => {
    const treeItem = createTreeItem(createWorkItemItem("Active"));

    vi.mocked(vscode.window.showInputBox).mockResolvedValue(undefined);

    const action = workItemSetAssignedToAction(container);
    await action(treeItem);

    expect(vscode.window.createQuickPick).toHaveBeenCalled();
    expect(workItemTrackingApi.updateWorkItem).not.toHaveBeenCalled();
    expect(refreshRefreshable).not.toHaveBeenCalled();
  });

  test("does nothing when assigned to is unchanged", async () => {
    const treeItem = createTreeItem(
      createWorkItemItem("Active", {
        "System.AssignedTo": { displayName: "John Doe", uniqueName: "john@example.com" },
      }),
    );

    vi.mocked(vscode.window.showInputBox).mockResolvedValue("John Doe");

    const action = workItemSetAssignedToAction(container);
    await action(treeItem);

    expect(vscode.window.createQuickPick).toHaveBeenCalled();
    expect(workItemTrackingApi.updateWorkItem).not.toHaveBeenCalled();
    expect(refreshRefreshable).not.toHaveBeenCalled();
  });

  test("shows error when work item tracking api cannot be loaded", async () => {
    const treeItem = createTreeItem(createWorkItemItem("Active"));

    vi.mocked(apiService.workItemTrackingApi as any).mockReturnValue(of(createException(new Error("No API"))));

    const action = workItemSetAssignedToAction(container);
    await action(treeItem);

    expect(vscode.window.showErrorMessage).toHaveBeenCalledWith("Failed to get Work Item Tracking API: No API");
    expect(workItemTrackingApi.updateWorkItem).not.toHaveBeenCalled();
  });

  test("updates assigned to after quick pick selection", async () => {
    const coreApi = {
      getTeams: vi.fn().mockResolvedValue([{ id: "team-1", name: "Team 1" }]),
      getTeamMembersWithExtendedProperties: vi.fn().mockResolvedValue([
        {
          identity: { id: "user-1", displayName: "Jane Doe", uniqueName: "jane@example.com" },
          isTeamAdmin: false,
        },
      ]),
    };
    vi.mocked(apiService.coreApi as any).mockReturnValue(of(coreApi));

    const treeItem = createTreeItem(
      createWorkItemItem("Active", {
        "System.AssignedTo": { displayName: "John Doe", uniqueName: "john@example.com" },
      }),
    );

    const action = workItemSetAssignedToAction(container);
    const actionPromise = action(treeItem);

    await new Promise((r) => setTimeout(r, 0));

    const quickPick = vi.mocked(vscode.window.createQuickPick).mock.results[0].value;
    expect(quickPick.busy).toBe(false);
    expect(quickPick.items[0].label).toBe("$(circle-slash) Unassigned");
    expect(quickPick.items[1].label).toBe("John Doe");
    expect(quickPick.items[2].label).toBe("Jane Doe");

    quickPick.selectedItems = [
      {
        label: "Jane Doe",
        description: "jane@example.com",
        assigneeValue: { id: "user-1", displayName: "Jane Doe", uniqueName: "jane@example.com" },
      },
    ];
    quickPick._fireDidAccept();

    await actionPromise;

    expect(workItemTrackingApi.updateWorkItem).toHaveBeenCalledWith(
      undefined,
      [
        {
          op: "add",
          path: "/fields/System.AssignedTo",
          value: { id: "user-1", displayName: "Jane Doe", uniqueName: "jane@example.com" },
        },
      ],
      123,
      "project-1",
    );

    expect(refreshRefreshable).toHaveBeenCalledWith(treeItem.data);
    expect(vscode.window.showInformationMessage).toHaveBeenCalledWith("Work item #123 assignee updated");
  });

  test("does nothing when user cancels quick pick", async () => {
    const coreApi = {
      getTeams: vi.fn().mockResolvedValue([{ id: "team-1", name: "Team 1" }]),
      getTeamMembersWithExtendedProperties: vi.fn().mockResolvedValue([]),
    };
    vi.mocked(apiService.coreApi as any).mockReturnValue(of(coreApi));

    const treeItem = createTreeItem(createWorkItemItem("Active"));

    vi.mocked(vscode.window.showInputBox).mockResolvedValue(undefined);

    const action = workItemSetAssignedToAction(container);
    const actionPromise = action(treeItem);

    await new Promise((r) => setTimeout(r, 0));

    const quickPick = vi.mocked(vscode.window.createQuickPick).mock.results[0].value;
    quickPick._fireDidHide();

    await actionPromise;

    expect(workItemTrackingApi.updateWorkItem).not.toHaveBeenCalled();
    expect(refreshRefreshable).not.toHaveBeenCalled();
  });

  test("unassigns when unassigned is selected in quick pick", async () => {
    const coreApi = {
      getTeams: vi.fn().mockResolvedValue([{ id: "team-1", name: "Team 1" }]),
      getTeamMembersWithExtendedProperties: vi.fn().mockResolvedValue([
        {
          identity: { id: "user-1", displayName: "Jane Doe", uniqueName: "jane@example.com" },
          isTeamAdmin: false,
        },
      ]),
    };
    vi.mocked(apiService.coreApi as any).mockReturnValue(of(coreApi));

    const treeItem = createTreeItem(
      createWorkItemItem("Active", {
        "System.AssignedTo": { displayName: "John Doe", uniqueName: "john@example.com" },
      }),
    );

    const action = workItemSetAssignedToAction(container);
    const actionPromise = action(treeItem);

    await new Promise((r) => setTimeout(r, 0));

    const quickPick = vi.mocked(vscode.window.createQuickPick).mock.results[0].value;
    quickPick.selectedItems = [
      {
        label: "$(circle-slash) Unassigned",
        assigneeValue: undefined,
      },
    ];
    quickPick._fireDidAccept();

    await actionPromise;

    expect(workItemTrackingApi.updateWorkItem).toHaveBeenCalledWith(
      undefined,
      [
        {
          op: "add",
          path: "/fields/System.AssignedTo",
          value: undefined,
        },
      ],
      123,
      "project-1",
    );

    expect(refreshRefreshable).toHaveBeenCalledWith(treeItem.data);
  });

  test("does nothing when current assignee is reselected in quick pick", async () => {
    const coreApi = {
      getTeams: vi.fn().mockResolvedValue([{ id: "team-1", name: "Team 1" }]),
      getTeamMembersWithExtendedProperties: vi.fn().mockResolvedValue([
        {
          identity: { id: "user-1", displayName: "John Doe", uniqueName: "john@example.com" },
          isTeamAdmin: false,
        },
      ]),
    };
    vi.mocked(apiService.coreApi as any).mockReturnValue(of(coreApi));

    const treeItem = createTreeItem(
      createWorkItemItem("Active", {
        "System.AssignedTo": { displayName: "John Doe", uniqueName: "john@example.com" },
      }),
    );

    const action = workItemSetAssignedToAction(container);
    const actionPromise = action(treeItem);

    await new Promise((r) => setTimeout(r, 0));

    const quickPick = vi.mocked(vscode.window.createQuickPick).mock.results[0].value;
    quickPick.selectedItems = [
      {
        label: "John Doe",
        description: "john@example.com",
        assigneeValue: { id: "user-1", displayName: "John Doe", uniqueName: "john@example.com" },
      },
    ];
    quickPick._fireDidAccept();

    await actionPromise;

    expect(workItemTrackingApi.updateWorkItem).not.toHaveBeenCalled();
    expect(refreshRefreshable).not.toHaveBeenCalled();
  });

  test("falls back to input box when teams api fails", async () => {
    const coreApi = {
      getTeams: vi.fn().mockRejectedValue(new Error("Teams API error")),
      getTeamMembersWithExtendedProperties: vi.fn(),
    };
    vi.mocked(apiService.coreApi as any).mockReturnValue(of(coreApi));

    const treeItem = createTreeItem(createWorkItemItem("Active"));

    vi.mocked(vscode.window.showInputBox).mockResolvedValue("Jane Doe");

    const action = workItemSetAssignedToAction(container);
    await action(treeItem);

    expect(vscode.window.createQuickPick).toHaveBeenCalled();
    expect(vscode.window.showInputBox).toHaveBeenCalledWith({
      prompt: "Enter assignee (name or email). Leave empty to unassign.",
      title: "Assign Work Item: 123",
      value: "",
    });

    expect(workItemTrackingApi.updateWorkItem).toHaveBeenCalledWith(
      undefined,
      [
        {
          op: "add",
          path: "/fields/System.AssignedTo",
          value: "Jane Doe",
        },
      ],
      123,
      "project-1",
    );
  });

  test("does nothing when tree item type does not match", async () => {
    const action = workItemSetAssignedToAction(container);
    await action({} as any);

    expect(vscode.window.createQuickPick).not.toHaveBeenCalled();
    expect(vscode.window.showInputBox).not.toHaveBeenCalled();
    expect(workItemTrackingApi.updateWorkItem).not.toHaveBeenCalled();
  });
});

describe("workItemSetSprintAction", () => {
  test("updates iteration path after input", async () => {
    const treeItem = createTreeItem(createWorkItemItem("Active", { "System.IterationPath": "Project\\Sprint 1" }));

    vi.mocked(vscode.window.showInputBox).mockResolvedValue("Project\\Sprint 2");

    const action = workItemSetSprintAction(container);
    await action(treeItem);

    expect(vscode.window.createQuickPick).toHaveBeenCalled();
    expect(vscode.window.showInputBox).toHaveBeenCalledWith({
      prompt: "Enter iteration path (e.g., Project\\Sprint 1). Leave empty to clear.",
      title: "Set Work Item Sprint: 123",
      value: "Project\\Sprint 1",
    });

    expect(workItemTrackingApi.updateWorkItem).toHaveBeenCalledWith(
      undefined,
      [
        {
          op: "add",
          path: "/fields/System.IterationPath",
          value: "Project\\Sprint 2",
        },
      ],
      123,
      "project-1",
    );

    expect(refreshRefreshable).toHaveBeenCalledWith(treeItem.data);
    expect(vscode.window.showInformationMessage).toHaveBeenCalledWith("Work item #123 sprint updated");
  });

  test("clears sprint when empty string is entered", async () => {
    const treeItem = createTreeItem(createWorkItemItem("Active", { "System.IterationPath": "Project\\Sprint 1" }));

    vi.mocked(vscode.window.showInputBox).mockResolvedValue("");

    const action = workItemSetSprintAction(container);
    await action(treeItem);

    expect(vscode.window.createQuickPick).toHaveBeenCalled();
    expect(workItemTrackingApi.updateWorkItem).toHaveBeenCalledWith(
      undefined,
      [
        {
          op: "add",
          path: "/fields/System.IterationPath",
          value: undefined,
        },
      ],
      123,
      "project-1",
    );

    expect(refreshRefreshable).toHaveBeenCalledWith(treeItem.data);
  });

  test("does nothing when user cancels input", async () => {
    const treeItem = createTreeItem(createWorkItemItem("Active"));

    vi.mocked(vscode.window.showInputBox).mockResolvedValue(undefined);

    const action = workItemSetSprintAction(container);
    await action(treeItem);

    expect(vscode.window.createQuickPick).toHaveBeenCalled();
    expect(workItemTrackingApi.updateWorkItem).not.toHaveBeenCalled();
    expect(refreshRefreshable).not.toHaveBeenCalled();
  });

  test("does nothing when iteration path is unchanged", async () => {
    const treeItem = createTreeItem(createWorkItemItem("Active", { "System.IterationPath": "Project\\Sprint 1" }));

    vi.mocked(vscode.window.showInputBox).mockResolvedValue("Project\\Sprint 1");

    const action = workItemSetSprintAction(container);
    await action(treeItem);

    expect(vscode.window.createQuickPick).toHaveBeenCalled();
    expect(workItemTrackingApi.updateWorkItem).not.toHaveBeenCalled();
    expect(refreshRefreshable).not.toHaveBeenCalled();
  });

  test("shows error when work item tracking api cannot be loaded", async () => {
    const treeItem = createTreeItem(createWorkItemItem("Active"));

    vi.mocked(apiService.workItemTrackingApi as any).mockReturnValue(of(createException(new Error("No API"))));

    const action = workItemSetSprintAction(container);
    await action(treeItem);

    expect(vscode.window.showErrorMessage).toHaveBeenCalledWith("Failed to get Work Item Tracking API: No API");
    expect(workItemTrackingApi.updateWorkItem).not.toHaveBeenCalled();
  });

  test("updates sprint after quick pick selection", async () => {
    vi.mocked(workItemTrackingApi.getClassificationNode as any).mockResolvedValue({
      path: "\\Project\\",
      children: [{ path: "\\Project\\Sprint 1\\" }, { path: "\\Project\\Sprint 2\\" }],
    });

    const treeItem = createTreeItem(createWorkItemItem("Active", { "System.IterationPath": "Project\\Sprint 1" }));

    const action = workItemSetSprintAction(container);
    const actionPromise = action(treeItem);

    await new Promise((r) => setTimeout(r, 0));

    const quickPick = vi.mocked(vscode.window.createQuickPick).mock.results[0].value;
    expect(quickPick.busy).toBe(false);
    expect(quickPick.items[0].label).toBe("$(circle-slash) Clear Sprint");
    expect(quickPick.items[1].label).toBe("Project\\Sprint 1");
    expect(quickPick.items[2].label).toBe("Project\\Sprint 2");
    expect(quickPick.items[1].description).toBe("Current");

    quickPick.selectedItems = [
      {
        label: "Project\\Sprint 2",
        sprintValue: "Project\\Sprint 2",
      },
    ];
    quickPick._fireDidAccept();

    await actionPromise;

    expect(workItemTrackingApi.updateWorkItem).toHaveBeenCalledWith(
      undefined,
      [
        {
          op: "add",
          path: "/fields/System.IterationPath",
          value: "Project\\Sprint 2",
        },
      ],
      123,
      "project-1",
    );

    expect(refreshRefreshable).toHaveBeenCalledWith(treeItem.data);
    expect(vscode.window.showInformationMessage).toHaveBeenCalledWith("Work item #123 sprint updated");
  });

  test("does nothing when user cancels quick pick", async () => {
    vi.mocked(workItemTrackingApi.getClassificationNode as any).mockResolvedValue({
      path: "\\Project\\",
      children: [{ path: "\\Project\\Sprint 1\\" }],
    });

    const treeItem = createTreeItem(createWorkItemItem("Active", { "System.IterationPath": "Project\\Sprint 1" }));

    vi.mocked(vscode.window.showInputBox).mockResolvedValue(undefined);

    const action = workItemSetSprintAction(container);
    const actionPromise = action(treeItem);

    await new Promise((r) => setTimeout(r, 0));

    const quickPick = vi.mocked(vscode.window.createQuickPick).mock.results[0].value;
    quickPick._fireDidHide();

    await actionPromise;

    expect(workItemTrackingApi.updateWorkItem).not.toHaveBeenCalled();
    expect(refreshRefreshable).not.toHaveBeenCalled();
  });

  test("clears sprint when clear sprint is selected in quick pick", async () => {
    vi.mocked(workItemTrackingApi.getClassificationNode as any).mockResolvedValue({
      path: "\\Project\\",
      children: [{ path: "\\Project\\Sprint 1\\" }],
    });

    const treeItem = createTreeItem(createWorkItemItem("Active", { "System.IterationPath": "Project\\Sprint 1" }));

    const action = workItemSetSprintAction(container);
    const actionPromise = action(treeItem);

    await new Promise((r) => setTimeout(r, 0));

    const quickPick = vi.mocked(vscode.window.createQuickPick).mock.results[0].value;
    quickPick.selectedItems = [
      {
        label: "$(circle-slash) Clear Sprint",
        sprintValue: undefined,
      },
    ];
    quickPick._fireDidAccept();

    await actionPromise;

    expect(workItemTrackingApi.updateWorkItem).toHaveBeenCalledWith(
      undefined,
      [
        {
          op: "add",
          path: "/fields/System.IterationPath",
          value: undefined,
        },
      ],
      123,
      "project-1",
    );

    expect(refreshRefreshable).toHaveBeenCalledWith(treeItem.data);
  });

  test("does nothing when current sprint is reselected in quick pick", async () => {
    vi.mocked(workItemTrackingApi.getClassificationNode as any).mockResolvedValue({
      path: "\\Project\\",
      children: [{ path: "\\Project\\Sprint 1\\" }],
    });

    const treeItem = createTreeItem(createWorkItemItem("Active", { "System.IterationPath": "Project\\Sprint 1" }));

    const action = workItemSetSprintAction(container);
    const actionPromise = action(treeItem);

    await new Promise((r) => setTimeout(r, 0));

    const quickPick = vi.mocked(vscode.window.createQuickPick).mock.results[0].value;
    quickPick.selectedItems = [
      {
        label: "Project\\Sprint 1",
        description: "Current",
        sprintValue: "Project\\Sprint 1",
      },
    ];
    quickPick._fireDidAccept();

    await actionPromise;

    expect(workItemTrackingApi.updateWorkItem).not.toHaveBeenCalled();
    expect(refreshRefreshable).not.toHaveBeenCalled();
  });

  test("falls back to input box when classification node api fails", async () => {
    vi.mocked(workItemTrackingApi.getClassificationNode as any).mockRejectedValue(new Error("API error"));

    const treeItem = createTreeItem(createWorkItemItem("Active", { "System.IterationPath": "Project\\Sprint 1" }));

    vi.mocked(vscode.window.showInputBox).mockResolvedValue("Project\\Sprint 2");

    const action = workItemSetSprintAction(container);
    await action(treeItem);

    expect(vscode.window.createQuickPick).toHaveBeenCalled();
    expect(vscode.window.showInputBox).toHaveBeenCalledWith({
      prompt: "Enter iteration path (e.g., Project\\Sprint 1). Leave empty to clear.",
      title: "Set Work Item Sprint: 123",
      value: "Project\\Sprint 1",
    });

    expect(workItemTrackingApi.updateWorkItem).toHaveBeenCalledWith(
      undefined,
      [
        {
          op: "add",
          path: "/fields/System.IterationPath",
          value: "Project\\Sprint 2",
        },
      ],
      123,
      "project-1",
    );
  });

  test("does nothing when tree item type does not match", async () => {
    const action = workItemSetSprintAction(container);
    await action({} as any);

    expect(vscode.window.createQuickPick).not.toHaveBeenCalled();
    expect(vscode.window.showInputBox).not.toHaveBeenCalled();
    expect(workItemTrackingApi.updateWorkItem).not.toHaveBeenCalled();
  });
});

describe("workItemCopyIdAction", () => {
  test("copies work item id to clipboard", async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(vscode, "env", {
      value: { clipboard: { writeText: writeTextMock } },
      writable: true,
    });

    const treeItem = createTreeItem(createWorkItemItem("Active"));

    await workItemCopyIdAction(treeItem);

    expect(writeTextMock).toHaveBeenCalledWith("123");
    expect(vscode.window.showInformationMessage).toHaveBeenCalledWith("Copied work item #123 to clipboard");
  });

  test("does nothing when tree item type does not match", async () => {
    await workItemCopyIdAction({} as any);

    expect(vscode.window.showInformationMessage).not.toHaveBeenCalled();
  });
});
