import { multiInject } from "inversify";
import { CancellationToken, Event, ProviderResult, TextDocumentContentProvider, TreeItem, Uri } from "vscode";
import { types } from "../generated/types";

export abstract class TextDocumentContentProviderPart implements TextDocumentContentProvider {
  abstract onDidChange?: Event<Uri> | undefined;

  abstract provideTextDocumentContent(uri: Uri, token: CancellationToken): ProviderResult<string>;

  abstract handles(uri: Uri): boolean;

  abstract handleItem(treeItem: TreeItem): Promise<Uri[] | undefined>;

  protected async streamToString(stream: NodeJS.ReadableStream): Promise<string> {
    const chunks: Buffer[] = [];
    return new Promise((resolve, reject) => {
      stream.on("data", (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
      stream.on("error", reject);
      stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    });
  }
}

export class CombinedTextDocumentContentProvider implements TextDocumentContentProvider {
  #providerParts: TextDocumentContentProviderPart[];
  constructor(
    @multiInject(types.TextDocumentContentProviderPart)
    textDocumentContentProviderParts: TextDocumentContentProviderPart[],
  ) {
    this.#providerParts = textDocumentContentProviderParts;
  }

  async provideTextDocumentContent(uri: Uri, token: CancellationToken) {
    const handlingProviderPart = this.#providerParts.find((providerPart) => providerPart.handles(uri));
    if (handlingProviderPart) {
      return await handlingProviderPart.provideTextDocumentContent(uri, token);
    }
    return null;
  }
}
