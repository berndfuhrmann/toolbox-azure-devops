// generated

import { inject, injectable, postConstruct } from "inversify";
import { TreePartProvider } from "../common/treePartProvider/TreePartProvider";
import { AbstractTreeItem } from "../common/treeItems/AbstractTreeItem";
import { types } from "./types";
import { SettingsService } from "../common/SettingsService";

import { PipelineFolderTreePartProvider } from "../modules/pipeline/treePartProviders/PipelineFolderTreePartProvider";
import { BacklogContentTreePartProvider } from "../modules/workItem/treePartProviders/BacklogContentTreePartProvider";
import { GitRepositoryPullRequestStatusTreePartProvider } from "../modules/repository/treePartProviders/GitRepositoryPullRequestStatusTreePartProvider";
import { MyTeamsTreePartProvider } from "../modules/workItem/treePartProviders/MyTeamsTreePartProvider";
import { AssignedToMeTreePartProvider } from "../modules/workItem/treePartProviders/AssignedToMeTreePartProvider";
import { QueriesTreeItem } from "../modules/workItem/treeItems/QueriesTreeItem";
import { SwitchingTreePartProvider } from "../common/treePartProvider/SwitchingTreePartProvider";
import { WorkItemTreeItem } from "../modules/workItem/treeItems/WorkItemTreeItem";
import { AreaPathChildrenTreePartProvider } from "../modules/workItem/treePartProviders/AreaPathChildrenTreePartProvider";
import { GitRepositoryItemTreeItem } from "../modules/repository/treeItems/GitRepositoryItemTreeItem";
import { PinnedGitRepositoryPullRequestTreePartProvider } from "../modules/repository/treePartProviders/PinnedGitRepositoryPullRequestTreePartProvider";
import { MentionedTreePartProvider } from "../modules/workItem/treePartProviders/MentionedTreePartProvider";
import { JobsContainerTreeItem } from "../modules/agents/treeItems/JobsContainerTreeItem";
import { PinnedPipelineFolderTreePartProvider } from "../modules/pipeline/treePartProviders/PinnedPipelineFolderTreePartProvider";
import { AttachmentTreePartProvider } from "../modules/workItem/treePartProviders/AttachmentTreePartProvider";
import { UnwrappingTreePartProvider } from "../common/treePartProvider/UnwrappingTreePartProvider";
import { WorkItemLinkedCommitsTreePartProvider } from "../modules/workItem/treePartProviders/WorkItemLinkedCommitsTreePartProvider";
import { WorkItemLinkedBuildsTreeItem } from "../modules/workItem/treeItems/WorkItemLinkedBuildsTreeItem";
import { PipelineTreeItem } from "../modules/pipeline/treeItems/PipelineTreeItem";
import { StaticTreePartProvider } from "../common/treePartProvider/StaticTreePartProvider";
import { AgentPoolTreeItem } from "../modules/agents/treeItems/AgentPoolTreeItem";
import { CurrentSprintScopeContentTreePartProvider } from "../modules/workItem/treePartProviders/CurrentSprintScopeContentTreePartProvider";
import { GitRepositoryCommitsTreeItem } from "../modules/repository/treeItems/GitRepositoryCommitsTreeItem";
import { AreaPathHierarchyRootTreePartProvider } from "../modules/workItem/treePartProviders/AreaPathHierarchyRootTreePartProvider";
import { WorkItemLinkedBranchesTreePartProvider } from "../modules/workItem/treePartProviders/WorkItemLinkedBranchesTreePartProvider";
import { WorkItemCurrentSprintByAssigneeScopeTreeItem } from "../modules/workItem/treeItems/WorkItemCurrentSprintByAssigneeScopeTreeItem";
import { shouldUnwrapAccountOrProject } from "../common/shouldUnwrapAccountOrProject";
import { WorkItemLinkedBranchesTreeItem } from "../modules/workItem/treeItems/WorkItemLinkedBranchesTreeItem";
import { WorkItemHierarchyTreeItem } from "../modules/workItem/treeItems/WorkItemHierarchyTreeItem";
import { of, map } from "rxjs";
import { GitRepositoryPullRequestsTreeItem } from "../modules/repository/treeItems/GitRepositoryPullRequestsTreeItem";
import { GitRepositoryPullRequestTreeItem } from "../modules/repository/treeItems/GitRepositoryPullRequestTreeItem";
import { ProjectRootTreePartProvider } from "../modules/workItem/treePartProviders/ProjectRootTreePartProvider";
import { WorkItemRevisionTreeItem } from "../modules/workItem/treeItems/WorkItemRevisionTreeItem";
import { GitRepositoryCommitTreeItem } from "../modules/repository/treeItems/GitRepositoryCommitTreeItem";
import { GitRepositoryPullRequestReviewerTreePartProvider } from "../modules/repository/treePartProviders/GitRepositoryPullRequestReviewerTreePartProvider";
import { MentionedTreeItem } from "../modules/workItem/treeItems/MentionedTreeItem";
import { WorkItemHistoryTreeItem } from "../modules/workItem/treeItems/WorkItemHistoryTreeItem";
import { WorkItemCommentsTreePartProvider } from "../modules/workItem/treePartProviders/WorkItemCommentsTreePartProvider";
import { GitRepositoryItemsTreeItem } from "../modules/repository/treeItems/GitRepositoryItemsTreeItem";
import { PinnedAgentPoolTreePartProvider } from "../modules/agents/treePartProviders/PinnedAgentPoolTreePartProvider";
import { PipelineRunTimelineTreePartProvider } from "../modules/pipeline/treePartProviders/PipelineRunTimelineTreePartProvider";
import { GitRepositoryPullRequestCommentThreadTreePartProvider } from "../modules/repository/treePartProviders/GitRepositoryPullRequestCommentThreadTreePartProvider";
import { GitRepositoryBranchesTreeItem } from "../modules/repository/treeItems/GitRepositoryBranchesTreeItem";
import { Constructor } from "../common/constructor";
import { AgentJobsContainerTreeItem } from "../modules/agents/treeItems/AgentJobsContainerTreeItem";
import { QueryResultsTreePartProvider } from "../modules/workItem/treePartProviders/QueryResultsTreePartProvider";
import { GitRepositoryTreePartProvider } from "../modules/repository/treePartProviders/GitRepositoryTreePartProvider";
import { PinnedGitRepositoryTreePartProvider } from "../modules/repository/treePartProviders/PinnedGitRepositoryTreePartProvider";
import { AgentTreeItem } from "../modules/agents/treeItems/AgentTreeItem";
import { WorkItemAttachmentsTreeItem } from "../modules/workItem/treeItems/WorkItemAttachmentsTreeItem";
import { WorkItemTeamTreeItem } from "../modules/workItem/treeItems/WorkItemTeamTreeItem";
import { dedupePinnedPipelines } from "../modules/pipeline/dedupePinnedPipelines";
import { GitRepositoryPullRequestTreePartProvider } from "../modules/repository/treePartProviders/GitRepositoryPullRequestTreePartProvider";
import { AllTeamsTreePartProvider } from "../modules/workItem/treePartProviders/AllTeamsTreePartProvider";
import { WorkItemCurrentSprintGroupTreeItem } from "../modules/workItem/treeItems/WorkItemCurrentSprintGroupTreeItem";
import { HierarchyRootContentTreePartProvider } from "../modules/workItem/treePartProviders/HierarchyRootContentTreePartProvider";
import { PinnedWorkItemAreaPathTreePartProvider } from "../modules/workItem/treePartProviders/PinnedWorkItemAreaPathTreePartProvider";
import { PipelineRunTimelineTreeItem } from "../modules/pipeline/treeItems/PipelineRunTimelineTreeItem";
import { RecentlyModifiedByMeTreeItem } from "../modules/workItem/treeItems/RecentlyModifiedByMeTreeItem";
import { MyWorkTreeItem } from "../modules/workItem/treeItems/MyWorkTreeItem";
import { WorkItemCurrentSprintTreeItem } from "../modules/workItem/treeItems/WorkItemCurrentSprintTreeItem";
import { GitRepositoryTreeItem } from "../modules/repository/treeItems/GitRepositoryTreeItem";
import { WorkItemLinkedCommitsTreeItem } from "../modules/workItem/treeItems/WorkItemLinkedCommitsTreeItem";
import { GitRepositoryBranchTreePartProvider } from "../modules/repository/treePartProviders/GitRepositoryBranchTreePartProvider";
import { AllTeamsTreeItem } from "../modules/workItem/treeItems/AllTeamsTreeItem";
import { WorkItemBacklogTreeItem } from "../modules/workItem/treeItems/WorkItemBacklogTreeItem";
import { ProjectTreeItem } from "../modules/core/treeItems/ProjectTreeItem";
import { AgentJobTreePartProvider } from "../modules/agents/treePartProviders/AgentJobTreePartProvider";
import { CurrentSprintGroupWorkItemTreePartProvider } from "../modules/workItem/treePartProviders/CurrentSprintGroupWorkItemTreePartProvider";
import { WorkItemLinkedWorkItemGroupsTreePartProvider } from "../modules/workItem/treePartProviders/WorkItemLinkedWorkItemGroupsTreePartProvider";
import { AgentsContainerTreeItem } from "../modules/agents/treeItems/AgentsContainerTreeItem";
import { ProjectTreePartProvider } from "../modules/core/treePartProviders/ProjectTreePartProvider";
import { MyTeamsTreeItem } from "../modules/workItem/treeItems/MyTeamsTreeItem";
import { WorkItemHistoryTreePartProvider } from "../modules/workItem/treePartProviders/WorkItemHistoryTreePartProvider";
import { GitRepositoryPullRequestWorkItemTreePartProvider } from "../modules/repository/treePartProviders/GitRepositoryPullRequestWorkItemTreePartProvider";
import { DashboardTreeItem } from "../modules/dashboard/treeItems/DashboardTreeItem";
import { AgentPoolTreePartProvider } from "../modules/agents/treePartProviders/AgentPoolTreePartProvider";
import { dedupePinnedAgentPools } from "../modules/agents/dedupePinnedAgentPools";
import { GitRepositoryPullRequestReviewersTreeItem } from "../modules/repository/treeItems/GitRepositoryPullRequestReviewersTreeItem";
import { PipelineTreePartProvider } from "../modules/pipeline/treePartProviders/PipelineTreePartProvider";
import { GitRepositoryTagTreePartProvider } from "../modules/repository/treePartProviders/GitRepositoryTagTreePartProvider";
import { HierarchyChildrenTreePartProvider } from "../modules/workItem/treePartProviders/HierarchyChildrenTreePartProvider";
import { PipelineRunTreeItem } from "../modules/pipeline/treeItems/PipelineRunTreeItem";
import { AccountTreeItem } from "../modules/core/treeItems/AccountTreeItem";
import { WorkItemLinkedPullRequestsTreeItem } from "../modules/workItem/treeItems/WorkItemLinkedPullRequestsTreeItem";
import { QueryFolderChildrenTreePartProvider } from "../modules/workItem/treePartProviders/QueryFolderChildrenTreePartProvider";
import { DeduplicatingTreePartProvider } from "../common/treePartProvider/DeduplicatingTreePartProvider";
import { CombiningTreePartProvider } from "../common/treePartProvider/CombiningTreePartProvider";
import { AccountTreePartProvider } from "../modules/core/treePartProviders/AccountTreePartProvider";
import { GitRepositoryItemTreePartProvider } from "../modules/repository/treePartProviders/GitRepositoryItemTreePartProvider";
import { QueriesContentTreePartProvider } from "../modules/workItem/treePartProviders/QueriesContentTreePartProvider";
import { WorkItemCommentsTreeItem } from "../modules/workItem/treeItems/WorkItemCommentsTreeItem";
import { PinnedWorkItemQueryLeafTreePartProvider } from "../modules/workItem/treePartProviders/PinnedWorkItemQueryLeafTreePartProvider";
import { DashboardWidgetTreePartProvider } from "../modules/dashboard/treePartProviders/DashboardWidgetTreePartProvider";
import { WorkItemQueryLeafTreeItem } from "../modules/workItem/treeItems/WorkItemQueryLeafTreeItem";
import { CurrentSprintTreePartProvider } from "../modules/workItem/treePartProviders/CurrentSprintTreePartProvider";
import { AreaPathsContentTreePartProvider } from "../modules/workItem/treePartProviders/AreaPathsContentTreePartProvider";
import { dedupePinnedRepositories } from "../modules/repository/dedupePinnedRepositories";
import { WorkItemLinkedWorkItemsTreePartProvider } from "../modules/workItem/treePartProviders/WorkItemLinkedWorkItemsTreePartProvider";
import { AgentTreePartProvider } from "../modules/agents/treePartProviders/AgentTreePartProvider";
import { PinnedPipelineTreePartProvider } from "../modules/pipeline/treePartProviders/PinnedPipelineTreePartProvider";
import { WorkItemRelationGroupTreeItem } from "../modules/workItem/treeItems/WorkItemRelationGroupTreeItem";
import { WorkItemAreaPathTreeItem } from "../modules/workItem/treeItems/WorkItemAreaPathTreeItem";
import { GitRepositoryTagsTreeItem } from "../modules/repository/treeItems/GitRepositoryTagsTreeItem";
import { selectSignInStatus } from "../modules/core/selectSignInStatus";
import { PipelineRunArtifactTreePartProvider } from "../modules/pipeline/treePartProviders/PipelineRunArtifactTreePartProvider";
import { GitRepositoryCommitTreePartProvider } from "../modules/repository/treePartProviders/GitRepositoryCommitTreePartProvider";
import { WorkItemLinkedBuildsTreePartProvider } from "../modules/workItem/treePartProviders/WorkItemLinkedBuildsTreePartProvider";
import { RecentlyModifiedByMeTreePartProvider } from "../modules/workItem/treePartProviders/RecentlyModifiedByMeTreePartProvider";
import { WorkItemRevisionFieldsTreePartProvider } from "../modules/workItem/treePartProviders/WorkItemRevisionFieldsTreePartProvider";
import { PinnedAgentTreePartProvider } from "../modules/agents/treePartProviders/PinnedAgentTreePartProvider";
import { DashboardsContainerTreeItem } from "../modules/dashboard/treeItems/DashboardsContainerTreeItem";
import { WorkItemLinkedPullRequestsTreePartProvider } from "../modules/workItem/treePartProviders/WorkItemLinkedPullRequestsTreePartProvider";
import { AreaPathsTreeItem } from "../modules/workItem/treeItems/AreaPathsTreeItem";
import { WorkItemCurrentSprintByStateScopeTreeItem } from "../modules/workItem/treeItems/WorkItemCurrentSprintByStateScopeTreeItem";
import { PipelineArtifactsTreeItem } from "../modules/pipeline/treeItems/PipelineArtifactsTreeItem";
import { DashboardTreePartProvider } from "../modules/dashboard/treePartProviders/DashboardTreePartProvider";
import { CurrentSprintScopeTreePartProvider } from "../modules/workItem/treePartProviders/CurrentSprintScopeTreePartProvider";
import { GitRepositoryBranchTreeItem } from "../modules/repository/treeItems/GitRepositoryBranchTreeItem";
import { AssignedToMeTreeItem } from "../modules/workItem/treeItems/AssignedToMeTreeItem";
import { WorkItemQueryFolderTreeItem } from "../modules/workItem/treeItems/WorkItemQueryFolderTreeItem";
import { PipelineFolderTreeItem } from "../modules/pipeline/treeItems/PipelineFolderTreeItem";
import { PinnedWorkItemTreePartProvider } from "../modules/workItem/treePartProviders/PinnedWorkItemTreePartProvider";
import { PipelineRunTreePartProvider } from "../modules/pipeline/treePartProviders/PipelineRunTreePartProvider";
import { WorkItemCurrentSprintUnassignedScopeTreeItem } from "../modules/workItem/treeItems/WorkItemCurrentSprintUnassignedScopeTreeItem";
import { PinnedWorkItemTeamTreePartProvider } from "../modules/workItem/treePartProviders/PinnedWorkItemTeamTreePartProvider";

@injectable()
export class RepositoryTreeProviderResolver {
  #settingsService: SettingsService;

  #workItemLinkedCommitsTreePartProvider: WorkItemLinkedCommitsTreePartProvider;
  #gitRepositoryPullRequestTreePartProvider: GitRepositoryPullRequestTreePartProvider;
  #gitRepositoryPullRequestStatusTreePartProvider: GitRepositoryPullRequestStatusTreePartProvider;
  #hierarchyChildrenTreePartProvider: HierarchyChildrenTreePartProvider;
  #workItemLinkedPullRequestsTreePartProvider: WorkItemLinkedPullRequestsTreePartProvider;
  #projectTreePartProvider: ProjectTreePartProvider;
  #gitRepositoryCommitTreePartProvider: GitRepositoryCommitTreePartProvider;
  #workItemLinkedWorkItemsTreePartProvider: WorkItemLinkedWorkItemsTreePartProvider;
  #workItemLinkedBuildsTreePartProvider: WorkItemLinkedBuildsTreePartProvider;
  #gitRepositoryItemTreePartProvider: GitRepositoryItemTreePartProvider;
  #gitRepositoryPullRequestReviewerTreePartProvider: GitRepositoryPullRequestReviewerTreePartProvider;
  #workItemLinkedBranchesTreePartProvider: WorkItemLinkedBranchesTreePartProvider;
  #attachmentTreePartProvider: AttachmentTreePartProvider;
  #workItemRevisionFieldsTreePartProvider: WorkItemRevisionFieldsTreePartProvider;
  #gitRepositoryPullRequestWorkItemTreePartProvider: GitRepositoryPullRequestWorkItemTreePartProvider;
  #workItemLinkedWorkItemGroupsTreePartProvider: WorkItemLinkedWorkItemGroupsTreePartProvider;
  #gitRepositoryTagTreePartProvider: GitRepositoryTagTreePartProvider;
  #workItemHistoryTreePartProvider: WorkItemHistoryTreePartProvider;
  #pinnedGitRepositoryPullRequestTreePartProvider: PinnedGitRepositoryPullRequestTreePartProvider;
  #gitRepositoryPullRequestCommentThreadTreePartProvider: GitRepositoryPullRequestCommentThreadTreePartProvider;
  #gitRepositoryTreePartProvider: GitRepositoryTreePartProvider;
  #accountTreePartProvider: AccountTreePartProvider;
  #workItemCommentsTreePartProvider: WorkItemCommentsTreePartProvider;
  #gitRepositoryBranchTreePartProvider: GitRepositoryBranchTreePartProvider;
  #pinnedGitRepositoryTreePartProvider: PinnedGitRepositoryTreePartProvider;

  #workItemAttachmentsTreeItem: Constructor<WorkItemAttachmentsTreeItem>;
  #workItemLinkedPullRequestsTreeItem: Constructor<WorkItemLinkedPullRequestsTreeItem>;
  #workItemLinkedBranchesTreeItem: Constructor<WorkItemLinkedBranchesTreeItem>;
  #gitRepositoryTagsTreeItem: Constructor<GitRepositoryTagsTreeItem>;
  #workItemLinkedBuildsTreeItem: Constructor<WorkItemLinkedBuildsTreeItem>;
  #gitRepositoryPullRequestsTreeItem: Constructor<GitRepositoryPullRequestsTreeItem>;
  #workItemLinkedCommitsTreeItem: Constructor<WorkItemLinkedCommitsTreeItem>;
  #gitRepositoryItemsTreeItem: Constructor<GitRepositoryItemsTreeItem>;
  #gitRepositoryBranchesTreeItem: Constructor<GitRepositoryBranchesTreeItem>;
  #workItemCommentsTreeItem: Constructor<WorkItemCommentsTreeItem>;
  #gitRepositoryCommitsTreeItem: Constructor<GitRepositoryCommitsTreeItem>;
  #gitRepositoryPullRequestReviewersTreeItem: Constructor<GitRepositoryPullRequestReviewersTreeItem>;

  projectUnwrappingTreePartProvider: TreePartProvider<any, any> | undefined;
  workItemDetailStaticTreePartProvider: TreePartProvider<any, any> | undefined;
  repositoryRootDeduplicatingTreePartProvider: TreePartProvider<any, any> | undefined;
  gitRepositoryPullRequestContentCombiningTreePartProvider: TreePartProvider<any, any> | undefined;
  projectSignInSwitchingTreePartProvider: TreePartProvider<any, any> | undefined;
  workItemContentsCombiningTreePartProvider: TreePartProvider<any, any> | undefined;
  gitRepositoryBranchDetailStaticTreePartProvider: TreePartProvider<any, any> | undefined;
  gitRepositoryDetailStaticTreePartProvider: TreePartProvider<any, any> | undefined;
  gitRepositoryCommitDetailStaticTreePartProvider: TreePartProvider<any, any> | undefined;
  repositoryRootCombiningTreePartProvider: TreePartProvider<any, any> | undefined;
  gitRepositoryPullRequestReviewersStaticTreePartProvider: TreePartProvider<any, any> | undefined;
  accountRootUnwrappingTreePartProvider: TreePartProvider<any, any> | undefined;

  constructor(
    @inject(types.SettingsService) settingsService: SettingsService,
    @inject(types.WorkItemLinkedCommitsTreePartProvider)
    workItemLinkedCommitsTreePartProvider: WorkItemLinkedCommitsTreePartProvider,
    @inject(types.GitRepositoryPullRequestTreePartProvider)
    gitRepositoryPullRequestTreePartProvider: GitRepositoryPullRequestTreePartProvider,
    @inject(types.GitRepositoryPullRequestStatusTreePartProvider)
    gitRepositoryPullRequestStatusTreePartProvider: GitRepositoryPullRequestStatusTreePartProvider,
    @inject(types.HierarchyChildrenTreePartProvider)
    hierarchyChildrenTreePartProvider: HierarchyChildrenTreePartProvider,
    @inject(types.WorkItemLinkedPullRequestsTreePartProvider)
    workItemLinkedPullRequestsTreePartProvider: WorkItemLinkedPullRequestsTreePartProvider,
    @inject(types.ProjectTreePartProvider) projectTreePartProvider: ProjectTreePartProvider,
    @inject(types.GitRepositoryCommitTreePartProvider)
    gitRepositoryCommitTreePartProvider: GitRepositoryCommitTreePartProvider,
    @inject(types.WorkItemLinkedWorkItemsTreePartProvider)
    workItemLinkedWorkItemsTreePartProvider: WorkItemLinkedWorkItemsTreePartProvider,
    @inject(types.WorkItemLinkedBuildsTreePartProvider)
    workItemLinkedBuildsTreePartProvider: WorkItemLinkedBuildsTreePartProvider,
    @inject(types.GitRepositoryItemTreePartProvider)
    gitRepositoryItemTreePartProvider: GitRepositoryItemTreePartProvider,
    @inject(types.GitRepositoryPullRequestReviewerTreePartProvider)
    gitRepositoryPullRequestReviewerTreePartProvider: GitRepositoryPullRequestReviewerTreePartProvider,
    @inject(types.WorkItemLinkedBranchesTreePartProvider)
    workItemLinkedBranchesTreePartProvider: WorkItemLinkedBranchesTreePartProvider,
    @inject(types.AttachmentTreePartProvider) attachmentTreePartProvider: AttachmentTreePartProvider,
    @inject(types.WorkItemRevisionFieldsTreePartProvider)
    workItemRevisionFieldsTreePartProvider: WorkItemRevisionFieldsTreePartProvider,
    @inject(types.GitRepositoryPullRequestWorkItemTreePartProvider)
    gitRepositoryPullRequestWorkItemTreePartProvider: GitRepositoryPullRequestWorkItemTreePartProvider,
    @inject(types.WorkItemLinkedWorkItemGroupsTreePartProvider)
    workItemLinkedWorkItemGroupsTreePartProvider: WorkItemLinkedWorkItemGroupsTreePartProvider,
    @inject(types.GitRepositoryTagTreePartProvider) gitRepositoryTagTreePartProvider: GitRepositoryTagTreePartProvider,
    @inject(types.WorkItemHistoryTreePartProvider) workItemHistoryTreePartProvider: WorkItemHistoryTreePartProvider,
    @inject(types.PinnedGitRepositoryPullRequestTreePartProvider)
    pinnedGitRepositoryPullRequestTreePartProvider: PinnedGitRepositoryPullRequestTreePartProvider,
    @inject(types.GitRepositoryPullRequestCommentThreadTreePartProvider)
    gitRepositoryPullRequestCommentThreadTreePartProvider: GitRepositoryPullRequestCommentThreadTreePartProvider,
    @inject(types.GitRepositoryTreePartProvider) gitRepositoryTreePartProvider: GitRepositoryTreePartProvider,
    @inject(types.AccountTreePartProvider) accountTreePartProvider: AccountTreePartProvider,
    @inject(types.WorkItemCommentsTreePartProvider) workItemCommentsTreePartProvider: WorkItemCommentsTreePartProvider,
    @inject(types.GitRepositoryBranchTreePartProvider)
    gitRepositoryBranchTreePartProvider: GitRepositoryBranchTreePartProvider,
    @inject(types.PinnedGitRepositoryTreePartProvider)
    pinnedGitRepositoryTreePartProvider: PinnedGitRepositoryTreePartProvider,
    @inject(types.WorkItemAttachmentsTreeItem) workItemAttachmentsTreeItem: Constructor<WorkItemAttachmentsTreeItem>,
    @inject(types.WorkItemLinkedPullRequestsTreeItem)
    workItemLinkedPullRequestsTreeItem: Constructor<WorkItemLinkedPullRequestsTreeItem>,
    @inject(types.WorkItemLinkedBranchesTreeItem)
    workItemLinkedBranchesTreeItem: Constructor<WorkItemLinkedBranchesTreeItem>,
    @inject(types.GitRepositoryTagsTreeItem) gitRepositoryTagsTreeItem: Constructor<GitRepositoryTagsTreeItem>,
    @inject(types.WorkItemLinkedBuildsTreeItem) workItemLinkedBuildsTreeItem: Constructor<WorkItemLinkedBuildsTreeItem>,
    @inject(types.GitRepositoryPullRequestsTreeItem)
    gitRepositoryPullRequestsTreeItem: Constructor<GitRepositoryPullRequestsTreeItem>,
    @inject(types.WorkItemLinkedCommitsTreeItem)
    workItemLinkedCommitsTreeItem: Constructor<WorkItemLinkedCommitsTreeItem>,
    @inject(types.GitRepositoryItemsTreeItem) gitRepositoryItemsTreeItem: Constructor<GitRepositoryItemsTreeItem>,
    @inject(types.GitRepositoryBranchesTreeItem)
    gitRepositoryBranchesTreeItem: Constructor<GitRepositoryBranchesTreeItem>,
    @inject(types.WorkItemCommentsTreeItem) workItemCommentsTreeItem: Constructor<WorkItemCommentsTreeItem>,
    @inject(types.GitRepositoryCommitsTreeItem) gitRepositoryCommitsTreeItem: Constructor<GitRepositoryCommitsTreeItem>,
    @inject(types.GitRepositoryPullRequestReviewersTreeItem)
    gitRepositoryPullRequestReviewersTreeItem: Constructor<GitRepositoryPullRequestReviewersTreeItem>,
  ) {
    this.#settingsService = settingsService;
    this.#workItemLinkedCommitsTreePartProvider = workItemLinkedCommitsTreePartProvider;
    this.#gitRepositoryPullRequestTreePartProvider = gitRepositoryPullRequestTreePartProvider;
    this.#gitRepositoryPullRequestStatusTreePartProvider = gitRepositoryPullRequestStatusTreePartProvider;
    this.#hierarchyChildrenTreePartProvider = hierarchyChildrenTreePartProvider;
    this.#workItemLinkedPullRequestsTreePartProvider = workItemLinkedPullRequestsTreePartProvider;
    this.#projectTreePartProvider = projectTreePartProvider;
    this.#gitRepositoryCommitTreePartProvider = gitRepositoryCommitTreePartProvider;
    this.#workItemLinkedWorkItemsTreePartProvider = workItemLinkedWorkItemsTreePartProvider;
    this.#workItemLinkedBuildsTreePartProvider = workItemLinkedBuildsTreePartProvider;
    this.#gitRepositoryItemTreePartProvider = gitRepositoryItemTreePartProvider;
    this.#gitRepositoryPullRequestReviewerTreePartProvider = gitRepositoryPullRequestReviewerTreePartProvider;
    this.#workItemLinkedBranchesTreePartProvider = workItemLinkedBranchesTreePartProvider;
    this.#attachmentTreePartProvider = attachmentTreePartProvider;
    this.#workItemRevisionFieldsTreePartProvider = workItemRevisionFieldsTreePartProvider;
    this.#gitRepositoryPullRequestWorkItemTreePartProvider = gitRepositoryPullRequestWorkItemTreePartProvider;
    this.#workItemLinkedWorkItemGroupsTreePartProvider = workItemLinkedWorkItemGroupsTreePartProvider;
    this.#gitRepositoryTagTreePartProvider = gitRepositoryTagTreePartProvider;
    this.#workItemHistoryTreePartProvider = workItemHistoryTreePartProvider;
    this.#pinnedGitRepositoryPullRequestTreePartProvider = pinnedGitRepositoryPullRequestTreePartProvider;
    this.#gitRepositoryPullRequestCommentThreadTreePartProvider = gitRepositoryPullRequestCommentThreadTreePartProvider;
    this.#gitRepositoryTreePartProvider = gitRepositoryTreePartProvider;
    this.#accountTreePartProvider = accountTreePartProvider;
    this.#workItemCommentsTreePartProvider = workItemCommentsTreePartProvider;
    this.#gitRepositoryBranchTreePartProvider = gitRepositoryBranchTreePartProvider;
    this.#pinnedGitRepositoryTreePartProvider = pinnedGitRepositoryTreePartProvider;
    this.#workItemAttachmentsTreeItem = workItemAttachmentsTreeItem;
    this.#workItemLinkedPullRequestsTreeItem = workItemLinkedPullRequestsTreeItem;
    this.#workItemLinkedBranchesTreeItem = workItemLinkedBranchesTreeItem;
    this.#gitRepositoryTagsTreeItem = gitRepositoryTagsTreeItem;
    this.#workItemLinkedBuildsTreeItem = workItemLinkedBuildsTreeItem;
    this.#gitRepositoryPullRequestsTreeItem = gitRepositoryPullRequestsTreeItem;
    this.#workItemLinkedCommitsTreeItem = workItemLinkedCommitsTreeItem;
    this.#gitRepositoryItemsTreeItem = gitRepositoryItemsTreeItem;
    this.#gitRepositoryBranchesTreeItem = gitRepositoryBranchesTreeItem;
    this.#workItemCommentsTreeItem = workItemCommentsTreeItem;
    this.#gitRepositoryCommitsTreeItem = gitRepositoryCommitsTreeItem;
    this.#gitRepositoryPullRequestReviewersTreeItem = gitRepositoryPullRequestReviewersTreeItem;
  }

  @postConstruct()
  private initializeRepositoryTreeProvider() {
    this.workItemDetailStaticTreePartProvider = new StaticTreePartProvider({
      linkedCommits: {
        treeItem: this.#workItemLinkedCommitsTreeItem,
        condition: (itemObservable) =>
          itemObservable.pipe(
            map(
              (item) =>
                item.workItem?.relations?.some(
                  (relation: any) => relation.url?.startsWith("vstfs:///Git/Commit/") ?? false,
                ) ?? false,
            ),
          ),
      },
      linkedPullRequests: {
        treeItem: this.#workItemLinkedPullRequestsTreeItem,
        condition: (itemObservable) =>
          itemObservable.pipe(
            map(
              (item) =>
                item.workItem?.relations?.some(
                  (relation: any) => relation.url?.startsWith("vstfs:///Git/PullRequestId/") ?? false,
                ) ?? false,
            ),
          ),
      },
      linkedBranches: {
        treeItem: this.#workItemLinkedBranchesTreeItem,
        condition: (itemObservable) =>
          itemObservable.pipe(
            map(
              (item) =>
                item.workItem?.relations?.some(
                  (relation: any) => relation.url?.startsWith("vstfs:///Git/Ref/") ?? false,
                ) ?? false,
            ),
          ),
      },
      linkedBuilds: {
        treeItem: this.#workItemLinkedBuildsTreeItem,
        condition: (itemObservable) =>
          itemObservable.pipe(
            map(
              (item) =>
                item.workItem?.relations?.some(
                  (relation: any) => relation.url?.startsWith("vstfs:///Build/Build/") ?? false,
                ) ?? false,
            ),
          ),
      },
      comments: {
        treeItem: this.#workItemCommentsTreeItem,
        condition: (itemObservable) =>
          itemObservable.pipe(map((item) => (item.workItem?.fields?.["System.CommentCount"] ?? 0) > 0)),
      },
      attachments: {
        treeItem: this.#workItemAttachmentsTreeItem,
        condition: (itemObservable) =>
          itemObservable.pipe(
            map((item) => item.workItem?.relations?.some((relation: any) => relation.rel === "AttachedFile") ?? false),
          ),
      },
    });
    this.projectSignInSwitchingTreePartProvider = new SwitchingTreePartProvider(selectSignInStatus, {
      signedIn: this.#projectTreePartProvider,
    });
    this.workItemContentsCombiningTreePartProvider = new CombiningTreePartProvider({
      children: this.#hierarchyChildrenTreePartProvider,
      details: this.workItemDetailStaticTreePartProvider,
      linkedWorkItemGroups: this.#workItemLinkedWorkItemGroupsTreePartProvider,
    });
    this.gitRepositoryBranchDetailStaticTreePartProvider = new StaticTreePartProvider({
      items: {
        treeItem: this.#gitRepositoryItemsTreeItem,
      },
      commits: {
        treeItem: this.#gitRepositoryCommitsTreeItem,
      },
    });
    this.gitRepositoryDetailStaticTreePartProvider = new StaticTreePartProvider({
      items: {
        treeItem: this.#gitRepositoryItemsTreeItem,
      },
      branches: {
        treeItem: this.#gitRepositoryBranchesTreeItem,
      },
      commits: {
        treeItem: this.#gitRepositoryCommitsTreeItem,
      },
      tags: {
        treeItem: this.#gitRepositoryTagsTreeItem,
      },
      pullRequests: {
        treeItem: this.#gitRepositoryPullRequestsTreeItem,
      },
    });
    this.gitRepositoryCommitDetailStaticTreePartProvider = new StaticTreePartProvider({
      items: {
        treeItem: this.#gitRepositoryItemsTreeItem,
      },
    });
    this.gitRepositoryPullRequestReviewersStaticTreePartProvider = new StaticTreePartProvider({
      reviewers: {
        treeItem: this.#gitRepositoryPullRequestReviewersTreeItem,
      },
    });
    this.projectUnwrappingTreePartProvider = new UnwrappingTreePartProvider(
      this.projectSignInSwitchingTreePartProvider,
      shouldUnwrapAccountOrProject(this.#settingsService.unwrapProjects()),
      (i) => this.getTreePartProvider(i),
    );
    this.gitRepositoryPullRequestContentCombiningTreePartProvider = new CombiningTreePartProvider({
      reviewers: this.gitRepositoryPullRequestReviewersStaticTreePartProvider,
      status: this.#gitRepositoryPullRequestStatusTreePartProvider,
      commentThread: this.#gitRepositoryPullRequestCommentThreadTreePartProvider,
      workItems: this.#gitRepositoryPullRequestWorkItemTreePartProvider,
    });
    this.accountRootUnwrappingTreePartProvider = new UnwrappingTreePartProvider(
      this.#accountTreePartProvider,
      shouldUnwrapAccountOrProject(this.#settingsService.unwrapAccounts()),
      () => this.projectUnwrappingTreePartProvider,
    );
    this.repositoryRootCombiningTreePartProvider = new CombiningTreePartProvider({
      pinnedPullRequests: this.#pinnedGitRepositoryPullRequestTreePartProvider,
      pinnedRepositories: this.#pinnedGitRepositoryTreePartProvider,
      accounts: this.accountRootUnwrappingTreePartProvider,
    });
    this.repositoryRootDeduplicatingTreePartProvider = new DeduplicatingTreePartProvider(
      this.repositoryRootCombiningTreePartProvider,
      dedupePinnedRepositories,
    );
  }

  public getTreePartProvider(element: AbstractTreeItem<any> | undefined): TreePartProvider<any, any> | undefined {
    if (element === undefined) {
      return this.repositoryRootDeduplicatingTreePartProvider;
    }
    if (element instanceof AccountTreeItem) {
      return this.projectUnwrappingTreePartProvider;
    }
    if (element instanceof ProjectTreeItem) {
      return this.#gitRepositoryTreePartProvider;
    }
    if (element instanceof GitRepositoryTreeItem) {
      return this.gitRepositoryDetailStaticTreePartProvider;
    }
    if (element instanceof GitRepositoryItemsTreeItem) {
      return this.#gitRepositoryItemTreePartProvider;
    }
    if (element instanceof GitRepositoryItemTreeItem) {
      return this.#gitRepositoryItemTreePartProvider;
    }
    if (element instanceof GitRepositoryCommitsTreeItem) {
      return this.#gitRepositoryCommitTreePartProvider;
    }
    if (element instanceof GitRepositoryCommitTreeItem) {
      return this.gitRepositoryCommitDetailStaticTreePartProvider;
    }
    if (element instanceof GitRepositoryBranchesTreeItem) {
      return this.#gitRepositoryBranchTreePartProvider;
    }
    if (element instanceof GitRepositoryBranchTreeItem) {
      return this.gitRepositoryBranchDetailStaticTreePartProvider;
    }
    if (element instanceof GitRepositoryTagsTreeItem) {
      return this.#gitRepositoryTagTreePartProvider;
    }
    if (element instanceof GitRepositoryPullRequestsTreeItem) {
      return this.#gitRepositoryPullRequestTreePartProvider;
    }
    if (element instanceof GitRepositoryPullRequestTreeItem) {
      return this.gitRepositoryPullRequestContentCombiningTreePartProvider;
    }
    if (element instanceof GitRepositoryPullRequestReviewersTreeItem) {
      return this.#gitRepositoryPullRequestReviewerTreePartProvider;
    }
    if (element instanceof WorkItemTreeItem) {
      return this.workItemContentsCombiningTreePartProvider;
    }
    if (element instanceof WorkItemCommentsTreeItem) {
      return this.#workItemCommentsTreePartProvider;
    }
    if (element instanceof WorkItemHistoryTreeItem) {
      return this.#workItemHistoryTreePartProvider;
    }
    if (element instanceof WorkItemRevisionTreeItem) {
      return this.#workItemRevisionFieldsTreePartProvider;
    }
    if (element instanceof WorkItemAttachmentsTreeItem) {
      return this.#attachmentTreePartProvider;
    }
    if (element instanceof WorkItemLinkedCommitsTreeItem) {
      return this.#workItemLinkedCommitsTreePartProvider;
    }
    if (element instanceof WorkItemLinkedPullRequestsTreeItem) {
      return this.#workItemLinkedPullRequestsTreePartProvider;
    }
    if (element instanceof WorkItemLinkedBranchesTreeItem) {
      return this.#workItemLinkedBranchesTreePartProvider;
    }
    if (element instanceof WorkItemLinkedBuildsTreeItem) {
      return this.#workItemLinkedBuildsTreePartProvider;
    }
    if (element instanceof WorkItemRelationGroupTreeItem) {
      return this.#workItemLinkedWorkItemsTreePartProvider;
    }
    return undefined;
  }
}

@injectable()
export class PipelineTreeProviderResolver {
  #settingsService: SettingsService;

  #projectTreePartProvider: ProjectTreePartProvider;
  #pipelineRunTreePartProvider: PipelineRunTreePartProvider;
  #accountTreePartProvider: AccountTreePartProvider;
  #pinnedPipelineFolderTreePartProvider: PinnedPipelineFolderTreePartProvider;
  #pinnedPipelineTreePartProvider: PinnedPipelineTreePartProvider;
  #pipelineRunArtifactTreePartProvider: PipelineRunArtifactTreePartProvider;
  #pipelineRunTimelineTreePartProvider: PipelineRunTimelineTreePartProvider;
  #pipelineTreePartProvider: PipelineTreePartProvider;
  #pipelineFolderTreePartProvider: PipelineFolderTreePartProvider;

  #pipelineArtifactsTreeItem: Constructor<PipelineArtifactsTreeItem>;

  projectUnwrappingTreePartProvider: TreePartProvider<any, any> | undefined;
  projectSignInSwitchingTreePartProvider: TreePartProvider<any, any> | undefined;
  pipelineFolderAndPipelineCombiningTreePartProvider: TreePartProvider<any, any> | undefined;
  pipelineRunArtifactsStaticTreePartProvider: TreePartProvider<any, any> | undefined;
  pipelineRootDeduplicatingTreePartProvider: TreePartProvider<any, any> | undefined;
  accountRootUnwrappingTreePartProvider: TreePartProvider<any, any> | undefined;
  pipelineRunDetailCombiningTreePartProvider: TreePartProvider<any, any> | undefined;
  pipelineRootCombiningTreePartProvider: TreePartProvider<any, any> | undefined;

  constructor(
    @inject(types.SettingsService) settingsService: SettingsService,
    @inject(types.ProjectTreePartProvider) projectTreePartProvider: ProjectTreePartProvider,
    @inject(types.PipelineRunTreePartProvider) pipelineRunTreePartProvider: PipelineRunTreePartProvider,
    @inject(types.AccountTreePartProvider) accountTreePartProvider: AccountTreePartProvider,
    @inject(types.PinnedPipelineFolderTreePartProvider)
    pinnedPipelineFolderTreePartProvider: PinnedPipelineFolderTreePartProvider,
    @inject(types.PinnedPipelineTreePartProvider) pinnedPipelineTreePartProvider: PinnedPipelineTreePartProvider,
    @inject(types.PipelineRunArtifactTreePartProvider)
    pipelineRunArtifactTreePartProvider: PipelineRunArtifactTreePartProvider,
    @inject(types.PipelineRunTimelineTreePartProvider)
    pipelineRunTimelineTreePartProvider: PipelineRunTimelineTreePartProvider,
    @inject(types.PipelineTreePartProvider) pipelineTreePartProvider: PipelineTreePartProvider,
    @inject(types.PipelineFolderTreePartProvider) pipelineFolderTreePartProvider: PipelineFolderTreePartProvider,
    @inject(types.PipelineArtifactsTreeItem) pipelineArtifactsTreeItem: Constructor<PipelineArtifactsTreeItem>,
  ) {
    this.#settingsService = settingsService;
    this.#projectTreePartProvider = projectTreePartProvider;
    this.#pipelineRunTreePartProvider = pipelineRunTreePartProvider;
    this.#accountTreePartProvider = accountTreePartProvider;
    this.#pinnedPipelineFolderTreePartProvider = pinnedPipelineFolderTreePartProvider;
    this.#pinnedPipelineTreePartProvider = pinnedPipelineTreePartProvider;
    this.#pipelineRunArtifactTreePartProvider = pipelineRunArtifactTreePartProvider;
    this.#pipelineRunTimelineTreePartProvider = pipelineRunTimelineTreePartProvider;
    this.#pipelineTreePartProvider = pipelineTreePartProvider;
    this.#pipelineFolderTreePartProvider = pipelineFolderTreePartProvider;
    this.#pipelineArtifactsTreeItem = pipelineArtifactsTreeItem;
  }

  @postConstruct()
  private initializePipelineTreeProvider() {
    this.projectSignInSwitchingTreePartProvider = new SwitchingTreePartProvider(selectSignInStatus, {
      signedIn: this.#projectTreePartProvider,
    });
    this.pipelineFolderAndPipelineCombiningTreePartProvider = new CombiningTreePartProvider({
      pipelineFolder: this.#pipelineFolderTreePartProvider,
      pipeline: this.#pipelineTreePartProvider,
    });
    this.pipelineRunArtifactsStaticTreePartProvider = new StaticTreePartProvider({
      artifacts: {
        treeItem: this.#pipelineArtifactsTreeItem,
      },
    });
    this.pipelineRunDetailCombiningTreePartProvider = new CombiningTreePartProvider({
      artifacts: this.pipelineRunArtifactsStaticTreePartProvider,
      timeline: this.#pipelineRunTimelineTreePartProvider,
    });
    this.projectUnwrappingTreePartProvider = new UnwrappingTreePartProvider(
      this.projectSignInSwitchingTreePartProvider,
      shouldUnwrapAccountOrProject(this.#settingsService.unwrapProjects()),
      (i) => this.getTreePartProvider(i),
    );
    this.accountRootUnwrappingTreePartProvider = new UnwrappingTreePartProvider(
      this.#accountTreePartProvider,
      shouldUnwrapAccountOrProject(this.#settingsService.unwrapAccounts()),
      () => this.projectUnwrappingTreePartProvider,
    );
    this.pipelineRootCombiningTreePartProvider = new CombiningTreePartProvider({
      pinnedPipelineFolders: this.#pinnedPipelineFolderTreePartProvider,
      pinnedPipelines: this.#pinnedPipelineTreePartProvider,
      accounts: this.accountRootUnwrappingTreePartProvider,
    });
    this.pipelineRootDeduplicatingTreePartProvider = new DeduplicatingTreePartProvider(
      this.pipelineRootCombiningTreePartProvider,
      dedupePinnedPipelines,
    );
  }

  public getTreePartProvider(element: AbstractTreeItem<any> | undefined): TreePartProvider<any, any> | undefined {
    if (element === undefined) {
      return this.pipelineRootDeduplicatingTreePartProvider;
    }
    if (element instanceof AccountTreeItem) {
      return this.projectUnwrappingTreePartProvider;
    }
    if (element instanceof ProjectTreeItem) {
      return this.pipelineFolderAndPipelineCombiningTreePartProvider;
    }
    if (element instanceof PipelineFolderTreeItem) {
      return this.pipelineFolderAndPipelineCombiningTreePartProvider;
    }
    if (element instanceof PipelineTreeItem) {
      return this.#pipelineRunTreePartProvider;
    }
    if (element instanceof PipelineRunTreeItem) {
      return this.pipelineRunDetailCombiningTreePartProvider;
    }
    if (element instanceof PipelineArtifactsTreeItem) {
      return this.#pipelineRunArtifactTreePartProvider;
    }
    if (element instanceof PipelineRunTimelineTreeItem) {
      return this.#pipelineRunTimelineTreePartProvider;
    }
    return undefined;
  }
}

@injectable()
export class DashboardTreeProviderResolver {
  #settingsService: SettingsService;

  #projectTreePartProvider: ProjectTreePartProvider;
  #accountTreePartProvider: AccountTreePartProvider;
  #dashboardTreePartProvider: DashboardTreePartProvider;
  #dashboardWidgetTreePartProvider: DashboardWidgetTreePartProvider;

  #dashboardsContainerTreeItem: Constructor<DashboardsContainerTreeItem>;

  projectUnwrappingTreePartProvider: TreePartProvider<any, any> | undefined;
  projectSignInSwitchingTreePartProvider: TreePartProvider<any, any> | undefined;
  projectDashboardsStaticTreePartProvider: TreePartProvider<any, any> | undefined;
  accountRootUnwrappingTreePartProvider: TreePartProvider<any, any> | undefined;

  constructor(
    @inject(types.SettingsService) settingsService: SettingsService,
    @inject(types.ProjectTreePartProvider) projectTreePartProvider: ProjectTreePartProvider,
    @inject(types.AccountTreePartProvider) accountTreePartProvider: AccountTreePartProvider,
    @inject(types.DashboardTreePartProvider) dashboardTreePartProvider: DashboardTreePartProvider,
    @inject(types.DashboardWidgetTreePartProvider) dashboardWidgetTreePartProvider: DashboardWidgetTreePartProvider,
    @inject(types.DashboardsContainerTreeItem) dashboardsContainerTreeItem: Constructor<DashboardsContainerTreeItem>,
  ) {
    this.#settingsService = settingsService;
    this.#projectTreePartProvider = projectTreePartProvider;
    this.#accountTreePartProvider = accountTreePartProvider;
    this.#dashboardTreePartProvider = dashboardTreePartProvider;
    this.#dashboardWidgetTreePartProvider = dashboardWidgetTreePartProvider;
    this.#dashboardsContainerTreeItem = dashboardsContainerTreeItem;
  }

  @postConstruct()
  private initializeDashboardTreeProvider() {
    this.projectSignInSwitchingTreePartProvider = new SwitchingTreePartProvider(selectSignInStatus, {
      signedIn: this.#projectTreePartProvider,
    });
    this.projectDashboardsStaticTreePartProvider = new StaticTreePartProvider({
      dashboards: {
        treeItem: this.#dashboardsContainerTreeItem,
      },
    });
    this.projectUnwrappingTreePartProvider = new UnwrappingTreePartProvider(
      this.projectSignInSwitchingTreePartProvider,
      shouldUnwrapAccountOrProject(this.#settingsService.unwrapProjects()),
      (i) => this.getTreePartProvider(i),
    );
    this.accountRootUnwrappingTreePartProvider = new UnwrappingTreePartProvider(
      this.#accountTreePartProvider,
      shouldUnwrapAccountOrProject(this.#settingsService.unwrapAccounts()),
      () => this.projectUnwrappingTreePartProvider,
    );
  }

  public getTreePartProvider(element: AbstractTreeItem<any> | undefined): TreePartProvider<any, any> | undefined {
    if (element === undefined) {
      return this.accountRootUnwrappingTreePartProvider;
    }
    if (element instanceof AccountTreeItem) {
      return this.projectUnwrappingTreePartProvider;
    }
    if (element instanceof ProjectTreeItem) {
      return this.projectDashboardsStaticTreePartProvider;
    }
    if (element instanceof DashboardsContainerTreeItem) {
      return this.#dashboardTreePartProvider;
    }
    if (element instanceof DashboardTreeItem) {
      return this.#dashboardWidgetTreePartProvider;
    }
    return undefined;
  }
}

@injectable()
export class WorkItemTreeProviderResolver {
  #settingsService: SettingsService;

  #areaPathChildrenTreePartProvider: AreaPathChildrenTreePartProvider;
  #workItemLinkedCommitsTreePartProvider: WorkItemLinkedCommitsTreePartProvider;
  #pinnedWorkItemTreePartProvider: PinnedWorkItemTreePartProvider;
  #currentSprintScopeTreePartProvider: CurrentSprintScopeTreePartProvider;
  #pinnedWorkItemTeamTreePartProvider: PinnedWorkItemTeamTreePartProvider;
  #hierarchyRootContentTreePartProvider: HierarchyRootContentTreePartProvider;
  #hierarchyChildrenTreePartProvider: HierarchyChildrenTreePartProvider;
  #areaPathsContentTreePartProvider: AreaPathsContentTreePartProvider;
  #currentSprintTreePartProvider: CurrentSprintTreePartProvider;
  #projectRootTreePartProvider: ProjectRootTreePartProvider;
  #workItemLinkedPullRequestsTreePartProvider: WorkItemLinkedPullRequestsTreePartProvider;
  #projectTreePartProvider: ProjectTreePartProvider;
  #workItemLinkedWorkItemsTreePartProvider: WorkItemLinkedWorkItemsTreePartProvider;
  #workItemLinkedBuildsTreePartProvider: WorkItemLinkedBuildsTreePartProvider;
  #queriesContentTreePartProvider: QueriesContentTreePartProvider;
  #queryResultsTreePartProvider: QueryResultsTreePartProvider;
  #workItemLinkedBranchesTreePartProvider: WorkItemLinkedBranchesTreePartProvider;
  #attachmentTreePartProvider: AttachmentTreePartProvider;
  #myTeamsTreePartProvider: MyTeamsTreePartProvider;
  #backlogContentTreePartProvider: BacklogContentTreePartProvider;
  #currentSprintScopeContentTreePartProvider: CurrentSprintScopeContentTreePartProvider;
  #workItemRevisionFieldsTreePartProvider: WorkItemRevisionFieldsTreePartProvider;
  #assignedToMeTreePartProvider: AssignedToMeTreePartProvider;
  #allTeamsTreePartProvider: AllTeamsTreePartProvider;
  #pinnedWorkItemQueryLeafTreePartProvider: PinnedWorkItemQueryLeafTreePartProvider;
  #recentlyModifiedByMeTreePartProvider: RecentlyModifiedByMeTreePartProvider;
  #workItemLinkedWorkItemGroupsTreePartProvider: WorkItemLinkedWorkItemGroupsTreePartProvider;
  #workItemHistoryTreePartProvider: WorkItemHistoryTreePartProvider;
  #mentionedTreePartProvider: MentionedTreePartProvider;
  #areaPathHierarchyRootTreePartProvider: AreaPathHierarchyRootTreePartProvider;
  #pinnedWorkItemAreaPathTreePartProvider: PinnedWorkItemAreaPathTreePartProvider;
  #accountTreePartProvider: AccountTreePartProvider;
  #workItemCommentsTreePartProvider: WorkItemCommentsTreePartProvider;
  #currentSprintGroupWorkItemTreePartProvider: CurrentSprintGroupWorkItemTreePartProvider;
  #queryFolderChildrenTreePartProvider: QueryFolderChildrenTreePartProvider;

  #workItemAttachmentsTreeItem: Constructor<WorkItemAttachmentsTreeItem>;
  #workItemLinkedPullRequestsTreeItem: Constructor<WorkItemLinkedPullRequestsTreeItem>;
  #workItemLinkedBranchesTreeItem: Constructor<WorkItemLinkedBranchesTreeItem>;
  #recentlyModifiedByMeTreeItem: Constructor<RecentlyModifiedByMeTreeItem>;
  #mentionedTreeItem: Constructor<MentionedTreeItem>;
  #workItemLinkedBuildsTreeItem: Constructor<WorkItemLinkedBuildsTreeItem>;
  #assignedToMeTreeItem: Constructor<AssignedToMeTreeItem>;
  #workItemLinkedCommitsTreeItem: Constructor<WorkItemLinkedCommitsTreeItem>;
  #workItemBacklogTreeItem: Constructor<WorkItemBacklogTreeItem>;
  #workItemCommentsTreeItem: Constructor<WorkItemCommentsTreeItem>;

  projectUnwrappingTreePartProvider: TreePartProvider<any, any> | undefined;
  workItemDetailStaticTreePartProvider: TreePartProvider<any, any> | undefined;
  projectSignInSwitchingTreePartProvider: TreePartProvider<any, any> | undefined;
  areaPathNodeCombiningTreePartProvider: TreePartProvider<any, any> | undefined;
  backlogStaticTreePartProvider: TreePartProvider<any, any> | undefined;
  workItemContentsCombiningTreePartProvider: TreePartProvider<any, any> | undefined;
  workItemRootCombiningTreePartProvider: TreePartProvider<any, any> | undefined;
  myWorkStaticTreePartProvider: TreePartProvider<any, any> | undefined;
  currentSprintUnwrappingTreePartProvider: TreePartProvider<any, any> | undefined;
  accountRootUnwrappingTreePartProvider: TreePartProvider<any, any> | undefined;
  teamContentsCombiningTreePartProvider: TreePartProvider<any, any> | undefined;

  constructor(
    @inject(types.SettingsService) settingsService: SettingsService,
    @inject(types.AreaPathChildrenTreePartProvider) areaPathChildrenTreePartProvider: AreaPathChildrenTreePartProvider,
    @inject(types.WorkItemLinkedCommitsTreePartProvider)
    workItemLinkedCommitsTreePartProvider: WorkItemLinkedCommitsTreePartProvider,
    @inject(types.PinnedWorkItemTreePartProvider) pinnedWorkItemTreePartProvider: PinnedWorkItemTreePartProvider,
    @inject(types.CurrentSprintScopeTreePartProvider)
    currentSprintScopeTreePartProvider: CurrentSprintScopeTreePartProvider,
    @inject(types.PinnedWorkItemTeamTreePartProvider)
    pinnedWorkItemTeamTreePartProvider: PinnedWorkItemTeamTreePartProvider,
    @inject(types.HierarchyRootContentTreePartProvider)
    hierarchyRootContentTreePartProvider: HierarchyRootContentTreePartProvider,
    @inject(types.HierarchyChildrenTreePartProvider)
    hierarchyChildrenTreePartProvider: HierarchyChildrenTreePartProvider,
    @inject(types.AreaPathsContentTreePartProvider) areaPathsContentTreePartProvider: AreaPathsContentTreePartProvider,
    @inject(types.CurrentSprintTreePartProvider) currentSprintTreePartProvider: CurrentSprintTreePartProvider,
    @inject(types.ProjectRootTreePartProvider) projectRootTreePartProvider: ProjectRootTreePartProvider,
    @inject(types.WorkItemLinkedPullRequestsTreePartProvider)
    workItemLinkedPullRequestsTreePartProvider: WorkItemLinkedPullRequestsTreePartProvider,
    @inject(types.ProjectTreePartProvider) projectTreePartProvider: ProjectTreePartProvider,
    @inject(types.WorkItemLinkedWorkItemsTreePartProvider)
    workItemLinkedWorkItemsTreePartProvider: WorkItemLinkedWorkItemsTreePartProvider,
    @inject(types.WorkItemLinkedBuildsTreePartProvider)
    workItemLinkedBuildsTreePartProvider: WorkItemLinkedBuildsTreePartProvider,
    @inject(types.QueriesContentTreePartProvider) queriesContentTreePartProvider: QueriesContentTreePartProvider,
    @inject(types.QueryResultsTreePartProvider) queryResultsTreePartProvider: QueryResultsTreePartProvider,
    @inject(types.WorkItemLinkedBranchesTreePartProvider)
    workItemLinkedBranchesTreePartProvider: WorkItemLinkedBranchesTreePartProvider,
    @inject(types.AttachmentTreePartProvider) attachmentTreePartProvider: AttachmentTreePartProvider,
    @inject(types.MyTeamsTreePartProvider) myTeamsTreePartProvider: MyTeamsTreePartProvider,
    @inject(types.BacklogContentTreePartProvider) backlogContentTreePartProvider: BacklogContentTreePartProvider,
    @inject(types.CurrentSprintScopeContentTreePartProvider)
    currentSprintScopeContentTreePartProvider: CurrentSprintScopeContentTreePartProvider,
    @inject(types.WorkItemRevisionFieldsTreePartProvider)
    workItemRevisionFieldsTreePartProvider: WorkItemRevisionFieldsTreePartProvider,
    @inject(types.AssignedToMeTreePartProvider) assignedToMeTreePartProvider: AssignedToMeTreePartProvider,
    @inject(types.AllTeamsTreePartProvider) allTeamsTreePartProvider: AllTeamsTreePartProvider,
    @inject(types.PinnedWorkItemQueryLeafTreePartProvider)
    pinnedWorkItemQueryLeafTreePartProvider: PinnedWorkItemQueryLeafTreePartProvider,
    @inject(types.RecentlyModifiedByMeTreePartProvider)
    recentlyModifiedByMeTreePartProvider: RecentlyModifiedByMeTreePartProvider,
    @inject(types.WorkItemLinkedWorkItemGroupsTreePartProvider)
    workItemLinkedWorkItemGroupsTreePartProvider: WorkItemLinkedWorkItemGroupsTreePartProvider,
    @inject(types.WorkItemHistoryTreePartProvider) workItemHistoryTreePartProvider: WorkItemHistoryTreePartProvider,
    @inject(types.MentionedTreePartProvider) mentionedTreePartProvider: MentionedTreePartProvider,
    @inject(types.AreaPathHierarchyRootTreePartProvider)
    areaPathHierarchyRootTreePartProvider: AreaPathHierarchyRootTreePartProvider,
    @inject(types.PinnedWorkItemAreaPathTreePartProvider)
    pinnedWorkItemAreaPathTreePartProvider: PinnedWorkItemAreaPathTreePartProvider,
    @inject(types.AccountTreePartProvider) accountTreePartProvider: AccountTreePartProvider,
    @inject(types.WorkItemCommentsTreePartProvider) workItemCommentsTreePartProvider: WorkItemCommentsTreePartProvider,
    @inject(types.CurrentSprintGroupWorkItemTreePartProvider)
    currentSprintGroupWorkItemTreePartProvider: CurrentSprintGroupWorkItemTreePartProvider,
    @inject(types.QueryFolderChildrenTreePartProvider)
    queryFolderChildrenTreePartProvider: QueryFolderChildrenTreePartProvider,
    @inject(types.WorkItemAttachmentsTreeItem) workItemAttachmentsTreeItem: Constructor<WorkItemAttachmentsTreeItem>,
    @inject(types.WorkItemLinkedPullRequestsTreeItem)
    workItemLinkedPullRequestsTreeItem: Constructor<WorkItemLinkedPullRequestsTreeItem>,
    @inject(types.WorkItemLinkedBranchesTreeItem)
    workItemLinkedBranchesTreeItem: Constructor<WorkItemLinkedBranchesTreeItem>,
    @inject(types.RecentlyModifiedByMeTreeItem) recentlyModifiedByMeTreeItem: Constructor<RecentlyModifiedByMeTreeItem>,
    @inject(types.MentionedTreeItem) mentionedTreeItem: Constructor<MentionedTreeItem>,
    @inject(types.WorkItemLinkedBuildsTreeItem) workItemLinkedBuildsTreeItem: Constructor<WorkItemLinkedBuildsTreeItem>,
    @inject(types.AssignedToMeTreeItem) assignedToMeTreeItem: Constructor<AssignedToMeTreeItem>,
    @inject(types.WorkItemLinkedCommitsTreeItem)
    workItemLinkedCommitsTreeItem: Constructor<WorkItemLinkedCommitsTreeItem>,
    @inject(types.WorkItemBacklogTreeItem) workItemBacklogTreeItem: Constructor<WorkItemBacklogTreeItem>,
    @inject(types.WorkItemCommentsTreeItem) workItemCommentsTreeItem: Constructor<WorkItemCommentsTreeItem>,
  ) {
    this.#settingsService = settingsService;
    this.#areaPathChildrenTreePartProvider = areaPathChildrenTreePartProvider;
    this.#workItemLinkedCommitsTreePartProvider = workItemLinkedCommitsTreePartProvider;
    this.#pinnedWorkItemTreePartProvider = pinnedWorkItemTreePartProvider;
    this.#currentSprintScopeTreePartProvider = currentSprintScopeTreePartProvider;
    this.#pinnedWorkItemTeamTreePartProvider = pinnedWorkItemTeamTreePartProvider;
    this.#hierarchyRootContentTreePartProvider = hierarchyRootContentTreePartProvider;
    this.#hierarchyChildrenTreePartProvider = hierarchyChildrenTreePartProvider;
    this.#areaPathsContentTreePartProvider = areaPathsContentTreePartProvider;
    this.#currentSprintTreePartProvider = currentSprintTreePartProvider;
    this.#projectRootTreePartProvider = projectRootTreePartProvider;
    this.#workItemLinkedPullRequestsTreePartProvider = workItemLinkedPullRequestsTreePartProvider;
    this.#projectTreePartProvider = projectTreePartProvider;
    this.#workItemLinkedWorkItemsTreePartProvider = workItemLinkedWorkItemsTreePartProvider;
    this.#workItemLinkedBuildsTreePartProvider = workItemLinkedBuildsTreePartProvider;
    this.#queriesContentTreePartProvider = queriesContentTreePartProvider;
    this.#queryResultsTreePartProvider = queryResultsTreePartProvider;
    this.#workItemLinkedBranchesTreePartProvider = workItemLinkedBranchesTreePartProvider;
    this.#attachmentTreePartProvider = attachmentTreePartProvider;
    this.#myTeamsTreePartProvider = myTeamsTreePartProvider;
    this.#backlogContentTreePartProvider = backlogContentTreePartProvider;
    this.#currentSprintScopeContentTreePartProvider = currentSprintScopeContentTreePartProvider;
    this.#workItemRevisionFieldsTreePartProvider = workItemRevisionFieldsTreePartProvider;
    this.#assignedToMeTreePartProvider = assignedToMeTreePartProvider;
    this.#allTeamsTreePartProvider = allTeamsTreePartProvider;
    this.#pinnedWorkItemQueryLeafTreePartProvider = pinnedWorkItemQueryLeafTreePartProvider;
    this.#recentlyModifiedByMeTreePartProvider = recentlyModifiedByMeTreePartProvider;
    this.#workItemLinkedWorkItemGroupsTreePartProvider = workItemLinkedWorkItemGroupsTreePartProvider;
    this.#workItemHistoryTreePartProvider = workItemHistoryTreePartProvider;
    this.#mentionedTreePartProvider = mentionedTreePartProvider;
    this.#areaPathHierarchyRootTreePartProvider = areaPathHierarchyRootTreePartProvider;
    this.#pinnedWorkItemAreaPathTreePartProvider = pinnedWorkItemAreaPathTreePartProvider;
    this.#accountTreePartProvider = accountTreePartProvider;
    this.#workItemCommentsTreePartProvider = workItemCommentsTreePartProvider;
    this.#currentSprintGroupWorkItemTreePartProvider = currentSprintGroupWorkItemTreePartProvider;
    this.#queryFolderChildrenTreePartProvider = queryFolderChildrenTreePartProvider;
    this.#workItemAttachmentsTreeItem = workItemAttachmentsTreeItem;
    this.#workItemLinkedPullRequestsTreeItem = workItemLinkedPullRequestsTreeItem;
    this.#workItemLinkedBranchesTreeItem = workItemLinkedBranchesTreeItem;
    this.#recentlyModifiedByMeTreeItem = recentlyModifiedByMeTreeItem;
    this.#mentionedTreeItem = mentionedTreeItem;
    this.#workItemLinkedBuildsTreeItem = workItemLinkedBuildsTreeItem;
    this.#assignedToMeTreeItem = assignedToMeTreeItem;
    this.#workItemLinkedCommitsTreeItem = workItemLinkedCommitsTreeItem;
    this.#workItemBacklogTreeItem = workItemBacklogTreeItem;
    this.#workItemCommentsTreeItem = workItemCommentsTreeItem;
  }

  @postConstruct()
  private initializeWorkItemTreeProvider() {
    this.workItemDetailStaticTreePartProvider = new StaticTreePartProvider({
      linkedCommits: {
        treeItem: this.#workItemLinkedCommitsTreeItem,
        condition: (itemObservable) =>
          itemObservable.pipe(
            map(
              (item) =>
                item.workItem?.relations?.some(
                  (relation: any) => relation.url?.startsWith("vstfs:///Git/Commit/") ?? false,
                ) ?? false,
            ),
          ),
      },
      linkedPullRequests: {
        treeItem: this.#workItemLinkedPullRequestsTreeItem,
        condition: (itemObservable) =>
          itemObservable.pipe(
            map(
              (item) =>
                item.workItem?.relations?.some(
                  (relation: any) => relation.url?.startsWith("vstfs:///Git/PullRequestId/") ?? false,
                ) ?? false,
            ),
          ),
      },
      linkedBranches: {
        treeItem: this.#workItemLinkedBranchesTreeItem,
        condition: (itemObservable) =>
          itemObservable.pipe(
            map(
              (item) =>
                item.workItem?.relations?.some(
                  (relation: any) => relation.url?.startsWith("vstfs:///Git/Ref/") ?? false,
                ) ?? false,
            ),
          ),
      },
      linkedBuilds: {
        treeItem: this.#workItemLinkedBuildsTreeItem,
        condition: (itemObservable) =>
          itemObservable.pipe(
            map(
              (item) =>
                item.workItem?.relations?.some(
                  (relation: any) => relation.url?.startsWith("vstfs:///Build/Build/") ?? false,
                ) ?? false,
            ),
          ),
      },
      comments: {
        treeItem: this.#workItemCommentsTreeItem,
        condition: (itemObservable) =>
          itemObservable.pipe(map((item) => (item.workItem?.fields?.["System.CommentCount"] ?? 0) > 0)),
      },
      attachments: {
        treeItem: this.#workItemAttachmentsTreeItem,
        condition: (itemObservable) =>
          itemObservable.pipe(
            map((item) => item.workItem?.relations?.some((relation: any) => relation.rel === "AttachedFile") ?? false),
          ),
      },
    });
    this.projectSignInSwitchingTreePartProvider = new SwitchingTreePartProvider(selectSignInStatus, {
      signedIn: this.#projectTreePartProvider,
    });
    this.areaPathNodeCombiningTreePartProvider = new CombiningTreePartProvider({
      areaPathChildren: this.#areaPathChildrenTreePartProvider,
      hierarchy: this.#areaPathHierarchyRootTreePartProvider,
    });
    this.backlogStaticTreePartProvider = new StaticTreePartProvider({
      backlog: {
        treeItem: this.#workItemBacklogTreeItem,
      },
    });
    this.workItemContentsCombiningTreePartProvider = new CombiningTreePartProvider({
      children: this.#hierarchyChildrenTreePartProvider,
      details: this.workItemDetailStaticTreePartProvider,
      linkedWorkItemGroups: this.#workItemLinkedWorkItemGroupsTreePartProvider,
    });
    this.myWorkStaticTreePartProvider = new StaticTreePartProvider({
      assignedToMe: {
        treeItem: this.#assignedToMeTreeItem,
      },
      mentioned: {
        treeItem: this.#mentionedTreeItem,
      },
      recentlyModifiedByMe: {
        treeItem: this.#recentlyModifiedByMeTreeItem,
      },
    });
    this.currentSprintUnwrappingTreePartProvider = new UnwrappingTreePartProvider(
      this.#currentSprintTreePartProvider,
      (items) => of(items.size === 1 && !items.has("exception")),
      () => this.#currentSprintScopeTreePartProvider,
    );
    this.teamContentsCombiningTreePartProvider = new CombiningTreePartProvider({
      sprints: this.currentSprintUnwrappingTreePartProvider,
      backlog: this.backlogStaticTreePartProvider,
    });
    this.projectUnwrappingTreePartProvider = new UnwrappingTreePartProvider(
      this.projectSignInSwitchingTreePartProvider,
      shouldUnwrapAccountOrProject(this.#settingsService.unwrapProjects()),
      (i) => this.getTreePartProvider(i),
    );
    this.accountRootUnwrappingTreePartProvider = new UnwrappingTreePartProvider(
      this.#accountTreePartProvider,
      shouldUnwrapAccountOrProject(this.#settingsService.unwrapAccounts()),
      () => this.projectUnwrappingTreePartProvider,
    );
    this.workItemRootCombiningTreePartProvider = new CombiningTreePartProvider({
      pinnedWorkItems: this.#pinnedWorkItemTreePartProvider,
      pinnedAreaPaths: this.#pinnedWorkItemAreaPathTreePartProvider,
      pinnedTeams: this.#pinnedWorkItemTeamTreePartProvider,
      pinnedQueries: this.#pinnedWorkItemQueryLeafTreePartProvider,
      accounts: this.accountRootUnwrappingTreePartProvider,
    });
  }

  public getTreePartProvider(element: AbstractTreeItem<any> | undefined): TreePartProvider<any, any> | undefined {
    if (element === undefined) {
      return this.workItemRootCombiningTreePartProvider;
    }
    if (element instanceof AccountTreeItem) {
      return this.projectUnwrappingTreePartProvider;
    }
    if (element instanceof ProjectTreeItem) {
      return this.#projectRootTreePartProvider;
    }
    if (element instanceof MyWorkTreeItem) {
      return this.myWorkStaticTreePartProvider;
    }
    if (element instanceof MyTeamsTreeItem) {
      return this.#myTeamsTreePartProvider;
    }
    if (element instanceof AllTeamsTreeItem) {
      return this.#allTeamsTreePartProvider;
    }
    if (element instanceof WorkItemTeamTreeItem) {
      return this.teamContentsCombiningTreePartProvider;
    }
    if (element instanceof WorkItemBacklogTreeItem) {
      return this.#backlogContentTreePartProvider;
    }
    if (element instanceof WorkItemHierarchyTreeItem) {
      return this.#hierarchyRootContentTreePartProvider;
    }
    if (element instanceof AreaPathsTreeItem) {
      return this.#areaPathsContentTreePartProvider;
    }
    if (element instanceof QueriesTreeItem) {
      return this.#queriesContentTreePartProvider;
    }
    if (element instanceof WorkItemQueryFolderTreeItem) {
      return this.#queryFolderChildrenTreePartProvider;
    }
    if (element instanceof WorkItemQueryLeafTreeItem) {
      return this.#queryResultsTreePartProvider;
    }
    if (element instanceof WorkItemAreaPathTreeItem) {
      return this.areaPathNodeCombiningTreePartProvider;
    }
    if (element instanceof WorkItemCurrentSprintTreeItem) {
      return this.#currentSprintScopeTreePartProvider;
    }
    if (element instanceof WorkItemCurrentSprintByAssigneeScopeTreeItem) {
      return this.#currentSprintScopeContentTreePartProvider;
    }
    if (element instanceof WorkItemCurrentSprintByStateScopeTreeItem) {
      return this.#currentSprintScopeContentTreePartProvider;
    }
    if (element instanceof WorkItemCurrentSprintUnassignedScopeTreeItem) {
      return this.#currentSprintScopeContentTreePartProvider;
    }
    if (element instanceof WorkItemCurrentSprintGroupTreeItem) {
      return this.#currentSprintGroupWorkItemTreePartProvider;
    }
    if (element instanceof AssignedToMeTreeItem) {
      return this.#assignedToMeTreePartProvider;
    }
    if (element instanceof MentionedTreeItem) {
      return this.#mentionedTreePartProvider;
    }
    if (element instanceof RecentlyModifiedByMeTreeItem) {
      return this.#recentlyModifiedByMeTreePartProvider;
    }
    if (element instanceof WorkItemTreeItem) {
      return this.workItemContentsCombiningTreePartProvider;
    }
    if (element instanceof WorkItemCommentsTreeItem) {
      return this.#workItemCommentsTreePartProvider;
    }
    if (element instanceof WorkItemHistoryTreeItem) {
      return this.#workItemHistoryTreePartProvider;
    }
    if (element instanceof WorkItemRevisionTreeItem) {
      return this.#workItemRevisionFieldsTreePartProvider;
    }
    if (element instanceof WorkItemAttachmentsTreeItem) {
      return this.#attachmentTreePartProvider;
    }
    if (element instanceof WorkItemLinkedCommitsTreeItem) {
      return this.#workItemLinkedCommitsTreePartProvider;
    }
    if (element instanceof WorkItemLinkedPullRequestsTreeItem) {
      return this.#workItemLinkedPullRequestsTreePartProvider;
    }
    if (element instanceof WorkItemLinkedBranchesTreeItem) {
      return this.#workItemLinkedBranchesTreePartProvider;
    }
    if (element instanceof WorkItemLinkedBuildsTreeItem) {
      return this.#workItemLinkedBuildsTreePartProvider;
    }
    if (element instanceof WorkItemRelationGroupTreeItem) {
      return this.#workItemLinkedWorkItemsTreePartProvider;
    }
    return undefined;
  }
}

@injectable()
export class WikiTreeProviderResolver {
  #settingsService: SettingsService;

  #projectTreePartProvider: ProjectTreePartProvider;
  #accountTreePartProvider: AccountTreePartProvider;

  projectUnwrappingTreePartProvider: TreePartProvider<any, any> | undefined;
  projectSignInSwitchingTreePartProvider: TreePartProvider<any, any> | undefined;
  accountRootUnwrappingTreePartProvider: TreePartProvider<any, any> | undefined;

  constructor(
    @inject(types.SettingsService) settingsService: SettingsService,
    @inject(types.ProjectTreePartProvider) projectTreePartProvider: ProjectTreePartProvider,
    @inject(types.AccountTreePartProvider) accountTreePartProvider: AccountTreePartProvider,
  ) {
    this.#settingsService = settingsService;
    this.#projectTreePartProvider = projectTreePartProvider;
    this.#accountTreePartProvider = accountTreePartProvider;
  }

  @postConstruct()
  private initializeWikiTreeProvider() {
    this.projectSignInSwitchingTreePartProvider = new SwitchingTreePartProvider(selectSignInStatus, {
      signedIn: this.#projectTreePartProvider,
    });
    this.projectUnwrappingTreePartProvider = new UnwrappingTreePartProvider(
      this.projectSignInSwitchingTreePartProvider,
      shouldUnwrapAccountOrProject(this.#settingsService.unwrapProjects()),
      (i) => this.getTreePartProvider(i),
    );
    this.accountRootUnwrappingTreePartProvider = new UnwrappingTreePartProvider(
      this.#accountTreePartProvider,
      shouldUnwrapAccountOrProject(this.#settingsService.unwrapAccounts()),
      () => this.projectUnwrappingTreePartProvider,
    );
  }

  public getTreePartProvider(element: AbstractTreeItem<any> | undefined): TreePartProvider<any, any> | undefined {
    if (element === undefined) {
      return this.accountRootUnwrappingTreePartProvider;
    }
    if (element instanceof AccountTreeItem) {
      return this.projectUnwrappingTreePartProvider;
    }
    return undefined;
  }
}

@injectable()
export class TestPlanTreeProviderResolver {
  #settingsService: SettingsService;

  #projectTreePartProvider: ProjectTreePartProvider;
  #accountTreePartProvider: AccountTreePartProvider;

  projectUnwrappingTreePartProvider: TreePartProvider<any, any> | undefined;
  projectSignInSwitchingTreePartProvider: TreePartProvider<any, any> | undefined;
  accountRootUnwrappingTreePartProvider: TreePartProvider<any, any> | undefined;

  constructor(
    @inject(types.SettingsService) settingsService: SettingsService,
    @inject(types.ProjectTreePartProvider) projectTreePartProvider: ProjectTreePartProvider,
    @inject(types.AccountTreePartProvider) accountTreePartProvider: AccountTreePartProvider,
  ) {
    this.#settingsService = settingsService;
    this.#projectTreePartProvider = projectTreePartProvider;
    this.#accountTreePartProvider = accountTreePartProvider;
  }

  @postConstruct()
  private initializeTestPlanTreeProvider() {
    this.projectSignInSwitchingTreePartProvider = new SwitchingTreePartProvider(selectSignInStatus, {
      signedIn: this.#projectTreePartProvider,
    });
    this.projectUnwrappingTreePartProvider = new UnwrappingTreePartProvider(
      this.projectSignInSwitchingTreePartProvider,
      shouldUnwrapAccountOrProject(this.#settingsService.unwrapProjects()),
      (i) => this.getTreePartProvider(i),
    );
    this.accountRootUnwrappingTreePartProvider = new UnwrappingTreePartProvider(
      this.#accountTreePartProvider,
      shouldUnwrapAccountOrProject(this.#settingsService.unwrapAccounts()),
      () => this.projectUnwrappingTreePartProvider,
    );
  }

  public getTreePartProvider(element: AbstractTreeItem<any> | undefined): TreePartProvider<any, any> | undefined {
    if (element === undefined) {
      return this.accountRootUnwrappingTreePartProvider;
    }
    if (element instanceof AccountTreeItem) {
      return this.projectUnwrappingTreePartProvider;
    }
    return undefined;
  }
}

@injectable()
export class AgentsTreeProviderResolver {
  #settingsService: SettingsService;

  #projectTreePartProvider: ProjectTreePartProvider;
  #agentTreePartProvider: AgentTreePartProvider;
  #pinnedAgentTreePartProvider: PinnedAgentTreePartProvider;
  #accountTreePartProvider: AccountTreePartProvider;
  #pinnedAgentPoolTreePartProvider: PinnedAgentPoolTreePartProvider;
  #agentPoolTreePartProvider: AgentPoolTreePartProvider;
  #agentJobTreePartProvider: AgentJobTreePartProvider;

  #jobsContainerTreeItem: Constructor<JobsContainerTreeItem>;
  #agentsContainerTreeItem: Constructor<AgentsContainerTreeItem>;
  #agentJobsContainerTreeItem: Constructor<AgentJobsContainerTreeItem>;

  projectUnwrappingTreePartProvider: TreePartProvider<any, any> | undefined;
  agentChildrenStaticTreePartProvider: TreePartProvider<any, any> | undefined;
  projectSignInSwitchingTreePartProvider: TreePartProvider<any, any> | undefined;
  agentsRootCombiningTreePartProvider: TreePartProvider<any, any> | undefined;
  agentsRootDeduplicatingTreePartProvider: TreePartProvider<any, any> | undefined;
  agentPoolChildrenStaticTreePartProvider: TreePartProvider<any, any> | undefined;
  accountRootUnwrappingTreePartProvider: TreePartProvider<any, any> | undefined;

  constructor(
    @inject(types.SettingsService) settingsService: SettingsService,
    @inject(types.ProjectTreePartProvider) projectTreePartProvider: ProjectTreePartProvider,
    @inject(types.AgentTreePartProvider) agentTreePartProvider: AgentTreePartProvider,
    @inject(types.PinnedAgentTreePartProvider) pinnedAgentTreePartProvider: PinnedAgentTreePartProvider,
    @inject(types.AccountTreePartProvider) accountTreePartProvider: AccountTreePartProvider,
    @inject(types.PinnedAgentPoolTreePartProvider) pinnedAgentPoolTreePartProvider: PinnedAgentPoolTreePartProvider,
    @inject(types.AgentPoolTreePartProvider) agentPoolTreePartProvider: AgentPoolTreePartProvider,
    @inject(types.AgentJobTreePartProvider) agentJobTreePartProvider: AgentJobTreePartProvider,
    @inject(types.JobsContainerTreeItem) jobsContainerTreeItem: Constructor<JobsContainerTreeItem>,
    @inject(types.AgentsContainerTreeItem) agentsContainerTreeItem: Constructor<AgentsContainerTreeItem>,
    @inject(types.AgentJobsContainerTreeItem) agentJobsContainerTreeItem: Constructor<AgentJobsContainerTreeItem>,
  ) {
    this.#settingsService = settingsService;
    this.#projectTreePartProvider = projectTreePartProvider;
    this.#agentTreePartProvider = agentTreePartProvider;
    this.#pinnedAgentTreePartProvider = pinnedAgentTreePartProvider;
    this.#accountTreePartProvider = accountTreePartProvider;
    this.#pinnedAgentPoolTreePartProvider = pinnedAgentPoolTreePartProvider;
    this.#agentPoolTreePartProvider = agentPoolTreePartProvider;
    this.#agentJobTreePartProvider = agentJobTreePartProvider;
    this.#jobsContainerTreeItem = jobsContainerTreeItem;
    this.#agentsContainerTreeItem = agentsContainerTreeItem;
    this.#agentJobsContainerTreeItem = agentJobsContainerTreeItem;
  }

  @postConstruct()
  private initializeAgentsTreeProvider() {
    this.agentChildrenStaticTreePartProvider = new StaticTreePartProvider({
      jobs: {
        treeItem: this.#agentJobsContainerTreeItem,
      },
    });
    this.projectSignInSwitchingTreePartProvider = new SwitchingTreePartProvider(selectSignInStatus, {
      signedIn: this.#projectTreePartProvider,
    });
    this.agentPoolChildrenStaticTreePartProvider = new StaticTreePartProvider({
      jobs: {
        treeItem: this.#jobsContainerTreeItem,
      },
      agents: {
        treeItem: this.#agentsContainerTreeItem,
      },
    });
    this.projectUnwrappingTreePartProvider = new UnwrappingTreePartProvider(
      this.projectSignInSwitchingTreePartProvider,
      shouldUnwrapAccountOrProject(this.#settingsService.unwrapProjects()),
      (i) => this.getTreePartProvider(i),
    );
    this.accountRootUnwrappingTreePartProvider = new UnwrappingTreePartProvider(
      this.#accountTreePartProvider,
      shouldUnwrapAccountOrProject(this.#settingsService.unwrapAccounts()),
      () => this.projectUnwrappingTreePartProvider,
    );
    this.agentsRootCombiningTreePartProvider = new CombiningTreePartProvider({
      pinnedAgentPools: this.#pinnedAgentPoolTreePartProvider,
      pinnedAgents: this.#pinnedAgentTreePartProvider,
      accounts: this.accountRootUnwrappingTreePartProvider,
    });
    this.agentsRootDeduplicatingTreePartProvider = new DeduplicatingTreePartProvider(
      this.agentsRootCombiningTreePartProvider,
      dedupePinnedAgentPools,
    );
  }

  public getTreePartProvider(element: AbstractTreeItem<any> | undefined): TreePartProvider<any, any> | undefined {
    if (element === undefined) {
      return this.agentsRootDeduplicatingTreePartProvider;
    }
    if (element instanceof AccountTreeItem) {
      return this.projectUnwrappingTreePartProvider;
    }
    if (element instanceof ProjectTreeItem) {
      return this.#agentPoolTreePartProvider;
    }
    if (element instanceof AgentPoolTreeItem) {
      return this.agentPoolChildrenStaticTreePartProvider;
    }
    if (element instanceof AgentsContainerTreeItem) {
      return this.#agentTreePartProvider;
    }
    if (element instanceof AgentTreeItem) {
      return this.agentChildrenStaticTreePartProvider;
    }
    if (element instanceof JobsContainerTreeItem) {
      return this.#agentJobTreePartProvider;
    }
    if (element instanceof AgentJobsContainerTreeItem) {
      return this.#agentJobTreePartProvider;
    }
    return undefined;
  }
}
