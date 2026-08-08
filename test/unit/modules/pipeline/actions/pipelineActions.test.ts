import { describe, test, expect, vi, beforeEach } from "vitest";
import { Container } from "inversify";
import vscode from "vscode";
import {
  pipelineRevealRepositoryAction,
  pipelineRenamePipelineAction,
  pipelineDeletePipelineAction,
  pipelineMovePipeline,
  pipelineRunPipelineAction,
} from "../../../../../src/modules/pipeline/actions/pipelineActions";
import { PipelineTreeItem } from "../../../../../src/modules/pipeline/treeItems/PipelineTreeItem";
import {
  PipelineItem,
  createPipelineItem as createPipelineItemFactory,
} from "../../../../../src/modules/pipeline/items/PipelineItem";
import {
  PipelineFolderItem,
  createPipelineFolderItem as createPipelineFolderItemFactory,
} from "../../../../../src/modules/pipeline/items/PipelineFolderItem";
import {
  ProjectItem,
  createProjectItem as createProjectItemFactory,
} from "../../../../../src/modules/core/items/ProjectItem";
import { ApiService } from "../../../../../src/generated/ApiService";
import { types } from "../../../../../src/generated/types";
import { AccountContextProvider } from "../../../../../src/modules/core/AccountContextProvider";
import { RepositoryTreeProvider } from "../../../../../src/modules/repository/RepositoryTreeProvider";
import { of } from "rxjs";
import { Account } from "../../../../../src/modules/core/account";

vi.mock("../../../../../src/common/items/RefreshableItem", () => ({
  refreshRefreshable: vi.fn(),
}));

describe("pipelineRevealRepositoryAction", () => {
  let container: Container;
  let accountContextProvider: AccountContextProvider;
  let accountContainer: Container;
  let apiService: ApiService;
  let buildApi: any;
  let repositoryTreeProvider: RepositoryTreeProvider;

  beforeEach(() => {
    vi.clearAllMocks();
    container = new Container();
    accountContainer = new Container();

    buildApi = {
      getDefinition: vi.fn(),
      updateDefinition: vi.fn().mockResolvedValue(undefined),
      deleteDefinition: vi.fn().mockResolvedValue(undefined),
    };

    apiService = {
      buildApi: vi.fn().mockReturnValue(of(buildApi)),
    } as any;

    accountContextProvider = {
      getAccountContainer: vi.fn().mockReturnValue(accountContainer),
    } as any;

    repositoryTreeProvider = {
      findAndRevealRepository: vi.fn().mockResolvedValue(true),
    } as any;

    accountContainer.bind(types.ApiService).toConstantValue(apiService);
    container.bind(types.AccountContextProvider).toConstantValue(accountContextProvider);
    container.bind(types.RepositoryTreeProvider).toConstantValue(repositoryTreeProvider);
  });

  function createPipelineItem(pipelineId: number, pipelineName: string): PipelineItem {
    const account: Account = {
      accountId: "account-1",
      url: "https://dev.azure.com/org",
      organization: "org",
      personalAccessToken: "pat",
    };
    return createPipelineItemFactory(
      { account, container: new Container(), refreshObservables: {}, projectId: "project-1" },
      { id: pipelineId, name: pipelineName },
      {},
    );
  }

  function createTreeItem(data: PipelineItem): PipelineTreeItem {
    const treeItem = new PipelineTreeItem();
    treeItem.updateFrom(data);
    return treeItem;
  }

  test("reveals repository when pipeline has repository", async () => {
    const data = createPipelineItem(123, "My Pipeline");
    const treeItem = createTreeItem(data);

    buildApi.getDefinition.mockResolvedValue({
      id: 123,
      name: "My Pipeline",
      repository: {
        id: "repo-123",
        name: "MyRepo",
        type: "TfsGit",
      },
    });

    const action = pipelineRevealRepositoryAction(container);
    await action(treeItem);

    expect(buildApi.getDefinition).toHaveBeenCalledWith("project-1", 123);
    expect(repositoryTreeProvider.findAndRevealRepository).toHaveBeenCalledWith("repo-123", "account-1", "project-1");
  });

  test("does not reveal when pipeline has no repository", async () => {
    const data = createPipelineItem(456, "Pipeline Without Repo");
    const treeItem = createTreeItem(data);

    buildApi.getDefinition.mockResolvedValue({
      id: 456,
      name: "Pipeline Without Repo",
      repository: undefined,
    });

    const action = pipelineRevealRepositoryAction(container);
    await action(treeItem);

    expect(buildApi.getDefinition).toHaveBeenCalledWith("project-1", 456);
    expect(repositoryTreeProvider.findAndRevealRepository).not.toHaveBeenCalled();
  });

  test("does not reveal when definition is null", async () => {
    const data = createPipelineItem(789, "Null Definition Pipeline");
    const treeItem = createTreeItem(data);

    buildApi.getDefinition.mockResolvedValue(null);

    const action = pipelineRevealRepositoryAction(container);
    await action(treeItem);

    expect(buildApi.getDefinition).toHaveBeenCalledWith("project-1", 789);
    expect(repositoryTreeProvider.findAndRevealRepository).not.toHaveBeenCalled();
  });

  test("does nothing when tree item is not PipelineTreeItem", async () => {
    const action = pipelineRevealRepositoryAction(container);
    await action({} as any);

    expect(buildApi.getDefinition).not.toHaveBeenCalled();
    expect(repositoryTreeProvider.findAndRevealRepository).not.toHaveBeenCalled();
  });

  test("uses correct account context", async () => {
    const account: Account = {
      accountId: "account-xyz",
      url: "https://dev.azure.com/other-org",
      organization: "other-org",
      personalAccessToken: "other-pat",
    };

    const data = createPipelineItemFactory(
      {
        account,
        container: new Container(),
        refreshObservables: {},
        projectId: "project-xyz",
      },
      { id: 999, name: "Other Pipeline" },
      {},
    );

    const treeItem = createTreeItem(data);

    buildApi.getDefinition.mockResolvedValue({
      id: 999,
      name: "Other Pipeline",
      repository: {
        id: "repo-xyz",
      },
    });

    const action = pipelineRevealRepositoryAction(container);
    await action(treeItem);

    expect(accountContextProvider.getAccountContainer).toHaveBeenCalledWith("account-xyz");
    expect(buildApi.getDefinition).toHaveBeenCalledWith("project-xyz", 999);
    expect(repositoryTreeProvider.findAndRevealRepository).toHaveBeenCalledWith(
      "repo-xyz",
      "account-xyz",
      "project-xyz",
    );
  });

  test("does not reveal when repository ID is null", async () => {
    const data = createPipelineItem(111, "Pipeline With Null Repo ID");
    const treeItem = createTreeItem(data);

    buildApi.getDefinition.mockResolvedValue({
      id: 111,
      name: "Pipeline With Null Repo ID",
      repository: {
        id: null,
        name: "Repo",
      },
    });

    const action = pipelineRevealRepositoryAction(container);
    await action(treeItem);

    expect(repositoryTreeProvider.findAndRevealRepository).not.toHaveBeenCalled();
  });
});

describe("pipelineRenamePipelineAction", () => {
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
      getDefinition: vi.fn(),
      updateDefinition: vi.fn().mockResolvedValue(undefined),
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

  function createPipelineItem(pipelineId: number, pipelineName: string): PipelineItem {
    const account: Account = {
      accountId: "account-1",
      url: "https://dev.azure.com/org",
      organization: "org",
      personalAccessToken: "pat",
    };
    return createPipelineItemFactory(
      { account, container: new Container(), refreshObservables: {}, projectId: "project-1" },
      { id: pipelineId, name: pipelineName },
      {},
    );
  }

  function createTreeItem(data: PipelineItem): PipelineTreeItem {
    const treeItem = new PipelineTreeItem();
    treeItem.updateFrom(data);
    return treeItem;
  }

  test("renames pipeline with new name", async () => {
    const data = createPipelineItem(123, "OldName");
    const treeItem = createTreeItem(data);

    buildApi.getDefinition.mockResolvedValue({
      id: 123,
      name: "OldName",
      path: "\\",
    });

    vi.mocked(vscode.window.showInputBox).mockResolvedValue("NewName");

    const action = pipelineRenamePipelineAction(container);
    await action(treeItem);

    expect(vscode.window.showInputBox).toHaveBeenCalledWith({
      prompt: "Enter new pipeline name",
      title: "Rename Pipeline",
      value: "OldName",
    });

    expect(buildApi.getDefinition).toHaveBeenCalledWith("project-1", 123);
    expect(buildApi.updateDefinition).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 123,
        name: "NewName",
        path: "\\",
      }),
      "project-1",
      123,
    );
  });

  test("cancels rename when user cancels input", async () => {
    const data = createPipelineItem(456, "SomePipeline");
    const treeItem = createTreeItem(data);

    vi.mocked(vscode.window.showInputBox).mockResolvedValue(undefined);

    const action = pipelineRenamePipelineAction(container);
    await action(treeItem);

    expect(buildApi.getDefinition).not.toHaveBeenCalled();
    expect(buildApi.updateDefinition).not.toHaveBeenCalled();
  });

  test("does nothing when tree item is not PipelineTreeItem", async () => {
    const action = pipelineRenamePipelineAction(container);
    await action({} as any);

    expect(vscode.window.showInputBox).not.toHaveBeenCalled();
    expect(buildApi.updateDefinition).not.toHaveBeenCalled();
  });
});

describe("pipelineDeletePipelineAction", () => {
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
      deleteDefinition: vi.fn().mockResolvedValue(undefined),
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

  function createPipelineItem(pipelineId: number, pipelineName: string): PipelineItem {
    const account: Account = {
      accountId: "account-1",
      url: "https://dev.azure.com/org",
      organization: "org",
      personalAccessToken: "pat",
    };
    return createPipelineItemFactory(
      { account, container: new Container(), refreshObservables: {}, projectId: "project-1" },
      { id: pipelineId, name: pipelineName },
      {},
    );
  }

  function createTreeItem(data: PipelineItem): PipelineTreeItem {
    const treeItem = new PipelineTreeItem();
    treeItem.updateFrom(data);
    return treeItem;
  }

  test("deletes pipeline with confirmation", async () => {
    const data = createPipelineItem(123, "PipelineToDelete");
    const treeItem = createTreeItem(data);

    vi.mocked(vscode.window.showWarningMessage).mockResolvedValue("Delete" as any);

    const action = pipelineDeletePipelineAction(container);
    await action(treeItem);

    expect(vscode.window.showWarningMessage).toHaveBeenCalledWith(
      'Are you sure you want to delete the pipeline "PipelineToDelete"?',
      { modal: true },
      "Delete",
    );

    expect(buildApi.deleteDefinition).toHaveBeenCalledWith("project-1", 123);
  });

  test("cancels delete when user does not confirm", async () => {
    const data = createPipelineItem(456, "PipelineToKeep");
    const treeItem = createTreeItem(data);

    vi.mocked(vscode.window.showWarningMessage).mockResolvedValue(undefined);

    const action = pipelineDeletePipelineAction(container);
    await action(treeItem);

    expect(vscode.window.showWarningMessage).toHaveBeenCalledWith(
      'Are you sure you want to delete the pipeline "PipelineToKeep"?',
      { modal: true },
      "Delete",
    );

    expect(buildApi.deleteDefinition).not.toHaveBeenCalled();
  });

  test("does nothing when tree item is not PipelineTreeItem", async () => {
    const action = pipelineDeletePipelineAction(container);
    await action({} as any);

    expect(vscode.window.showWarningMessage).not.toHaveBeenCalled();
    expect(buildApi.deleteDefinition).not.toHaveBeenCalled();
  });
});

describe("pipelineMovePipeline", () => {
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
      getDefinition: vi.fn(),
      updateDefinition: vi.fn().mockResolvedValue(undefined),
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

  function createPipelineItem(pipelineId: number, pipelineName: string): PipelineItem {
    const account: Account = {
      accountId: "account-1",
      url: "https://dev.azure.com/org",
      organization: "org",
      personalAccessToken: "pat",
    };
    return createPipelineItemFactory(
      { account, container: new Container(), refreshObservables: {}, projectId: "project-1" },
      { id: pipelineId, name: pipelineName },
      {},
    );
  }

  function createPipelineFolderItem(path: string): PipelineFolderItem {
    const account: Account = {
      accountId: "account-1",
      url: "https://dev.azure.com/org",
      organization: "org",
      personalAccessToken: "pat",
    };
    return createPipelineFolderItemFactory(
      { account, container: new Container(), refreshObservables: {}, projectId: "project-1" },
      { path },
      {},
    );
  }

  function createProjectItem(): ProjectItem {
    const account: Account = {
      accountId: "account-1",
      url: "https://dev.azure.com/org",
      organization: "org",
      personalAccessToken: "pat",
    };
    return createProjectItemFactory(
      { account, container: new Container(), refreshObservables: {} },
      { id: "project-1", name: "Project" },
      {},
    );
  }

  test("moves pipeline to folder with confirmation", async () => {
    const sourcePipeline = createPipelineItem(123, "MyPipeline");
    const targetFolder = createPipelineFolderItem("\\TargetFolder");

    buildApi.getDefinition.mockResolvedValue({
      id: 123,
      name: "MyPipeline",
      path: "\\",
    });

    vi.mocked(vscode.window.showWarningMessage).mockResolvedValue("Move" as any);

    await pipelineMovePipeline(container, sourcePipeline, targetFolder);

    expect(vscode.window.showWarningMessage).toHaveBeenCalledWith(
      'Move pipeline "MyPipeline" to "\\TargetFolder"?',
      { modal: true },
      "Move",
    );

    expect(buildApi.getDefinition).toHaveBeenCalledWith("project-1", 123);
    expect(buildApi.updateDefinition).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 123,
        name: "MyPipeline",
        path: "\\TargetFolder",
      }),
      "project-1",
      123,
    );
  });

  test("moves pipeline to root (project) with confirmation", async () => {
    const sourcePipeline = createPipelineItem(456, "PipelineToMove");
    const targetProject = createProjectItem();

    buildApi.getDefinition.mockResolvedValue({
      id: 456,
      name: "PipelineToMove",
      path: "\\SomeFolder",
    });

    vi.mocked(vscode.window.showWarningMessage).mockResolvedValue("Move" as any);

    await pipelineMovePipeline(container, sourcePipeline, undefined);

    expect(vscode.window.showWarningMessage).toHaveBeenCalledWith(
      'Move pipeline "PipelineToMove" to "root"?',
      { modal: true },
      "Move",
    );

    expect(buildApi.updateDefinition).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 456,
        name: "PipelineToMove",
        path: "\\",
      }),
      "project-1",
      456,
    );
  });

  test("cancels move when user does not confirm", async () => {
    const sourcePipeline = createPipelineItem(789, "StayingPipeline");
    const targetFolder = createPipelineFolderItem("\\NewFolder");

    vi.mocked(vscode.window.showWarningMessage).mockResolvedValue(undefined);

    await pipelineMovePipeline(container, sourcePipeline, targetFolder);

    expect(vscode.window.showWarningMessage).toHaveBeenCalled();
    expect(buildApi.getDefinition).not.toHaveBeenCalled();
    expect(buildApi.updateDefinition).not.toHaveBeenCalled();
  });
});

describe("pipelineRunPipelineAction", () => {
  let container: Container;
  let accountContextProvider: AccountContextProvider;
  let accountContainer: Container;
  let apiService: ApiService;
  let buildApi: any;
  let gitApi: any;

  beforeEach(() => {
    vi.clearAllMocks();
    container = new Container();
    accountContainer = new Container();

    buildApi = {
      getDefinition: vi.fn(),
      queueBuild: vi.fn().mockResolvedValue(undefined),
    };

    gitApi = {
      getBranches: vi.fn(),
    };

    apiService = {
      buildApi: vi.fn().mockReturnValue(of(buildApi)),
      gitApi: vi.fn().mockReturnValue(of(gitApi)),
    } as any;

    accountContextProvider = {
      getAccountContainer: vi.fn().mockReturnValue(accountContainer),
    } as any;

    accountContainer.bind(types.ApiService).toConstantValue(apiService);
    container.bind(types.AccountContextProvider).toConstantValue(accountContextProvider);
  });

  function createPipelineItem(pipelineId: number, pipelineName: string): PipelineItem {
    const account: Account = {
      accountId: "account-1",
      url: "https://dev.azure.com/org",
      organization: "org",
      personalAccessToken: "pat",
    };
    return createPipelineItemFactory(
      { account, container: new Container(), refreshObservables: {}, projectId: "project-1" },
      { id: pipelineId, name: pipelineName },
      {},
    );
  }

  function createTreeItem(data: PipelineItem): PipelineTreeItem {
    const treeItem = new PipelineTreeItem();
    treeItem.updateFrom(data);
    return treeItem;
  }

  test("successfully runs pipeline with selected branch", async () => {
    const data = createPipelineItem(123, "Test Pipeline");
    const treeItem = createTreeItem(data);

    buildApi.getDefinition.mockResolvedValue({
      repository: {
        id: "repo-1",
        name: "test-repo",
      },
    });

    gitApi.getBranches.mockResolvedValue([
      { name: "refs/heads/main" },
      { name: "refs/heads/develop" },
      { name: "refs/heads/feature/test" },
    ]);

    vi.mocked(vscode.window.showQuickPick).mockResolvedValue({
      label: "main",
      description: "refs/heads/main",
      branchName: "refs/heads/main",
    } as any);

    const action = pipelineRunPipelineAction(container);
    await action(treeItem);

    expect(buildApi.getDefinition).toHaveBeenCalledWith("project-1", 123);
    expect(gitApi.getBranches).toHaveBeenCalledWith("repo-1", "project-1");
    expect(vscode.window.showQuickPick).toHaveBeenCalled();
    expect(buildApi.queueBuild).toHaveBeenCalledWith(
      {
        definition: { id: 123 },
        sourceBranch: "refs/heads/main",
      },
      "project-1",
    );
    expect(vscode.window.showInformationMessage).toHaveBeenCalledWith(
      'Pipeline "Test Pipeline" queued on branch "main"',
    );
  });

  test("does nothing when user cancels branch selection", async () => {
    const data = createPipelineItem(456, "Another Pipeline");
    const treeItem = createTreeItem(data);

    buildApi.getDefinition.mockResolvedValue({
      repository: {
        id: "repo-1",
        name: "test-repo",
      },
    });

    gitApi.getBranches.mockResolvedValue([{ name: "refs/heads/main" }]);

    vi.mocked(vscode.window.showQuickPick).mockResolvedValue(undefined);

    const action = pipelineRunPipelineAction(container);
    await action(treeItem);

    expect(buildApi.queueBuild).not.toHaveBeenCalled();
    expect(vscode.window.showInformationMessage).not.toHaveBeenCalled();
  });

  test("shows error when pipeline has no repository", async () => {
    const data = createPipelineItem(789, "No Repo Pipeline");
    const treeItem = createTreeItem(data);

    buildApi.getDefinition.mockResolvedValue({
      repository: null,
    });

    const action = pipelineRunPipelineAction(container);
    await action(treeItem);

    expect(vscode.window.showErrorMessage).toHaveBeenCalledWith("Pipeline repository not found");
    expect(gitApi.getBranches).not.toHaveBeenCalled();
    expect(buildApi.queueBuild).not.toHaveBeenCalled();
  });

  test("shows error when no branches found", async () => {
    const data = createPipelineItem(111, "Empty Repo Pipeline");
    const treeItem = createTreeItem(data);

    buildApi.getDefinition.mockResolvedValue({
      repository: {
        id: "repo-1",
        name: "test-repo",
      },
    });

    gitApi.getBranches.mockResolvedValue([]);

    const action = pipelineRunPipelineAction(container);
    await action(treeItem);

    expect(vscode.window.showErrorMessage).toHaveBeenCalledWith("No branches found for this repository");
    expect(buildApi.queueBuild).not.toHaveBeenCalled();
  });

  test("shows error when queue build fails", async () => {
    const data = createPipelineItem(222, "Failing Pipeline");
    const treeItem = createTreeItem(data);

    buildApi.getDefinition.mockResolvedValue({
      repository: {
        id: "repo-1",
        name: "test-repo",
      },
    });

    gitApi.getBranches.mockResolvedValue([{ name: "refs/heads/main" }]);

    vi.mocked(vscode.window.showQuickPick).mockResolvedValue({
      label: "main",
      description: "refs/heads/main",
      branchName: "refs/heads/main",
    } as any);

    buildApi.queueBuild.mockRejectedValue(new Error("API Error"));

    const action = pipelineRunPipelineAction(container);
    await action(treeItem);

    expect(vscode.window.showErrorMessage).toHaveBeenCalledWith("Failed to queue pipeline: API Error");
  });

  test("sorts branches with main and master at the top", async () => {
    const data = createPipelineItem(333, "Sorted Pipeline");
    const treeItem = createTreeItem(data);

    buildApi.getDefinition.mockResolvedValue({
      repository: {
        id: "repo-1",
        name: "test-repo",
      },
    });

    gitApi.getBranches.mockResolvedValue([
      { name: "refs/heads/feature/xyz" },
      { name: "refs/heads/develop" },
      { name: "refs/heads/main" },
      { name: "refs/heads/feature/abc" },
    ]);

    vi.mocked(vscode.window.showQuickPick).mockResolvedValue(undefined);

    const action = pipelineRunPipelineAction(container);
    await action(treeItem);

    const quickPickCall = vi.mocked(vscode.window.showQuickPick).mock.calls[0];
    const items = quickPickCall[0] as any[];

    expect(items[0].label).toBe("main");
    expect(items[1].label).toBe("develop");
    expect(items[2].label).toBe("feature/abc");
    expect(items[3].label).toBe("feature/xyz");
  });

  test("does nothing when tree item is not a PipelineTreeItem", async () => {
    const action = pipelineRunPipelineAction(container);
    await action({} as any);

    expect(buildApi.getDefinition).not.toHaveBeenCalled();
  });
});
