import { parsePullRequestUrl } from "../WorkItemArtifactLink";
import { WorkItemLinkedItemTreeItem } from "./WorkItemLinkedItemTreeItem";
import { WorkItemLinkedItemItem } from "../items/WorkItemLinkedItemItem";

export class WorkItemLinkedPullRequestTreeItem<
  Data extends WorkItemLinkedItemItem = WorkItemLinkedItemItem,
> extends WorkItemLinkedItemTreeItem<Data> {
  public constructor() {
    super();
    this.addContextTag("inWeb");
  }

  public override updateFrom(data: Data) {
    const pullRequestId = data.pullRequest?.pullRequestId ?? parsePullRequestUrl(data.relation.url ?? "");
    const prTitle = data.pullRequest?.title;
    let label: string;
    if (pullRequestId && prTitle) {
      label = `#${pullRequestId}: ${prTitle}`;
    } else if (pullRequestId) {
      label = `Pull Request #${pullRequestId}`;
    } else {
      label = "Pull Request";
    }
    this.data = data;
    return [
      this.updateLabel(label),
      this.updateIcon("git-pull-request"),
      this.updateTooltip("Linked pull request"),
    ].includes(true);
  }
}
