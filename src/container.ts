import { Container } from "inversify";
import vscode from "vscode";
import { CombinedTextDocumentContentProvider } from "./common/CombinedTextDocumentContentProvider";
import { StatusFileDecorationProvider } from "./common/fileDecorator/StatusFileDecorationProvider";
import { MissingItem } from "./common/items/MissingItem";
import { PinnedItem } from "./common/items/PinnedItem";
import {
  getPinInfo as getPinnedExceptionPinInfo,
  PinnableException,
  PinnedTreeItemMixin,
} from "./common/items/PinnedTreeItemMixin";
import { AbstractStorageService } from "./common/storage/AbstractStorageService";
import { VSCodeStorageService } from "./common/storage/VSCodeStorageService";
import { IconService } from "./common/icons/IconService";
import { TreeItemRegistry } from "./common/TreeItemRegistry";
import { AbstractTreeItem } from "./common/treeItems/AbstractTreeItem";
import { ExceptionTreeItem } from "./common/treeItems/ExceptionTreeItem";
import { getPinInfo as getMissingItemPinInfo, MissingTreeItem } from "./common/treeItems/MissingTreeItem";
import { registerTreeItem, registerTreePartProvider, registerTreeProvider } from "./generated/register";
import { types } from "./generated/types";
import { AccountContextProvider } from "./modules/core/AccountContextProvider";
import { BuildLogTextDocumentContentProviderPart } from "./modules/pipeline/BuildLogTextDocumentContentProviderPart";
import { PipelineDefinitionTextDocumentContentProviderPart } from "./modules/pipeline/PipelineDefinitionTextDocumentContentProviderPart";
import { RepositoryItemTextDocumentContentProviderPart } from "./modules/repository/RepositoryItemTextDocumentContentProviderPart";
import { SettingsService } from "./common/SettingsService";

export function createContainer(context: vscode.ExtensionContext) {
  const container = new Container();
  container.bind<vscode.ExtensionContext>(types.vscodeContext).toConstantValue(context);
  container
    .bind<vscode.OutputChannel>(types.outputChannel)
    .toConstantValue(vscode.window.createOutputChannel("Toolbox for Azure Devops"));
  container.bind<Container>(types.Container).toConstantValue(container);
  container.bind<AccountContextProvider>(types.AccountContextProvider).to(AccountContextProvider).inSingletonScope();
  container.bind<SettingsService>(types.SettingsService).to(SettingsService).inSingletonScope();
  container
    .bind<IconService>(types.IconService)
    .toDynamicValue((ctx) => new IconService(ctx.get<vscode.ExtensionContext>(types.vscodeContext).extensionUri))
    .inSingletonScope();
  container.bind<AbstractStorageService>(types.StorageService).to(VSCodeStorageService).inSingletonScope();
  container
    .bind<TreeItemRegistry<AbstractTreeItem<any>>>(types.TreeItemRegistry)
    .to(TreeItemRegistry)
    .inSingletonScope();
  container
    .bind<StatusFileDecorationProvider>(types.StatusFileDecorationProvider)
    .to(StatusFileDecorationProvider)
    .inSingletonScope();
  container
    .bind<BuildLogTextDocumentContentProviderPart>(types.TextDocumentContentProviderPart)
    .to(BuildLogTextDocumentContentProviderPart)
    .inSingletonScope();
  container
    .bind<PipelineDefinitionTextDocumentContentProviderPart>(types.TextDocumentContentProviderPart)
    .to(PipelineDefinitionTextDocumentContentProviderPart)
    .inSingletonScope();
  container
    .bind<RepositoryItemTextDocumentContentProviderPart>(types.TextDocumentContentProviderPart)
    .to(RepositoryItemTextDocumentContentProviderPart)
    .inSingletonScope();
  container
    .bind<CombinedTextDocumentContentProvider>(types.CombinedTextDocumentContentProvider)
    .to(CombinedTextDocumentContentProvider)
    .inSingletonScope();
  registerTreeProvider(container);
  registerTreePartProvider(container);
  registerTreeItem(container);

  container.rebindSync(types.PinnedExceptionTreeItem).toDynamicValue((context) => {
    return PinnedTreeItemMixin(
      context.get<typeof ExceptionTreeItem<PinnableException>>(types.ExceptionTreeItem),
      getPinnedExceptionPinInfo,
      context.get<AbstractStorageService>(types.StorageService),
    );
  });

  container.rebindSync(types.PinnedMissingTreeItem).toDynamicValue((context) => {
    return PinnedTreeItemMixin(
      context.get<typeof MissingTreeItem<MissingItem & PinnedItem>>(types.MissingTreeItem),
      getMissingItemPinInfo,
      context.get<AbstractStorageService>(types.StorageService),
    );
  });

  return container;
}
