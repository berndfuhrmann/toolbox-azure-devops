// generated

import { inject, injectable, postConstruct } from "inversify";
import { TreePartProvider } from "../common/treePartProvider/TreePartProvider";
import { AbstractTreeItem } from "../common/treeItems/AbstractTreeItem";
import { types } from "./types";
import { SettingsService } from "../common/SettingsService";

import { BacklogContentTreePartProvider } from "../modules/workItem/treePartProviders/BacklogContentTreePartProvider";
import { PipelineFolderTreePartProvider } from "../modules/pipeline/treePartProviders/PipelineFolderTreePartProvider";
import { MyTeamsTreePartProvider } from "../modules/workItem/treePartProviders/MyTeamsTreePartProvider";
import { GitRepositoryPullRequestStatusTreePartProvider } from "../modules/repository/treePartProviders/GitRepositoryPullRequestStatusTreePartProvider";
import { AssignedToMeTreePartProvider } from "../modules/workItem/treePartProviders/AssignedToMeTreePartProvider";
import { QueriesTreeItem } from "../modules/workItem/treeItems/QueriesTreeItem";
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
import { WorkItemLinkedBranchesTreePartProvider } from "../modules/workItem/treePartProviders/WorkItemLinkedBranchesTreePartProvider";
import { AreaPathHierarchyRootTreePartProvider } from "../modules/workItem/treePartProviders/AreaPathHierarchyRootTreePartProvider";
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
import { GitRepositoryTreePartProvider } from "../modules/repository/treePartProviders/GitRepositoryTreePartProvider";
import { QueryResultsTreePartProvider } from "../modules/workItem/treePartProviders/QueryResultsTreePartProvider";
import { PinnedGitRepositoryTreePartProvider } from "../modules/repository/treePartProviders/PinnedGitRepositoryTreePartProvider";
import { AgentTreeItem } from "../modules/agents/treeItems/AgentTreeItem";
import { WorkItemAttachmentsTreeItem } from "../modules/workItem/treeItems/WorkItemAttachmentsTreeItem";
import { WorkItemTeamTreeItem } from "../modules/workItem/treeItems/WorkItemTeamTreeItem";
import { dedupePinnedPipelines } from "../modules/pipeline/dedupePinnedPipelines";
import { AllTeamsTreePartProvider } from "../modules/workItem/treePartProviders/AllTeamsTreePartProvider";
import { GitRepositoryPullRequestTreePartProvider } from "../modules/repository/treePartProviders/GitRepositoryPullRequestTreePartProvider";
import { WorkItemCurrentSprintGroupTreeItem } from "../modules/workItem/treeItems/WorkItemCurrentSprintGroupTreeItem";
import { PinnedWorkItemAreaPathTreePartProvider } from "../modules/workItem/treePartProviders/PinnedWorkItemAreaPathTreePartProvider";
import { HierarchyRootContentTreePartProvider } from "../modules/workItem/treePartProviders/HierarchyRootContentTreePartProvider";
import { PipelineRunTimelineTreeItem } from "../modules/pipeline/treeItems/PipelineRunTimelineTreeItem";
import { MyWorkTreeItem } from "../modules/workItem/treeItems/MyWorkTreeItem";
import { RecentlyModifiedByMeTreeItem } from "../modules/workItem/treeItems/RecentlyModifiedByMeTreeItem";
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
import { PipelineRunArtifactTreePartProvider } from "../modules/pipeline/treePartProviders/PipelineRunArtifactTreePartProvider";
import { WorkItemLinkedBuildsTreePartProvider } from "../modules/workItem/treePartProviders/WorkItemLinkedBuildsTreePartProvider";
import { GitRepositoryCommitTreePartProvider } from "../modules/repository/treePartProviders/GitRepositoryCommitTreePartProvider";
import { RecentlyModifiedByMeTreePartProvider } from "../modules/workItem/treePartProviders/RecentlyModifiedByMeTreePartProvider";
import { WorkItemRevisionFieldsTreePartProvider } from "../modules/workItem/treePartProviders/WorkItemRevisionFieldsTreePartProvider";
import { PinnedAgentTreePartProvider } from "../modules/agents/treePartProviders/PinnedAgentTreePartProvider";
import { DashboardsContainerTreeItem } from "../modules/dashboard/treeItems/DashboardsContainerTreeItem";
import { WorkItemLinkedPullRequestsTreePartProvider } from "../modules/workItem/treePartProviders/WorkItemLinkedPullRequestsTreePartProvider";
import { AreaPathsTreeItem } from "../modules/workItem/treeItems/AreaPathsTreeItem";
import { PipelineArtifactsTreeItem } from "../modules/pipeline/treeItems/PipelineArtifactsTreeItem";
import { WorkItemCurrentSprintByStateScopeTreeItem } from "../modules/workItem/treeItems/WorkItemCurrentSprintByStateScopeTreeItem";
import { DashboardTreePartProvider } from "../modules/dashboard/treePartProviders/DashboardTreePartProvider";
import { CurrentSprintScopeTreePartProvider } from "../modules/workItem/treePartProviders/CurrentSprintScopeTreePartProvider";
import { AssignedToMeTreeItem } from "../modules/workItem/treeItems/AssignedToMeTreeItem";
import { GitRepositoryBranchTreeItem } from "../modules/repository/treeItems/GitRepositoryBranchTreeItem";
import { WorkItemQueryFolderTreeItem } from "../modules/workItem/treeItems/WorkItemQueryFolderTreeItem";
import { PipelineFolderTreeItem } from "../modules/pipeline/treeItems/PipelineFolderTreeItem";
import { PinnedWorkItemTreePartProvider } from "../modules/workItem/treePartProviders/PinnedWorkItemTreePartProvider";
import { PipelineRunTreePartProvider } from "../modules/pipeline/treePartProviders/PipelineRunTreePartProvider";
import { WorkItemCurrentSprintUnassignedScopeTreeItem } from "../modules/workItem/treeItems/WorkItemCurrentSprintUnassignedScopeTreeItem";
import { PinnedWorkItemTeamTreePartProvider } from "../modules/workItem/treePartProviders/PinnedWorkItemTeamTreePartProvider";


@injectable()
export class RepositoryTreeProviderResolver {
  #settingsService: SettingsService;

  #workItemLinkedBranchesTreePartProvider: WorkItemLinkedBranchesTreePartProvider;
  #workItemRevisionFieldsTreePartProvider: WorkItemRevisionFieldsTreePartProvider;
  #gitRepositoryTreePartProvider: GitRepositoryTreePartProvider;
  #workItemLinkedPullRequestsTreePartProvider: WorkItemLinkedPullRequestsTreePartProvider;
  #gitRepositoryTagTreePartProvider: GitRepositoryTagTreePartProvider;
  #pinnedGitRepositoryTreePartProvider: PinnedGitRepositoryTreePartProvider;
  #projectTreePartProvider: ProjectTreePartProvider;
  #workItemLinkedCommitsTreePartProvider: WorkItemLinkedCommitsTreePartProvider;
  #gitRepositoryPullRequestWorkItemTreePartProvider: GitRepositoryPullRequestWorkItemTreePartProvider;
  #gitRepositoryPullRequestCommentThreadTreePartProvider: GitRepositoryPullRequestCommentThreadTreePartProvider;
  #gitRepositoryCommitTreePartProvider: GitRepositoryCommitTreePartProvider;
  #accountTreePartProvider: AccountTreePartProvider;
  #pinnedGitRepositoryPullRequestTreePartProvider: PinnedGitRepositoryPullRequestTreePartProvider;
  #hierarchyChildrenTreePartProvider: HierarchyChildrenTreePartProvider;
  #gitRepositoryPullRequestStatusTreePartProvider: GitRepositoryPullRequestStatusTreePartProvider;
  #gitRepositoryBranchTreePartProvider: GitRepositoryBranchTreePartProvider;
  #workItemCommentsTreePartProvider: WorkItemCommentsTreePartProvider;
  #gitRepositoryPullRequestReviewerTreePartProvider: GitRepositoryPullRequestReviewerTreePartProvider;
  #gitRepositoryPullRequestTreePartProvider: GitRepositoryPullRequestTreePartProvider;
  #workItemLinkedWorkItemGroupsTreePartProvider: WorkItemLinkedWorkItemGroupsTreePartProvider;
  #workItemHistoryTreePartProvider: WorkItemHistoryTreePartProvider;
  #gitRepositoryItemTreePartProvider: GitRepositoryItemTreePartProvider;
  #attachmentTreePartProvider: AttachmentTreePartProvider;
  #workItemLinkedWorkItemsTreePartProvider: WorkItemLinkedWorkItemsTreePartProvider;
  #workItemLinkedBuildsTreePartProvider: WorkItemLinkedBuildsTreePartProvider;

  #gitRepositoryPullRequestsTreeItem: Constructor<GitRepositoryPullRequestsTreeItem>;
  #gitRepositoryPullRequestReviewersTreeItem: Constructor<GitRepositoryPullRequestReviewersTreeItem>;
  #workItemAttachmentsTreeItem: Constructor<WorkItemAttachmentsTreeItem>;
  #workItemLinkedBranchesTreeItem: Constructor<WorkItemLinkedBranchesTreeItem>;
  #gitRepositoryItemsTreeItem: Constructor<GitRepositoryItemsTreeItem>;
  #workItemLinkedCommitsTreeItem: Constructor<WorkItemLinkedCommitsTreeItem>;
  #gitRepositoryTagsTreeItem: Constructor<GitRepositoryTagsTreeItem>;
  #workItemLinkedBuildsTreeItem: Constructor<WorkItemLinkedBuildsTreeItem>;
  #gitRepositoryCommitsTreeItem: Constructor<GitRepositoryCommitsTreeItem>;
  #gitRepositoryBranchesTreeItem: Constructor<GitRepositoryBranchesTreeItem>;
  #workItemCommentsTreeItem: Constructor<WorkItemCommentsTreeItem>;
  #workItemLinkedPullRequestsTreeItem: Constructor<WorkItemLinkedPullRequestsTreeItem>;

  projectUnwrappingTreePartProvider: TreePartProvider<any, any> | undefined;
  gitRepositoryDetailStaticTreePartProvider: TreePartProvider<any, any> | undefined;
  workItemContentsCombiningTreePartProvider: TreePartProvider<any, any> | undefined;
  gitRepositoryPullRequestReviewersStaticTreePartProvider: TreePartProvider<any, any> | undefined;
  accountRootUnwrappingTreePartProvider: TreePartProvider<any, any> | undefined;
  gitRepositoryPullRequestContentCombiningTreePartProvider: TreePartProvider<any, any> | undefined;
  repositoryRootCombiningTreePartProvider: TreePartProvider<any, any> | undefined;
  gitRepositoryCommitDetailStaticTreePartProvider: TreePartProvider<any, any> | undefined;
  gitRepositoryBranchDetailStaticTreePartProvider: TreePartProvider<any, any> | undefined;
  repositoryRootDeduplicatingTreePartProvider: TreePartProvider<any, any> | undefined;
  workItemDetailStaticTreePartProvider: TreePartProvider<any, any> | undefined;

  constructor(
    @inject(types.SettingsService) settingsService: SettingsService,
    @inject(types.WorkItemLinkedBranchesTreePartProvider) workItemLinkedBranchesTreePartProvider: WorkItemLinkedBranchesTreePartProvider,
    @inject(types.WorkItemRevisionFieldsTreePartProvider) workItemRevisionFieldsTreePartProvider: WorkItemRevisionFieldsTreePartProvider,
    @inject(types.GitRepositoryTreePartProvider) gitRepositoryTreePartProvider: GitRepositoryTreePartProvider,
    @inject(types.WorkItemLinkedPullRequestsTreePartProvider) workItemLinkedPullRequestsTreePartProvider: WorkItemLinkedPullRequestsTreePartProvider,
    @inject(types.GitRepositoryTagTreePartProvider) gitRepositoryTagTreePartProvider: GitRepositoryTagTreePartProvider,
    @inject(types.PinnedGitRepositoryTreePartProvider) pinnedGitRepositoryTreePartProvider: PinnedGitRepositoryTreePartProvider,
    @inject(types.ProjectTreePartProvider) projectTreePartProvider: ProjectTreePartProvider,
    @inject(types.WorkItemLinkedCommitsTreePartProvider) workItemLinkedCommitsTreePartProvider: WorkItemLinkedCommitsTreePartProvider,
    @inject(types.GitRepositoryPullRequestWorkItemTreePartProvider) gitRepositoryPullRequestWorkItemTreePartProvider: GitRepositoryPullRequestWorkItemTreePartProvider,
    @inject(types.GitRepositoryPullRequestCommentThreadTreePartProvider) gitRepositoryPullRequestCommentThreadTreePartProvider: GitRepositoryPullRequestCommentThreadTreePartProvider,
    @inject(types.GitRepositoryCommitTreePartProvider) gitRepositoryCommitTreePartProvider: GitRepositoryCommitTreePartProvider,
    @inject(types.AccountTreePartProvider) accountTreePartProvider: AccountTreePartProvider,
    @inject(types.PinnedGitRepositoryPullRequestTreePartProvider) pinnedGitRepositoryPullRequestTreePartProvider: PinnedGitRepositoryPullRequestTreePartProvider,
    @inject(types.HierarchyChildrenTreePartProvider) hierarchyChildrenTreePartProvider: HierarchyChildrenTreePartProvider,
    @inject(types.GitRepositoryPullRequestStatusTreePartProvider) gitRepositoryPullRequestStatusTreePartProvider: GitRepositoryPullRequestStatusTreePartProvider,
    @inject(types.GitRepositoryBranchTreePartProvider) gitRepositoryBranchTreePartProvider: GitRepositoryBranchTreePartProvider,
    @inject(types.WorkItemCommentsTreePartProvider) workItemCommentsTreePartProvider: WorkItemCommentsTreePartProvider,
    @inject(types.GitRepositoryPullRequestReviewerTreePartProvider) gitRepositoryPullRequestReviewerTreePartProvider: GitRepositoryPullRequestReviewerTreePartProvider,
    @inject(types.GitRepositoryPullRequestTreePartProvider) gitRepositoryPullRequestTreePartProvider: GitRepositoryPullRequestTreePartProvider,
    @inject(types.WorkItemLinkedWorkItemGroupsTreePartProvider) workItemLinkedWorkItemGroupsTreePartProvider: WorkItemLinkedWorkItemGroupsTreePartProvider,
    @inject(types.WorkItemHistoryTreePartProvider) workItemHistoryTreePartProvider: WorkItemHistoryTreePartProvider,
    @inject(types.GitRepositoryItemTreePartProvider) gitRepositoryItemTreePartProvider: GitRepositoryItemTreePartProvider,
    @inject(types.AttachmentTreePartProvider) attachmentTreePartProvider: AttachmentTreePartProvider,
    @inject(types.WorkItemLinkedWorkItemsTreePartProvider) workItemLinkedWorkItemsTreePartProvider: WorkItemLinkedWorkItemsTreePartProvider,
    @inject(types.WorkItemLinkedBuildsTreePartProvider) workItemLinkedBuildsTreePartProvider: WorkItemLinkedBuildsTreePartProvider,
    @inject(types.GitRepositoryPullRequestsTreeItem) gitRepositoryPullRequestsTreeItem: Constructor<GitRepositoryPullRequestsTreeItem>,
    @inject(types.GitRepositoryPullRequestReviewersTreeItem) gitRepositoryPullRequestReviewersTreeItem: Constructor<GitRepositoryPullRequestReviewersTreeItem>,
    @inject(types.WorkItemAttachmentsTreeItem) workItemAttachmentsTreeItem: Constructor<WorkItemAttachmentsTreeItem>,
    @inject(types.WorkItemLinkedBranchesTreeItem) workItemLinkedBranchesTreeItem: Constructor<WorkItemLinkedBranchesTreeItem>,
    @inject(types.GitRepositoryItemsTreeItem) gitRepositoryItemsTreeItem: Constructor<GitRepositoryItemsTreeItem>,
    @inject(types.WorkItemLinkedCommitsTreeItem) workItemLinkedCommitsTreeItem: Constructor<WorkItemLinkedCommitsTreeItem>,
    @inject(types.GitRepositoryTagsTreeItem) gitRepositoryTagsTreeItem: Constructor<GitRepositoryTagsTreeItem>,
    @inject(types.WorkItemLinkedBuildsTreeItem) workItemLinkedBuildsTreeItem: Constructor<WorkItemLinkedBuildsTreeItem>,
    @inject(types.GitRepositoryCommitsTreeItem) gitRepositoryCommitsTreeItem: Constructor<GitRepositoryCommitsTreeItem>,
    @inject(types.GitRepositoryBranchesTreeItem) gitRepositoryBranchesTreeItem: Constructor<GitRepositoryBranchesTreeItem>,
    @inject(types.WorkItemCommentsTreeItem) workItemCommentsTreeItem: Constructor<WorkItemCommentsTreeItem>,
    @inject(types.WorkItemLinkedPullRequestsTreeItem) workItemLinkedPullRequestsTreeItem: Constructor<WorkItemLinkedPullRequestsTreeItem>,
  ) {
    this.#settingsService = settingsService;
    this.#workItemLinkedBranchesTreePartProvider = workItemLinkedBranchesTreePartProvider;
    this.#workItemRevisionFieldsTreePartProvider = workItemRevisionFieldsTreePartProvider;
    this.#gitRepositoryTreePartProvider = gitRepositoryTreePartProvider;
    this.#workItemLinkedPullRequestsTreePartProvider = workItemLinkedPullRequestsTreePartProvider;
    this.#gitRepositoryTagTreePartProvider = gitRepositoryTagTreePartProvider;
    this.#pinnedGitRepositoryTreePartProvider = pinnedGitRepositoryTreePartProvider;
    this.#projectTreePartProvider = projectTreePartProvider;
    this.#workItemLinkedCommitsTreePartProvider = workItemLinkedCommitsTreePartProvider;
    this.#gitRepositoryPullRequestWorkItemTreePartProvider = gitRepositoryPullRequestWorkItemTreePartProvider;
    this.#gitRepositoryPullRequestCommentThreadTreePartProvider = gitRepositoryPullRequestCommentThreadTreePartProvider;
    this.#gitRepositoryCommitTreePartProvider = gitRepositoryCommitTreePartProvider;
    this.#accountTreePartProvider = accountTreePartProvider;
    this.#pinnedGitRepositoryPullRequestTreePartProvider = pinnedGitRepositoryPullRequestTreePartProvider;
    this.#hierarchyChildrenTreePartProvider = hierarchyChildrenTreePartProvider;
    this.#gitRepositoryPullRequestStatusTreePartProvider = gitRepositoryPullRequestStatusTreePartProvider;
    this.#gitRepositoryBranchTreePartProvider = gitRepositoryBranchTreePartProvider;
    this.#workItemCommentsTreePartProvider = workItemCommentsTreePartProvider;
    this.#gitRepositoryPullRequestReviewerTreePartProvider = gitRepositoryPullRequestReviewerTreePartProvider;
    this.#gitRepositoryPullRequestTreePartProvider = gitRepositoryPullRequestTreePartProvider;
    this.#workItemLinkedWorkItemGroupsTreePartProvider = workItemLinkedWorkItemGroupsTreePartProvider;
    this.#workItemHistoryTreePartProvider = workItemHistoryTreePartProvider;
    this.#gitRepositoryItemTreePartProvider = gitRepositoryItemTreePartProvider;
    this.#attachmentTreePartProvider = attachmentTreePartProvider;
    this.#workItemLinkedWorkItemsTreePartProvider = workItemLinkedWorkItemsTreePartProvider;
    this.#workItemLinkedBuildsTreePartProvider = workItemLinkedBuildsTreePartProvider;
    this.#gitRepositoryPullRequestsTreeItem = gitRepositoryPullRequestsTreeItem;
    this.#gitRepositoryPullRequestReviewersTreeItem = gitRepositoryPullRequestReviewersTreeItem;
    this.#workItemAttachmentsTreeItem = workItemAttachmentsTreeItem;
    this.#workItemLinkedBranchesTreeItem = workItemLinkedBranchesTreeItem;
    this.#gitRepositoryItemsTreeItem = gitRepositoryItemsTreeItem;
    this.#workItemLinkedCommitsTreeItem = workItemLinkedCommitsTreeItem;
    this.#gitRepositoryTagsTreeItem = gitRepositoryTagsTreeItem;
    this.#workItemLinkedBuildsTreeItem = workItemLinkedBuildsTreeItem;
    this.#gitRepositoryCommitsTreeItem = gitRepositoryCommitsTreeItem;
    this.#gitRepositoryBranchesTreeItem = gitRepositoryBranchesTreeItem;
    this.#workItemCommentsTreeItem = workItemCommentsTreeItem;
    this.#workItemLinkedPullRequestsTreeItem = workItemLinkedPullRequestsTreeItem;
  }


  @postConstruct()
  private initializeRepositoryTreeProvider() {
    this.projectUnwrappingTreePartProvider = new UnwrappingTreePartProvider(
      this.#projectTreePartProvider,
      shouldUnwrapAccountOrProject(this.#settingsService.unwrapProjects()),
      (i) => this.getTreePartProvider(i),
    );
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
    this.gitRepositoryPullRequestReviewersStaticTreePartProvider = new StaticTreePartProvider({
      reviewers: {
        treeItem: this.#gitRepositoryPullRequestReviewersTreeItem,
      },
    });
    this.accountRootUnwrappingTreePartProvider = new UnwrappingTreePartProvider(
      this.#accountTreePartProvider,
      shouldUnwrapAccountOrProject(this.#settingsService.unwrapAccounts()),
      () => this.projectUnwrappingTreePartProvider,
    );
    this.gitRepositoryPullRequestContentCombiningTreePartProvider = new CombiningTreePartProvider({
      reviewers: this.gitRepositoryPullRequestReviewersStaticTreePartProvider,
      status: this.#gitRepositoryPullRequestStatusTreePartProvider,
      commentThread: this.#gitRepositoryPullRequestCommentThreadTreePartProvider,
      workItems: this.#gitRepositoryPullRequestWorkItemTreePartProvider,
    });
    this.repositoryRootCombiningTreePartProvider = new CombiningTreePartProvider({
      pinnedPullRequests: this.#pinnedGitRepositoryPullRequestTreePartProvider,
      pinnedRepositories: this.#pinnedGitRepositoryTreePartProvider,
      accounts: this.accountRootUnwrappingTreePartProvider,
    });
    this.gitRepositoryCommitDetailStaticTreePartProvider = new StaticTreePartProvider({
      items: {
        treeItem: this.#gitRepositoryItemsTreeItem,
      },
    });
    this.gitRepositoryBranchDetailStaticTreePartProvider = new StaticTreePartProvider({
      items: {
        treeItem: this.#gitRepositoryItemsTreeItem,
      },
      commits: {
        treeItem: this.#gitRepositoryCommitsTreeItem,
      },
    });
    this.repositoryRootDeduplicatingTreePartProvider = new DeduplicatingTreePartProvider(
      this.repositoryRootCombiningTreePartProvider,
      dedupePinnedRepositories,
    );
    this.workItemDetailStaticTreePartProvider = new StaticTreePartProvider({
      linkedCommits: {
        treeItem: this.#workItemLinkedCommitsTreeItem,
        condition: (itemObservable) => itemObservable.pipe(map((item) => (item.workItem?.relations?.some((relation: any) => relation.url?.startsWith('vstfs:///Git/Commit/') ?? false) ?? false))),
      },
      linkedPullRequests: {
        treeItem: this.#workItemLinkedPullRequestsTreeItem,
        condition: (itemObservable) => itemObservable.pipe(map((item) => (item.workItem?.relations?.some((relation: any) => relation.url?.startsWith('vstfs:///Git/PullRequestId/') ?? false) ?? false))),
      },
      linkedBranches: {
        treeItem: this.#workItemLinkedBranchesTreeItem,
        condition: (itemObservable) => itemObservable.pipe(map((item) => (item.workItem?.relations?.some((relation: any) => relation.url?.startsWith('vstfs:///Git/Ref/') ?? false) ?? false))),
      },
      linkedBuilds: {
        treeItem: this.#workItemLinkedBuildsTreeItem,
        condition: (itemObservable) => itemObservable.pipe(map((item) => (item.workItem?.relations?.some((relation: any) => relation.url?.startsWith('vstfs:///Build/Build/') ?? false) ?? false))),
      },
      comments: {
        treeItem: this.#workItemCommentsTreeItem,
        condition: (itemObservable) => itemObservable.pipe(map((item) => (item.workItem?.fields?.['System.CommentCount'] ?? 0) > 0)),
      },
      attachments: {
        treeItem: this.#workItemAttachmentsTreeItem,
        condition: (itemObservable) => itemObservable.pipe(map((item) => (item.workItem?.relations?.some((relation: any) => relation.rel === 'AttachedFile') ?? false))),
      },
    });
    this.workItemContentsCombiningTreePartProvider = new CombiningTreePartProvider({
      children: this.#hierarchyChildrenTreePartProvider,
      details: this.workItemDetailStaticTreePartProvider,
      linkedWorkItemGroups: this.#workItemLinkedWorkItemGroupsTreePartProvider,
    });
  }

  public getTreePartProvider(
    element: AbstractTreeItem<any> | undefined,
  ): TreePartProvider<any, any> | undefined {
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

  #pipelineRunTimelineTreePartProvider: PipelineRunTimelineTreePartProvider;
  #pinnedPipelineFolderTreePartProvider: PinnedPipelineFolderTreePartProvider;
  #pipelineFolderTreePartProvider: PipelineFolderTreePartProvider;
  #pipelineRunTreePartProvider: PipelineRunTreePartProvider;
  #pipelineTreePartProvider: PipelineTreePartProvider;
  #accountTreePartProvider: AccountTreePartProvider;
  #pipelineRunArtifactTreePartProvider: PipelineRunArtifactTreePartProvider;
  #pinnedPipelineTreePartProvider: PinnedPipelineTreePartProvider;
  #projectTreePartProvider: ProjectTreePartProvider;

  #pipelineArtifactsTreeItem: Constructor<PipelineArtifactsTreeItem>;

  projectUnwrappingTreePartProvider: TreePartProvider<any, any> | undefined;
  pipelineRootCombiningTreePartProvider: TreePartProvider<any, any> | undefined;
  pipelineRunArtifactsStaticTreePartProvider: TreePartProvider<any, any> | undefined;
  accountRootUnwrappingTreePartProvider: TreePartProvider<any, any> | undefined;
  pipelineRootDeduplicatingTreePartProvider: TreePartProvider<any, any> | undefined;
  pipelineFolderAndPipelineCombiningTreePartProvider: TreePartProvider<any, any> | undefined;
  pipelineRunDetailCombiningTreePartProvider: TreePartProvider<any, any> | undefined;

  constructor(
    @inject(types.SettingsService) settingsService: SettingsService,
    @inject(types.PipelineRunTimelineTreePartProvider) pipelineRunTimelineTreePartProvider: PipelineRunTimelineTreePartProvider,
    @inject(types.PinnedPipelineFolderTreePartProvider) pinnedPipelineFolderTreePartProvider: PinnedPipelineFolderTreePartProvider,
    @inject(types.PipelineFolderTreePartProvider) pipelineFolderTreePartProvider: PipelineFolderTreePartProvider,
    @inject(types.PipelineRunTreePartProvider) pipelineRunTreePartProvider: PipelineRunTreePartProvider,
    @inject(types.PipelineTreePartProvider) pipelineTreePartProvider: PipelineTreePartProvider,
    @inject(types.AccountTreePartProvider) accountTreePartProvider: AccountTreePartProvider,
    @inject(types.PipelineRunArtifactTreePartProvider) pipelineRunArtifactTreePartProvider: PipelineRunArtifactTreePartProvider,
    @inject(types.PinnedPipelineTreePartProvider) pinnedPipelineTreePartProvider: PinnedPipelineTreePartProvider,
    @inject(types.ProjectTreePartProvider) projectTreePartProvider: ProjectTreePartProvider,
    @inject(types.PipelineArtifactsTreeItem) pipelineArtifactsTreeItem: Constructor<PipelineArtifactsTreeItem>,
  ) {
    this.#settingsService = settingsService;
    this.#pipelineRunTimelineTreePartProvider = pipelineRunTimelineTreePartProvider;
    this.#pinnedPipelineFolderTreePartProvider = pinnedPipelineFolderTreePartProvider;
    this.#pipelineFolderTreePartProvider = pipelineFolderTreePartProvider;
    this.#pipelineRunTreePartProvider = pipelineRunTreePartProvider;
    this.#pipelineTreePartProvider = pipelineTreePartProvider;
    this.#accountTreePartProvider = accountTreePartProvider;
    this.#pipelineRunArtifactTreePartProvider = pipelineRunArtifactTreePartProvider;
    this.#pinnedPipelineTreePartProvider = pinnedPipelineTreePartProvider;
    this.#projectTreePartProvider = projectTreePartProvider;
    this.#pipelineArtifactsTreeItem = pipelineArtifactsTreeItem;
  }


  @postConstruct()
  private initializePipelineTreeProvider() {
    this.projectUnwrappingTreePartProvider = new UnwrappingTreePartProvider(
      this.#projectTreePartProvider,
      shouldUnwrapAccountOrProject(this.#settingsService.unwrapProjects()),
      (i) => this.getTreePartProvider(i),
    );
    this.pipelineRunArtifactsStaticTreePartProvider = new StaticTreePartProvider({
      artifacts: {
        treeItem: this.#pipelineArtifactsTreeItem,
      },
    });
    this.accountRootUnwrappingTreePartProvider = new UnwrappingTreePartProvider(
      this.#accountTreePartProvider,
      shouldUnwrapAccountOrProject(this.#settingsService.unwrapAccounts()),
      () => this.projectUnwrappingTreePartProvider,
    );
    this.pipelineFolderAndPipelineCombiningTreePartProvider = new CombiningTreePartProvider({
      pipelineFolder: this.#pipelineFolderTreePartProvider,
      pipeline: this.#pipelineTreePartProvider,
    });
    this.pipelineRunDetailCombiningTreePartProvider = new CombiningTreePartProvider({
      artifacts: this.pipelineRunArtifactsStaticTreePartProvider,
      timeline: this.#pipelineRunTimelineTreePartProvider,
    });
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

  public getTreePartProvider(
    element: AbstractTreeItem<any> | undefined,
  ): TreePartProvider<any, any> | undefined {
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

  #dashboardWidgetTreePartProvider: DashboardWidgetTreePartProvider;
  #dashboardTreePartProvider: DashboardTreePartProvider;
  #accountTreePartProvider: AccountTreePartProvider;
  #projectTreePartProvider: ProjectTreePartProvider;

  #dashboardsContainerTreeItem: Constructor<DashboardsContainerTreeItem>;

  projectUnwrappingTreePartProvider: TreePartProvider<any, any> | undefined;
  projectDashboardsStaticTreePartProvider: TreePartProvider<any, any> | undefined;
  accountRootUnwrappingTreePartProvider: TreePartProvider<any, any> | undefined;

  constructor(
    @inject(types.SettingsService) settingsService: SettingsService,
    @inject(types.DashboardWidgetTreePartProvider) dashboardWidgetTreePartProvider: DashboardWidgetTreePartProvider,
    @inject(types.DashboardTreePartProvider) dashboardTreePartProvider: DashboardTreePartProvider,
    @inject(types.AccountTreePartProvider) accountTreePartProvider: AccountTreePartProvider,
    @inject(types.ProjectTreePartProvider) projectTreePartProvider: ProjectTreePartProvider,
    @inject(types.DashboardsContainerTreeItem) dashboardsContainerTreeItem: Constructor<DashboardsContainerTreeItem>,
  ) {
    this.#settingsService = settingsService;
    this.#dashboardWidgetTreePartProvider = dashboardWidgetTreePartProvider;
    this.#dashboardTreePartProvider = dashboardTreePartProvider;
    this.#accountTreePartProvider = accountTreePartProvider;
    this.#projectTreePartProvider = projectTreePartProvider;
    this.#dashboardsContainerTreeItem = dashboardsContainerTreeItem;
  }


  @postConstruct()
  private initializeDashboardTreeProvider() {
    this.projectUnwrappingTreePartProvider = new UnwrappingTreePartProvider(
      this.#projectTreePartProvider,
      shouldUnwrapAccountOrProject(this.#settingsService.unwrapProjects()),
      (i) => this.getTreePartProvider(i),
    );
    this.projectDashboardsStaticTreePartProvider = new StaticTreePartProvider({
      dashboards: {
        treeItem: this.#dashboardsContainerTreeItem,
      },
    });
    this.accountRootUnwrappingTreePartProvider = new UnwrappingTreePartProvider(
      this.#accountTreePartProvider,
      shouldUnwrapAccountOrProject(this.#settingsService.unwrapAccounts()),
      () => this.projectUnwrappingTreePartProvider,
    );
  }

  public getTreePartProvider(
    element: AbstractTreeItem<any> | undefined,
  ): TreePartProvider<any, any> | undefined {
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

  #workItemLinkedBranchesTreePartProvider: WorkItemLinkedBranchesTreePartProvider;
  #pinnedWorkItemTeamTreePartProvider: PinnedWorkItemTeamTreePartProvider;
  #workItemRevisionFieldsTreePartProvider: WorkItemRevisionFieldsTreePartProvider;
  #workItemLinkedPullRequestsTreePartProvider: WorkItemLinkedPullRequestsTreePartProvider;
  #queriesContentTreePartProvider: QueriesContentTreePartProvider;
  #myTeamsTreePartProvider: MyTeamsTreePartProvider;
  #currentSprintGroupWorkItemTreePartProvider: CurrentSprintGroupWorkItemTreePartProvider;
  #pinnedWorkItemQueryLeafTreePartProvider: PinnedWorkItemQueryLeafTreePartProvider;
  #currentSprintTreePartProvider: CurrentSprintTreePartProvider;
  #queryResultsTreePartProvider: QueryResultsTreePartProvider;
  #projectTreePartProvider: ProjectTreePartProvider;
  #allTeamsTreePartProvider: AllTeamsTreePartProvider;
  #workItemLinkedCommitsTreePartProvider: WorkItemLinkedCommitsTreePartProvider;
  #queryFolderChildrenTreePartProvider: QueryFolderChildrenTreePartProvider;
  #accountTreePartProvider: AccountTreePartProvider;
  #projectRootTreePartProvider: ProjectRootTreePartProvider;
  #assignedToMeTreePartProvider: AssignedToMeTreePartProvider;
  #hierarchyChildrenTreePartProvider: HierarchyChildrenTreePartProvider;
  #currentSprintScopeTreePartProvider: CurrentSprintScopeTreePartProvider;
  #workItemCommentsTreePartProvider: WorkItemCommentsTreePartProvider;
  #areaPathChildrenTreePartProvider: AreaPathChildrenTreePartProvider;
  #mentionedTreePartProvider: MentionedTreePartProvider;
  #pinnedWorkItemTreePartProvider: PinnedWorkItemTreePartProvider;
  #currentSprintScopeContentTreePartProvider: CurrentSprintScopeContentTreePartProvider;
  #workItemLinkedWorkItemGroupsTreePartProvider: WorkItemLinkedWorkItemGroupsTreePartProvider;
  #workItemHistoryTreePartProvider: WorkItemHistoryTreePartProvider;
  #areaPathHierarchyRootTreePartProvider: AreaPathHierarchyRootTreePartProvider;
  #pinnedWorkItemAreaPathTreePartProvider: PinnedWorkItemAreaPathTreePartProvider;
  #backlogContentTreePartProvider: BacklogContentTreePartProvider;
  #areaPathsContentTreePartProvider: AreaPathsContentTreePartProvider;
  #attachmentTreePartProvider: AttachmentTreePartProvider;
  #workItemLinkedWorkItemsTreePartProvider: WorkItemLinkedWorkItemsTreePartProvider;
  #recentlyModifiedByMeTreePartProvider: RecentlyModifiedByMeTreePartProvider;
  #workItemLinkedBuildsTreePartProvider: WorkItemLinkedBuildsTreePartProvider;
  #hierarchyRootContentTreePartProvider: HierarchyRootContentTreePartProvider;

  #assignedToMeTreeItem: Constructor<AssignedToMeTreeItem>;
  #mentionedTreeItem: Constructor<MentionedTreeItem>;
  #workItemAttachmentsTreeItem: Constructor<WorkItemAttachmentsTreeItem>;
  #workItemLinkedBranchesTreeItem: Constructor<WorkItemLinkedBranchesTreeItem>;
  #workItemLinkedCommitsTreeItem: Constructor<WorkItemLinkedCommitsTreeItem>;
  #workItemLinkedBuildsTreeItem: Constructor<WorkItemLinkedBuildsTreeItem>;
  #recentlyModifiedByMeTreeItem: Constructor<RecentlyModifiedByMeTreeItem>;
  #workItemBacklogTreeItem: Constructor<WorkItemBacklogTreeItem>;
  #workItemCommentsTreeItem: Constructor<WorkItemCommentsTreeItem>;
  #workItemLinkedPullRequestsTreeItem: Constructor<WorkItemLinkedPullRequestsTreeItem>;

  projectUnwrappingTreePartProvider: TreePartProvider<any, any> | undefined;
  workItemContentsCombiningTreePartProvider: TreePartProvider<any, any> | undefined;
  accountRootUnwrappingTreePartProvider: TreePartProvider<any, any> | undefined;
  currentSprintUnwrappingTreePartProvider: TreePartProvider<any, any> | undefined;
  myWorkStaticTreePartProvider: TreePartProvider<any, any> | undefined;
  backlogStaticTreePartProvider: TreePartProvider<any, any> | undefined;
  teamContentsCombiningTreePartProvider: TreePartProvider<any, any> | undefined;
  areaPathNodeCombiningTreePartProvider: TreePartProvider<any, any> | undefined;
  workItemRootCombiningTreePartProvider: TreePartProvider<any, any> | undefined;
  workItemDetailStaticTreePartProvider: TreePartProvider<any, any> | undefined;

  constructor(
    @inject(types.SettingsService) settingsService: SettingsService,
    @inject(types.WorkItemLinkedBranchesTreePartProvider) workItemLinkedBranchesTreePartProvider: WorkItemLinkedBranchesTreePartProvider,
    @inject(types.PinnedWorkItemTeamTreePartProvider) pinnedWorkItemTeamTreePartProvider: PinnedWorkItemTeamTreePartProvider,
    @inject(types.WorkItemRevisionFieldsTreePartProvider) workItemRevisionFieldsTreePartProvider: WorkItemRevisionFieldsTreePartProvider,
    @inject(types.WorkItemLinkedPullRequestsTreePartProvider) workItemLinkedPullRequestsTreePartProvider: WorkItemLinkedPullRequestsTreePartProvider,
    @inject(types.QueriesContentTreePartProvider) queriesContentTreePartProvider: QueriesContentTreePartProvider,
    @inject(types.MyTeamsTreePartProvider) myTeamsTreePartProvider: MyTeamsTreePartProvider,
    @inject(types.CurrentSprintGroupWorkItemTreePartProvider) currentSprintGroupWorkItemTreePartProvider: CurrentSprintGroupWorkItemTreePartProvider,
    @inject(types.PinnedWorkItemQueryLeafTreePartProvider) pinnedWorkItemQueryLeafTreePartProvider: PinnedWorkItemQueryLeafTreePartProvider,
    @inject(types.CurrentSprintTreePartProvider) currentSprintTreePartProvider: CurrentSprintTreePartProvider,
    @inject(types.QueryResultsTreePartProvider) queryResultsTreePartProvider: QueryResultsTreePartProvider,
    @inject(types.ProjectTreePartProvider) projectTreePartProvider: ProjectTreePartProvider,
    @inject(types.AllTeamsTreePartProvider) allTeamsTreePartProvider: AllTeamsTreePartProvider,
    @inject(types.WorkItemLinkedCommitsTreePartProvider) workItemLinkedCommitsTreePartProvider: WorkItemLinkedCommitsTreePartProvider,
    @inject(types.QueryFolderChildrenTreePartProvider) queryFolderChildrenTreePartProvider: QueryFolderChildrenTreePartProvider,
    @inject(types.AccountTreePartProvider) accountTreePartProvider: AccountTreePartProvider,
    @inject(types.ProjectRootTreePartProvider) projectRootTreePartProvider: ProjectRootTreePartProvider,
    @inject(types.AssignedToMeTreePartProvider) assignedToMeTreePartProvider: AssignedToMeTreePartProvider,
    @inject(types.HierarchyChildrenTreePartProvider) hierarchyChildrenTreePartProvider: HierarchyChildrenTreePartProvider,
    @inject(types.CurrentSprintScopeTreePartProvider) currentSprintScopeTreePartProvider: CurrentSprintScopeTreePartProvider,
    @inject(types.WorkItemCommentsTreePartProvider) workItemCommentsTreePartProvider: WorkItemCommentsTreePartProvider,
    @inject(types.AreaPathChildrenTreePartProvider) areaPathChildrenTreePartProvider: AreaPathChildrenTreePartProvider,
    @inject(types.MentionedTreePartProvider) mentionedTreePartProvider: MentionedTreePartProvider,
    @inject(types.PinnedWorkItemTreePartProvider) pinnedWorkItemTreePartProvider: PinnedWorkItemTreePartProvider,
    @inject(types.CurrentSprintScopeContentTreePartProvider) currentSprintScopeContentTreePartProvider: CurrentSprintScopeContentTreePartProvider,
    @inject(types.WorkItemLinkedWorkItemGroupsTreePartProvider) workItemLinkedWorkItemGroupsTreePartProvider: WorkItemLinkedWorkItemGroupsTreePartProvider,
    @inject(types.WorkItemHistoryTreePartProvider) workItemHistoryTreePartProvider: WorkItemHistoryTreePartProvider,
    @inject(types.AreaPathHierarchyRootTreePartProvider) areaPathHierarchyRootTreePartProvider: AreaPathHierarchyRootTreePartProvider,
    @inject(types.PinnedWorkItemAreaPathTreePartProvider) pinnedWorkItemAreaPathTreePartProvider: PinnedWorkItemAreaPathTreePartProvider,
    @inject(types.BacklogContentTreePartProvider) backlogContentTreePartProvider: BacklogContentTreePartProvider,
    @inject(types.AreaPathsContentTreePartProvider) areaPathsContentTreePartProvider: AreaPathsContentTreePartProvider,
    @inject(types.AttachmentTreePartProvider) attachmentTreePartProvider: AttachmentTreePartProvider,
    @inject(types.WorkItemLinkedWorkItemsTreePartProvider) workItemLinkedWorkItemsTreePartProvider: WorkItemLinkedWorkItemsTreePartProvider,
    @inject(types.RecentlyModifiedByMeTreePartProvider) recentlyModifiedByMeTreePartProvider: RecentlyModifiedByMeTreePartProvider,
    @inject(types.WorkItemLinkedBuildsTreePartProvider) workItemLinkedBuildsTreePartProvider: WorkItemLinkedBuildsTreePartProvider,
    @inject(types.HierarchyRootContentTreePartProvider) hierarchyRootContentTreePartProvider: HierarchyRootContentTreePartProvider,
    @inject(types.AssignedToMeTreeItem) assignedToMeTreeItem: Constructor<AssignedToMeTreeItem>,
    @inject(types.MentionedTreeItem) mentionedTreeItem: Constructor<MentionedTreeItem>,
    @inject(types.WorkItemAttachmentsTreeItem) workItemAttachmentsTreeItem: Constructor<WorkItemAttachmentsTreeItem>,
    @inject(types.WorkItemLinkedBranchesTreeItem) workItemLinkedBranchesTreeItem: Constructor<WorkItemLinkedBranchesTreeItem>,
    @inject(types.WorkItemLinkedCommitsTreeItem) workItemLinkedCommitsTreeItem: Constructor<WorkItemLinkedCommitsTreeItem>,
    @inject(types.WorkItemLinkedBuildsTreeItem) workItemLinkedBuildsTreeItem: Constructor<WorkItemLinkedBuildsTreeItem>,
    @inject(types.RecentlyModifiedByMeTreeItem) recentlyModifiedByMeTreeItem: Constructor<RecentlyModifiedByMeTreeItem>,
    @inject(types.WorkItemBacklogTreeItem) workItemBacklogTreeItem: Constructor<WorkItemBacklogTreeItem>,
    @inject(types.WorkItemCommentsTreeItem) workItemCommentsTreeItem: Constructor<WorkItemCommentsTreeItem>,
    @inject(types.WorkItemLinkedPullRequestsTreeItem) workItemLinkedPullRequestsTreeItem: Constructor<WorkItemLinkedPullRequestsTreeItem>,
  ) {
    this.#settingsService = settingsService;
    this.#workItemLinkedBranchesTreePartProvider = workItemLinkedBranchesTreePartProvider;
    this.#pinnedWorkItemTeamTreePartProvider = pinnedWorkItemTeamTreePartProvider;
    this.#workItemRevisionFieldsTreePartProvider = workItemRevisionFieldsTreePartProvider;
    this.#workItemLinkedPullRequestsTreePartProvider = workItemLinkedPullRequestsTreePartProvider;
    this.#queriesContentTreePartProvider = queriesContentTreePartProvider;
    this.#myTeamsTreePartProvider = myTeamsTreePartProvider;
    this.#currentSprintGroupWorkItemTreePartProvider = currentSprintGroupWorkItemTreePartProvider;
    this.#pinnedWorkItemQueryLeafTreePartProvider = pinnedWorkItemQueryLeafTreePartProvider;
    this.#currentSprintTreePartProvider = currentSprintTreePartProvider;
    this.#queryResultsTreePartProvider = queryResultsTreePartProvider;
    this.#projectTreePartProvider = projectTreePartProvider;
    this.#allTeamsTreePartProvider = allTeamsTreePartProvider;
    this.#workItemLinkedCommitsTreePartProvider = workItemLinkedCommitsTreePartProvider;
    this.#queryFolderChildrenTreePartProvider = queryFolderChildrenTreePartProvider;
    this.#accountTreePartProvider = accountTreePartProvider;
    this.#projectRootTreePartProvider = projectRootTreePartProvider;
    this.#assignedToMeTreePartProvider = assignedToMeTreePartProvider;
    this.#hierarchyChildrenTreePartProvider = hierarchyChildrenTreePartProvider;
    this.#currentSprintScopeTreePartProvider = currentSprintScopeTreePartProvider;
    this.#workItemCommentsTreePartProvider = workItemCommentsTreePartProvider;
    this.#areaPathChildrenTreePartProvider = areaPathChildrenTreePartProvider;
    this.#mentionedTreePartProvider = mentionedTreePartProvider;
    this.#pinnedWorkItemTreePartProvider = pinnedWorkItemTreePartProvider;
    this.#currentSprintScopeContentTreePartProvider = currentSprintScopeContentTreePartProvider;
    this.#workItemLinkedWorkItemGroupsTreePartProvider = workItemLinkedWorkItemGroupsTreePartProvider;
    this.#workItemHistoryTreePartProvider = workItemHistoryTreePartProvider;
    this.#areaPathHierarchyRootTreePartProvider = areaPathHierarchyRootTreePartProvider;
    this.#pinnedWorkItemAreaPathTreePartProvider = pinnedWorkItemAreaPathTreePartProvider;
    this.#backlogContentTreePartProvider = backlogContentTreePartProvider;
    this.#areaPathsContentTreePartProvider = areaPathsContentTreePartProvider;
    this.#attachmentTreePartProvider = attachmentTreePartProvider;
    this.#workItemLinkedWorkItemsTreePartProvider = workItemLinkedWorkItemsTreePartProvider;
    this.#recentlyModifiedByMeTreePartProvider = recentlyModifiedByMeTreePartProvider;
    this.#workItemLinkedBuildsTreePartProvider = workItemLinkedBuildsTreePartProvider;
    this.#hierarchyRootContentTreePartProvider = hierarchyRootContentTreePartProvider;
    this.#assignedToMeTreeItem = assignedToMeTreeItem;
    this.#mentionedTreeItem = mentionedTreeItem;
    this.#workItemAttachmentsTreeItem = workItemAttachmentsTreeItem;
    this.#workItemLinkedBranchesTreeItem = workItemLinkedBranchesTreeItem;
    this.#workItemLinkedCommitsTreeItem = workItemLinkedCommitsTreeItem;
    this.#workItemLinkedBuildsTreeItem = workItemLinkedBuildsTreeItem;
    this.#recentlyModifiedByMeTreeItem = recentlyModifiedByMeTreeItem;
    this.#workItemBacklogTreeItem = workItemBacklogTreeItem;
    this.#workItemCommentsTreeItem = workItemCommentsTreeItem;
    this.#workItemLinkedPullRequestsTreeItem = workItemLinkedPullRequestsTreeItem;
  }


  @postConstruct()
  private initializeWorkItemTreeProvider() {
    this.projectUnwrappingTreePartProvider = new UnwrappingTreePartProvider(
      this.#projectTreePartProvider,
      shouldUnwrapAccountOrProject(this.#settingsService.unwrapProjects()),
      (i) => this.getTreePartProvider(i),
    );
    this.accountRootUnwrappingTreePartProvider = new UnwrappingTreePartProvider(
      this.#accountTreePartProvider,
      shouldUnwrapAccountOrProject(this.#settingsService.unwrapAccounts()),
      () => this.projectUnwrappingTreePartProvider,
    );
    this.currentSprintUnwrappingTreePartProvider = new UnwrappingTreePartProvider(
      this.#currentSprintTreePartProvider,
      (items) => of(items.size === 1 && !items.has('exception')),
      () => this.#currentSprintScopeTreePartProvider,
    );
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
    this.backlogStaticTreePartProvider = new StaticTreePartProvider({
      backlog: {
        treeItem: this.#workItemBacklogTreeItem,
      },
    });
    this.teamContentsCombiningTreePartProvider = new CombiningTreePartProvider({
      sprints: this.currentSprintUnwrappingTreePartProvider,
      backlog: this.backlogStaticTreePartProvider,
    });
    this.areaPathNodeCombiningTreePartProvider = new CombiningTreePartProvider({
      areaPathChildren: this.#areaPathChildrenTreePartProvider,
      hierarchy: this.#areaPathHierarchyRootTreePartProvider,
    });
    this.workItemRootCombiningTreePartProvider = new CombiningTreePartProvider({
      pinnedWorkItems: this.#pinnedWorkItemTreePartProvider,
      pinnedAreaPaths: this.#pinnedWorkItemAreaPathTreePartProvider,
      pinnedTeams: this.#pinnedWorkItemTeamTreePartProvider,
      pinnedQueries: this.#pinnedWorkItemQueryLeafTreePartProvider,
      accounts: this.accountRootUnwrappingTreePartProvider,
    });
    this.workItemDetailStaticTreePartProvider = new StaticTreePartProvider({
      linkedCommits: {
        treeItem: this.#workItemLinkedCommitsTreeItem,
        condition: (itemObservable) => itemObservable.pipe(map((item) => (item.workItem?.relations?.some((relation: any) => relation.url?.startsWith('vstfs:///Git/Commit/') ?? false) ?? false))),
      },
      linkedPullRequests: {
        treeItem: this.#workItemLinkedPullRequestsTreeItem,
        condition: (itemObservable) => itemObservable.pipe(map((item) => (item.workItem?.relations?.some((relation: any) => relation.url?.startsWith('vstfs:///Git/PullRequestId/') ?? false) ?? false))),
      },
      linkedBranches: {
        treeItem: this.#workItemLinkedBranchesTreeItem,
        condition: (itemObservable) => itemObservable.pipe(map((item) => (item.workItem?.relations?.some((relation: any) => relation.url?.startsWith('vstfs:///Git/Ref/') ?? false) ?? false))),
      },
      linkedBuilds: {
        treeItem: this.#workItemLinkedBuildsTreeItem,
        condition: (itemObservable) => itemObservable.pipe(map((item) => (item.workItem?.relations?.some((relation: any) => relation.url?.startsWith('vstfs:///Build/Build/') ?? false) ?? false))),
      },
      comments: {
        treeItem: this.#workItemCommentsTreeItem,
        condition: (itemObservable) => itemObservable.pipe(map((item) => (item.workItem?.fields?.['System.CommentCount'] ?? 0) > 0)),
      },
      attachments: {
        treeItem: this.#workItemAttachmentsTreeItem,
        condition: (itemObservable) => itemObservable.pipe(map((item) => (item.workItem?.relations?.some((relation: any) => relation.rel === 'AttachedFile') ?? false))),
      },
    });
    this.workItemContentsCombiningTreePartProvider = new CombiningTreePartProvider({
      children: this.#hierarchyChildrenTreePartProvider,
      details: this.workItemDetailStaticTreePartProvider,
      linkedWorkItemGroups: this.#workItemLinkedWorkItemGroupsTreePartProvider,
    });
  }

  public getTreePartProvider(
    element: AbstractTreeItem<any> | undefined,
  ): TreePartProvider<any, any> | undefined {
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

  #accountTreePartProvider: AccountTreePartProvider;
  #projectTreePartProvider: ProjectTreePartProvider;


  projectUnwrappingTreePartProvider: TreePartProvider<any, any> | undefined;
  accountRootUnwrappingTreePartProvider: TreePartProvider<any, any> | undefined;

  constructor(
    @inject(types.SettingsService) settingsService: SettingsService,
    @inject(types.AccountTreePartProvider) accountTreePartProvider: AccountTreePartProvider,
    @inject(types.ProjectTreePartProvider) projectTreePartProvider: ProjectTreePartProvider,
  ) {
    this.#settingsService = settingsService;
    this.#accountTreePartProvider = accountTreePartProvider;
    this.#projectTreePartProvider = projectTreePartProvider;
  }


  @postConstruct()
  private initializeWikiTreeProvider() {
    this.projectUnwrappingTreePartProvider = new UnwrappingTreePartProvider(
      this.#projectTreePartProvider,
      shouldUnwrapAccountOrProject(this.#settingsService.unwrapProjects()),
      (i) => this.getTreePartProvider(i),
    );
    this.accountRootUnwrappingTreePartProvider = new UnwrappingTreePartProvider(
      this.#accountTreePartProvider,
      shouldUnwrapAccountOrProject(this.#settingsService.unwrapAccounts()),
      () => this.projectUnwrappingTreePartProvider,
    );
  }

  public getTreePartProvider(
    element: AbstractTreeItem<any> | undefined,
  ): TreePartProvider<any, any> | undefined {
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

  #accountTreePartProvider: AccountTreePartProvider;
  #projectTreePartProvider: ProjectTreePartProvider;


  projectUnwrappingTreePartProvider: TreePartProvider<any, any> | undefined;
  accountRootUnwrappingTreePartProvider: TreePartProvider<any, any> | undefined;

  constructor(
    @inject(types.SettingsService) settingsService: SettingsService,
    @inject(types.AccountTreePartProvider) accountTreePartProvider: AccountTreePartProvider,
    @inject(types.ProjectTreePartProvider) projectTreePartProvider: ProjectTreePartProvider,
  ) {
    this.#settingsService = settingsService;
    this.#accountTreePartProvider = accountTreePartProvider;
    this.#projectTreePartProvider = projectTreePartProvider;
  }


  @postConstruct()
  private initializeTestPlanTreeProvider() {
    this.projectUnwrappingTreePartProvider = new UnwrappingTreePartProvider(
      this.#projectTreePartProvider,
      shouldUnwrapAccountOrProject(this.#settingsService.unwrapProjects()),
      (i) => this.getTreePartProvider(i),
    );
    this.accountRootUnwrappingTreePartProvider = new UnwrappingTreePartProvider(
      this.#accountTreePartProvider,
      shouldUnwrapAccountOrProject(this.#settingsService.unwrapAccounts()),
      () => this.projectUnwrappingTreePartProvider,
    );
  }

  public getTreePartProvider(
    element: AbstractTreeItem<any> | undefined,
  ): TreePartProvider<any, any> | undefined {
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

  #pinnedAgentTreePartProvider: PinnedAgentTreePartProvider;
  #agentJobTreePartProvider: AgentJobTreePartProvider;
  #agentTreePartProvider: AgentTreePartProvider;
  #accountTreePartProvider: AccountTreePartProvider;
  #pinnedAgentPoolTreePartProvider: PinnedAgentPoolTreePartProvider;
  #agentPoolTreePartProvider: AgentPoolTreePartProvider;
  #projectTreePartProvider: ProjectTreePartProvider;

  #agentJobsContainerTreeItem: Constructor<AgentJobsContainerTreeItem>;
  #jobsContainerTreeItem: Constructor<JobsContainerTreeItem>;
  #agentsContainerTreeItem: Constructor<AgentsContainerTreeItem>;

  projectUnwrappingTreePartProvider: TreePartProvider<any, any> | undefined;
  accountRootUnwrappingTreePartProvider: TreePartProvider<any, any> | undefined;
  agentsRootCombiningTreePartProvider: TreePartProvider<any, any> | undefined;
  agentPoolChildrenStaticTreePartProvider: TreePartProvider<any, any> | undefined;
  agentChildrenStaticTreePartProvider: TreePartProvider<any, any> | undefined;

  constructor(
    @inject(types.SettingsService) settingsService: SettingsService,
    @inject(types.PinnedAgentTreePartProvider) pinnedAgentTreePartProvider: PinnedAgentTreePartProvider,
    @inject(types.AgentJobTreePartProvider) agentJobTreePartProvider: AgentJobTreePartProvider,
    @inject(types.AgentTreePartProvider) agentTreePartProvider: AgentTreePartProvider,
    @inject(types.AccountTreePartProvider) accountTreePartProvider: AccountTreePartProvider,
    @inject(types.PinnedAgentPoolTreePartProvider) pinnedAgentPoolTreePartProvider: PinnedAgentPoolTreePartProvider,
    @inject(types.AgentPoolTreePartProvider) agentPoolTreePartProvider: AgentPoolTreePartProvider,
    @inject(types.ProjectTreePartProvider) projectTreePartProvider: ProjectTreePartProvider,
    @inject(types.AgentJobsContainerTreeItem) agentJobsContainerTreeItem: Constructor<AgentJobsContainerTreeItem>,
    @inject(types.JobsContainerTreeItem) jobsContainerTreeItem: Constructor<JobsContainerTreeItem>,
    @inject(types.AgentsContainerTreeItem) agentsContainerTreeItem: Constructor<AgentsContainerTreeItem>,
  ) {
    this.#settingsService = settingsService;
    this.#pinnedAgentTreePartProvider = pinnedAgentTreePartProvider;
    this.#agentJobTreePartProvider = agentJobTreePartProvider;
    this.#agentTreePartProvider = agentTreePartProvider;
    this.#accountTreePartProvider = accountTreePartProvider;
    this.#pinnedAgentPoolTreePartProvider = pinnedAgentPoolTreePartProvider;
    this.#agentPoolTreePartProvider = agentPoolTreePartProvider;
    this.#projectTreePartProvider = projectTreePartProvider;
    this.#agentJobsContainerTreeItem = agentJobsContainerTreeItem;
    this.#jobsContainerTreeItem = jobsContainerTreeItem;
    this.#agentsContainerTreeItem = agentsContainerTreeItem;
  }


  @postConstruct()
  private initializeAgentsTreeProvider() {
    this.projectUnwrappingTreePartProvider = new UnwrappingTreePartProvider(
      this.#projectTreePartProvider,
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
    this.agentPoolChildrenStaticTreePartProvider = new StaticTreePartProvider({
      jobs: {
        treeItem: this.#jobsContainerTreeItem,
      },
      agents: {
        treeItem: this.#agentsContainerTreeItem,
      },
    });
    this.agentChildrenStaticTreePartProvider = new StaticTreePartProvider({
      jobs: {
        treeItem: this.#agentJobsContainerTreeItem,
      },
    });
  }

  public getTreePartProvider(
    element: AbstractTreeItem<any> | undefined,
  ): TreePartProvider<any, any> | undefined {
    if (element === undefined) {
      return this.agentsRootCombiningTreePartProvider;
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
