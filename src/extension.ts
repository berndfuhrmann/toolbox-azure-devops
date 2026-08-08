import * as vscode from "vscode";
import { CombinedTextDocumentContentProvider } from "./common/CombinedTextDocumentContentProvider";
import { StatusFileDecorationProvider } from "./common/fileDecorator/StatusFileDecorationProvider";
import { extensionUrlScheme } from "./config";
import { createContainer } from "./container";
import { types } from "./generated/types";
import { AbstractStorageService } from "./common/storage/AbstractStorageService";
import { registerCommands } from "./generated/registerCommands";
import { registerViews } from "./generated/registerViews";
import { registerTreeProviderResolver } from "./generated/register";

export function activate(context: vscode.ExtensionContext) {
  const container = createContainer(context);

  // Track account availability for welcome views
  const storageService = container.get<AbstractStorageService>(types.StorageService);
  const accountSubscription = storageService.getAccounts().subscribe((accounts) => {
    vscode.commands.executeCommand("setContext", "toolbox-azure-devops-by-bf.hasNoAccounts", accounts.length === 0);
  });
  context.subscriptions.push({
    dispose: () => accountSubscription.unsubscribe(),
  });
  registerTreeProviderResolver(container);
  registerViews(context, container);
  registerCommands(context, container);

  context.subscriptions.push(
    vscode.workspace.registerTextDocumentContentProvider(
      extensionUrlScheme,
      container.get<CombinedTextDocumentContentProvider>(types.CombinedTextDocumentContentProvider),
    ),
  );

  context.subscriptions.push(
    vscode.window.registerFileDecorationProvider(
      container.get<StatusFileDecorationProvider>(types.StatusFileDecorationProvider),
    ),
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}
