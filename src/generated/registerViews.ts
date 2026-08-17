import * as vscode from "vscode";
import { Container } from "inversify";
import { extensionName } from "../config";
import { AbstractTreeProvider } from "../common/AbstractTreeProvider";
import { AbstractTreeItem } from "../common/treeItems/AbstractTreeItem";
import { types } from "./types";
import { AgentsTreeProvider } from "../modules/agents/AgentsTreeProvider";
import { PipelineTreeProvider } from "../modules/pipeline/PipelineTreeProvider";
import { RepositoryTreeProvider } from "../modules/repository/RepositoryTreeProvider";
import { WorkItemTreeProvider } from "../modules/workItem/WorkItemTreeProvider";

function registerTreeView(
  context: vscode.ExtensionContext,
  treeDataProvider: AbstractTreeProvider,
  name: string,
) {
  const treeView = vscode.window.createTreeView<AbstractTreeItem<any>>(
    extensionName + "." + name,
    {
      treeDataProvider: treeDataProvider,
      dragAndDropController: treeDataProvider,
    },
  );

  context.subscriptions.push(
    treeView,
    treeDataProvider.registerTreeView(treeView),
  );
}

export function registerViews(
  context: vscode.ExtensionContext,
  container: Container,
) {
  registerTreeView(
    context,
    container.get<AgentsTreeProvider>(types.AgentsTreeProvider),
    "agents",
  );
  registerTreeView(
    context,
    container.get<PipelineTreeProvider>(types.PipelineTreeProvider),
    "pipeline",
  );
  registerTreeView(
    context,
    container.get<RepositoryTreeProvider>(types.RepositoryTreeProvider),
    "repository",
  );
  registerTreeView(
    context,
    container.get<WorkItemTreeProvider>(types.WorkItemTreeProvider),
    "workItem",
  );
}
