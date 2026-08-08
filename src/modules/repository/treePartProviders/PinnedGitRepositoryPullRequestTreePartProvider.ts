import { Type } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import { Container, inject, injectable, injectFromHierarchy } from "inversify";
import { of } from "rxjs";
import { Constructor } from "../../../common/constructor";
import { combineLatestX, switchMapX } from "../../../common/exceptionOperators";
import { createMissingItem, MissingItem, missingSymbol } from "../../../common/items/MissingItem";
import { createPinnedItem, PinnedItem } from "../../../common/items/PinnedItem";
import { PinInfo } from "../../../common/items/PinnedTreeItemMixin";
import { autoRefresh } from "../../../common/operators";
import { SettingsService } from "../../../common/SettingsService";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { PinnedItemTreePartProvider } from "../../../common/treePartProvider/PinnedTreePartProvider";
import { createOrUpdateTreeItem } from "../../../common/treePartProvider/TreePartProvider";
import { GitService } from "../../../generated/services";
import { types } from "../../../generated/types";
import {
  createGitRepositoryPullRequestItem,
  GitRepositoryPullRequestItem,
} from "../items/GitRepositoryPullRequestItem";
import { GitRepositoryPullRequestTreeItem } from "../treeItems/GitRepositoryPullRequestTreeItem";
import { loadGitRepositoryPullRequestStatusses } from "./GitRepositoryPullRequestTreePartProvider";

type PinnedGitRepositoryPullRequestData = {
  pullRequestId: number;
  projectId: string | undefined;
};

const pinnedGitRepositoryPullRequestSchema = Type.Object({
  pullRequestId: Type.Number(),
  projectId: Type.Optional(Type.String()),
});
@injectable()
@injectFromHierarchy({
  extendConstructorArguments: false,
  extendProperties: true,
})
export class PinnedGitRepositoryPullRequestTreePartProvider extends PinnedItemTreePartProvider<
  GitRepositoryPullRequestItem & PinnedItem
> {
  #repositoryPullRequestTreeItemConstructor: Constructor<
    GitRepositoryPullRequestTreeItem<GitRepositoryPullRequestItem & PinnedItem>
  >;

  constructor(
    @inject(types.PinnableGitRepositoryPullRequestTreeItem)
    GitRepositoryPullRequestTreeItemConstructor: Constructor<
      GitRepositoryPullRequestTreeItem<GitRepositoryPullRequestItem & PinnedItem>
    >,
    @inject(types.SettingsService) SettingsService: SettingsService,
  ) {
    super("gitrepositorypullrequest");
    this.#repositoryPullRequestTreeItemConstructor = GitRepositoryPullRequestTreeItemConstructor;
    this.#settingsSettings = SettingsService;
  }

  updateTreeItemImpl(
    item: GitRepositoryPullRequestItem & PinnedItem,
    key: string,
    oldTreeItem: AbstractTreeItem<any> | undefined,
  ) {
    return createOrUpdateTreeItem(oldTreeItem, this.#repositoryPullRequestTreeItemConstructor, item);
  }

  #settingsSettings: SettingsService;

  public retrievePinned(container: Container, pinInfo: PinInfo) {
    const { accountContainer, account } = this.getAccountContext(container, pinInfo);
    const refreshObservable = this.createRefreshObservable();
    const gitService = accountContainer.get<GitService>(types.GitService);
    const parsed = this.#parseAndVerify(pinInfo.object);
    return combineLatestX([
      gitService.pullRequestById(parsed.pullRequestId, parsed.projectId, refreshObservable),
      account,
    ]).pipe(
      autoRefresh(refreshObservable, this.#settingsSettings.autoRefreshInterval()),
      switchMapX(([pullRequest, account]) => {
        if (!pullRequest) {
          return of(createMissingItem(pinInfo.name, "git-pull-request", pinInfo));
        }
        return of(
          createPinnedItem(
            createGitRepositoryPullRequestItem(
              {
                account,
                container: accountContainer,
                projectId: pullRequest.repository!.project!.id!,
                gitRepositoryId: pullRequest.repository!.id!,
                refreshObservables: {},
              },
              pullRequest,
              { pullRequest: refreshObservable },
            ),
          ),
        ).pipe(
          loadGitRepositoryPullRequestStatusses((item) => this.appendRefreshObservable(item, "pullRequestStatus")),
        );
      }),
    );
  }

  #parseAndVerify(input: string) {
    const parsed = JSON.parse(input);
    return Value.Parse(pinnedGitRepositoryPullRequestSchema, parsed);
  }

  #serialize(data: PinnedGitRepositoryPullRequestData): string {
    return JSON.stringify(data);
  }

  public getPinInfo = (data: GitRepositoryPullRequestItem | MissingItem) =>
    missingSymbol in data
      ? data.pinInfo
      : {
          accountId: data.account.accountId,
          name: data.pullRequest.title ?? "unnamed",
          object: this.#serialize({
            pullRequestId: data.pullRequestId,
            projectId: data.projectId,
          }),
          type: this.type,
        };
}
