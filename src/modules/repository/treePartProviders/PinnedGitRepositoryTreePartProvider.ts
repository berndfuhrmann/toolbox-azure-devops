import { Type } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import { Container, inject, injectable, injectFromHierarchy } from "inversify";
import { map, of } from "rxjs";
import { Constructor } from "../../../common/constructor";
import { isException } from "../../../common/Exception";
import { combineLatestX, mapX, switchMapX } from "../../../common/exceptionOperators";
import { createMissingItem, MissingItem, missingSymbol } from "../../../common/items/MissingItem";
import { createPinnedItem, PinnedItem } from "../../../common/items/PinnedItem";
import { PinInfo, PinnableException } from "../../../common/items/PinnedTreeItemMixin";
import { autoRefresh } from "../../../common/operators";
import { SettingsService } from "../../../common/SettingsService";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { PinnedItemTreePartProvider } from "../../../common/treePartProvider/PinnedTreePartProvider";
import { createOrUpdateTreeItem } from "../../../common/treePartProvider/TreePartProvider";
import { GitService } from "../../../generated/services";
import { types } from "../../../generated/types";
import { createGitRepositoryItem, type GitRepositoryItem } from "../items/GitRepositoryItem";
import type { GitRepositoryTreeItem } from "../treeItems/GitRepositoryTreeItem";

type PinnedGitRepositoryData = {
  gitRepositoryId: string;
  projectId: string;
};

const pinnedGitRepositorySchema = Type.Object({
  gitRepositoryId: Type.String(),
  projectId: Type.String(),
});

@injectable()
@injectFromHierarchy({
  extendConstructorArguments: false,
  extendProperties: true,
})
export class PinnedGitRepositoryTreePartProvider extends PinnedItemTreePartProvider<GitRepositoryItem & PinnedItem> {
  #repositoryTreeItemConstructor: Constructor<GitRepositoryTreeItem<GitRepositoryItem & PinnedItem>>;
  #settingsSettings: SettingsService;

  constructor(
    @inject(types.PinnableGitRepositoryTreeItem)
    GitRepositoryTreeItemConstructor: Constructor<GitRepositoryTreeItem<GitRepositoryItem & PinnedItem>>,
    @inject(types.SettingsService)
    SettingsService: SettingsService,
  ) {
    super("gitrepository");
    this.#repositoryTreeItemConstructor = GitRepositoryTreeItemConstructor;
    this.#settingsSettings = SettingsService;
  }

  override updateTreeItemImpl(
    item: GitRepositoryItem & PinnedItem,
    key: string,
    oldTreeItem: AbstractTreeItem<any> | undefined,
  ) {
    return createOrUpdateTreeItem(oldTreeItem, this.#repositoryTreeItemConstructor, item);
  }

  public retrievePinned(container: Container, pinInfo: PinInfo) {
    const { accountContainer, account } = this.getAccountContext(container, pinInfo);
    const refreshObservable = this.createRefreshObservable();
    const gitService = accountContainer.get<GitService>(types.GitService);
    const parsed = this.#parseAndVerify(pinInfo.object);
    return combineLatestX([
      gitService.repository(parsed.gitRepositoryId, parsed.projectId, refreshObservable).pipe(
        autoRefresh(refreshObservable, this.#settingsSettings.autoRefreshInterval()),
        mapX((repository) => {
          if (repository === null) {
            return gitService
              .repositories(parsed.projectId, refreshObservable)
              .pipe(
                mapX((repositories) => repositories.find((repository) => repository.id === parsed.gitRepositoryId)),
              );
          } else {
            return of(repository);
          }
        }),
        switchMapX((x) => x),
      ),
      account,
    ]).pipe(
      map((item) => {
        if (isException(item)) {
          return {
            ...item,
            icon: "git",
            name: pinInfo.name,
            pinInfo: pinInfo,
            pinned: true,
          } as PinnableException;
        }
        const [repository, account] = item;
        return repository && account
          ? createPinnedItem(
              createGitRepositoryItem(
                {
                  account,
                  container: accountContainer,
                  projectId: repository.project!.id!,
                  refreshObservables: {},
                },
                repository,
                { gitRepository: refreshObservable },
              ),
            )
          : createMissingItem(pinInfo.name, "git", pinInfo);
      }),
    );
  }

  #parseAndVerify(input: string) {
    const parsed = JSON.parse(input);
    return Value.Parse(pinnedGitRepositorySchema, parsed);
  }

  #serialize(data: PinnedGitRepositoryData): string {
    return JSON.stringify(data);
  }

  public getPinInfo = (data: GitRepositoryItem | MissingItem) =>
    missingSymbol in data
      ? data.pinInfo
      : {
          accountId: data.account.accountId,
          name: data.gitRepository.name ?? "unknown",
          object: this.#serialize({
            gitRepositoryId: data.gitRepositoryId,
            projectId: data.projectId,
          }),
          type: this.type,
        };
}
