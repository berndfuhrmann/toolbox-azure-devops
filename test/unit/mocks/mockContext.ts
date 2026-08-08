import { ExtensionContext, Uri } from "vscode";
export function createMockContext() {
  return {
    subscriptions: [],
    extensionUri: Uri.file("/test/extension"),
  } as unknown as ExtensionContext;
}
