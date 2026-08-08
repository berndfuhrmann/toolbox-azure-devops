import { inject } from "inversify";
import { decode, stringify } from "querystring";
import { firstValueFrom } from "rxjs";
import { Event, TreeItem, Uri } from "vscode";
import { TextDocumentContentProviderPart } from "../../common/CombinedTextDocumentContentProvider";
import { isException } from "../../common/Exception";
import { mapX } from "../../common/exceptionOperators";
import { extensionUrlScheme } from "../../config";
import { ApiService } from "../../generated/ApiService";
import { types } from "../../generated/types";
import { AccountContextProvider } from "../core/AccountContextProvider";
import { GitRepositoryItemItem } from "./items/GitRepositoryItemItem";
import { GitRepositoryItemTreeItem } from "./treeItems/GitRepositoryItemTreeItem";

export class RepositoryItemTextDocumentContentProviderPart extends TextDocumentContentProviderPart {
  #accountContextProvider: AccountContextProvider;
  constructor(
    @inject(types.AccountContextProvider)
    accountContextProvider: AccountContextProvider,
  ) {
    super();
    this.#accountContextProvider = accountContextProvider;
  }

  onDidChange?: Event<Uri> | undefined;

  handles(uri: Uri): boolean {
    return this.#parseUri(uri) !== undefined;
  }

  async handleItem(treeItem: TreeItem) {
    if (treeItem instanceof GitRepositoryItemTreeItem && !(treeItem.data as GitRepositoryItemItem).item.isFolder) {
      const data: GitRepositoryItemItem = treeItem.data;

      const accountId = data.account.accountId;
      const projectId = data.projectId;
      const repositoryId = data.gitRepositoryId;
      const path = data.item.path!;
      const versionDescriptor = data.versionDescriptor === undefined ? "" : JSON.stringify(data.versionDescriptor);
      const title = data.item.path!.split("/").at(-1)!;
      const uri = Uri.from({
        scheme: extensionUrlScheme,
        authority: "gitrepository.repositoryitem",
        path: "/" + encodeURIComponent(title),
        query: stringify({
          accountId,
          projectId,
          repositoryId,
          path,
          versionDescriptor,
        }),
      });

      return [uri];
    }
  }

  #parseUri(uri: Uri) {
    if (uri.scheme !== extensionUrlScheme) {
      return undefined;
    }
    if (uri.authority !== "gitrepository.repositoryitem") {
      return undefined;
    }

    const { accountId, projectId, repositoryId, path, versionDescriptor } = decode(uri.query);

    if (
      typeof accountId !== "string" ||
      !isValidUuid(accountId) ||
      typeof projectId !== "string" ||
      !isValidUuid(projectId) ||
      typeof repositoryId !== "string" ||
      !isValidUuid(repositoryId) ||
      typeof versionDescriptor !== "string" ||
      typeof path !== "string"
    ) {
      return undefined;
    }

    try {
      return {
        accountId,
        projectId,
        repositoryId,
        path,
        versionDescriptor: versionDescriptor !== "" ? JSON.parse(versionDescriptor) : undefined,
      };
    } catch {
      return undefined;
    }
  }

  async provideTextDocumentContent(uri: Uri): Promise<string> {
    const dummyContent = "";
    const parameters = this.#parseUri(uri);
    if (parameters === undefined) {
      return dummyContent;
    }
    const accountContainer = this.#accountContextProvider.getAccountContainer(parameters.accountId);
    if (accountContainer === undefined) {
      return dummyContent;
    }
    const apiService = accountContainer.get<ApiService>(types.ApiService);
    const logStream = await firstValueFrom(
      apiService
        .gitApi()
        .pipe(
          mapX((gitApi) =>
            gitApi.getItemContent(
              parameters.repositoryId,
              parameters.path,
              parameters.projectId,
              undefined,
              undefined,
              undefined,
              undefined,
              undefined,
              parameters.versionDescriptor,
              undefined,
              true,
              false,
            ),
          ),
        ),
    );
    //
    if (isException(logStream)) {
      // FIXME: Show error message
      return dummyContent;
    }
    return this.streamToString(logStream);
  }
}

function isValidUuid(uuid: string): boolean {
  const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  return uuidRegex.test(uuid);
}
