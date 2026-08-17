import * as vscode from "vscode";
import { Container } from "inversify";
import { extensionName } from "../config";
import { workItemSetAssignedToAction, workItemCopyIdAction, workItemSetStateAction, workItemSetEffortAction, workItemSetTitleAction } from "../modules/workItem/actions/workItemActions";
import { handleRefreshAction } from "../common/items/RefreshableTreeItemMixin";
import { removeOrganizationAction } from "../modules/core/actions/removeOrganizationAction";
import { gitRepositoryPullRequestSetTitleAction } from "../modules/repository/actions/gitRepositoryPullRequestActions";
import { handleUnpinAction, handlePinAction } from "../common/items/PinnedTreeItemMixin";
import { pipelineDeleteFolderAction, pipelineCreateFolderAction, pipelineRenameFolderAction } from "../modules/pipeline/actions/folderActions";
import { pipelineCancelRunAction, pipelineRerunRunAction } from "../modules/pipeline/actions/pipelineRunActions";
import { handleOpenInWebAction } from "../common/items/OpenInWebTreeItemMixin";
import { openTextFileAction } from "../common/openTextFileAction";
import { pipelineRevealRepositoryAction, pipelineRunPipelineAction, pipelineRenamePipelineAction, pipelineDeletePipelineAction } from "../modules/pipeline/actions/pipelineActions";
import { updatePersonalAccessTokenAction } from "../modules/core/actions/updatePersonalAccessTokenAction";
import { addOrganizationAction } from "../modules/core/actions/addOrganizationAction";
import { downloadAttachmentAction } from "../modules/workItem/actions/attachmentActions";

export function registerCommands(
  context: vscode.ExtensionContext,
  container: Container,
) {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      extensionName + ".addOrganization",
addOrganizationAction(container),
    ),
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      extensionName + ".removeOrganization",
removeOrganizationAction(container),
    ),
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      extensionName + ".updatePersonalAccessToken",
updatePersonalAccessTokenAction(container),
    ),
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      extensionName + ".openInWeb",
handleOpenInWebAction,
    ),
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      extensionName + ".pin",
handlePinAction,
    ),
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      extensionName + ".unpin",
handleUnpinAction,
    ),
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      extensionName + ".refresh",
handleRefreshAction,
    ),
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      extensionName + ".workItem.downloadAttachment",
downloadAttachmentAction(container),
    ),
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      extensionName + ".workItem.setState",
workItemSetStateAction(container),
    ),
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      extensionName + ".workItem.setTitle",
workItemSetTitleAction(container),
    ),
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      extensionName + ".workItem.setEffort",
workItemSetEffortAction(container),
    ),
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      extensionName + ".workItem.setAssignedTo",
workItemSetAssignedToAction(container),
    ),
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      extensionName + ".workItem.copyId",
workItemCopyIdAction,
    ),
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      extensionName + ".openTextFile",
openTextFileAction(container),
    ),
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      extensionName + ".gitRepository.pullRequest.setTitle",
gitRepositoryPullRequestSetTitleAction(container),
    ),
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      extensionName + ".pipeline.renameFolder",
pipelineRenameFolderAction(container),
    ),
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      extensionName + ".pipeline.createFolder",
pipelineCreateFolderAction(container),
    ),
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      extensionName + ".pipeline.deleteFolder",
pipelineDeleteFolderAction(container),
    ),
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      extensionName + ".pipeline.revealRepository",
pipelineRevealRepositoryAction(container),
    ),
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      extensionName + ".pipeline.renamePipeline",
pipelineRenamePipelineAction(container),
    ),
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      extensionName + ".pipeline.deletePipeline",
pipelineDeletePipelineAction(container),
    ),
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      extensionName + ".pipeline.runPipeline",
pipelineRunPipelineAction(container),
    ),
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      extensionName + ".pipeline.cancelRun",
pipelineCancelRunAction(container),
    ),
  );
  context.subscriptions.push(
    vscode.commands.registerCommand(
      extensionName + ".pipeline.rerunRun",
pipelineRerunRunAction(container),
    ),
  );
}
