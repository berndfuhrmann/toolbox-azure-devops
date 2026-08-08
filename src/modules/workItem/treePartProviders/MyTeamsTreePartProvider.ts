import { inject } from "inversify";
import { Constructor } from "../../../common/constructor";
import { SettingsService } from "../../../common/SettingsService";
import { types } from "../../../generated/types";
import { MyTeamsItem } from "../items/WorkItemProjectRootItem";
import { WorkItemTeamTreeItem } from "../treeItems/WorkItemTeamTreeItem";
import { TeamsTreePartProviderBase } from "./TeamsTreePartProviderBase";

export class MyTeamsTreePartProvider extends TeamsTreePartProviderBase<MyTeamsItem> {
  constructor(
    @inject(types.PinnableWorkItemTeamTreeItem)
    WorkItemTeamTreeItemConstructor: Constructor<WorkItemTeamTreeItem>,
    @inject(types.SettingsService)
    SettingsService: SettingsService,
  ) {
    super(WorkItemTeamTreeItemConstructor, SettingsService, true);
  }
}
