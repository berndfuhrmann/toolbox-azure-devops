import { inject } from "inversify";
import { firstValueFrom } from "rxjs";
import { Event, TreeItem, Uri } from "vscode";
import { TextDocumentContentProviderPart } from "../../common/CombinedTextDocumentContentProvider";
import { isException } from "../../common/Exception";
import { mapX } from "../../common/exceptionOperators";
import { extensionUrlScheme } from "../../config";
import { ApiService } from "../../generated/ApiService";
import { types } from "../../generated/types";
import { AccountContextProvider } from "../core/AccountContextProvider";
import { PipelineRunTimelineItem } from "./items/PipelineRunTimelineItem";
import { PipelineRunTimelineTreeItem } from "./treeItems/PipelineRunTimelineTreeItem";
import { decode, stringify } from "querystring";

export class BuildLogTextDocumentContentProviderPart extends TextDocumentContentProviderPart {
  #accountContextProvider: AccountContextProvider;
  constructor(
    @inject(types.AccountContextProvider)
    accountContextProvider: AccountContextProvider,
  ) {
    super();
    this.#accountContextProvider = accountContextProvider;
  }

  onDidChange?: Event<Uri> | undefined;

  async handleItem(treeItem: TreeItem) {
    if (treeItem instanceof PipelineRunTimelineTreeItem) {
      const data: PipelineRunTimelineItem = treeItem.data;
      const timelineRecord = data.timeline.records?.find((record) => data.timelineRecordId === record.id);
      const accountId = data.account.accountId;
      const projectId = data.projectId;
      const buildId = data.buildId;
      const logId = timelineRecord?.log?.id;
      const title = timelineRecord?.name;
      if (
        accountId === undefined ||
        projectId === undefined ||
        buildId === undefined ||
        logId === undefined ||
        title === undefined
      ) {
        return;
      }
      const uri = Uri.from({
        scheme: extensionUrlScheme,
        authority: "pipelines.buildlog",
        path: "/" + encodeURIComponent(title),
        query: stringify({
          accountId,
          projectId,
          buildId,
          logId,
        }),
      });
      return [uri];
    }
  }

  handles(uri: Uri): boolean {
    return this.#parseUri(uri) !== undefined;
  }

  #parseUri(uri: Uri) {
    if (uri.scheme !== extensionUrlScheme) {
      return undefined;
    }
    if (uri.authority !== "pipelines.buildlog") {
      return undefined;
    }
    const { accountId, projectId, buildId, logId } = decode(uri.query);
    if (
      typeof accountId !== "string" ||
      !isValidUuid(accountId) ||
      typeof projectId !== "string" ||
      !isValidUuid(projectId) ||
      typeof buildId !== "string" ||
      !isPositiveInteger(buildId) ||
      typeof logId !== "string" ||
      !isPositiveInteger(logId)
    ) {
      return undefined;
    }
    return {
      accountId,
      projectId,
      buildId: Number(buildId),
      logId: Number(logId),
    };
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
        .buildApi()
        .pipe(mapX((buildApi) => buildApi.getBuildLog(parameters.projectId, parameters.buildId, parameters.logId))),
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

function isPositiveInteger(value: string): boolean {
  const num = Number(value);
  return Number.isInteger(num) && num >= 0;
}
