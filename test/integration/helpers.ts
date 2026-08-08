import * as vscode from "vscode";
import { Container } from "inversify";
import { firstValueFrom } from "rxjs";
import { AbstractTreeProvider } from "../../src/common/AbstractTreeProvider";
import { AbstractTreeItem } from "../../src/common/treeItems/AbstractTreeItem";
import { types } from "../../src/generated/types";
import { AbstractStorageService } from "../../src/common/storage/AbstractStorageService";
import { createContainer } from "../../src/container";

let testContainer: Container | undefined;
let testContext: vscode.ExtensionContext | undefined;

/**
 * Get a test container for integration tests.
 * Creates a fresh container using the real VSCode extension context.
 */
export function getExtensionContainer(): Container {
  if (!testContainer) {
    // Get the extension context from the activated extension
    const extension = vscode.extensions.getExtension("test-publisher.toolbox-azure-devops");
    if (!extension) {
      throw new Error("Extension not found");
    }
    if (!extension.isActive) {
      throw new Error("Extension is not activated");
    }

    // The extension context is available via the extension's extensionUri
    // We'll create our own container for testing
    const emptyEventEmitter = new vscode.EventEmitter<any>();
    testContext = {
      subscriptions: [],
      extensionUri: extension.extensionUri,
      extensionPath: extension.extensionPath,
      asAbsolutePath: (relativePath: string) => vscode.Uri.joinPath(extension.extensionUri, relativePath).fsPath,
      storageUri: vscode.Uri.joinPath(extension.extensionUri, ".test-storage"),
      globalStorageUri: vscode.Uri.joinPath(extension.extensionUri, ".test-global-storage"),
      logUri: vscode.Uri.joinPath(extension.extensionUri, ".test-logs"),
      extensionMode: vscode.ExtensionMode.Test,
      globalState: {
        keys: () => [],
        get: () => undefined,
        update: async () => {},
        setKeysForSync: () => {},
      } as any,
      workspaceState: {
        keys: () => [],
        get: () => undefined,
        update: async () => {},
      } as any,
      secrets: {
        get: async () => undefined,
        store: async () => {},
        delete: async () => {},
        onDidChange: emptyEventEmitter.event,
      } as any,
      storagePath: undefined,
      globalStoragePath: vscode.Uri.joinPath(extension.extensionUri, ".test-global-storage").fsPath,
      logPath: vscode.Uri.joinPath(extension.extensionUri, ".test-logs").fsPath,
      extension: extension,
      environmentVariableCollection: {} as any,
      languageModelAccessInformation: {} as any,
    } as vscode.ExtensionContext;

    // Create test container
    testContainer = createContainer(testContext);
  }

  return testContainer;
}

/**
 * Setup a tree provider for testing by creating a tree view and returning helpers
 * to interact with it.
 */
export function setupTreeView(
  provider: AbstractTreeProvider,
  viewId: string,
): {
  treeView: vscode.TreeView<AbstractTreeItem<any>>;
  waitForUpdate: () => Promise<void>;
  dispose: () => void;
} {
  const treeView = vscode.window.createTreeView<AbstractTreeItem<any>>(viewId, {
    treeDataProvider: provider,
  });

  const disposable = provider.registerTreeView(treeView);

  const waitForUpdate = (): Promise<void> => {
    return new Promise((resolve) => {
      const listener = provider.onDidChangeTreeData;
      if (!listener) {
        resolve();
        return;
      }
      const disposable = listener(() => {
        disposable.dispose();
        // Allow event loop to complete
        setTimeout(() => resolve(), 0);
      });
    });
  };

  return {
    treeView,
    waitForUpdate,
    dispose: () => {
      treeView.dispose();
      disposable.dispose();
    },
  };
}

/**
 * Assert that a tree structure matches the expected hierarchy.
 *
 * @param provider - The tree provider to test
 * @param parent - The parent item (undefined for root)
 * @param expectedItems - Array of predicates to match against child items
 */
export async function assertTreeStructure(
  provider: AbstractTreeProvider,
  parent: AbstractTreeItem<any> | undefined,
  expectedItems: Array<(item: AbstractTreeItem<any>) => boolean>,
): Promise<void> {
  const children = await provider.getChildren(parent);

  if (!children) {
    throw new Error(`Expected ${expectedItems.length} items but got undefined`);
  }

  if (children.length !== expectedItems.length) {
    throw new Error(`Expected ${expectedItems.length} items but got ${children.length}`);
  }

  for (let i = 0; i < expectedItems.length; i++) {
    if (!expectedItems[i](children[i])) {
      throw new Error(`Item at index ${i} did not match expected predicate`);
    }
  }
}

/**
 * Clear all accounts from storage for test isolation.
 */
export async function clearAccounts(container: Container): Promise<void> {
  const storageService = container.get<AbstractStorageService>(types.StorageService);
  const accounts = await firstValueFrom(storageService.getAccounts());

  for (const account of accounts) {
    await storageService.deleteAccount(account.accountId);
  }
}
