import { MarkdownString } from "vscode";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { GitRepositoryPullRequestReviewerItem } from "../items/GitRepositoryPullRequestReviewerItem";

export class GitRepositoryPullRequestReviewerTreeItem<
  Data extends GitRepositoryPullRequestReviewerItem = GitRepositoryPullRequestReviewerItem,
> extends AbstractTreeItem<Data> {
  constructor() {
    super();
  }

  public updateFrom(data: Data) {
    const voteLabels: Record<number, string> = {
      10: "Approved",
      5: "Approved with suggestions",
      0: "No vote",
      [-5]: "Waiting for author",
      [-10]: "Rejected",
    };
    const tooltip = new MarkdownString();
    tooltip.appendText(voteLabels[data.identityRef.vote ?? 0] ?? "No vote");
    tooltip.appendMarkdown("  \n");
    tooltip.appendText(data.identityRef.isRequired ? "Required" : "Optional");
    return [
      super.updateFrom(data),
      this.updateIcon(data.identityRef.isContainer ? "users" : "user"),
      this.updateLabel(`${data.identityRef.displayName ?? "unknown"}`),
      this.updateTooltip(tooltip),
    ].includes(true);
  }
}
