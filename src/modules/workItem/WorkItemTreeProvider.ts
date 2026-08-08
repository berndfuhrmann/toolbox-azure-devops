import { inject, injectable, injectFromHierarchy, postConstruct } from "inversify";
import { map } from "rxjs";
import vscode from "vscode";
import { sortByBoolean, sortByNumber, sortByString, sortByType, sorter } from "../../common/sorting";
import { AbstractTreeProvider } from "../../common/AbstractTreeProvider";
import { AbstractTreeItem } from "../../common/treeItems/AbstractTreeItem";
import { ExceptionTreeItem } from "../../common/treeItems/ExceptionTreeItem";
import { MissingTreeItem } from "../../common/treeItems/MissingTreeItem";
import { TreePartProvider } from "../../common/treePartProvider/TreePartProvider";
import { UnwrappingTreePartProvider } from "../../common/treePartProvider/UnwrappingTreePartProvider";
import { types } from "../../generated/types";
import { AccountItem } from "../core/items/AccountItem";
import { ProjectTreeItem } from "../core/treeItems/ProjectTreeItem";
import { AllTeamsTreeItem } from "./treeItems/AllTeamsTreeItem";
import { AreaPathsTreeItem } from "./treeItems/AreaPathsTreeItem";
import { WorkItemCurrentSprintGroupTreeItem } from "./treeItems/WorkItemCurrentSprintGroupTreeItem";
import { WorkItemCurrentSprintByAssigneeScopeTreeItem } from "./treeItems/WorkItemCurrentSprintByAssigneeScopeTreeItem";
import { WorkItemCurrentSprintByStateScopeTreeItem } from "./treeItems/WorkItemCurrentSprintByStateScopeTreeItem";
import { WorkItemCurrentSprintUnassignedScopeTreeItem } from "./treeItems/WorkItemCurrentSprintUnassignedScopeTreeItem";
import { WorkItemCurrentSprintTreeItem } from "./treeItems/WorkItemCurrentSprintTreeItem";
import { WorkItemHierarchyTreeItem } from "./treeItems/WorkItemHierarchyTreeItem";
import { MyTeamsTreeItem } from "./treeItems/MyTeamsTreeItem";
import { MyWorkTreeItem } from "./treeItems/MyWorkTreeItem";
import { QueriesTreeItem } from "./treeItems/QueriesTreeItem";
import { WorkItemTeamTreeItem } from "./treeItems/WorkItemTeamTreeItem";
import { WorkItemTreeItem } from "./treeItems/WorkItemTreeItem";
import { WorkItemQueryFolderTreeItem } from "./treeItems/WorkItemQueryFolderTreeItem";
import { WorkItemQueryLeafTreeItem } from "./treeItems/WorkItemQueryLeafTreeItem";
import { WorkItemBacklogTreeItem } from "./treeItems/WorkItemBacklogTreeItem";
import { WorkItemAreaPathTreeItem } from "./treeItems/WorkItemAreaPathTreeItem";
import { TeamSettingsIteration, TimeFrame } from "azure-devops-node-api/interfaces/WorkInterfaces";
import { WorkItemTreeProviderResolver } from "../../generated/treeProviderResolvers";

sortBySprint;
export function sortBySprint<T>(getSprint: (element: T) => TeamSettingsIteration) {
  return (a: T, b: T) => {
    const sprint1 = getSprint(a);
    const sprint2 = getSprint(b);

    // order: current, future, part
    const timeFrame1 = sprint1.attributes?.timeFrame;
    const timeFrame2 = sprint2.attributes?.timeFrame;
    switch (timeFrame1) {
      case TimeFrame.Current:
        switch (timeFrame2) {
          case TimeFrame.Current:
            break;
          case TimeFrame.Future:
          case TimeFrame.Past:
          default:
            return -1;
        }
        break;
      case TimeFrame.Future:
        switch (timeFrame2) {
          case TimeFrame.Current:
            return 1;
          case TimeFrame.Future:
            break;
          case TimeFrame.Past:
          default:
            return -1;
        }
        break;
      case TimeFrame.Past:
        switch (timeFrame2) {
          case TimeFrame.Current:
          case TimeFrame.Future:
            return 1;
          case TimeFrame.Past:
            break;
          default:
            return -1;
        }
        break;
      default:
        switch (timeFrame2) {
          case TimeFrame.Current:
          case TimeFrame.Future:
          case TimeFrame.Past:
            return 1;
          default:
            break;
        }
        break;
    }

    const startTime1 = sprint1.attributes?.startDate?.getTime();
    const startTime2 = sprint2.attributes?.startDate?.getTime();

    if (startTime1 !== startTime2) {
      if (startTime1 === undefined) {
        return -1;
      } else if (startTime2 === undefined) {
        return 1;
      }
      switch (timeFrame1) {
        case TimeFrame.Future:
          return startTime1 - startTime2;
        case TimeFrame.Current:
        case TimeFrame.Past:
        default:
          return startTime2 - startTime1;
      }
    }

    const finishTime1 = sprint1.attributes?.finishDate?.getTime();
    const finishTime2 = sprint2.attributes?.finishDate?.getTime();

    if (finishTime1 !== finishTime2) {
      if (finishTime1 === undefined) {
        return -1;
      } else if (finishTime2 === undefined) {
        return 1;
      }
      switch (timeFrame1) {
        case TimeFrame.Future:
          return finishTime1 - finishTime2;
        case TimeFrame.Current:
        case TimeFrame.Past:
        default:
          return finishTime2 - finishTime1;
      }
    }

    return 0;
  };
}

@injectable()
@injectFromHierarchy({
  extendConstructorArguments: false,
  extendProperties: true,
})
export class WorkItemTreeProvider extends AbstractTreeProvider {
  #resolver: WorkItemTreeProviderResolver;

  #sorter = sorter(
    sortByBoolean((a: any) => !("pinnedInstance" in a.data)),
    sortByType([
      [ExceptionTreeItem, undefined],
      [MissingTreeItem, undefined],
      [
        WorkItemTreeItem,
        sorter(
          sortByBoolean((a: any) => !a.data.pinned),
          sortByNumber((a: WorkItemTreeItem) => -a.data.workItemId),
        ),
      ],
      [MyWorkTreeItem, undefined],
      [MyTeamsTreeItem, undefined],
      [
        WorkItemTeamTreeItem,
        sorter(
          sortByBoolean((a: any) => !a.data.pinned),
          sortByString((a: WorkItemTeamTreeItem) => a.data.team.name ?? ""),
        ),
      ],
      [WorkItemCurrentSprintTreeItem, sortBySprint((a: WorkItemCurrentSprintTreeItem) => a.data.sprint)],
      [WorkItemCurrentSprintByAssigneeScopeTreeItem, undefined],
      [WorkItemCurrentSprintByStateScopeTreeItem, undefined],
      [WorkItemCurrentSprintUnassignedScopeTreeItem, undefined],
      [WorkItemCurrentSprintGroupTreeItem, sortByString((a: WorkItemCurrentSprintGroupTreeItem) => a.data.groupName)],
      [WorkItemBacklogTreeItem, undefined],
      [
        WorkItemAreaPathTreeItem,
        sorter(
          sortByBoolean((a: any) => !a.data.pinned),
          sortByString((a: WorkItemAreaPathTreeItem) => a.data.classificationNode.name ?? ""),
        ),
      ],
      [WorkItemQueryFolderTreeItem, sortByString((a: WorkItemQueryFolderTreeItem) => a.data.queryItem.name ?? "")],
      [
        WorkItemQueryLeafTreeItem,
        sorter(
          sortByBoolean((a: any) => !a.data.pinned),
          sortByString((a: WorkItemQueryLeafTreeItem) => a.data.queryItem.name ?? ""),
        ),
      ],
      [AllTeamsTreeItem, undefined],
      [WorkItemHierarchyTreeItem, undefined],
      [AreaPathsTreeItem, undefined],
      [QueriesTreeItem, undefined],
      [ProjectTreeItem, sortByString((a: ProjectTreeItem) => a.data.project.name!)],
    ]),
  ).bind(this);

  protected sortTreeItems(treeItems: AbstractTreeItem<any>[], _parent: AbstractTreeItem<any> | undefined): void {
    treeItems.sort(this.#sorter);
  }

  constructor(
    @inject(types.WorkItemTreeProviderResolver)
    resolver: WorkItemTreeProviderResolver,
  ) {
    super();
    this.#resolver = resolver;
  }

  public override getTreePartProvider(
    element: AbstractTreeItem<any> | undefined,
  ): TreePartProvider<any, any> | undefined {
    return this.#resolver.getTreePartProvider(element);
  }

  @postConstruct()
  private initializeWorkItemTreeProvider() {
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
}
