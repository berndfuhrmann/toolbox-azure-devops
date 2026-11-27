import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { GitRepositoryPullRequestCommentItem } from "../items/GitRepositoryPullRequestCommentItem";
import { getCommentLabel, getLikesDescription, getLikesTooltip, getLikeTags } from "../services/pullRequestComments";

export class GitRepositoryPullRequestCommentTreeItem<
  Data extends GitRepositoryPullRequestCommentItem = GitRepositoryPullRequestCommentItem,
> extends AbstractTreeItem<Data> {
  constructor() {
    super();
    this.setIcon("comment");
    this.addContextTag("inWebContextMenu");
  }

  public updateFrom(data: Data) {
    return [
      super.updateFrom(data),
      this.updateLabel(getCommentLabel(data.comment)),
      this.updateDescription(getLikesDescription(data.comment)),
      this.updateTooltip(getLikesTooltip(data.comment)),
      ...Object.entries(getLikeTags(data.comment, data.userId)).map(([tag, present]) => this.updateTag(tag, present)),
    ].includes(true);
  }
}
