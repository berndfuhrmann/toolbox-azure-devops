import { GitStatusState } from "azure-devops-node-api/interfaces/GitInterfaces";
import { MarkdownString, TreeItemCollapsibleState } from "vscode";
import { getStatus } from "../../../common/fileDecorator/StatusFileDecorationProvider";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { GitRepositoryPullRequestItem } from "../items/GitRepositoryPullRequestItem";
import { refToDisplayString } from "../items/GitRepositoryItem";

export class GitRepositoryPullRequestTreeItem<
  Data extends GitRepositoryPullRequestItem = GitRepositoryPullRequestItem,
> extends AbstractTreeItem<Data> {
  constructor() {
    super();
    this.collapsibleState = TreeItemCollapsibleState.Collapsed;
    this.addContextTag("inWeb");
    this.addContextTag("gitRepository.pullRequest");
  }

  public updateFrom(data: Data) {
    const tooltip = new MarkdownString();
    tooltip.appendMarkdown(`#${data.pullRequest.pullRequestId}`);
    if (data.pullRequest.createdBy?.displayName) {
      tooltip.appendMarkdown(" by ");
      tooltip.appendText(data.pullRequest.createdBy.displayName);
    }
    if (data.pullRequest.creationDate) {
      tooltip.appendMarkdown("  \nCreated ");
      tooltip.appendText(new Date(data.pullRequest.creationDate).toLocaleDateString());
    }
    tooltip.appendMarkdown("  \n`");
    tooltip.appendText(refToDisplayString(data.pullRequest.sourceRefName));
    tooltip.appendMarkdown("` \u2192 `");
    tooltip.appendText(refToDisplayString(data.pullRequest.targetRefName));
    tooltip.appendMarkdown("`");
    return [
      super.updateFrom(data),
      this.updateLabel((data.pullRequest.isDraft ? "[DRAFT] " : "") + (data.pullRequest.title ?? "unnamed")),
      this.updateIcon(data.pullRequest.isDraft ? "git-pull-request-draft" : "git-pull-request"),
      this.updateTooltip(tooltip),
    ].includes(true);
  }

  public [getStatus]() {
    if (this.data.pullRequestStatusses) {
      if (
        this.data.pullRequestStatusses.some(
          (s) => s.state === GitStatusState.NotApplicable || s.state === GitStatusState.NotSet,
        )
      ) {
        return "❓";
      }
      if (
        this.data.pullRequestStatusses.some(
          (s) => s.state === GitStatusState.Failed || s.state === GitStatusState.Error,
        )
      ) {
        return "❌";
      }
      if (this.data.pullRequestStatusses.some((s) => s.state === GitStatusState.Pending)) {
        return "🔄";
      }
      if (this.data.pullRequestStatusses.some((s) => s.state === GitStatusState.PartiallySucceeded)) {
        return "⚠️";
      }
      if (this.data.pullRequestStatusses.some((s) => s.state === GitStatusState.Succeeded)) {
        return "✅";
      }
    }
    return "";
  }
}
