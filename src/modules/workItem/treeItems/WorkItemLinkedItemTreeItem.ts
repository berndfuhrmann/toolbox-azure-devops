import vscode from "vscode";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import {
  isBranchRelation,
  isBuildRelation,
  isCommitRelation,
  isPullRequestRelation,
  parsePullRequestUrl,
} from "../WorkItemArtifactLink";
import { openInWebGetUrl, WorkItemLinkedItemItem } from "../items/WorkItemLinkedItemItem";

export class WorkItemLinkedItemTreeItem<
  Data extends WorkItemLinkedItemItem = WorkItemLinkedItemItem,
> extends AbstractTreeItem<Data> {
  public constructor() {
    super();
    this.collapsibleState = vscode.TreeItemCollapsibleState.None;
    this.setIcon("link");
  }

  public override updateFrom(data: Data) {
    const url = openInWebGetUrl(data);
    if (url) {
      this.addContextTag("inWeb");
    } else {
      this.removeContextTag("inWeb");
    }

    let label: string;
    let iconName: string;
    if (isPullRequestRelation(data.relation)) {
      iconName = "git-pull-request";
      const pullRequestId = data.pullRequest?.pullRequestId ?? parsePullRequestUrl(data.relation.url ?? "");
      const prTitle = data.pullRequest?.title;
      if (pullRequestId && prTitle) {
        label = `#${pullRequestId}: ${prTitle}`;
      } else if (pullRequestId) {
        label = `Pull Request #${pullRequestId}`;
      } else {
        label = "Pull Request";
      }
    } else if (isCommitRelation(data.relation)) {
      iconName = "git-commit";
      const commitMessage = data.commit?.comment ?? data.commit?.commitId ?? data.relation.url ?? "Commit";
      label = commitMessage;
    } else if (isBranchRelation(data.relation)) {
      iconName = "git-branch";
      label = data.branchName ?? data.relation.attributes?.["name"] ?? data.relation.url ?? "Branch";
    } else if (isBuildRelation(data.relation)) {
      iconName = "run";
      const buildName = data.build?.definition?.name;
      const buildNumber = data.build?.buildNumber;
      if (buildName && buildNumber) {
        label = `${buildName} #${buildNumber}`;
      } else if (buildName) {
        label = buildName;
      } else if (buildNumber) {
        label = `Build #${buildNumber}`;
      } else {
        label = data.relation.attributes?.["name"] ?? data.relation.url ?? "Build";
      }
    } else {
      iconName = "link";
      const relationType = data.relation.rel ?? "Unknown";
      const title = data.relation.attributes?.["name"] ?? data.relation.url ?? "Unknown";
      label = `${relationType}: ${title}`;
    }

    return [super.updateFrom(data), this.updateLabel(label), this.updateIcon(iconName)].includes(true);
  }
}
