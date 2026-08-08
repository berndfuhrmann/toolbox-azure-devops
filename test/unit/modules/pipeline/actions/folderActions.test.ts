import { describe, test, expect, vi, beforeEach } from "vitest";
import { Container } from "inversify";
import vscode from "vscode";
import {
  pipelineRenameFolderAction,
  pipelineCreateFolderAction,
  pipelineDeleteFolderAction,
  pipelineMoveFolder,
} from "../../../../../src/modules/pipeline/actions/folderActions";
import { PipelineFolderTreeItem } from "../../../../../src/modules/pipeline/treeItems/PipelineFolderTreeItem";
import {
  PipelineFolderItem,
  createPipelineFolderItem as createPipelineFolderItemFactory,
} from "../../../../../src/modules/pipeline/items/PipelineFolderItem";
import { ApiService } from "../../../../../src/generated/ApiService";
import { types } from "../../../../../src/generated/types";
import { AccountContextProvider } from "../../../../../src/modules/core/AccountContextProvider";
import { of } from "rxjs";
import {
  ProjectItem,
  createProjectItem as createProjectItemFactory,
} from "../../../../../src/modules/core/items/ProjectItem";
import { Account } from "../../../../../src/modules/core/account";
import { ProjectTreeItem } from "../../../../../src/modules/core/treeItems/ProjectTreeItem";

vi.mock("../../../../../src/common/items/RefreshableItem", () => ({
  refreshRefreshable: vi.fn(),
}));

describe("pipelineRenameFolderAction", () => {
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
      updateFolder: vi.fn().mockResolvedValue(undefined),
      createFolder: vi.fn().mockResolvedValue(undefined),
      deleteFolder: vi.fn().mockResolvedValue(undefined),
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

  function createPipelineFolderItem(path: string): PipelineFolderItem {
    const account: Account = {
      accountId: "account-1",
      url: "https://dev.azure.com/org",
      organization: "org",
      personalAccessToken: "pat",
    };
    const project = createProjectItemFactory(
      { account, container: new Container(), refreshObservables: {} },
      { id: "project-1", name: "Project" },
      {},
    );
    return createPipelineFolderItemFactory(project, { path }, {});
  }

  function createTreeItem(data: PipelineFolderItem): PipelineFolderTreeItem {
    const treeItem = new PipelineFolderTreeItem();
    treeItem.updateFrom(data);
    return treeItem;
  }

  test("extracts folder name from path and updates with new name", async () => {
    const data = createPipelineFolderItem("\\Parent\\Child");
    const treeItem = createTreeItem(data);

    vi.mocked(vscode.window.showInputBox).mockResolvedValue("NewChild");

    const action = pipelineRenameFolderAction(container);
    await action(treeItem);

    expect(vscode.window.showInputBox).toHaveBeenCalledWith({
      prompt: "Enter new folder name",
      title: "Rename Folder",
      value: "Child",
    });

    expect(buildApi.updateFolder).toHaveBeenCalledWith({ path: "\\Parent\\NewChild" }, "project-1", "\\Parent\\Child");
  });

  test("handles root folder without parent path", async () => {
    const data = createPipelineFolderItem("\\RootFolder");
    const treeItem = createTreeItem(data);

    vi.mocked(vscode.window.showInputBox).mockResolvedValue("NewRootFolder");

    const action = pipelineRenameFolderAction(container);
    await action(treeItem);

    expect(vscode.window.showInputBox).toHaveBeenCalledWith({
      prompt: "Enter new folder name",
      title: "Rename Folder",
      value: "RootFolder",
    });

    expect(buildApi.updateFolder).toHaveBeenCalledWith({ path: "\\NewRootFolder" }, "project-1", "\\RootFolder");
  });

  test("handles nested folder paths", async () => {
    const data = createPipelineFolderItem("\\Level1\\Level2\\Level3");
    const treeItem = createTreeItem(data);

    vi.mocked(vscode.window.showInputBox).mockResolvedValue("NewLevel3");

    const action = pipelineRenameFolderAction(container);
    await action(treeItem);

    expect(vscode.window.showInputBox).toHaveBeenCalledWith({
      prompt: "Enter new folder name",
      title: "Rename Folder",
      value: "Level3",
    });

    expect(buildApi.updateFolder).toHaveBeenCalledWith(
      { path: "\\Level1\\Level2\\NewLevel3" },
      "project-1",
      "\\Level1\\Level2\\Level3",
    );
  });

  test("does nothing when user cancels input", async () => {
    const data = createPipelineFolderItem("\\Parent\\Child");
    const treeItem = createTreeItem(data);

    vi.mocked(vscode.window.showInputBox).mockResolvedValue(undefined);

    const action = pipelineRenameFolderAction(container);
    await action(treeItem);

    expect(buildApi.updateFolder).not.toHaveBeenCalled();
  });

  test("does nothing when tree item is not PipelineFolderTreeItem", async () => {
    const action = pipelineRenameFolderAction(container);
    await action({} as any);

    expect(vscode.window.showInputBox).not.toHaveBeenCalled();
    expect(buildApi.updateFolder).not.toHaveBeenCalled();
  });

  test("does nothing when path does not start with backslash", async () => {
    const data = createPipelineFolderItem("NoBackslash");
    const treeItem = createTreeItem(data);

    const action = pipelineRenameFolderAction(container);
    await action(treeItem);

    expect(vscode.window.showInputBox).not.toHaveBeenCalled();
    expect(buildApi.updateFolder).not.toHaveBeenCalled();
  });
});

describe("pipelineCreateFolderAction", () => {
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
      createFolder: vi.fn().mockResolvedValue(undefined),
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

  function createPipelineFolderItem(path: string): PipelineFolderItem {
    const account: Account = {
      accountId: "account-1",
      url: "https://dev.azure.com/org",
      organization: "org",
      personalAccessToken: "pat",
    };
    const project = createProjectItemFactory(
      { account, container: new Container(), refreshObservables: {} },
      { id: "project-1", name: "Project" },
      {},
    );
    return createPipelineFolderItemFactory(project, { path }, {});
  }

  function createProjectTreeItem(data: ProjectItem): ProjectTreeItem {
    const treeItem = new ProjectTreeItem();
    treeItem.updateFrom(data);
    return treeItem;
  }

  function createPipelineFolderTreeItem(data: PipelineFolderItem): PipelineFolderTreeItem {
    const treeItem = new PipelineFolderTreeItem();
    treeItem.updateFrom(data);
    return treeItem;
  }

  test("creates folder at root when called on ProjectTreeItem", async () => {
    const data = createProjectItem();
    const treeItem = createProjectTreeItem(data);

    vi.mocked(vscode.window.showInputBox).mockResolvedValue("NewFolder");

    const action = pipelineCreateFolderAction(container);
    await action(treeItem);

    expect(vscode.window.showInputBox).toHaveBeenCalledWith({
      prompt: "Enter new folder name",
      title: "Create Folder",
      value: "",
    });

    expect(buildApi.createFolder).toHaveBeenCalledWith({ path: "\\NewFolder" }, "project-1", "\\NewFolder");
  });

  test("creates subfolder when called on PipelineFolderTreeItem", async () => {
    const data = createPipelineFolderItem("\\Parent");
    const treeItem = createPipelineFolderTreeItem(data);

    vi.mocked(vscode.window.showInputBox).mockResolvedValue("Child");

    const action = pipelineCreateFolderAction(container);
    await action(treeItem);

    expect(vscode.window.showInputBox).toHaveBeenCalledWith({
      prompt: "Enter new folder name",
      title: "Create Folder",
      value: "",
    });

    expect(buildApi.createFolder).toHaveBeenCalledWith({ path: "\\Parent\\Child" }, "project-1", "\\Parent\\Child");
  });

  test("creates nested subfolder in deep hierarchy", async () => {
    const data = createPipelineFolderItem("\\Level1\\Level2\\Level3");
    const treeItem = createPipelineFolderTreeItem(data);

    vi.mocked(vscode.window.showInputBox).mockResolvedValue("Level4");

    const action = pipelineCreateFolderAction(container);
    await action(treeItem);

    expect(vscode.window.showInputBox).toHaveBeenCalledWith({
      prompt: "Enter new folder name",
      title: "Create Folder",
      value: "",
    });

    expect(buildApi.createFolder).toHaveBeenCalledWith(
      { path: "\\Level1\\Level2\\Level3\\Level4" },
      "project-1",
      "\\Level1\\Level2\\Level3\\Level4",
    );
  });

  test("does nothing when user cancels input", async () => {
    const data = createProjectItem();
    const treeItem = createProjectTreeItem(data);

    vi.mocked(vscode.window.showInputBox).mockResolvedValue(undefined);

    const action = pipelineCreateFolderAction(container);
    await action(treeItem);

    expect(buildApi.createFolder).not.toHaveBeenCalled();
  });

  test("does nothing when tree item is neither PipelineFolderTreeItem nor ProjectTreeItem", async () => {
    const action = pipelineCreateFolderAction(container);
    await action({} as any);

    expect(vscode.window.showInputBox).not.toHaveBeenCalled();
    expect(buildApi.createFolder).not.toHaveBeenCalled();
  });

  test("handles empty folder name input by creating folder at root", async () => {
    const data = createProjectItem();
    const treeItem = createProjectTreeItem(data);

    vi.mocked(vscode.window.showInputBox).mockResolvedValue("");

    const action = pipelineCreateFolderAction(container);
    await action(treeItem);

    expect(buildApi.createFolder).toHaveBeenCalledWith({ path: "\\" }, "project-1", "\\");
  });
});

describe("pipelineDeleteFolderAction", () => {
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
      deleteFolder: vi.fn().mockResolvedValue(undefined),
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

  function createPipelineFolderItem(path: string): PipelineFolderItem {
    const account: Account = {
      accountId: "account-1",
      url: "https://dev.azure.com/org",
      organization: "org",
      personalAccessToken: "pat",
    };
    const project = createProjectItemFactory(
      { account, container: new Container(), refreshObservables: {} },
      { id: "project-1", name: "Project" },
      {},
    );
    return createPipelineFolderItemFactory(project, { path }, {});
  }

  function createTreeItem(data: PipelineFolderItem): PipelineFolderTreeItem {
    const treeItem = new PipelineFolderTreeItem();
    treeItem.updateFrom(data);
    return treeItem;
  }

  test("deletes folder after user confirms", async () => {
    const data = createPipelineFolderItem("\\Parent\\Child");
    const treeItem = createTreeItem(data);

    vi.mocked(vscode.window.showWarningMessage).mockResolvedValue("Delete" as any);

    const action = pipelineDeleteFolderAction(container);
    await action(treeItem);

    expect(vscode.window.showWarningMessage).toHaveBeenCalledWith(
      'Are you sure you want to delete the folder "Child"?',
      { modal: true },
      "Delete",
    );

    expect(buildApi.deleteFolder).toHaveBeenCalledWith("project-1", "\\Parent\\Child");
  });

  test("extracts folder name correctly for root folder", async () => {
    const data = createPipelineFolderItem("\\RootFolder");
    const treeItem = createTreeItem(data);

    vi.mocked(vscode.window.showWarningMessage).mockResolvedValue("Delete" as any);

    const action = pipelineDeleteFolderAction(container);
    await action(treeItem);

    expect(vscode.window.showWarningMessage).toHaveBeenCalledWith(
      'Are you sure you want to delete the folder "RootFolder"?',
      { modal: true },
      "Delete",
    );

    expect(buildApi.deleteFolder).toHaveBeenCalledWith("project-1", "\\RootFolder");
  });

  test("extracts folder name correctly for deeply nested folder", async () => {
    const data = createPipelineFolderItem("\\Level1\\Level2\\Level3");
    const treeItem = createTreeItem(data);

    vi.mocked(vscode.window.showWarningMessage).mockResolvedValue("Delete" as any);

    const action = pipelineDeleteFolderAction(container);
    await action(treeItem);

    expect(vscode.window.showWarningMessage).toHaveBeenCalledWith(
      'Are you sure you want to delete the folder "Level3"?',
      { modal: true },
      "Delete",
    );

    expect(buildApi.deleteFolder).toHaveBeenCalledWith("project-1", "\\Level1\\Level2\\Level3");
  });

  test("does nothing when user cancels deletion", async () => {
    const data = createPipelineFolderItem("\\Parent\\Child");
    const treeItem = createTreeItem(data);

    vi.mocked(vscode.window.showWarningMessage).mockResolvedValue(undefined as any);

    const action = pipelineDeleteFolderAction(container);
    await action(treeItem);

    expect(buildApi.deleteFolder).not.toHaveBeenCalled();
  });

  test("does nothing when user clicks anything other than Delete", async () => {
    const data = createPipelineFolderItem("\\Parent\\Child");
    const treeItem = createTreeItem(data);

    vi.mocked(vscode.window.showWarningMessage).mockResolvedValue("Cancel" as any);

    const action = pipelineDeleteFolderAction(container);
    await action(treeItem);

    expect(buildApi.deleteFolder).not.toHaveBeenCalled();
  });

  test("does nothing when tree item is not PipelineFolderTreeItem", async () => {
    const action = pipelineDeleteFolderAction(container);
    await action({} as any);

    expect(vscode.window.showWarningMessage).not.toHaveBeenCalled();
    expect(buildApi.deleteFolder).not.toHaveBeenCalled();
  });

  test("does nothing when folder path is undefined", async () => {
    const data = createPipelineFolderItem("\\Test");
    const treeItem = createTreeItem(data);
    // Set path to undefined after tree item is created
    data.folder.path = undefined;

    const action = pipelineDeleteFolderAction(container);
    await action(treeItem);

    expect(vscode.window.showWarningMessage).not.toHaveBeenCalled();
    expect(buildApi.deleteFolder).not.toHaveBeenCalled();
  });
});

describe("pipelineMoveFolder", () => {
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
      updateFolder: vi.fn().mockResolvedValue(undefined),
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

  function createPipelineFolderItem(path: string): PipelineFolderItem {
    const account: Account = {
      accountId: "account-1",
      url: "https://dev.azure.com/org",
      organization: "org",
      personalAccessToken: "pat",
    };
    const project = createProjectItemFactory(
      { account, container: new Container(), refreshObservables: {} },
      { id: "project-1", name: "Project" },
      {},
    );
    return createPipelineFolderItemFactory(project, { path }, {});
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

  test("moves folder to another folder after confirmation", async () => {
    const sourceFolder = createPipelineFolderItem("\\Source\\MyFolder");
    const targetFolder = createPipelineFolderItem("\\Target");

    vi.mocked(vscode.window.showWarningMessage).mockResolvedValue("Move" as any);

    await pipelineMoveFolder(container, sourceFolder, targetFolder);

    expect(vscode.window.showWarningMessage).toHaveBeenCalledWith(
      'Move folder "MyFolder" to "\\Target"?',
      { modal: true },
      "Move",
    );

    expect(buildApi.updateFolder).toHaveBeenCalledWith(
      { path: "\\Target\\MyFolder" },
      "project-1",
      "\\Source\\MyFolder",
    );
  });

  test("moves folder to root when target is ProjectItem", async () => {
    const sourceFolder = createPipelineFolderItem("\\Source\\MyFolder");

    vi.mocked(vscode.window.showWarningMessage).mockResolvedValue("Move" as any);

    await pipelineMoveFolder(container, sourceFolder, undefined);

    expect(vscode.window.showWarningMessage).toHaveBeenCalledWith(
      'Move folder "MyFolder" to "root"?',
      { modal: true },
      "Move",
    );

    expect(buildApi.updateFolder).toHaveBeenCalledWith({ path: "\\MyFolder" }, "project-1", "\\Source\\MyFolder");
  });

  test("moves folder from root to another folder", async () => {
    const sourceFolder = createPipelineFolderItem("\\MyFolder");
    const targetFolder = createPipelineFolderItem("\\Target\\Subfolder");

    vi.mocked(vscode.window.showWarningMessage).mockResolvedValue("Move" as any);

    await pipelineMoveFolder(container, sourceFolder, targetFolder);

    expect(vscode.window.showWarningMessage).toHaveBeenCalledWith(
      'Move folder "MyFolder" to "\\Target\\Subfolder"?',
      { modal: true },
      "Move",
    );

    expect(buildApi.updateFolder).toHaveBeenCalledWith(
      { path: "\\Target\\Subfolder\\MyFolder" },
      "project-1",
      "\\MyFolder",
    );
  });

  test("does nothing when user cancels move", async () => {
    const sourceFolder = createPipelineFolderItem("\\Source\\MyFolder");
    const targetFolder = createPipelineFolderItem("\\Target");

    vi.mocked(vscode.window.showWarningMessage).mockResolvedValue(undefined as any);

    await pipelineMoveFolder(container, sourceFolder, targetFolder);

    expect(buildApi.updateFolder).not.toHaveBeenCalled();
  });

  test("does nothing when user clicks anything other than Move", async () => {
    const sourceFolder = createPipelineFolderItem("\\Source\\MyFolder");
    const targetFolder = createPipelineFolderItem("\\Target");

    vi.mocked(vscode.window.showWarningMessage).mockResolvedValue("Cancel" as any);

    await pipelineMoveFolder(container, sourceFolder, targetFolder);

    expect(buildApi.updateFolder).not.toHaveBeenCalled();
  });

  test("does nothing when source path is undefined", async () => {
    const sourceFolder = createPipelineFolderItem("\\Test");
    sourceFolder.folder.path = undefined;
    const targetFolder = createPipelineFolderItem("\\Target");

    await pipelineMoveFolder(container, sourceFolder, targetFolder);

    expect(vscode.window.showWarningMessage).not.toHaveBeenCalled();
    expect(buildApi.updateFolder).not.toHaveBeenCalled();
  });

  test("does nothing when source path does not start with backslash", async () => {
    const sourceFolder = createPipelineFolderItem("NoBackslash");
    const targetFolder = createPipelineFolderItem("\\Target");

    await pipelineMoveFolder(container, sourceFolder, targetFolder);

    expect(vscode.window.showWarningMessage).not.toHaveBeenCalled();
    expect(buildApi.updateFolder).not.toHaveBeenCalled();
  });

  test("handles deeply nested folder moves", async () => {
    const sourceFolder = createPipelineFolderItem("\\A\\B\\C\\MyFolder");
    const targetFolder = createPipelineFolderItem("\\X\\Y\\Z");

    vi.mocked(vscode.window.showWarningMessage).mockResolvedValue("Move" as any);

    await pipelineMoveFolder(container, sourceFolder, targetFolder);

    expect(vscode.window.showWarningMessage).toHaveBeenCalledWith(
      'Move folder "MyFolder" to "\\X\\Y\\Z"?',
      { modal: true },
      "Move",
    );

    expect(buildApi.updateFolder).toHaveBeenCalledWith(
      { path: "\\X\\Y\\Z\\MyFolder" },
      "project-1",
      "\\A\\B\\C\\MyFolder",
    );
  });
});
