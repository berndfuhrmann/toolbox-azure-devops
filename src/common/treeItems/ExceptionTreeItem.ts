import { Type } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import { MarkdownString } from "vscode";
import { Exception } from "../Exception";
import { AbstractTreeItem } from "./AbstractTreeItem";

const errorMessageSchema = Type.Object({
  $id: Type.String(),
  innerException: Type.Any(),
  message: Type.String(),
  typeName: Type.String(),
  typeKey: Type.String(),
  errorCode: Type.Number(),
  eventId: Type.Number(),
});
export class ExceptionTreeItem<Data extends Exception = Exception> extends AbstractTreeItem<Data> {
  constructor() {
    super();
    this.label = "Exception";
    this.setIcon("error");
  }

  override updateFrom(data: Data) {
    return [super.updateFrom(data), ...this.updateFromException()].includes(true);
  }

  updateFromException() {
    if (this.data.error instanceof Error) {
      return this.loadHttpException(this.data.error);
    } else {
      return [];
    }
  }

  loadHttpException(error: Error) {
    if (typeof error === "object" && error instanceof Error) {
      if ("statusCode" in error && typeof error.statusCode === "number") {
        const statusCode = error.statusCode;
        let messageString = error.message;
        return this.loadHttpError(statusCode, messageString);
      } else {
        return [this.updateLabel(`Error: ${error.message}`)];
      }
    } else {
      return [this.updateLabel("unknown Exception")];
    }
  }

  loadHttpError(statusCode: number, messageString: string) {
    const message = this.parseErrorMessage(messageString);
    if (message) {
      return [
        this.updateLabel(message.message),
        this.updateTooltip(
          new MarkdownString().appendText(`Http Error (status: ${statusCode}`).appendCodeblock(messageString, "json"),
        ),
      ];
    } else {
      return [this.updateLabel(`unknown HttpException(statusCode: ${statusCode})`), this.updateTooltip(messageString)];
    }
  }

  parseErrorMessage(messageString: string) {
    if (messageString.charCodeAt(0) === 0xfeff) {
      messageString = messageString.slice(1);
    }
    try {
      const messageRaw = JSON.parse(messageString);
      return Value.Parse(errorMessageSchema, messageRaw);
    } catch (error) {
      return undefined;
    }
  }
}

/*
Example for PAT expired:
{
  $id: "1",
  customProperties: {
    Descriptor: null,
    IdentityDisplayName: null,
    Token: null,
    RequestedPermissions: 0,
    NamespaceId: "00000000-0000-0000-0000-000000000000",
  },
  innerException: null,
  message: "Access Denied: The Personal Access Token used has expired.",
  typeName: "Microsoft.VisualStudio.Services.Security.AccessCheckException, Microsoft.VisualStudio.Services.WebApi",
  typeKey: "AccessCheckException",
  errorCode: 0,
  eventId: 3000,
}
*/
