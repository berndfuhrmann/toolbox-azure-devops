import { inject, injectable, injectFromHierarchy, postConstruct } from "inversify";
import { map } from "rxjs";
import vscode from "vscode";
import { AbstractTreeProvider } from "../../common/AbstractTreeProvider";
import { AbstractTreeItem } from "../../common/treeItems/AbstractTreeItem";
import { TreePartProvider } from "../../common/treePartProvider/TreePartProvider";
import { UnwrappingTreePartProvider } from "../../common/treePartProvider/UnwrappingTreePartProvider";
import { types } from "../../generated/types";
import { AccountItem } from "../core/items/AccountItem";
import { TestPlanTreeProviderResolver } from "../../generated/treeProviderResolvers";

@injectable()
@injectFromHierarchy({
  extendConstructorArguments: false,
  extendProperties: true,
})
export class TestPlanTreeProvider extends AbstractTreeProvider {
  #resolver: TestPlanTreeProviderResolver;

  protected sortTreeItems(treeItems: AbstractTreeItem<any>[], parent: AbstractTreeItem<any> | undefined): void {}

  constructor(
    @inject(types.TestPlanTreeProviderResolver)
    resolver: TestPlanTreeProviderResolver,
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
  private initializeTestPlanTreeProvider() {
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
