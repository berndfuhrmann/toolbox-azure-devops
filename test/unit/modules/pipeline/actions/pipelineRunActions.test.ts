import { describe, test, expect, vi, beforeEach } from "vitest";
import { Container } from "inversify";
import vscode from "vscode";
import {
  pipelineCancelRunAction,
  pipelineRerunRunAction,
} from "../../../../../src/modules/pipeline/actions/pipelineRunActions";
import { PipelineRunTreeItem } from "../../../../../src/modules/pipeline/treeItems/PipelineRunTreeItem";
import {
  PipelineRunItem,
  createPipelineRunItem as createPipelineRunItemFactory,
} from "../../../../../src/modules/pipeline/items/PipelineRunItem";
import { ApiService } from "../../../../../src/generated/ApiService";
import { types } from "../../../../../src/generated/types";
import { AccountContextProvider } from "../../../../../src/modules/core/AccountContextProvider";
import { of } from "rxjs";
import { Account } from "../../../../../src/modules/core/account";
import { BuildStatus } from "azure-devops-node-api/interfaces/BuildInterfaces";
import { createException } from "../../../../../src/common/Exception";

vi.mock("../../../../../src/common/items/RefreshableItem", () => ({
  refreshRefreshable: vi.fn(),
}));

describe("pipelineCancelRunAction", () => {
  let container: Container;
  let accountContextProvider: AccountContextProvider;
  let accountContainer: Container;
  let apiService: ApiService;
  let buildApi: any;

  beforeEach(() => {
    vi.clearAllMocks();
    container = new Container();
    accountContainer = new Container();

    buildApi = {
      updateBuild: vi.fn().mockResolvedValue(undefined),
    };

    apiService = {
      buildApi: vi.fn().mockReturnValue(of(buildApi)),
    } as any;

    accountContextProvider = {
      getAccountContainer: vi.fn().mockReturnValue(accountContainer),
    } as any;

    accountContainer.bind(types.ApiService).toConstantValue(apiService);
    container.bind(types.AccountContextProvider).toConstantValue(accountContextProvider);
  });

  function createPipelineRunItem(buildId: number, buildNumber: string, status: BuildStatus): PipelineRunItem {
    const account: Account = {
      accountId: "account-1",
      url: "https://dev.azure.com/org",
      organization: "org",
      personalAccessToken: "pat",
    };
    return createPipelineRunItemFactory(
      {
        account,
        container: new Container(),
        refreshObservables: {},
        projectId: "project-1",
        pipelineId: 123,
      },
      { id: buildId, buildNumber, status, definition: { id: 123 } },
      {},
    );
  }

  function createTreeItem(data: PipelineRunItem): PipelineRunTreeItem {
    const treeItem = new PipelineRunTreeItem();
    treeItem.updateFrom(data);
    return treeItem;
  }

  test("cancels build with confirmation", async () => {
    const data = createPipelineRunItem(456, "20250103.1", BuildStatus.InProgress);
    const treeItem = createTreeItem(data);

    vi.mocked(vscode.window.showWarningMessage).mockResolvedValue("Cancel Build" as any);

    const action = pipelineCancelRunAction(container);
    await action(treeItem);

    expect(vscode.window.showWarningMessage).toHaveBeenCalledWith(
      'Are you sure you want to cancel build "20250103.1"?',
      { modal: true },
      "Cancel Build",
    );

    expect(buildApi.updateBuild).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 456,
        buildNumber: "20250103.1",
        status: BuildStatus.Cancelling,
      }),
      "project-1",
      456,
    );

    expect(vscode.window.showInformationMessage).toHaveBeenCalledWith('Build "20250103.1" is being cancelled');
  });

  test("does not cancel when user does not confirm", async () => {
    const data = createPipelineRunItem(789, "20250103.2", BuildStatus.InProgress);
    const treeItem = createTreeItem(data);

    vi.mocked(vscode.window.showWarningMessage).mockResolvedValue(undefined);

    const action = pipelineCancelRunAction(container);
    await action(treeItem);

    expect(vscode.window.showWarningMessage).toHaveBeenCalled();
    expect(buildApi.updateBuild).not.toHaveBeenCalled();
    expect(vscode.window.showInformationMessage).not.toHaveBeenCalled();
  });

  test("does not cancel completed build", async () => {
    const data = createPipelineRunItem(111, "20250103.3", BuildStatus.Completed);
    const treeItem = createTreeItem(data);

    const action = pipelineCancelRunAction(container);
    await action(treeItem);

    expect(vscode.window.showWarningMessage).toHaveBeenCalledWith(
      'Build "20250103.3" cannot be cancelled (status: Completed)',
    );
    expect(buildApi.updateBuild).not.toHaveBeenCalled();
  });

  test("does not cancel build that is already cancelling", async () => {
    const data = createPipelineRunItem(222, "20250103.4", BuildStatus.Cancelling);
    const treeItem = createTreeItem(data);

    const action = pipelineCancelRunAction(container);
    await action(treeItem);

    expect(vscode.window.showWarningMessage).toHaveBeenCalledWith(
      'Build "20250103.4" cannot be cancelled (status: Cancelling)',
    );
    expect(buildApi.updateBuild).not.toHaveBeenCalled();
  });

  test("can cancel NotStarted build", async () => {
    const data = createPipelineRunItem(333, "20250103.5", BuildStatus.NotStarted);
    const treeItem = createTreeItem(data);

    vi.mocked(vscode.window.showWarningMessage).mockResolvedValue("Cancel Build" as any);

    const action = pipelineCancelRunAction(container);
    await action(treeItem);

    expect(buildApi.updateBuild).toHaveBeenCalled();
    expect(vscode.window.showInformationMessage).toHaveBeenCalled();
  });

  test("does nothing when tree item is not PipelineRunTreeItem", async () => {
    const action = pipelineCancelRunAction(container);
    await action({} as any);

    expect(vscode.window.showWarningMessage).not.toHaveBeenCalled();
    expect(buildApi.updateBuild).not.toHaveBeenCalled();
  });

  test("uses correct account context", async () => {
    const account: Account = {
      accountId: "account-xyz",
      url: "https://dev.azure.com/other-org",
      organization: "other-org",
      personalAccessToken: "other-pat",
    };

    const data = createPipelineRunItemFactory(
      {
        account,
        container: new Container(),
        refreshObservables: {},
        projectId: "project-xyz",
        pipelineId: 999,
      },
      { id: 555, buildNumber: "20250103.6", status: BuildStatus.InProgress, definition: { id: 999 } },
      {},
    );

    const treeItem = createTreeItem(data);

    vi.mocked(vscode.window.showWarningMessage).mockResolvedValue("Cancel Build" as any);

    const action = pipelineCancelRunAction(container);
    await action(treeItem);

    expect(accountContextProvider.getAccountContainer).toHaveBeenCalledWith("account-xyz");
    expect(buildApi.updateBuild).toHaveBeenCalledWith(expect.anything(), "project-xyz", 555);
  });
});

describe("pipelineRerunRunAction", () => {
  let container: Container;
  let accountContextProvider: AccountContextProvider;
  let accountContainer: Container;
  let apiService: ApiService;
  let buildApi: any;

  beforeEach(() => {
    vi.clearAllMocks();
    container = new Container();
    accountContainer = new Container();

    buildApi = {
      queueBuild: vi.fn().mockResolvedValue(undefined),
    };

    apiService = {
      buildApi: vi.fn().mockReturnValue(of(buildApi)),
    } as any;

    accountContextProvider = {
      getAccountContainer: vi.fn().mockReturnValue(accountContainer),
    } as any;

    accountContainer.bind(types.ApiService).toConstantValue(apiService);
    container.bind(types.AccountContextProvider).toConstantValue(accountContextProvider);
  });

  function createPipelineRunItem(
    buildId: number,
    buildNumber: string,
    sourceBranch: string,
    parameters?: string,
  ): PipelineRunItem {
    const account: Account = {
      accountId: "account-1",
      url: "https://dev.azure.com/org",
      organization: "org",
      personalAccessToken: "pat",
    };
    return createPipelineRunItemFactory(
      {
        account,
        container: new Container(),
        refreshObservables: {},
        projectId: "project-1",
        pipelineId: 123,
      },
      {
        id: buildId,
        buildNumber,
        status: BuildStatus.Completed,
        definition: { id: 123 },
        sourceBranch,
        sourceVersion: "abc123",
        parameters,
      },
      {},
    );
  }

  function createTreeItem(data: PipelineRunItem): PipelineRunTreeItem {
    const treeItem = new PipelineRunTreeItem();
    treeItem.updateFrom(data);
    return treeItem;
  }

  test("reruns build with confirmation", async () => {
    const data = createPipelineRunItem(456, "20250103.1", "refs/heads/main", '{"param1": "value1"}');
    const treeItem = createTreeItem(data);

    vi.mocked(vscode.window.showWarningMessage).mockResolvedValue("Re-run" as any);

    const action = pipelineRerunRunAction(container);
    await action(treeItem);

    expect(vscode.window.showWarningMessage).toHaveBeenCalledWith(
      'Re-run build "20250103.1"?',
      { modal: true },
      "Re-run",
    );

    expect(buildApi.queueBuild).toHaveBeenCalledWith(
      {
        definition: { id: 123 },
        sourceBranch: "refs/heads/main",
        sourceVersion: "abc123",
        parameters: '{"param1": "value1"}',
      },
      "project-1",
    );

    expect(vscode.window.showInformationMessage).toHaveBeenCalledWith('Build "20250103.1" has been queued for re-run');
  });

  test("does not rerun when user does not confirm", async () => {
    const data = createPipelineRunItem(789, "20250103.2", "refs/heads/develop");
    const treeItem = createTreeItem(data);

    vi.mocked(vscode.window.showWarningMessage).mockResolvedValue(undefined);

    const action = pipelineRerunRunAction(container);
    await action(treeItem);

    expect(vscode.window.showWarningMessage).toHaveBeenCalled();
    expect(buildApi.queueBuild).not.toHaveBeenCalled();
    expect(vscode.window.showInformationMessage).not.toHaveBeenCalled();
  });

  test("handles queue build failure", async () => {
    const data = createPipelineRunItem(111, "20250103.3", "refs/heads/main");
    const treeItem = createTreeItem(data);

    vi.mocked(vscode.window.showWarningMessage).mockResolvedValue("Re-run" as any);

    buildApi.queueBuild.mockRejectedValue(new Error("API Error"));

    const action = pipelineRerunRunAction(container);
    await action(treeItem);

    expect(buildApi.queueBuild).toHaveBeenCalled();
    expect(vscode.window.showErrorMessage).toHaveBeenCalledWith("Failed to re-run build: API Error");
    expect(vscode.window.showInformationMessage).not.toHaveBeenCalled();
  });

  test("does nothing when tree item is not PipelineRunTreeItem", async () => {
    const action = pipelineRerunRunAction(container);
    await action({} as any);

    expect(vscode.window.showWarningMessage).not.toHaveBeenCalled();
    expect(buildApi.queueBuild).not.toHaveBeenCalled();
  });

  test("uses correct account context", async () => {
    const account: Account = {
      accountId: "account-xyz",
      url: "https://dev.azure.com/other-org",
      organization: "other-org",
      personalAccessToken: "other-pat",
    };

    const data = createPipelineRunItemFactory(
      {
        account,
        container: new Container(),
        refreshObservables: {},
        projectId: "project-xyz",
        pipelineId: 999,
      },
      {
        id: 555,
        buildNumber: "20250103.4",
        status: BuildStatus.Completed,
        definition: { id: 999 },
        sourceBranch: "refs/heads/feature/test",
        sourceVersion: "def456",
      },
      {},
    );

    const treeItem = createTreeItem(data);

    vi.mocked(vscode.window.showWarningMessage).mockResolvedValue("Re-run" as any);

    const action = pipelineRerunRunAction(container);
    await action(treeItem);

    expect(accountContextProvider.getAccountContainer).toHaveBeenCalledWith("account-xyz");
    expect(buildApi.queueBuild).toHaveBeenCalledWith(
      expect.objectContaining({
        definition: { id: 999 },
        sourceBranch: "refs/heads/feature/test",
        sourceVersion: "def456",
      }),
      "project-xyz",
    );
  });

  test("reruns build without parameters", async () => {
    const data = createPipelineRunItem(222, "20250103.5", "refs/heads/main");
    const treeItem = createTreeItem(data);

    vi.mocked(vscode.window.showWarningMessage).mockResolvedValue("Re-run" as any);

    const action = pipelineRerunRunAction(container);
    await action(treeItem);

    expect(buildApi.queueBuild).toHaveBeenCalledWith(
      expect.objectContaining({
        definition: { id: 123 },
        sourceBranch: "refs/heads/main",
        sourceVersion: "abc123",
        parameters: undefined,
      }),
      "project-1",
    );
  });

  test("shows error when buildApi returns exception", async () => {
    const data = createPipelineRunItem(333, "20250103.6", "refs/heads/main");
    const treeItem = createTreeItem(data);

    // Mock the buildApi to return an exception
    const exceptionApiService = {
      buildApi: vi.fn().mockReturnValue(of(createException(new Error("API Exception")))),
    } as any;

    accountContainer.unbind(types.ApiService);
    accountContainer.bind(types.ApiService).toConstantValue(exceptionApiService);

    vi.mocked(vscode.window.showWarningMessage).mockResolvedValue("Re-run" as any);

    const action = pipelineRerunRunAction(container);
    await action(treeItem);

    expect(vscode.window.showErrorMessage).toHaveBeenCalledWith("Failed to access Build API");
    expect(vscode.window.showInformationMessage).not.toHaveBeenCalled();
  });
});
