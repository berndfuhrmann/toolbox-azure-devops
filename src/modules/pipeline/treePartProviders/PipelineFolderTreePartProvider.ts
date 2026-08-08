import { inject } from "inversify";
import { Observable, switchMap } from "rxjs";
import { Constructor } from "../../../common/constructor";
import { Exception } from "../../../common/Exception";
import { mapX } from "../../../common/exceptionOperators";
import { AbstractTreeItem } from "../../../common/treeItems/AbstractTreeItem";
import { fromArray } from "../../../common/treePartProvider/fromArray";
import {
  ItemInformation,
  createOrUpdateTreeItem,
  TreePartProvider,
} from "../../../common/treePartProvider/TreePartProvider";
import { updateExceptionTreeItem } from "../../../common/treePartProvider/updateExceptionTreeItem";
import { BuildService } from "../../../generated/services";
import { types } from "../../../generated/types";
import { SettingsService } from "../../../common/SettingsService";
import type { ProjectContext } from "../../core/items/ProjectItem";
import { createPipelineFolderItem, PipelineFolderItem } from "../items/PipelineFolderItem";
import type { PipelineFolderTreeItem } from "../treeItems/PipelineFolderTreeItem";

export function getPath(item: ProjectContext | PipelineFolderItem) {
  if ("folder" in item) {
    return item.folder.path!;
  } else {
    return "\\";
  }
}

export function isDirectChildPath(parentPath: string, childPath: string): boolean {
  const childPathPrefix = parentPath.length === 1 ? parentPath : parentPath + "\\";
  return (
    childPath.startsWith(childPathPrefix) &&
    childPath.length > parentPath.length &&
    childPath.indexOf("\\", parentPath.length + 1) === -1
  );
}

export class PipelineFolderTreePartProvider extends TreePartProvider<
  PipelineFolderItem | Exception,
  ProjectContext | PipelineFolderItem
> {
  getItems(
    context: Observable<ProjectContext | PipelineFolderItem>,
  ): Observable<ItemInformation<PipelineFolderItem | Exception>> {
    return context.pipe(
      switchMap((context) => {
        const path = getPath(context);
        const { refreshObservables, refreshObservable } = this.createRefreshObservables("pipelineFolder");
        return context.container
          .get<BuildService>(types.BuildService)
          .folders(context.projectId, refreshObservable)
          .pipe(
            mapX((folders) =>
              folders
                .filter((folder) => folder.path !== undefined && isDirectChildPath(path, folder.path))
                .map((folder) => createPipelineFolderItem(context, folder, refreshObservables)),
            ),
            fromArray((item: PipelineFolderItem) => item.folder.path ?? "", { refreshObservables }),
          );
      }),
    );
  }

  #pipelineFolderTreeItemConstructor: Constructor<PipelineFolderTreeItem>;
  #settingsSettings: SettingsService;
  constructor(
    @inject(types.PinnablePipelineFolderTreeItem)
    PipelineFolderTreeItemConstructor: Constructor<PipelineFolderTreeItem>,
    @inject(types.SettingsService)
    SettingsService: SettingsService,
  ) {
    super();
    this.#pipelineFolderTreeItemConstructor = PipelineFolderTreeItemConstructor;
    this.#settingsSettings = SettingsService;
  }

  override updateTreeItem(
    item: PipelineFolderItem | Exception,
    key: string,
    oldTreeItem: AbstractTreeItem<any> | undefined,
  ) {
    return (
      updateExceptionTreeItem(item, oldTreeItem) ??
      this.updateTreeItemImpl(item as PipelineFolderItem, key, oldTreeItem)
    );
  }

  updateTreeItemImpl(item: PipelineFolderItem, _key: string, oldTreeItem: AbstractTreeItem<any> | undefined) {
    return createOrUpdateTreeItem(oldTreeItem, this.#pipelineFolderTreeItemConstructor, item);
  }
}
