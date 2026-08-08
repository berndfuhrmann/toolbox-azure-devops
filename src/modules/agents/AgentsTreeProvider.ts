import { inject, injectable, injectFromHierarchy, postConstruct } from "inversify";
import { map } from "rxjs";
import vscode from "vscode";
import { AbstractTreeProvider } from "../../common/AbstractTreeProvider";
import { AbstractTreeItem } from "../../common/treeItems/AbstractTreeItem";
import { sortByBoolean, sortByString, sortByType, sorter } from "../../common/sorting";
import { ExceptionTreeItem } from "../../common/treeItems/ExceptionTreeItem";
import { MissingTreeItem } from "../../common/treeItems/MissingTreeItem";
import { TreePartProvider } from "../../common/treePartProvider/TreePartProvider";
import { UnwrappingTreePartProvider } from "../../common/treePartProvider/UnwrappingTreePartProvider";
import { types } from "../../generated/types";
import { AccountItem } from "../core/items/AccountItem";
import { ProjectTreeItem } from "../core/treeItems/ProjectTreeItem";
import { AgentPoolTreeItem } from "./treeItems/AgentPoolTreeItem";
import { AgentTreeItem } from "./treeItems/AgentTreeItem";
import { AgentsTreeProviderResolver } from "../../generated/treeProviderResolvers";

@injectable()
@injectFromHierarchy({
  extendConstructorArguments: false,
  extendProperties: true,
})
export class AgentsTreeProvider extends AbstractTreeProvider {
  #resolver: AgentsTreeProviderResolver;

  #sorter = sorter(
    sortByBoolean((a: any) => !("pinnedInstance" in a.data)),
    sortByType([
      [ExceptionTreeItem, undefined],
      [MissingTreeItem, undefined],
      [
        AgentPoolTreeItem,
        sorter(
          sortByBoolean((a: any) => !a.data.pinned),
          sortByString((a: AgentPoolTreeItem) => a.data.agentPool.name ?? ""),
        ),
      ],
      [
        AgentTreeItem,
        sorter(
          sortByBoolean((a: any) => !a.data.pinned),
          sortByString((a: AgentTreeItem) => a.data.agent.name ?? ""),
        ),
      ],
      [ProjectTreeItem, sortByString((a: ProjectTreeItem) => a.data.project.name!)],
    ]),
  ).bind(this);

  protected sortTreeItems(treeItems: AbstractTreeItem<any>[], _parent: AbstractTreeItem<any> | undefined): void {
    treeItems.sort(this.#sorter);
  }

  constructor(
    @inject(types.AgentsTreeProviderResolver)
    resolver: AgentsTreeProviderResolver,
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
  private initializeAgentsTreeProvider() {
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
