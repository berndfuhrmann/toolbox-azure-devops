import vscode from "vscode";
import { Container } from "inversify";
import { TextDocumentContentProviderPart } from "./CombinedTextDocumentContentProvider";
import { TreeItem } from "vscode";
import { types } from "../generated/types";

export function openTextFileAction(container: Container) {
  return async (treeItem: TreeItem) => {
    const providers = container.getAll<TextDocumentContentProviderPart>(types.TextDocumentContentProviderPart);
    for (const provider of providers) {
      const result = await provider.handleItem(treeItem);
      if (result !== undefined) {
        for (const uri of result) {
          const doc = await vscode.workspace.openTextDocument(uri);
          await vscode.window.showTextDocument(doc, { preview: false });
        }
        return;
      }
    }
  };
}
