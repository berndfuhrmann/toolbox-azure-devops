import { Container } from "inversify";
import { types } from "./types";
import { Constructor } from "../common/constructor";
import { IconService } from "../common/icons/IconService";
import { ExtensionContextTreeItemMixin } from "../common/items/ExtensionContextTreeItemMixin";
import {
  AlertService,
  BuildService,
  CixService,
  CoreService,
  DashboardService,
  ExtensionManagementService,
  FeatureManagementService,
  FileContainerService,
  GalleryService,
  GitService,
  LocationsService,
  ManagementService,
  NotificationService,
  PipelinesService,
  PolicyService,
  ProfileService,
  ProjectAnalysisService,
  ReleaseService,
  SecurityRolesService,
  TaskAgentService,
  TaskService,
  TestService,
  TestPlanService,
  TestResultsService,
  WikiService,
  WorkService,
  WorkItemTrackingService,
  WorkItemTrackingProcessService,
  WorkItemTrackingProcessDefinitionService,
} from "./services";
import {
  handleOpenInWebAction,
  OpenInWebTreeItemMixin,
} from "../common/items/OpenInWebTreeItemMixin";

import { 
  handleRefreshAction, 
  RefreshableTreeItemMixin 
} from "../common/items/RefreshableTreeItemMixin";

import { PinnedTreeItemMixin } from "../common/items/PinnedTreeItemMixin";
import { PinnedItem } from "../common/items/PinnedItem";
import { PinnableTreePartProviderMixin } from "../common/treePartProvider/PinnableTreePartProviderMixin";

import {
  RepositoryTreeProviderResolver,
  PipelineTreeProviderResolver,
  DashboardTreeProviderResolver,
  WorkItemTreeProviderResolver,
  WikiTreeProviderResolver,
  TestPlanTreeProviderResolver,
  AgentsTreeProviderResolver,
} from "./treeProviderResolvers";

// imports
import { PipelineFolderTreePartProvider } from "../modules/pipeline/treePartProviders/PipelineFolderTreePartProvider";
import { BacklogContentTreePartProvider } from "../modules/workItem/treePartProviders/BacklogContentTreePartProvider";
import { DashboardWidgetItem } from "../modules/dashboard/items/DashboardWidgetItem";
import { GitRepositoryPullRequestStatusTreePartProvider } from "../modules/repository/treePartProviders/GitRepositoryPullRequestStatusTreePartProvider";
import { MyTeamsTreePartProvider } from "../modules/workItem/treePartProviders/MyTeamsTreePartProvider";
import { AreaPathsItem, MyTeamsItem, MyWorkItem, AllTeamsItem, WorkItemHierarchyItem, QueriesItem } from "../modules/workItem/items/WorkItemProjectRootItem";
import { AssignedToMeTreePartProvider } from "../modules/workItem/treePartProviders/AssignedToMeTreePartProvider";
import { QueriesTreeItem } from "../modules/workItem/treeItems/QueriesTreeItem";
import { PipelineRunTimelineItem } from "../modules/pipeline/items/PipelineRunTimelineItem";
import { WorkItemRevisionFieldChangeTreeItem } from "../modules/workItem/treeItems/WorkItemRevisionFieldChangeTreeItem";
import { WorkItemTreeItem } from "../modules/workItem/treeItems/WorkItemTreeItem";
import { PipelineRunItem } from "../modules/pipeline/items/PipelineRunItem";
import { AreaPathChildrenTreePartProvider } from "../modules/workItem/treePartProviders/AreaPathChildrenTreePartProvider";
import { GitRepositoryPullRequestItem, openInWebGetUrl as openInWebGetUrlGitRepositoryPullRequest } from "../modules/repository/items/GitRepositoryPullRequestItem";
import { GitRepositoryItemTreeItem } from "../modules/repository/treeItems/GitRepositoryItemTreeItem";
import { WorkItemCurrentSprintItem } from "../modules/workItem/items/WorkItemCurrentSprintItem";
import { PinnedGitRepositoryPullRequestTreePartProvider } from "../modules/repository/treePartProviders/PinnedGitRepositoryPullRequestTreePartProvider";
import { MentionedTreePartProvider } from "../modules/workItem/treePartProviders/MentionedTreePartProvider";
import { JobsContainerTreeItem } from "../modules/agents/treeItems/JobsContainerTreeItem";
import { PinnedPipelineFolderTreePartProvider } from "../modules/pipeline/treePartProviders/PinnedPipelineFolderTreePartProvider";
import { AttachmentTreePartProvider } from "../modules/workItem/treePartProviders/AttachmentTreePartProvider";
import { WorkItemLinkedCommitsTreePartProvider } from "../modules/workItem/treePartProviders/WorkItemLinkedCommitsTreePartProvider";
import { WorkItemLinkedBuildsTreeItem } from "../modules/workItem/treeItems/WorkItemLinkedBuildsTreeItem";
import { PipelineTreeItem } from "../modules/pipeline/treeItems/PipelineTreeItem";
import { WorkItemLinkedItemItem, openInWebGetUrl as openInWebGetUrlWorkItemLinkedItem, openInWebGetUrl as openInWebGetUrlWorkItemLinkedPullRequest, openInWebGetUrl as openInWebGetUrlWorkItemLinkedBuild, openInWebGetUrl as openInWebGetUrlWorkItemLinkedCommit, openInWebGetUrl as openInWebGetUrlWorkItemLinkedBranch } from "../modules/workItem/items/WorkItemLinkedItemItem";
import { GitRepositoryPullRequestReviewerItem } from "../modules/repository/items/GitRepositoryPullRequestReviewerItem";
import { MissingItem } from "../common/items/MissingItem";
import { AgentPoolTreeItem } from "../modules/agents/treeItems/AgentPoolTreeItem";
import { CurrentSprintScopeContentTreePartProvider } from "../modules/workItem/treePartProviders/CurrentSprintScopeContentTreePartProvider";
import { GitRepositoryCommitsTreeItem } from "../modules/repository/treeItems/GitRepositoryCommitsTreeItem";
import { AreaPathHierarchyRootTreePartProvider } from "../modules/workItem/treePartProviders/AreaPathHierarchyRootTreePartProvider";
import { WorkItemLinkedBranchesTreePartProvider } from "../modules/workItem/treePartProviders/WorkItemLinkedBranchesTreePartProvider";
import { ExceptionTreeItem } from "../common/treeItems/ExceptionTreeItem";
import { WorkItemCurrentSprintByAssigneeScopeTreeItem } from "../modules/workItem/treeItems/WorkItemCurrentSprintByAssigneeScopeTreeItem";
import { WorkItemLinkedBranchesTreeItem } from "../modules/workItem/treeItems/WorkItemLinkedBranchesTreeItem";
import { MissingTreeItem } from "../common/treeItems/MissingTreeItem";
import { WorkItemHierarchyTreeItem } from "../modules/workItem/treeItems/WorkItemHierarchyTreeItem";
import { ExceptionItem } from "../common/items/ExceptionItem";
import { GitRepositoryPullRequestsTreeItem } from "../modules/repository/treeItems/GitRepositoryPullRequestsTreeItem";
import { GitRepositoryPullRequestTreeItem } from "../modules/repository/treeItems/GitRepositoryPullRequestTreeItem";
import { ProjectRootTreePartProvider } from "../modules/workItem/treePartProviders/ProjectRootTreePartProvider";
import { WorkItemRevisionTreeItem } from "../modules/workItem/treeItems/WorkItemRevisionTreeItem";
import { DashboardTreeProvider } from "../modules/dashboard/DashboardTreeProvider";
import { GitRepositoryCommitTreeItem } from "../modules/repository/treeItems/GitRepositoryCommitTreeItem";
import { GitRepositoryPullRequestReviewerTreePartProvider } from "../modules/repository/treePartProviders/GitRepositoryPullRequestReviewerTreePartProvider";
import { GitRepositoryTagItem } from "../modules/repository/items/GitRepositoryTagItem";
import { MentionedTreeItem } from "../modules/workItem/treeItems/MentionedTreeItem";
import { WorkItemHistoryTreeItem } from "../modules/workItem/treeItems/WorkItemHistoryTreeItem";
import { DashboardWidgetTreeItem } from "../modules/dashboard/treeItems/DashboardWidgetTreeItem";
import { AttachmentTreeItem } from "../modules/workItem/treeItems/AttachmentTreeItem";
import { TestPlanTreeProvider } from "../modules/testPlan/TestPlanTreeProvider";
import { PipelineTreeProvider } from "../modules/pipeline/PipelineTreeProvider";
import { WorkItemRevisionFieldChangeItem } from "../modules/workItem/items/WorkItemRevisionFieldChangeItem";
import { WorkItemCommentsTreePartProvider } from "../modules/workItem/treePartProviders/WorkItemCommentsTreePartProvider";
import { PipelineItem, openInWebGetUrl as openInWebGetUrlPipeline } from "../modules/pipeline/items/PipelineItem";
import { GitRepositoryItemsTreeItem } from "../modules/repository/treeItems/GitRepositoryItemsTreeItem";
import { PinnedAgentPoolTreePartProvider } from "../modules/agents/treePartProviders/PinnedAgentPoolTreePartProvider";
import { GitRepositoryPullRequestCommentThreadTreePartProvider } from "../modules/repository/treePartProviders/GitRepositoryPullRequestCommentThreadTreePartProvider";
import { PipelineRunTimelineTreePartProvider } from "../modules/pipeline/treePartProviders/PipelineRunTimelineTreePartProvider";
import { GitRepositoryBranchesTreeItem } from "../modules/repository/treeItems/GitRepositoryBranchesTreeItem";
import { AgentJobsContainerTreeItem } from "../modules/agents/treeItems/AgentJobsContainerTreeItem";
import { GitRepositoryTreePartProvider } from "../modules/repository/treePartProviders/GitRepositoryTreePartProvider";
import { QueryResultsTreePartProvider } from "../modules/workItem/treePartProviders/QueryResultsTreePartProvider";
import { PinnedGitRepositoryTreePartProvider } from "../modules/repository/treePartProviders/PinnedGitRepositoryTreePartProvider";
import { PipelineFolderItem } from "../modules/pipeline/items/PipelineFolderItem";
import { AgentTreeItem } from "../modules/agents/treeItems/AgentTreeItem";
import { WorkItemAttachmentsTreeItem } from "../modules/workItem/treeItems/WorkItemAttachmentsTreeItem";
import { WorkItemTeamTreeItem } from "../modules/workItem/treeItems/WorkItemTeamTreeItem";
import { LoadingItem } from "../common/items/LoadingItem";
import { ProjectItem } from "../modules/core/items/ProjectItem";
import { GitRepositoryPullRequestTreePartProvider } from "../modules/repository/treePartProviders/GitRepositoryPullRequestTreePartProvider";
import { AllTeamsTreePartProvider } from "../modules/workItem/treePartProviders/AllTeamsTreePartProvider";
import { WorkItemCurrentSprintGroupTreeItem } from "../modules/workItem/treeItems/WorkItemCurrentSprintGroupTreeItem";
import { RepositoryTreeProvider } from "../modules/repository/RepositoryTreeProvider";
import { HierarchyRootContentTreePartProvider } from "../modules/workItem/treePartProviders/HierarchyRootContentTreePartProvider";
import { PinnedWorkItemAreaPathTreePartProvider } from "../modules/workItem/treePartProviders/PinnedWorkItemAreaPathTreePartProvider";
import { PipelineRunTimelineTreeItem } from "../modules/pipeline/treeItems/PipelineRunTimelineTreeItem";
import { MyWorkTreeItem } from "../modules/workItem/treeItems/MyWorkTreeItem";
import { RecentlyModifiedByMeTreeItem } from "../modules/workItem/treeItems/RecentlyModifiedByMeTreeItem";
import { WorkItemCurrentSprintTreeItem } from "../modules/workItem/treeItems/WorkItemCurrentSprintTreeItem";
import { GitRepositoryTreeItem } from "../modules/repository/treeItems/GitRepositoryTreeItem";
import { WorkItemCommentItem } from "../modules/workItem/items/WorkItemCommentItem";
import { WorkItemLinkedCommitsTreeItem } from "../modules/workItem/treeItems/WorkItemLinkedCommitsTreeItem";
import { GitRepositoryPullRequestStatusItem } from "../modules/repository/items/GitRepositoryPullRequestStatusItem";
import { GitRepositoryBranchTreePartProvider } from "../modules/repository/treePartProviders/GitRepositoryBranchTreePartProvider";
import { AllTeamsTreeItem } from "../modules/workItem/treeItems/AllTeamsTreeItem";
import { GitRepositoryPullRequestStatusTreeItem } from "../modules/repository/treeItems/GitRepositoryPullRequestStatusTreeItem";
import { WorkItemBacklogTreeItem } from "../modules/workItem/treeItems/WorkItemBacklogTreeItem";
import { openInWebGetUrl as openInWebGetUrlDashboard, DashboardItem } from "../modules/dashboard/items/DashboardItem";
import { PipelineRunArtifactItem } from "../modules/pipeline/items/PipelineRunArtifactItem";
import { ProjectTreeItem } from "../modules/core/treeItems/ProjectTreeItem";
import { CurrentSprintGroupWorkItemTreePartProvider } from "../modules/workItem/treePartProviders/CurrentSprintGroupWorkItemTreePartProvider";
import { AgentJobTreePartProvider } from "../modules/agents/treePartProviders/AgentJobTreePartProvider";
import { WorkItemQueryItem } from "../modules/workItem/items/WorkItemQueryItem";
import { GitRepositoryPullRequestCommentThreadTreeItem } from "../modules/repository/treeItems/GitRepositoryPullRequestCommentThreadTreeItem";
import { WorkItemLinkedWorkItemGroupsTreePartProvider } from "../modules/workItem/treePartProviders/WorkItemLinkedWorkItemGroupsTreePartProvider";
import { WorkItemRevisionItem } from "../modules/workItem/items/WorkItemRevisionItem";
import { AgentsContainerTreeItem } from "../modules/agents/treeItems/AgentsContainerTreeItem";
import { ProjectTreePartProvider } from "../modules/core/treePartProviders/ProjectTreePartProvider";
import { WorkItemAreaPathItem } from "../modules/workItem/items/WorkItemAreaPathItem";
import { MyTeamsTreeItem } from "../modules/workItem/treeItems/MyTeamsTreeItem";
import { WorkItemHistoryTreePartProvider } from "../modules/workItem/treePartProviders/WorkItemHistoryTreePartProvider";
import { GitRepositoryPullRequestWorkItemTreePartProvider } from "../modules/repository/treePartProviders/GitRepositoryPullRequestWorkItemTreePartProvider";
import { WorkItemCommentTreeItem } from "../modules/workItem/treeItems/WorkItemCommentTreeItem";
import { DashboardTreeItem } from "../modules/dashboard/treeItems/DashboardTreeItem";
import { openInWebGetUrl as openInWebGetUrlWorkItem, WorkItemItem } from "../modules/workItem/items/WorkItemItem";
import { WorkItemCurrentSprintGroupItem } from "../modules/workItem/items/WorkItemCurrentSprintGroupItem";
import { AgentPoolTreePartProvider } from "../modules/agents/treePartProviders/AgentPoolTreePartProvider";
import { GitRepositoryPullRequestReviewersTreeItem } from "../modules/repository/treeItems/GitRepositoryPullRequestReviewersTreeItem";
import { WorkItemTreeProvider } from "../modules/workItem/WorkItemTreeProvider";
import { PipelineTreePartProvider } from "../modules/pipeline/treePartProviders/PipelineTreePartProvider";
import { GitRepositoryTagTreePartProvider } from "../modules/repository/treePartProviders/GitRepositoryTagTreePartProvider";
import { HierarchyChildrenTreePartProvider } from "../modules/workItem/treePartProviders/HierarchyChildrenTreePartProvider";
import { AgentItem } from "../modules/agents/items/AgentItem";
import { PipelineRunTreeItem } from "../modules/pipeline/treeItems/PipelineRunTreeItem";
import { AccountTreeItem } from "../modules/core/treeItems/AccountTreeItem";
import { WorkItemLinkedPullRequestsTreeItem } from "../modules/workItem/treeItems/WorkItemLinkedPullRequestsTreeItem";
import { QueryFolderChildrenTreePartProvider } from "../modules/workItem/treePartProviders/QueryFolderChildrenTreePartProvider";
import { GitRepositoryBranchItem } from "../modules/repository/items/GitRepositoryBranchItem";
import { PipelineRunArtifactTreeItem } from "../modules/pipeline/treeItems/PipelineRunArtifactTreeItem";
import { AccountTreePartProvider } from "../modules/core/treePartProviders/AccountTreePartProvider";
import { AgentsTreeProvider } from "../modules/agents/AgentsTreeProvider";
import { GitRepositoryItemTreePartProvider } from "../modules/repository/treePartProviders/GitRepositoryItemTreePartProvider";
import { QueriesContentTreePartProvider } from "../modules/workItem/treePartProviders/QueriesContentTreePartProvider";
import { LoadingTreeItem } from "../common/treeItems/LoadingTreeItem";
import { WorkItemLinkedPullRequestTreeItem } from "../modules/workItem/treeItems/WorkItemLinkedPullRequestTreeItem";
import { WorkItemCurrentSprintByAssigneeScopeItem } from "../modules/workItem/items/WorkItemCurrentSprintByAssigneeScopeItem";
import { WorkItemLinkedBranchTreeItem } from "../modules/workItem/treeItems/WorkItemLinkedBranchTreeItem";
import { GitRepositoryTagTreeItem } from "../modules/repository/treeItems/GitRepositoryTagTreeItem";
import { WorkItemCommentsTreeItem } from "../modules/workItem/treeItems/WorkItemCommentsTreeItem";
import { PinnedWorkItemQueryLeafTreePartProvider } from "../modules/workItem/treePartProviders/PinnedWorkItemQueryLeafTreePartProvider";
import { DashboardWidgetTreePartProvider } from "../modules/dashboard/treePartProviders/DashboardWidgetTreePartProvider";
import { WorkItemQueryLeafTreeItem } from "../modules/workItem/treeItems/WorkItemQueryLeafTreeItem";
import { AgentJobItem } from "../modules/agents/items/AgentJobItem";
import { CurrentSprintTreePartProvider } from "../modules/workItem/treePartProviders/CurrentSprintTreePartProvider";
import { WorkItemCurrentSprintByStateScopeItem } from "../modules/workItem/items/WorkItemCurrentSprintByStateScopeItem";
import { AreaPathsContentTreePartProvider } from "../modules/workItem/treePartProviders/AreaPathsContentTreePartProvider";
import { GitRepositoryItem, openInWebGetUrl as openInWebGetUrlGitRepository } from "../modules/repository/items/GitRepositoryItem";
import { WorkItemLinkedItemTreeItem } from "../modules/workItem/treeItems/WorkItemLinkedItemTreeItem";
import { WorkItemLinkedWorkItemsTreePartProvider } from "../modules/workItem/treePartProviders/WorkItemLinkedWorkItemsTreePartProvider";
import { WorkItemTeamItem } from "../modules/workItem/items/WorkItemTeamItem";
import { AgentTreePartProvider } from "../modules/agents/treePartProviders/AgentTreePartProvider";
import { AccountItem } from "../modules/core/items/AccountItem";
import { PinnedPipelineTreePartProvider } from "../modules/pipeline/treePartProviders/PinnedPipelineTreePartProvider";
import { WorkItemRelationGroupTreeItem } from "../modules/workItem/treeItems/WorkItemRelationGroupTreeItem";
import { WorkItemLinkedBuildTreeItem } from "../modules/workItem/treeItems/WorkItemLinkedBuildTreeItem";
import { GitRepositoryPullRequestReviewerTreeItem } from "../modules/repository/treeItems/GitRepositoryPullRequestReviewerTreeItem";
import { WorkItemAreaPathTreeItem } from "../modules/workItem/treeItems/WorkItemAreaPathTreeItem";
import { GitRepositoryCommitItem } from "../modules/repository/items/GitRepositoryCommitItem";
import { GitRepositoryTagsTreeItem } from "../modules/repository/treeItems/GitRepositoryTagsTreeItem";
import { PipelineRunArtifactTreePartProvider } from "../modules/pipeline/treePartProviders/PipelineRunArtifactTreePartProvider";
import { GitRepositoryItemItem } from "../modules/repository/items/GitRepositoryItemItem";
import { GitRepositoryCommitTreePartProvider } from "../modules/repository/treePartProviders/GitRepositoryCommitTreePartProvider";
import { WorkItemLinkedBuildsTreePartProvider } from "../modules/workItem/treePartProviders/WorkItemLinkedBuildsTreePartProvider";
import { RecentlyModifiedByMeTreePartProvider } from "../modules/workItem/treePartProviders/RecentlyModifiedByMeTreePartProvider";
import { WorkItemRevisionFieldsTreePartProvider } from "../modules/workItem/treePartProviders/WorkItemRevisionFieldsTreePartProvider";
import { PinnedAgentTreePartProvider } from "../modules/agents/treePartProviders/PinnedAgentTreePartProvider";
import { DashboardsContainerTreeItem } from "../modules/dashboard/treeItems/DashboardsContainerTreeItem";
import { WorkItemLinkedPullRequestsTreePartProvider } from "../modules/workItem/treePartProviders/WorkItemLinkedPullRequestsTreePartProvider";
import { AreaPathsTreeItem } from "../modules/workItem/treeItems/AreaPathsTreeItem";
import { GitRepositoryPullRequestCommentThreadItem } from "../modules/repository/items/GitRepositoryPullRequestCommentThreadItem";
import { PipelineArtifactsTreeItem } from "../modules/pipeline/treeItems/PipelineArtifactsTreeItem";
import { WorkItemCurrentSprintByStateScopeTreeItem } from "../modules/workItem/treeItems/WorkItemCurrentSprintByStateScopeTreeItem";
import { WorkItemRelationGroupItem } from "../modules/workItem/items/WorkItemRelationGroupItem";
import { DashboardTreePartProvider } from "../modules/dashboard/treePartProviders/DashboardTreePartProvider";
import { AttachmentItem } from "../modules/workItem/items/AttachmentItem";
import { AgentPoolItem } from "../modules/agents/items/AgentPoolItem";
import { WorkItemCurrentSprintUnassignedScopeItem } from "../modules/workItem/items/WorkItemCurrentSprintUnassignedScopeItem";
import { CurrentSprintScopeTreePartProvider } from "../modules/workItem/treePartProviders/CurrentSprintScopeTreePartProvider";
import { GitRepositoryBranchTreeItem } from "../modules/repository/treeItems/GitRepositoryBranchTreeItem";
import { AssignedToMeTreeItem } from "../modules/workItem/treeItems/AssignedToMeTreeItem";
import { PipelineFolderTreeItem } from "../modules/pipeline/treeItems/PipelineFolderTreeItem";
import { WorkItemQueryFolderTreeItem } from "../modules/workItem/treeItems/WorkItemQueryFolderTreeItem";
import { AgentJobTreeItem } from "../modules/agents/treeItems/AgentJobTreeItem";
import { WorkItemLinkedCommitTreeItem } from "../modules/workItem/treeItems/WorkItemLinkedCommitTreeItem";
import { PinnedWorkItemTreePartProvider } from "../modules/workItem/treePartProviders/PinnedWorkItemTreePartProvider";
import { PipelineRunTreePartProvider } from "../modules/pipeline/treePartProviders/PipelineRunTreePartProvider";
import { WikiTreeProvider } from "../modules/wiki/WikiTreeProvider";
import { WorkItemCurrentSprintUnassignedScopeTreeItem } from "../modules/workItem/treeItems/WorkItemCurrentSprintUnassignedScopeTreeItem";
import { PinnedWorkItemTeamTreePartProvider } from "../modules/workItem/treePartProviders/PinnedWorkItemTeamTreePartProvider";

export function registerServices(container: Container) {
  container
  .bind<AlertService>(types.AlertService)
  .to(AlertService).inSingletonScope();
  container
  .bind<BuildService>(types.BuildService)
  .to(BuildService).inSingletonScope();
  container
  .bind<CixService>(types.CixService)
  .to(CixService).inSingletonScope();
  container
  .bind<CoreService>(types.CoreService)
  .to(CoreService).inSingletonScope();
  container
  .bind<DashboardService>(types.DashboardService)
  .to(DashboardService).inSingletonScope();
  container
  .bind<ExtensionManagementService>(types.ExtensionManagementService)
  .to(ExtensionManagementService).inSingletonScope();
  container
  .bind<FeatureManagementService>(types.FeatureManagementService)
  .to(FeatureManagementService).inSingletonScope();
  container
  .bind<FileContainerService>(types.FileContainerService)
  .to(FileContainerService).inSingletonScope();
  container
  .bind<GalleryService>(types.GalleryService)
  .to(GalleryService).inSingletonScope();
  container
  .bind<GitService>(types.GitService)
  .to(GitService).inSingletonScope();
  container
  .bind<LocationsService>(types.LocationsService)
  .to(LocationsService).inSingletonScope();
  container
  .bind<ManagementService>(types.ManagementService)
  .to(ManagementService).inSingletonScope();
  container
  .bind<NotificationService>(types.NotificationService)
  .to(NotificationService).inSingletonScope();
  container
  .bind<PipelinesService>(types.PipelinesService)
  .to(PipelinesService).inSingletonScope();
  container
  .bind<PolicyService>(types.PolicyService)
  .to(PolicyService).inSingletonScope();
  container
  .bind<ProfileService>(types.ProfileService)
  .to(ProfileService).inSingletonScope();
  container
  .bind<ProjectAnalysisService>(types.ProjectAnalysisService)
  .to(ProjectAnalysisService).inSingletonScope();
  container
  .bind<ReleaseService>(types.ReleaseService)
  .to(ReleaseService).inSingletonScope();
  container
  .bind<SecurityRolesService>(types.SecurityRolesService)
  .to(SecurityRolesService).inSingletonScope();
  container
  .bind<TaskAgentService>(types.TaskAgentService)
  .to(TaskAgentService).inSingletonScope();
  container
  .bind<TaskService>(types.TaskService)
  .to(TaskService).inSingletonScope();
  container
  .bind<TestService>(types.TestService)
  .to(TestService).inSingletonScope();
  container
  .bind<TestPlanService>(types.TestPlanService)
  .to(TestPlanService).inSingletonScope();
  container
  .bind<TestResultsService>(types.TestResultsService)
  .to(TestResultsService).inSingletonScope();
  container
  .bind<WikiService>(types.WikiService)
  .to(WikiService).inSingletonScope();
  container
  .bind<WorkService>(types.WorkService)
  .to(WorkService).inSingletonScope();
  container
  .bind<WorkItemTrackingService>(types.WorkItemTrackingService)
  .to(WorkItemTrackingService).inSingletonScope();
  container
  .bind<WorkItemTrackingProcessService>(types.WorkItemTrackingProcessService)
  .to(WorkItemTrackingProcessService).inSingletonScope();
  container
  .bind<WorkItemTrackingProcessDefinitionService>(types.WorkItemTrackingProcessDefinitionService)
  .to(WorkItemTrackingProcessDefinitionService).inSingletonScope();
}

export function registerTreeProvider(container: Container) {
  container
    .bind<RepositoryTreeProvider>(types.RepositoryTreeProvider)
    .to(RepositoryTreeProvider).inSingletonScope();
  container
    .bind<PipelineTreeProvider>(types.PipelineTreeProvider)
    .to(PipelineTreeProvider).inSingletonScope();
  container
    .bind<DashboardTreeProvider>(types.DashboardTreeProvider)
    .to(DashboardTreeProvider).inSingletonScope();
  container
    .bind<WorkItemTreeProvider>(types.WorkItemTreeProvider)
    .to(WorkItemTreeProvider).inSingletonScope();
  container
    .bind<WikiTreeProvider>(types.WikiTreeProvider)
    .to(WikiTreeProvider).inSingletonScope();
  container
    .bind<TestPlanTreeProvider>(types.TestPlanTreeProvider)
    .to(TestPlanTreeProvider).inSingletonScope();
  container
    .bind<AgentsTreeProvider>(types.AgentsTreeProvider)
    .to(AgentsTreeProvider).inSingletonScope();
}

export function registerTreeProviderResolver(container: Container) {
  container
    .bind<RepositoryTreeProviderResolver>(types.RepositoryTreeProviderResolver)
    .to(RepositoryTreeProviderResolver).inSingletonScope();
  container
    .bind<PipelineTreeProviderResolver>(types.PipelineTreeProviderResolver)
    .to(PipelineTreeProviderResolver).inSingletonScope();
  container
    .bind<DashboardTreeProviderResolver>(types.DashboardTreeProviderResolver)
    .to(DashboardTreeProviderResolver).inSingletonScope();
  container
    .bind<WorkItemTreeProviderResolver>(types.WorkItemTreeProviderResolver)
    .to(WorkItemTreeProviderResolver).inSingletonScope();
  container
    .bind<WikiTreeProviderResolver>(types.WikiTreeProviderResolver)
    .to(WikiTreeProviderResolver).inSingletonScope();
  container
    .bind<TestPlanTreeProviderResolver>(types.TestPlanTreeProviderResolver)
    .to(TestPlanTreeProviderResolver).inSingletonScope();
  container
    .bind<AgentsTreeProviderResolver>(types.AgentsTreeProviderResolver)
    .to(AgentsTreeProviderResolver).inSingletonScope();
}

export function registerTreePartProvider(container: Container) {
  container
    .bind<AccountTreePartProvider>(types.AccountTreePartProvider)
    .to(AccountTreePartProvider).inSingletonScope();
  container
    .bind<ProjectTreePartProvider>(types.ProjectTreePartProvider)
    .to(ProjectTreePartProvider).inSingletonScope();
  container
    .bind<GitRepositoryTreePartProvider>(types.GitRepositoryTreePartProvider)
    .to(PinnableTreePartProviderMixin(GitRepositoryTreePartProvider, types.PinnedGitRepositoryTreePartProvider),).inSingletonScope();
  container
    .bind<GitRepositoryBranchTreePartProvider>(types.GitRepositoryBranchTreePartProvider)
    .to(GitRepositoryBranchTreePartProvider).inSingletonScope();
  container
    .bind<GitRepositoryItemTreePartProvider>(types.GitRepositoryItemTreePartProvider)
    .to(GitRepositoryItemTreePartProvider).inSingletonScope();
  container
    .bind<GitRepositoryCommitTreePartProvider>(types.GitRepositoryCommitTreePartProvider)
    .to(GitRepositoryCommitTreePartProvider).inSingletonScope();
  container
    .bind<GitRepositoryTagTreePartProvider>(types.GitRepositoryTagTreePartProvider)
    .to(GitRepositoryTagTreePartProvider).inSingletonScope();
  container
    .bind<GitRepositoryPullRequestTreePartProvider>(types.GitRepositoryPullRequestTreePartProvider)
    .to(PinnableTreePartProviderMixin(GitRepositoryPullRequestTreePartProvider, types.PinnedGitRepositoryPullRequestTreePartProvider),).inSingletonScope();
  container
    .bind<GitRepositoryPullRequestReviewerTreePartProvider>(types.GitRepositoryPullRequestReviewerTreePartProvider)
    .to(GitRepositoryPullRequestReviewerTreePartProvider).inSingletonScope();
  container
    .bind<GitRepositoryPullRequestWorkItemTreePartProvider>(types.GitRepositoryPullRequestWorkItemTreePartProvider)
    .to(GitRepositoryPullRequestWorkItemTreePartProvider).inSingletonScope();
  container
    .bind<GitRepositoryPullRequestStatusTreePartProvider>(types.GitRepositoryPullRequestStatusTreePartProvider)
    .to(GitRepositoryPullRequestStatusTreePartProvider).inSingletonScope();
  container
    .bind<GitRepositoryPullRequestCommentThreadTreePartProvider>(types.GitRepositoryPullRequestCommentThreadTreePartProvider)
    .to(GitRepositoryPullRequestCommentThreadTreePartProvider).inSingletonScope();
  container
    .bind<PinnedGitRepositoryTreePartProvider>(types.PinnedGitRepositoryTreePartProvider)
    .to(PinnedGitRepositoryTreePartProvider).inSingletonScope();
  container
    .bind<PinnedGitRepositoryPullRequestTreePartProvider>(types.PinnedGitRepositoryPullRequestTreePartProvider)
    .to(PinnedGitRepositoryPullRequestTreePartProvider).inSingletonScope();
  container
    .bind<PipelineFolderTreePartProvider>(types.PipelineFolderTreePartProvider)
    .to(PinnableTreePartProviderMixin(PipelineFolderTreePartProvider, types.PinnedPipelineFolderTreePartProvider),).inSingletonScope();
  container
    .bind<PipelineTreePartProvider>(types.PipelineTreePartProvider)
    .to(PinnableTreePartProviderMixin(PipelineTreePartProvider, types.PinnedPipelineTreePartProvider),).inSingletonScope();
  container
    .bind<PipelineRunTreePartProvider>(types.PipelineRunTreePartProvider)
    .to(PipelineRunTreePartProvider).inSingletonScope();
  container
    .bind<PipelineRunArtifactTreePartProvider>(types.PipelineRunArtifactTreePartProvider)
    .to(PipelineRunArtifactTreePartProvider).inSingletonScope();
  container
    .bind<PipelineRunTimelineTreePartProvider>(types.PipelineRunTimelineTreePartProvider)
    .to(PipelineRunTimelineTreePartProvider).inSingletonScope();
  container
    .bind<PinnedPipelineFolderTreePartProvider>(types.PinnedPipelineFolderTreePartProvider)
    .to(PinnedPipelineFolderTreePartProvider).inSingletonScope();
  container
    .bind<PinnedPipelineTreePartProvider>(types.PinnedPipelineTreePartProvider)
    .to(PinnedPipelineTreePartProvider).inSingletonScope();
  container
    .bind<AssignedToMeTreePartProvider>(types.AssignedToMeTreePartProvider)
    .to(PinnableTreePartProviderMixin(AssignedToMeTreePartProvider, types.PinnedWorkItemTreePartProvider),).inSingletonScope();
  container
    .bind<MentionedTreePartProvider>(types.MentionedTreePartProvider)
    .to(PinnableTreePartProviderMixin(MentionedTreePartProvider, types.PinnedWorkItemTreePartProvider),).inSingletonScope();
  container
    .bind<RecentlyModifiedByMeTreePartProvider>(types.RecentlyModifiedByMeTreePartProvider)
    .to(PinnableTreePartProviderMixin(RecentlyModifiedByMeTreePartProvider, types.PinnedWorkItemTreePartProvider),).inSingletonScope();
  container
    .bind<MyTeamsTreePartProvider>(types.MyTeamsTreePartProvider)
    .to(PinnableTreePartProviderMixin(MyTeamsTreePartProvider, types.PinnedWorkItemTeamTreePartProvider),).inSingletonScope();
  container
    .bind<AllTeamsTreePartProvider>(types.AllTeamsTreePartProvider)
    .to(PinnableTreePartProviderMixin(AllTeamsTreePartProvider, types.PinnedWorkItemTeamTreePartProvider),).inSingletonScope();
  container
    .bind<CurrentSprintTreePartProvider>(types.CurrentSprintTreePartProvider)
    .to(CurrentSprintTreePartProvider).inSingletonScope();
  container
    .bind<CurrentSprintScopeTreePartProvider>(types.CurrentSprintScopeTreePartProvider)
    .to(CurrentSprintScopeTreePartProvider).inSingletonScope();
  container
    .bind<CurrentSprintScopeContentTreePartProvider>(types.CurrentSprintScopeContentTreePartProvider)
    .to(CurrentSprintScopeContentTreePartProvider).inSingletonScope();
  container
    .bind<CurrentSprintGroupWorkItemTreePartProvider>(types.CurrentSprintGroupWorkItemTreePartProvider)
    .to(CurrentSprintGroupWorkItemTreePartProvider).inSingletonScope();
  container
    .bind<BacklogContentTreePartProvider>(types.BacklogContentTreePartProvider)
    .to(BacklogContentTreePartProvider).inSingletonScope();
  container
    .bind<HierarchyRootContentTreePartProvider>(types.HierarchyRootContentTreePartProvider)
    .to(HierarchyRootContentTreePartProvider).inSingletonScope();
  container
    .bind<HierarchyChildrenTreePartProvider>(types.HierarchyChildrenTreePartProvider)
    .to(HierarchyChildrenTreePartProvider).inSingletonScope();
  container
    .bind<AreaPathsContentTreePartProvider>(types.AreaPathsContentTreePartProvider)
    .to(PinnableTreePartProviderMixin(AreaPathsContentTreePartProvider, types.PinnedWorkItemAreaPathTreePartProvider),).inSingletonScope();
  container
    .bind<AreaPathChildrenTreePartProvider>(types.AreaPathChildrenTreePartProvider)
    .to(PinnableTreePartProviderMixin(AreaPathChildrenTreePartProvider, types.PinnedWorkItemAreaPathTreePartProvider),).inSingletonScope();
  container
    .bind<AreaPathHierarchyRootTreePartProvider>(types.AreaPathHierarchyRootTreePartProvider)
    .to(AreaPathHierarchyRootTreePartProvider).inSingletonScope();
  container
    .bind<QueriesContentTreePartProvider>(types.QueriesContentTreePartProvider)
    .to(QueriesContentTreePartProvider).inSingletonScope();
  container
    .bind<QueryFolderChildrenTreePartProvider>(types.QueryFolderChildrenTreePartProvider)
    .to(PinnableTreePartProviderMixin(QueryFolderChildrenTreePartProvider, types.PinnedWorkItemQueryLeafTreePartProvider),).inSingletonScope();
  container
    .bind<QueryResultsTreePartProvider>(types.QueryResultsTreePartProvider)
    .to(QueryResultsTreePartProvider).inSingletonScope();
  container
    .bind<PinnedWorkItemTreePartProvider>(types.PinnedWorkItemTreePartProvider)
    .to(PinnedWorkItemTreePartProvider).inSingletonScope();
  container
    .bind<PinnedWorkItemAreaPathTreePartProvider>(types.PinnedWorkItemAreaPathTreePartProvider)
    .to(PinnedWorkItemAreaPathTreePartProvider).inSingletonScope();
  container
    .bind<PinnedWorkItemTeamTreePartProvider>(types.PinnedWorkItemTeamTreePartProvider)
    .to(PinnedWorkItemTeamTreePartProvider).inSingletonScope();
  container
    .bind<PinnedWorkItemQueryLeafTreePartProvider>(types.PinnedWorkItemQueryLeafTreePartProvider)
    .to(PinnedWorkItemQueryLeafTreePartProvider).inSingletonScope();
  container
    .bind<ProjectRootTreePartProvider>(types.ProjectRootTreePartProvider)
    .to(ProjectRootTreePartProvider).inSingletonScope();
  container
    .bind<AttachmentTreePartProvider>(types.AttachmentTreePartProvider)
    .to(AttachmentTreePartProvider).inSingletonScope();
  container
    .bind<WorkItemLinkedWorkItemGroupsTreePartProvider>(types.WorkItemLinkedWorkItemGroupsTreePartProvider)
    .to(WorkItemLinkedWorkItemGroupsTreePartProvider).inSingletonScope();
  container
    .bind<WorkItemLinkedWorkItemsTreePartProvider>(types.WorkItemLinkedWorkItemsTreePartProvider)
    .to(WorkItemLinkedWorkItemsTreePartProvider).inSingletonScope();
  container
    .bind<WorkItemCommentsTreePartProvider>(types.WorkItemCommentsTreePartProvider)
    .to(WorkItemCommentsTreePartProvider).inSingletonScope();
  container
    .bind<WorkItemLinkedCommitsTreePartProvider>(types.WorkItemLinkedCommitsTreePartProvider)
    .to(WorkItemLinkedCommitsTreePartProvider).inSingletonScope();
  container
    .bind<WorkItemLinkedPullRequestsTreePartProvider>(types.WorkItemLinkedPullRequestsTreePartProvider)
    .to(WorkItemLinkedPullRequestsTreePartProvider).inSingletonScope();
  container
    .bind<WorkItemLinkedBranchesTreePartProvider>(types.WorkItemLinkedBranchesTreePartProvider)
    .to(WorkItemLinkedBranchesTreePartProvider).inSingletonScope();
  container
    .bind<WorkItemLinkedBuildsTreePartProvider>(types.WorkItemLinkedBuildsTreePartProvider)
    .to(WorkItemLinkedBuildsTreePartProvider).inSingletonScope();
  container
    .bind<WorkItemHistoryTreePartProvider>(types.WorkItemHistoryTreePartProvider)
    .to(WorkItemHistoryTreePartProvider).inSingletonScope();
  container
    .bind<WorkItemRevisionFieldsTreePartProvider>(types.WorkItemRevisionFieldsTreePartProvider)
    .to(WorkItemRevisionFieldsTreePartProvider).inSingletonScope();
  container
    .bind<AgentPoolTreePartProvider>(types.AgentPoolTreePartProvider)
    .to(PinnableTreePartProviderMixin(AgentPoolTreePartProvider, types.PinnedAgentPoolTreePartProvider),).inSingletonScope();
  container
    .bind<AgentTreePartProvider>(types.AgentTreePartProvider)
    .to(PinnableTreePartProviderMixin(AgentTreePartProvider, types.PinnedAgentTreePartProvider),).inSingletonScope();
  container
    .bind<AgentJobTreePartProvider>(types.AgentJobTreePartProvider)
    .to(AgentJobTreePartProvider).inSingletonScope();
  container
    .bind<PinnedAgentPoolTreePartProvider>(types.PinnedAgentPoolTreePartProvider)
    .to(PinnedAgentPoolTreePartProvider).inSingletonScope();
  container
    .bind<PinnedAgentTreePartProvider>(types.PinnedAgentTreePartProvider)
    .to(PinnedAgentTreePartProvider).inSingletonScope();
  container
    .bind<DashboardWidgetTreePartProvider>(types.DashboardWidgetTreePartProvider)
    .to(DashboardWidgetTreePartProvider).inSingletonScope();
  container
    .bind<DashboardTreePartProvider>(types.DashboardTreePartProvider)
    .to(DashboardTreePartProvider).inSingletonScope();
}

export function registerTreeItem(container: Container) {
  container
        .bind<Constructor<MissingTreeItem<MissingItem>>>(types.MissingTreeItem)
        .toConstantValue(MissingTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(injectable, context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<LoadingTreeItem<LoadingItem>>>(types.LoadingTreeItem)
        .toConstantValue(LoadingTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(injectable, context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<ExceptionTreeItem<ExceptionItem>>>(types.ExceptionTreeItem)
        .toConstantValue(ExceptionTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(injectable, context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<AccountTreeItem<AccountItem>>>(types.AccountTreeItem)
        .toConstantValue(AccountTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(RefreshableTreeItemMixin(injectable), context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<ProjectTreeItem<ProjectItem>>>(types.ProjectTreeItem)
        .toConstantValue(ProjectTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(RefreshableTreeItemMixin(injectable), context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<GitRepositoryTreeItem<GitRepositoryItem>>>(types.GitRepositoryTreeItem)
        .toConstantValue(GitRepositoryTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(RefreshableTreeItemMixin(OpenInWebTreeItemMixin(injectable, openInWebGetUrlGitRepository)), context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<GitRepositoryTreeItem<GitRepositoryItem & PinnedItem>>>(types.PinnableGitRepositoryTreeItem)
        .toConstantValue(GitRepositoryTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(RefreshableTreeItemMixin(OpenInWebTreeItemMixin(PinnedTreeItemMixin(injectable, (data: GitRepositoryItem & PinnedItem) => 
            context.get<PinnedGitRepositoryTreePartProvider>(types.PinnedGitRepositoryTreePartProvider).getPinInfo(data), context.get<any>(types.StorageService)), openInWebGetUrlGitRepository)), context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<GitRepositoryBranchTreeItem<GitRepositoryBranchItem>>>(types.GitRepositoryBranchTreeItem)
        .toConstantValue(GitRepositoryBranchTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(RefreshableTreeItemMixin(injectable), context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<GitRepositoryItemTreeItem<GitRepositoryItemItem>>>(types.GitRepositoryItemTreeItem)
        .toConstantValue(GitRepositoryItemTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(RefreshableTreeItemMixin(injectable), context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<GitRepositoryItemsTreeItem<GitRepositoryItem>>>(types.GitRepositoryItemsTreeItem)
        .toConstantValue(GitRepositoryItemsTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(RefreshableTreeItemMixin(injectable), context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<GitRepositoryBranchesTreeItem<GitRepositoryItem>>>(types.GitRepositoryBranchesTreeItem)
        .toConstantValue(GitRepositoryBranchesTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(RefreshableTreeItemMixin(injectable), context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<GitRepositoryCommitTreeItem<GitRepositoryCommitItem>>>(types.GitRepositoryCommitTreeItem)
        .toConstantValue(GitRepositoryCommitTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(RefreshableTreeItemMixin(injectable), context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<GitRepositoryCommitsTreeItem<GitRepositoryItem>>>(types.GitRepositoryCommitsTreeItem)
        .toConstantValue(GitRepositoryCommitsTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(RefreshableTreeItemMixin(injectable), context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<GitRepositoryTagsTreeItem<GitRepositoryItem>>>(types.GitRepositoryTagsTreeItem)
        .toConstantValue(GitRepositoryTagsTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(RefreshableTreeItemMixin(injectable), context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<GitRepositoryTagTreeItem<GitRepositoryTagItem>>>(types.GitRepositoryTagTreeItem)
        .toConstantValue(GitRepositoryTagTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(RefreshableTreeItemMixin(injectable), context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<GitRepositoryPullRequestsTreeItem<GitRepositoryItem>>>(types.GitRepositoryPullRequestsTreeItem)
        .toConstantValue(GitRepositoryPullRequestsTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(RefreshableTreeItemMixin(injectable), context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<GitRepositoryPullRequestTreeItem<GitRepositoryPullRequestItem>>>(types.GitRepositoryPullRequestTreeItem)
        .toConstantValue(GitRepositoryPullRequestTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(RefreshableTreeItemMixin(OpenInWebTreeItemMixin(injectable, openInWebGetUrlGitRepositoryPullRequest)), context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<GitRepositoryPullRequestTreeItem<GitRepositoryPullRequestItem & PinnedItem>>>(types.PinnableGitRepositoryPullRequestTreeItem)
        .toConstantValue(GitRepositoryPullRequestTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(RefreshableTreeItemMixin(OpenInWebTreeItemMixin(PinnedTreeItemMixin(injectable, (data: GitRepositoryPullRequestItem & PinnedItem) => 
            context.get<PinnedGitRepositoryPullRequestTreePartProvider>(types.PinnedGitRepositoryPullRequestTreePartProvider).getPinInfo(data), context.get<any>(types.StorageService)), openInWebGetUrlGitRepositoryPullRequest)), context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<GitRepositoryPullRequestReviewerTreeItem<GitRepositoryPullRequestReviewerItem>>>(types.GitRepositoryPullRequestReviewerTreeItem)
        .toConstantValue(GitRepositoryPullRequestReviewerTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(RefreshableTreeItemMixin(injectable), context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<GitRepositoryPullRequestReviewersTreeItem<GitRepositoryPullRequestItem>>>(types.GitRepositoryPullRequestReviewersTreeItem)
        .toConstantValue(GitRepositoryPullRequestReviewersTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(RefreshableTreeItemMixin(injectable), context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<GitRepositoryPullRequestStatusTreeItem<GitRepositoryPullRequestStatusItem>>>(types.GitRepositoryPullRequestStatusTreeItem)
        .toConstantValue(GitRepositoryPullRequestStatusTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(RefreshableTreeItemMixin(injectable), context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<GitRepositoryPullRequestCommentThreadTreeItem<GitRepositoryPullRequestCommentThreadItem>>>(types.GitRepositoryPullRequestCommentThreadTreeItem)
        .toConstantValue(GitRepositoryPullRequestCommentThreadTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(RefreshableTreeItemMixin(injectable), context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<PipelineFolderTreeItem<PipelineFolderItem>>>(types.PipelineFolderTreeItem)
        .toConstantValue(PipelineFolderTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(RefreshableTreeItemMixin(injectable), context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<PipelineFolderTreeItem<PipelineFolderItem & PinnedItem>>>(types.PinnablePipelineFolderTreeItem)
        .toConstantValue(PipelineFolderTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(RefreshableTreeItemMixin(PinnedTreeItemMixin(injectable, (data: PipelineFolderItem & PinnedItem) => 
            context.get<PinnedPipelineFolderTreePartProvider>(types.PinnedPipelineFolderTreePartProvider).getPinInfo(data), context.get<any>(types.StorageService))), context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<PipelineTreeItem<PipelineItem>>>(types.PipelineTreeItem)
        .toConstantValue(PipelineTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(RefreshableTreeItemMixin(OpenInWebTreeItemMixin(injectable, openInWebGetUrlPipeline)), context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<PipelineTreeItem<PipelineItem & PinnedItem>>>(types.PinnablePipelineTreeItem)
        .toConstantValue(PipelineTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(RefreshableTreeItemMixin(OpenInWebTreeItemMixin(PinnedTreeItemMixin(injectable, (data: PipelineItem & PinnedItem) => 
            context.get<PinnedPipelineTreePartProvider>(types.PinnedPipelineTreePartProvider).getPinInfo(data), context.get<any>(types.StorageService)), openInWebGetUrlPipeline)), context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<PipelineRunTreeItem<PipelineRunItem>>>(types.PipelineRunTreeItem)
        .toConstantValue(PipelineRunTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(RefreshableTreeItemMixin(injectable), context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<PipelineArtifactsTreeItem<PipelineRunItem>>>(types.PipelineArtifactsTreeItem)
        .toConstantValue(PipelineArtifactsTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(RefreshableTreeItemMixin(injectable), context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<PipelineRunArtifactTreeItem<PipelineRunArtifactItem>>>(types.PipelineRunArtifactTreeItem)
        .toConstantValue(PipelineRunArtifactTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(RefreshableTreeItemMixin(injectable), context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<PipelineRunTimelineTreeItem<PipelineRunTimelineItem>>>(types.PipelineRunTimelineTreeItem)
        .toConstantValue(PipelineRunTimelineTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(RefreshableTreeItemMixin(injectable), context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<WorkItemTreeItem<WorkItemItem>>>(types.WorkItemTreeItem)
        .toConstantValue(WorkItemTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(RefreshableTreeItemMixin(OpenInWebTreeItemMixin(injectable, openInWebGetUrlWorkItem)), context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<WorkItemTreeItem<WorkItemItem & PinnedItem>>>(types.PinnableWorkItemTreeItem)
        .toConstantValue(WorkItemTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(RefreshableTreeItemMixin(OpenInWebTreeItemMixin(PinnedTreeItemMixin(injectable, (data: WorkItemItem & PinnedItem) => 
            context.get<PinnedWorkItemTreePartProvider>(types.PinnedWorkItemTreePartProvider).getPinInfo(data), context.get<any>(types.StorageService)), openInWebGetUrlWorkItem)), context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<MyWorkTreeItem<MyWorkItem>>>(types.MyWorkTreeItem)
        .toConstantValue(MyWorkTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(injectable, context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<MyTeamsTreeItem<MyTeamsItem>>>(types.MyTeamsTreeItem)
        .toConstantValue(MyTeamsTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(RefreshableTreeItemMixin(injectable), context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<AllTeamsTreeItem<AllTeamsItem>>>(types.AllTeamsTreeItem)
        .toConstantValue(AllTeamsTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(RefreshableTreeItemMixin(injectable), context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<WorkItemHierarchyTreeItem<WorkItemHierarchyItem>>>(types.WorkItemHierarchyTreeItem)
        .toConstantValue(WorkItemHierarchyTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(RefreshableTreeItemMixin(injectable), context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<AreaPathsTreeItem<AreaPathsItem>>>(types.AreaPathsTreeItem)
        .toConstantValue(AreaPathsTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(RefreshableTreeItemMixin(injectable), context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<QueriesTreeItem<QueriesItem>>>(types.QueriesTreeItem)
        .toConstantValue(QueriesTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(RefreshableTreeItemMixin(injectable), context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<AssignedToMeTreeItem<MyWorkItem>>>(types.AssignedToMeTreeItem)
        .toConstantValue(AssignedToMeTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(RefreshableTreeItemMixin(injectable), context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<MentionedTreeItem<MyWorkItem>>>(types.MentionedTreeItem)
        .toConstantValue(MentionedTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(RefreshableTreeItemMixin(injectable), context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<RecentlyModifiedByMeTreeItem<MyWorkItem>>>(types.RecentlyModifiedByMeTreeItem)
        .toConstantValue(RecentlyModifiedByMeTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(RefreshableTreeItemMixin(injectable), context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<WorkItemTeamTreeItem<WorkItemTeamItem>>>(types.WorkItemTeamTreeItem)
        .toConstantValue(WorkItemTeamTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(RefreshableTreeItemMixin(injectable), context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<WorkItemTeamTreeItem<WorkItemTeamItem & PinnedItem>>>(types.PinnableWorkItemTeamTreeItem)
        .toConstantValue(WorkItemTeamTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(RefreshableTreeItemMixin(PinnedTreeItemMixin(injectable, (data: WorkItemTeamItem & PinnedItem) => 
            context.get<PinnedWorkItemTeamTreePartProvider>(types.PinnedWorkItemTeamTreePartProvider).getPinInfo(data), context.get<any>(types.StorageService))), context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<WorkItemCurrentSprintTreeItem<WorkItemCurrentSprintItem>>>(types.WorkItemCurrentSprintTreeItem)
        .toConstantValue(WorkItemCurrentSprintTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(RefreshableTreeItemMixin(injectable), context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<WorkItemCurrentSprintByAssigneeScopeTreeItem<WorkItemCurrentSprintByAssigneeScopeItem>>>(types.WorkItemCurrentSprintByAssigneeScopeTreeItem)
        .toConstantValue(WorkItemCurrentSprintByAssigneeScopeTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(RefreshableTreeItemMixin(injectable), context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<WorkItemCurrentSprintByStateScopeTreeItem<WorkItemCurrentSprintByStateScopeItem>>>(types.WorkItemCurrentSprintByStateScopeTreeItem)
        .toConstantValue(WorkItemCurrentSprintByStateScopeTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(RefreshableTreeItemMixin(injectable), context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<WorkItemCurrentSprintUnassignedScopeTreeItem<WorkItemCurrentSprintUnassignedScopeItem>>>(types.WorkItemCurrentSprintUnassignedScopeTreeItem)
        .toConstantValue(WorkItemCurrentSprintUnassignedScopeTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(RefreshableTreeItemMixin(injectable), context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<WorkItemCurrentSprintGroupTreeItem<WorkItemCurrentSprintGroupItem>>>(types.WorkItemCurrentSprintGroupTreeItem)
        .toConstantValue(WorkItemCurrentSprintGroupTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(RefreshableTreeItemMixin(injectable), context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<WorkItemBacklogTreeItem<WorkItemTeamItem>>>(types.WorkItemBacklogTreeItem)
        .toConstantValue(WorkItemBacklogTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(RefreshableTreeItemMixin(injectable), context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<WorkItemQueryFolderTreeItem<WorkItemQueryItem>>>(types.WorkItemQueryFolderTreeItem)
        .toConstantValue(WorkItemQueryFolderTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(RefreshableTreeItemMixin(injectable), context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<WorkItemQueryLeafTreeItem<WorkItemQueryItem>>>(types.WorkItemQueryLeafTreeItem)
        .toConstantValue(WorkItemQueryLeafTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(RefreshableTreeItemMixin(injectable), context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<WorkItemQueryLeafTreeItem<WorkItemQueryItem & PinnedItem>>>(types.PinnableWorkItemQueryLeafTreeItem)
        .toConstantValue(WorkItemQueryLeafTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(RefreshableTreeItemMixin(PinnedTreeItemMixin(injectable, (data: WorkItemQueryItem & PinnedItem) => 
            context.get<PinnedWorkItemQueryLeafTreePartProvider>(types.PinnedWorkItemQueryLeafTreePartProvider).getPinInfo(data), context.get<any>(types.StorageService))), context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<WorkItemAreaPathTreeItem<WorkItemAreaPathItem>>>(types.WorkItemAreaPathTreeItem)
        .toConstantValue(WorkItemAreaPathTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(RefreshableTreeItemMixin(injectable), context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<WorkItemAreaPathTreeItem<WorkItemAreaPathItem & PinnedItem>>>(types.PinnableWorkItemAreaPathTreeItem)
        .toConstantValue(WorkItemAreaPathTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(RefreshableTreeItemMixin(PinnedTreeItemMixin(injectable, (data: WorkItemAreaPathItem & PinnedItem) => 
            context.get<PinnedWorkItemAreaPathTreePartProvider>(types.PinnedWorkItemAreaPathTreePartProvider).getPinInfo(data), context.get<any>(types.StorageService))), context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<AttachmentTreeItem<AttachmentItem>>>(types.AttachmentTreeItem)
        .toConstantValue(AttachmentTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(injectable, context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<WorkItemAttachmentsTreeItem<WorkItemItem>>>(types.WorkItemAttachmentsTreeItem)
        .toConstantValue(WorkItemAttachmentsTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(RefreshableTreeItemMixin(injectable), context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<WorkItemLinkedItemTreeItem<WorkItemLinkedItemItem>>>(types.WorkItemLinkedItemTreeItem)
        .toConstantValue(WorkItemLinkedItemTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(OpenInWebTreeItemMixin(injectable, openInWebGetUrlWorkItemLinkedItem), context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<WorkItemCommentsTreeItem<WorkItemItem>>>(types.WorkItemCommentsTreeItem)
        .toConstantValue(WorkItemCommentsTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(RefreshableTreeItemMixin(injectable), context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<WorkItemCommentTreeItem<WorkItemCommentItem>>>(types.WorkItemCommentTreeItem)
        .toConstantValue(WorkItemCommentTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(injectable, context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<WorkItemHistoryTreeItem<WorkItemItem>>>(types.WorkItemHistoryTreeItem)
        .toConstantValue(WorkItemHistoryTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(RefreshableTreeItemMixin(injectable), context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<WorkItemRevisionTreeItem<WorkItemRevisionItem>>>(types.WorkItemRevisionTreeItem)
        .toConstantValue(WorkItemRevisionTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(injectable, context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<WorkItemRevisionFieldChangeTreeItem<WorkItemRevisionFieldChangeItem>>>(types.WorkItemRevisionFieldChangeTreeItem)
        .toConstantValue(WorkItemRevisionFieldChangeTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(injectable, context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<WorkItemLinkedCommitsTreeItem<WorkItemItem>>>(types.WorkItemLinkedCommitsTreeItem)
        .toConstantValue(WorkItemLinkedCommitsTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(RefreshableTreeItemMixin(injectable), context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<WorkItemLinkedPullRequestsTreeItem<WorkItemItem>>>(types.WorkItemLinkedPullRequestsTreeItem)
        .toConstantValue(WorkItemLinkedPullRequestsTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(RefreshableTreeItemMixin(injectable), context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<WorkItemLinkedBranchesTreeItem<WorkItemItem>>>(types.WorkItemLinkedBranchesTreeItem)
        .toConstantValue(WorkItemLinkedBranchesTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(RefreshableTreeItemMixin(injectable), context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<WorkItemLinkedBuildsTreeItem<WorkItemItem>>>(types.WorkItemLinkedBuildsTreeItem)
        .toConstantValue(WorkItemLinkedBuildsTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(RefreshableTreeItemMixin(injectable), context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<WorkItemRelationGroupTreeItem<WorkItemRelationGroupItem>>>(types.WorkItemRelationGroupTreeItem)
        .toConstantValue(WorkItemRelationGroupTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(RefreshableTreeItemMixin(injectable), context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<WorkItemLinkedCommitTreeItem<WorkItemLinkedItemItem>>>(types.WorkItemLinkedCommitTreeItem)
        .toConstantValue(WorkItemLinkedCommitTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(OpenInWebTreeItemMixin(injectable, openInWebGetUrlWorkItemLinkedCommit), context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<WorkItemLinkedPullRequestTreeItem<WorkItemLinkedItemItem>>>(types.WorkItemLinkedPullRequestTreeItem)
        .toConstantValue(WorkItemLinkedPullRequestTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(OpenInWebTreeItemMixin(injectable, openInWebGetUrlWorkItemLinkedPullRequest), context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<WorkItemLinkedBranchTreeItem<WorkItemLinkedItemItem>>>(types.WorkItemLinkedBranchTreeItem)
        .toConstantValue(WorkItemLinkedBranchTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(OpenInWebTreeItemMixin(injectable, openInWebGetUrlWorkItemLinkedBranch), context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<WorkItemLinkedBuildTreeItem<WorkItemLinkedItemItem>>>(types.WorkItemLinkedBuildTreeItem)
        .toConstantValue(WorkItemLinkedBuildTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(OpenInWebTreeItemMixin(injectable, openInWebGetUrlWorkItemLinkedBuild), context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<AgentPoolTreeItem<AgentPoolItem>>>(types.AgentPoolTreeItem)
        .toConstantValue(AgentPoolTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(RefreshableTreeItemMixin(injectable), context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<AgentPoolTreeItem<AgentPoolItem & PinnedItem>>>(types.PinnableAgentPoolTreeItem)
        .toConstantValue(AgentPoolTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(RefreshableTreeItemMixin(PinnedTreeItemMixin(injectable, (data: AgentPoolItem & PinnedItem) => 
            context.get<PinnedAgentPoolTreePartProvider>(types.PinnedAgentPoolTreePartProvider).getPinInfo(data), context.get<any>(types.StorageService))), context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<AgentsContainerTreeItem<AgentPoolItem>>>(types.AgentsContainerTreeItem)
        .toConstantValue(AgentsContainerTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(RefreshableTreeItemMixin(injectable), context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<AgentTreeItem<AgentItem>>>(types.AgentTreeItem)
        .toConstantValue(AgentTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(RefreshableTreeItemMixin(injectable), context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<AgentTreeItem<AgentItem & PinnedItem>>>(types.PinnableAgentTreeItem)
        .toConstantValue(AgentTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(RefreshableTreeItemMixin(PinnedTreeItemMixin(injectable, (data: AgentItem & PinnedItem) => 
            context.get<PinnedAgentTreePartProvider>(types.PinnedAgentTreePartProvider).getPinInfo(data), context.get<any>(types.StorageService))), context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<JobsContainerTreeItem<AgentPoolItem>>>(types.JobsContainerTreeItem)
        .toConstantValue(JobsContainerTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(RefreshableTreeItemMixin(injectable), context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<AgentJobsContainerTreeItem<AgentItem>>>(types.AgentJobsContainerTreeItem)
        .toConstantValue(AgentJobsContainerTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(RefreshableTreeItemMixin(injectable), context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<AgentJobTreeItem<AgentJobItem>>>(types.AgentJobTreeItem)
        .toConstantValue(AgentJobTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(RefreshableTreeItemMixin(injectable), context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<DashboardTreeItem<DashboardItem>>>(types.DashboardTreeItem)
        .toConstantValue(DashboardTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(RefreshableTreeItemMixin(OpenInWebTreeItemMixin(injectable, openInWebGetUrlDashboard)), context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<DashboardWidgetTreeItem<DashboardWidgetItem>>>(types.DashboardWidgetTreeItem)
        .toConstantValue(DashboardWidgetTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(RefreshableTreeItemMixin(injectable), context.get<IconService>(types.IconService));
        });
  container
        .bind<Constructor<DashboardsContainerTreeItem<ProjectItem>>>(types.DashboardsContainerTreeItem)
        .toConstantValue(DashboardsContainerTreeItem)
        .onActivation((context, injectable) => {
          return ExtensionContextTreeItemMixin(RefreshableTreeItemMixin(injectable), context.get<IconService>(types.IconService));
        });
}