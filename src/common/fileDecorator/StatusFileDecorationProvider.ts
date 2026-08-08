import { inject, injectable } from "inversify";
import * as vscode from "vscode";
import { types } from "../../generated/types";
import { TreeItemRegistry } from "../TreeItemRegistry";
import { AbstractTreeItem } from "../treeItems/AbstractTreeItem";

export const getStatus = Symbol("getStatus");

export interface StatusProvider {
  [getStatus]: () => string | undefined;
}
@injectable()
export class StatusFileDecorationProvider implements vscode.FileDecorationProvider {
  #onDidChangeFileDecorations: vscode.EventEmitter<vscode.Uri | vscode.Uri[]> = new vscode.EventEmitter<
    vscode.Uri | vscode.Uri[]
  >();

  onDidChangeFileDecorations?: vscode.Event<vscode.Uri | vscode.Uri[]> | undefined =
    this.#onDidChangeFileDecorations.event;

  constructor(
    @inject(types.TreeItemRegistry)
    private treeItemRegistry: TreeItemRegistry<AbstractTreeItem<any>>,
  ) {}

  #changeHandler(item: vscode.TreeItem) {
    if (item.resourceUri) {
      this.#onDidChangeFileDecorations.fire(item.resourceUri);
    }
    return false;
  }

  provideFileDecoration(
    uri: vscode.Uri,
    _token: vscode.CancellationToken,
  ): vscode.ProviderResult<vscode.FileDecoration> {
    const treeItem = this.treeItemRegistry.getById(uri.path);
    if (typeof treeItem === "object" && getStatus in treeItem) {
      this.treeItemRegistry.registerListener(treeItem, this.#changeHandler.bind(this));
      const badge = (treeItem as StatusProvider)[getStatus]();
      if (badge !== undefined) {
        return { badge };
      }
    }
  }
}
