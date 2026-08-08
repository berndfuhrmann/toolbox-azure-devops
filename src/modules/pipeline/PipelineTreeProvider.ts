import { Container, inject, injectable, injectFromHierarchy, postConstruct } from "inversify";
import { map } from "rxjs";
import * as vscode from "vscode";
import { AbstractTreeProvider } from "../../common/AbstractTreeProvider";
import { sortByBoolean, sortByString, sortByType, sorter } from "../../common/sorting";
import { AbstractTreeItem } from "../../common/treeItems/AbstractTreeItem";
import { ExceptionTreeItem } from "../../common/treeItems/ExceptionTreeItem";
import { MissingTreeItem } from "../../common/treeItems/MissingTreeItem";
import { TreePartProvider } from "../../common/treePartProvider/TreePartProvider";
import { UnwrappingTreePartProvider } from "../../common/treePartProvider/UnwrappingTreePartProvider";
import { extensionUrlScheme } from "../../config";
import { types } from "../../generated/types";
import { AccountItem } from "../core/items/AccountItem";
import { ProjectItem } from "../core/items/ProjectItem";
import { ProjectTreeItem } from "../core/treeItems/ProjectTreeItem";
import { pipelineMoveFolder } from "./actions/folderActions";
import { pipelineMovePipeline } from "./actions/pipelineActions";
import { PipelineFolderItem } from "./items/PipelineFolderItem";
import { PipelineItem } from "./items/PipelineItem";
import { PipelineFolderTreeItem } from "./treeItems/PipelineFolderTreeItem";
import { PipelineTreeItem } from "./treeItems/PipelineTreeItem";
import { PipelineTreeProviderResolver } from "../../generated/treeProviderResolvers";

const PipelineFolderMimeType = `application/vnd.code.tree.${extensionUrlScheme}.pipeline.folder`;
const PipelineMimeType = `application/vnd.code.tree.${extensionUrlScheme}.pipeline.pipeline`;

@injectable()
@injectFromHierarchy({
  extendConstructorArguments: false,
  extendProperties: true,
})
export class PipelineTreeProvider extends AbstractTreeProvider {
  #container: Container;
  #resolver: PipelineTreeProviderResolver;

  #sorter = sorter(
    sortByBoolean((a: any) => !("pinnedInstance" in a.data)),
    sortByType([
      [ExceptionTreeItem, undefined],
      [MissingTreeItem, undefined],
      [
        PipelineFolderTreeItem,
        sorter(
          sortByBoolean((a: any) => !a.data.pinned),
          sortByString((a: PipelineFolderTreeItem) => String(a.data.folder.path)),
        ),
      ],
      [
        PipelineTreeItem,
        sorter(
          sortByBoolean((a: any) => !a.data.pinned),
          sortByString((a: PipelineTreeItem) => a.data.pipeline.name!),
        ),
      ],
      [ProjectTreeItem, sortByString((a: ProjectTreeItem) => a.data.project.name!)],
    ]),
  ).bind(this);

  protected sortTreeItems(treeItems: AbstractTreeItem<any>[], parent: AbstractTreeItem<any> | undefined): void {
    treeItems.sort(this.#sorter);
  }

  constructor(
    @inject(types.PipelineTreeProviderResolver)
    resolver: PipelineTreeProviderResolver,
    @inject(types.Container)
    container: Container,
  ) {
    super();
    this.#resolver = resolver;
    this.#container = container;
  }

  public override getTreePartProvider(
    element: AbstractTreeItem<any> | undefined,
  ): TreePartProvider<any, any> | undefined {
    return this.#resolver.getTreePartProvider(element);
  }

  @postConstruct()
  private initializePipelineTreeProvider() {
    (
      this.#resolver.accountRootUnwrappingTreePartProvider as UnwrappingTreePartProvider<
        any,
        AccountItem,
        undefined,
        TreePartProvider<any, AccountItem>
      >
    ).unwrapObservable
      .pipe(map((x: { unwrap: boolean }) => x.unwrap))
      .subscribe((unwrap: boolean) => {
        vscode.commands.executeCommand("setContext", "toolbox-azure-devops-by-bf.accounts-unwrapped", unwrap);
      });
  }

  // Drag and drop support
  public override readonly dropMimeTypes = [PipelineFolderMimeType, PipelineMimeType];
  public override readonly dragMimeTypes = [PipelineFolderMimeType, PipelineMimeType];

  public override async handleDrag(
    source: readonly AbstractTreeItem<any>[],
    dataTransfer: vscode.DataTransfer,
    token: vscode.CancellationToken,
  ): Promise<void> {
    // Only allow dragging pipeline folders
    const pipelineFolderItems = source.filter((item) => item instanceof PipelineFolderTreeItem);
    if (pipelineFolderItems.length === 1) {
      const item = pipelineFolderItems[0] as PipelineFolderTreeItem<PipelineFolderItem>;
      dataTransfer.set(PipelineFolderMimeType, new vscode.DataTransferItem(item.id));
    }

    // Only allow dragging pipelines
    const pipelineItems = source.filter((item) => item instanceof PipelineTreeItem);
    if (pipelineItems.length === 1) {
      const item = pipelineItems[0] as PipelineTreeItem<PipelineItem>;
      dataTransfer.set(PipelineMimeType, new vscode.DataTransferItem(item.id));
    }
  }

  public override async handleDrop(
    target: AbstractTreeItem<any> | undefined,
    dataTransfer: vscode.DataTransfer,
    token: vscode.CancellationToken,
  ): Promise<void> {
    // Handle folder drop
    const folderTransferItem = dataTransfer.get(PipelineFolderMimeType);
    if (folderTransferItem) {
      const sourceItem = this.treeItemRegistry.getById(folderTransferItem.value);
      if (!(sourceItem instanceof PipelineFolderTreeItem)) {
        return;
      }

      // Only allow dropping on pipeline folders or project items
      if (target && !(target instanceof PipelineFolderTreeItem) && !(target instanceof ProjectTreeItem)) {
        return;
      }

      // Ensure source and target are in the same project
      const sourceData = sourceItem.data as PipelineFolderItem;
      const targetData = target?.data as PipelineFolderItem | ProjectItem | undefined;
      // FIXME: Do we need to check source and target are on the same account?
      if (targetData && sourceData.projectId !== targetData.projectId) {
        vscode.window.showErrorMessage("Cannot move folders across different projects.");
        return;
      }

      // Get target folder item (use root if target is undefined or ProjectItem)
      const targetFolderItem = targetData && "folder" in targetData ? targetData : undefined;

      await pipelineMoveFolder(this.#container, sourceData, targetFolderItem);
      return;
    }

    // Handle pipeline drop
    const pipelineTransferItem = dataTransfer.get(PipelineMimeType);
    if (pipelineTransferItem) {
      const sourceItem = this.treeItemRegistry.getById(pipelineTransferItem.value);
      if (!(sourceItem instanceof PipelineTreeItem)) {
        return;
      }

      // Only allow dropping on pipeline folders or project items
      if (target && !(target instanceof PipelineFolderTreeItem) && !(target instanceof ProjectTreeItem)) {
        return;
      }

      // Ensure source and target are in the same project
      const sourceData = sourceItem.data as PipelineItem;
      const targetData = target?.data as PipelineFolderItem | ProjectItem | undefined;
      // FIXME: Do we need to check source and target are on the same account?
      if (targetData && sourceData.projectId !== targetData.projectId) {
        vscode.window.showErrorMessage("Cannot move pipelines across different projects.");
        return;
      }

      // Get target folder item (use root if target is undefined or ProjectItem)
      const targetFolderItem = targetData && "folder" in targetData ? targetData : undefined;

      await pipelineMovePipeline(this.#container, sourceData, targetFolderItem);
    }
  }
}
