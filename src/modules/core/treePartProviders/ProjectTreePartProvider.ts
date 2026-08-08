import { inject } from "inversify";
import { Observable, switchMap } from "rxjs";
import { Constructor } from "../../../common/constructor";
import { Exception } from "../../../common/Exception";
import { mapX } from "../../../common/exceptionOperators";
import { SettingsService } from "../../../common/SettingsService";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { fromArray } from "../../../common/treePartProvider/fromArray";
import {
  createOrUpdateTreeItem,
  ItemInformation,
  TreePartProvider,
} from "../../../common/treePartProvider/TreePartProvider";
import { updateExceptionTreeItem } from "../../../common/treePartProvider/updateExceptionTreeItem";
import { CoreService } from "../../../generated/services";
import { types } from "../../../generated/types";
import type { AccountItem } from "../items/AccountItem";
import { createProjectItem, type ProjectItem } from "../items/ProjectItem";
import type { ProjectTreeItem } from "../treeItems/ProjectTreeItem";

export class ProjectTreePartProvider extends TreePartProvider<ProjectItem | Exception, AccountItem> {
  getItems(context: Observable<AccountItem>): Observable<ItemInformation<ProjectItem | Exception>> {
    return context.pipe(
      switchMap((context: AccountItem) => {
        const { refreshObservables, refreshObservable } = this.createRefreshObservables("project");
        return context.container
          .get<CoreService>(types.CoreService)
          .projects(refreshObservable)
          .pipe(
            mapX((projects) => projects.map((project) => createProjectItem(context, project, refreshObservables))),
            fromArray(
              (item: ProjectItem) => {
                return item.projectId;
              },
              { refreshObservables },
            ),
          );
      }),
    );
  }

  #projectTreeItemConstructor: Constructor<ProjectTreeItem>;
  #settingsSettings: SettingsService;
  constructor(
    @inject(types.ProjectTreeItem)
    ProjectTreeItemConstructor: Constructor<ProjectTreeItem>,
    @inject(types.SettingsService)
    SettingsService: SettingsService,
  ) {
    super();
    this.#projectTreeItemConstructor = ProjectTreeItemConstructor;
    this.#settingsSettings = SettingsService;
  }

  override updateTreeItem(item: ProjectItem | Exception, key: string, oldTreeItem: AbstractTreeItem<any> | undefined) {
    return updateExceptionTreeItem(item, oldTreeItem) ?? this.updateTreeItemImpl(item as ProjectItem, key, oldTreeItem);
  }

  updateTreeItemImpl(item: ProjectItem, key: string, oldTreeItem: AbstractTreeItem<any> | undefined) {
    return createOrUpdateTreeItem(oldTreeItem, this.#projectTreeItemConstructor, item);
  }
}
