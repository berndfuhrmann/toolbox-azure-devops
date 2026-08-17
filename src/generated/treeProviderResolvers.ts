// generated

import { inject, injectable, postConstruct } from "inversify";
import { TreePartProvider } from "../common/treePartProvider/TreePartProvider";
import { AbstractTreeItem } from "../common/treeItems/AbstractTreeItem";
import { types } from "./types";
import { SettingsService } from "../common/SettingsService";

import { PipelineFolderTreePartProvider } from "../modules/pipeline/treePartProviders/PipelineFolderTreePartProvider";
import { BacklogContentTreePartProvider } from "../modules/workItem/treePartProviders/BacklogContentTreePartProvider";
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
import { GitRepositoryPullRequestCommentThreadTreePartProvider } from "../modules/repository/treePartProviders/GitRepositoryPullRequestCommentThreadTreePartProvider";
import { PipelineRunTimelineTreePartProvider } from "../modules/pipeline/treePartProviders/PipelineRunTimelineTreePartProvider";
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
import { AllTeamsTreePartProvider } from "../modules/workItem/treePartProviders/AllTeamsTreePartProvider";
import { GitRepositoryPullRequestTreePartProvider } from "../modules/repository/treePartProviders/GitRepositoryPullRequestTreePartProvider";
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
import { PinnedAgentTreePartProvider } from "../modules/agents/treePartProviders/PinnedAgentTreePartProvider";
import { WorkItemRevisionFieldsTreePartProvider } from "../modules/workItem/treePartProviders/WorkItemRevisionFieldsTreePartProvider";
import { DashboardsContainerTreeItem } from "../modules/dashboard/treeItems/DashboardsContainerTreeItem";
import { WorkItemLinkedPullRequestsTreePartProvider } from "../modules/workItem/treePartProviders/WorkItemLinkedPullRequestsTreePartProvider";
import { AreaPathsTreeItem } from "../modules/workItem/treeItems/AreaPathsTreeItem";
import { PipelineArtifactsTreeItem } from "../modules/pipeline/treeItems/PipelineArtifactsTreeItem";
import { WorkItemCurrentSprintByStateScopeTreeItem } from "../modules/workItem/treeItems/WorkItemCurrentSprintByStateScopeTreeItem";
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

  #workItemLinkedPullRequestsTreePartProvider: WorkItemLinkedPullRequestsTreePartProvider;
  #gitRepositoryPullRequestCommentThreadTreePartProvider: GitRepositoryPullRequestCommentThreadTreePartProvider;
  #gitRepositoryItemTreePartProvider: GitRepositoryItemTreePartProvider;
  #workItemLinkedCommitsTreePartProvider: WorkItemLinkedCommitsTreePartProvider;
  #workItemLinkedBuildsTreePartProvider: WorkItemLinkedBuildsTreePartProvider;
  #pinnedGitRepositoryPullRequestTreePartProvider: PinnedGitRepositoryPullRequestTreePartProvider;
  #workItemLinkedBranchesTreePartProvider: WorkItemLinkedBranchesTreePartProvider;
  #gitRepositoryPullRequestTreePartProvider: GitRepositoryPullRequestTreePartProvider;
  #gitRepositoryPullRequestStatusTreePartProvider: GitRepositoryPullRequestStatusTreePartProvider;
  #gitRepositoryCommitTreePartProvider: GitRepositoryCommitTreePartProvider;
  #gitRepositoryTagTreePartProvider: GitRepositoryTagTreePartProvider;
  #attachmentTreePartProvider: AttachmentTreePartProvider;
  #gitRepositoryPullRequestWorkItemTreePartProvider: GitRepositoryPullRequestWorkItemTreePartProvider;
  #gitRepositoryBranchTreePartProvider: GitRepositoryBranchTreePartProvider;
  #workItemRevisionFieldsTreePartProvider: WorkItemRevisionFieldsTreePartProvider;
  #pinnedGitRepositoryTreePartProvider: PinnedGitRepositoryTreePartProvider;
  #gitRepositoryPullRequestReviewerTreePartProvider: GitRepositoryPullRequestReviewerTreePartProvider;
  #hierarchyChildrenTreePartProvider: HierarchyChildrenTreePartProvider;
  #projectTreePartProvider: ProjectTreePartProvider;
  #gitRepositoryTreePartProvider: GitRepositoryTreePartProvider;
  #workItemCommentsTreePartProvider: WorkItemCommentsTreePartProvider;
  #workItemLinkedWorkItemsTreePartProvider: WorkItemLinkedWorkItemsTreePartProvider;
  #accountTreePartProvider: AccountTreePartProvider;
  #workItemHistoryTreePartProvider: WorkItemHistoryTreePartProvider;
  #workItemLinkedWorkItemGroupsTreePartProvider: WorkItemLinkedWorkItemGroupsTreePartProvider;

  #gitRepositoryBranchesTreeItem: Constructor<GitRepositoryBranchesTreeItem>;
  #workItemLinkedPullRequestsTreeItem: Constructor<WorkItemLinkedPullRequestsTreeItem>;
  #workItemCommentsTreeItem: Constructor<WorkItemCommentsTreeItem>;
  #workItemLinkedCommitsTreeItem: Constructor<WorkItemLinkedCommitsTreeItem>;
  #gitRepositoryCommitsTreeItem: Constructor<GitRepositoryCommitsTreeItem>;
  #gitRepositoryPullRequestsTreeItem: Constructor<GitRepositoryPullRequestsTreeItem>;
  #gitRepositoryTagsTreeItem: Constructor<GitRepositoryTagsTreeItem>;
  #workItemLinkedBuildsTreeItem: Constructor<WorkItemLinkedBuildsTreeItem>;
  #gitRepositoryItemsTreeItem: Constructor<GitRepositoryItemsTreeItem>;
  #gitRepositoryPullRequestReviewersTreeItem: Constructor<GitRepositoryPullRequestReviewersTreeItem>;
  #workItemLinkedBranchesTreeItem: Constructor<WorkItemLinkedBranchesTreeItem>;
  #workItemAttachmentsTreeItem: Constructor<WorkItemAttachmentsTreeItem>;

  gitRepositoryBranchDetailStaticTreePartProvider: TreePartProvider<any, any> | undefined;
  repositoryRootDeduplicatingTreePartProvider: TreePartProvider<any, any> | undefined;
  workItemContentsCombiningTreePartProvider: TreePartProvider<any, any> | undefined;
  gitRepositoryDetailStaticTreePartProvider: TreePartProvider<any, any> | undefined;
  repositoryRootCombiningTreePartProvider: TreePartProvider<any, any> | undefined;
  projectUnwrappingTreePartProvider: TreePartProvider<any, any> | undefined;
  gitRepositoryPullRequestReviewersStaticTreePartProvider: TreePartProvider<any, any> | undefined;
  accountRootUnwrappingTreePartProvider: TreePartProvider<any, any> | undefined;
  workItemDetailStaticTreePartProvider: TreePartProvider<any, any> | undefined;
  gitRepositoryCommitDetailStaticTreePartProvider: TreePartProvider<any, any> | undefined;
  gitRepositoryPullRequestContentCombiningTreePartProvider: TreePartProvider<any, any> | undefined;

  constructor(
    @inject(types.SettingsService) settingsService: SettingsService,
    @inject(types.WorkItemLinkedPullRequestsTreePartProvider) workItemLinkedPullRequestsTreePartProvider: WorkItemLinkedPullRequestsTreePartProvider,
    @inject(types.GitRepositoryPullRequestCommentThreadTreePartProvider) gitRepositoryPullRequestCommentThreadTreePartProvider: GitRepositoryPullRequestCommentThreadTreePartProvider,
    @inject(types.GitRepositoryItemTreePartProvider) gitRepositoryItemTreePartProvider: GitRepositoryItemTreePartProvider,
    @inject(types.WorkItemLinkedCommitsTreePartProvider) workItemLinkedCommitsTreePartProvider: WorkItemLinkedCommitsTreePartProvider,
    @inject(types.WorkItemLinkedBuildsTreePartProvider) workItemLinkedBuildsTreePartProvider: WorkItemLinkedBuildsTreePartProvider,
    @inject(types.PinnedGitRepositoryPullRequestTreePartProvider) pinnedGitRepositoryPullRequestTreePartProvider: PinnedGitRepositoryPullRequestTreePartProvider,
    @inject(types.WorkItemLinkedBranchesTreePartProvider) workItemLinkedBranchesTreePartProvider: WorkItemLinkedBranchesTreePartProvider,
    @inject(types.GitRepositoryPullRequestTreePartProvider) gitRepositoryPullRequestTreePartProvider: GitRepositoryPullRequestTreePartProvider,
    @inject(types.GitRepositoryPullRequestStatusTreePartProvider) gitRepositoryPullRequestStatusTreePartProvider: GitRepositoryPullRequestStatusTreePartProvider,
    @inject(types.GitRepositoryCommitTreePartProvider) gitRepositoryCommitTreePartProvider: GitRepositoryCommitTreePartProvider,
    @inject(types.GitRepositoryTagTreePartProvider) gitRepositoryTagTreePartProvider: GitRepositoryTagTreePartProvider,
    @inject(types.AttachmentTreePartProvider) attachmentTreePartProvider: AttachmentTreePartProvider,
    @inject(types.GitRepositoryPullRequestWorkItemTreePartProvider) gitRepositoryPullRequestWorkItemTreePartProvider: GitRepositoryPullRequestWorkItemTreePartProvider,
    @inject(types.GitRepositoryBranchTreePartProvider) gitRepositoryBranchTreePartProvider: GitRepositoryBranchTreePartProvider,
    @inject(types.WorkItemRevisionFieldsTreePartProvider) workItemRevisionFieldsTreePartProvider: WorkItemRevisionFieldsTreePartProvider,
    @inject(types.PinnedGitRepositoryTreePartProvider) pinnedGitRepositoryTreePartProvider: PinnedGitRepositoryTreePartProvider,
    @inject(types.GitRepositoryPullRequestReviewerTreePartProvider) gitRepositoryPullRequestReviewerTreePartProvider: GitRepositoryPullRequestReviewerTreePartProvider,
    @inject(types.HierarchyChildrenTreePartProvider) hierarchyChildrenTreePartProvider: HierarchyChildrenTreePartProvider,
    @inject(types.ProjectTreePartProvider) projectTreePartProvider: ProjectTreePartProvider,
    @inject(types.GitRepositoryTreePartProvider) gitRepositoryTreePartProvider: GitRepositoryTreePartProvider,
    @inject(types.WorkItemCommentsTreePartProvider) workItemCommentsTreePartProvider: WorkItemCommentsTreePartProvider,
    @inject(types.WorkItemLinkedWorkItemsTreePartProvider) workItemLinkedWorkItemsTreePartProvider: WorkItemLinkedWorkItemsTreePartProvider,
    @inject(types.AccountTreePartProvider) accountTreePartProvider: AccountTreePartProvider,
    @inject(types.WorkItemHistoryTreePartProvider) workItemHistoryTreePartProvider: WorkItemHistoryTreePartProvider,
    @inject(types.WorkItemLinkedWorkItemGroupsTreePartProvider) workItemLinkedWorkItemGroupsTreePartProvider: WorkItemLinkedWorkItemGroupsTreePartProvider,
    @inject(types.GitRepositoryBranchesTreeItem) gitRepositoryBranchesTreeItem: Constructor<GitRepositoryBranchesTreeItem>,
    @inject(types.WorkItemLinkedPullRequestsTreeItem) workItemLinkedPullRequestsTreeItem: Constructor<WorkItemLinkedPullRequestsTreeItem>,
    @inject(types.WorkItemCommentsTreeItem) workItemCommentsTreeItem: Constructor<WorkItemCommentsTreeItem>,
    @inject(types.WorkItemLinkedCommitsTreeItem) workItemLinkedCommitsTreeItem: Constructor<WorkItemLinkedCommitsTreeItem>,
    @inject(types.GitRepositoryCommitsTreeItem) gitRepositoryCommitsTreeItem: Constructor<GitRepositoryCommitsTreeItem>,
    @inject(types.GitRepositoryPullRequestsTreeItem) gitRepositoryPullRequestsTreeItem: Constructor<GitRepositoryPullRequestsTreeItem>,
    @inject(types.GitRepositoryTagsTreeItem) gitRepositoryTagsTreeItem: Constructor<GitRepositoryTagsTreeItem>,
    @inject(types.WorkItemLinkedBuildsTreeItem) workItemLinkedBuildsTreeItem: Constructor<WorkItemLinkedBuildsTreeItem>,
    @inject(types.GitRepositoryItemsTreeItem) gitRepositoryItemsTreeItem: Constructor<GitRepositoryItemsTreeItem>,
    @inject(types.GitRepositoryPullRequestReviewersTreeItem) gitRepositoryPullRequestReviewersTreeItem: Constructor<GitRepositoryPullRequestReviewersTreeItem>,
    @inject(types.WorkItemLinkedBranchesTreeItem) workItemLinkedBranchesTreeItem: Constructor<WorkItemLinkedBranchesTreeItem>,
    @inject(types.WorkItemAttachmentsTreeItem) workItemAttachmentsTreeItem: Constructor<WorkItemAttachmentsTreeItem>,
  ) {
    this.#settingsService = settingsService;
    this.#workItemLinkedPullRequestsTreePartProvider = workItemLinkedPullRequestsTreePartProvider;
    this.#gitRepositoryPullRequestCommentThreadTreePartProvider = gitRepositoryPullRequestCommentThreadTreePartProvider;
    this.#gitRepositoryItemTreePartProvider = gitRepositoryItemTreePartProvider;
    this.#workItemLinkedCommitsTreePartProvider = workItemLinkedCommitsTreePartProvider;
    this.#workItemLinkedBuildsTreePartProvider = workItemLinkedBuildsTreePartProvider;
    this.#pinnedGitRepositoryPullRequestTreePartProvider = pinnedGitRepositoryPullRequestTreePartProvider;
    this.#workItemLinkedBranchesTreePartProvider = workItemLinkedBranchesTreePartProvider;
    this.#gitRepositoryPullRequestTreePartProvider = gitRepositoryPullRequestTreePartProvider;
    this.#gitRepositoryPullRequestStatusTreePartProvider = gitRepositoryPullRequestStatusTreePartProvider;
    this.#gitRepositoryCommitTreePartProvider = gitRepositoryCommitTreePartProvider;
    this.#gitRepositoryTagTreePartProvider = gitRepositoryTagTreePartProvider;
    this.#attachmentTreePartProvider = attachmentTreePartProvider;
    this.#gitRepositoryPullRequestWorkItemTreePartProvider = gitRepositoryPullRequestWorkItemTreePartProvider;
    this.#gitRepositoryBranchTreePartProvider = gitRepositoryBranchTreePartProvider;
    this.#workItemRevisionFieldsTreePartProvider = workItemRevisionFieldsTreePartProvider;
    this.#pinnedGitRepositoryTreePartProvider = pinnedGitRepositoryTreePartProvider;
    this.#gitRepositoryPullRequestReviewerTreePartProvider = gitRepositoryPullRequestReviewerTreePartProvider;
    this.#hierarchyChildrenTreePartProvider = hierarchyChildrenTreePartProvider;
    this.#projectTreePartProvider = projectTreePartProvider;
    this.#gitRepositoryTreePartProvider = gitRepositoryTreePartProvider;
    this.#workItemCommentsTreePartProvider = workItemCommentsTreePartProvider;
    this.#workItemLinkedWorkItemsTreePartProvider = workItemLinkedWorkItemsTreePartProvider;
    this.#accountTreePartProvider = accountTreePartProvider;
    this.#workItemHistoryTreePartProvider = workItemHistoryTreePartProvider;
    this.#workItemLinkedWorkItemGroupsTreePartProvider = workItemLinkedWorkItemGroupsTreePartProvider;
    this.#gitRepositoryBranchesTreeItem = gitRepositoryBranchesTreeItem;
    this.#workItemLinkedPullRequestsTreeItem = workItemLinkedPullRequestsTreeItem;
    this.#workItemCommentsTreeItem = workItemCommentsTreeItem;
    this.#workItemLinkedCommitsTreeItem = workItemLinkedCommitsTreeItem;
    this.#gitRepositoryCommitsTreeItem = gitRepositoryCommitsTreeItem;
    this.#gitRepositoryPullRequestsTreeItem = gitRepositoryPullRequestsTreeItem;
    this.#gitRepositoryTagsTreeItem = gitRepositoryTagsTreeItem;
    this.#workItemLinkedBuildsTreeItem = workItemLinkedBuildsTreeItem;
    this.#gitRepositoryItemsTreeItem = gitRepositoryItemsTreeItem;
    this.#gitRepositoryPullRequestReviewersTreeItem = gitRepositoryPullRequestReviewersTreeItem;
    this.#workItemLinkedBranchesTreeItem = workItemLinkedBranchesTreeItem;
    this.#workItemAttachmentsTreeItem = workItemAttachmentsTreeItem;
  }


  @postConstruct()
  private initializeRepositoryTreeProvider() {
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
    this.projectUnwrappingTreePartProvider = new UnwrappingTreePartProvider(
      this.#projectTreePartProvider,
      shouldUnwrapAccountOrProject(this.#settingsService.unwrapProjects()),
      (i) => this.getTreePartProvider(i),
    );
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
    this.gitRepositoryCommitDetailStaticTreePartProvider = new StaticTreePartProvider({
      items: {
        treeItem: this.#gitRepositoryItemsTreeItem,
      },
    });
    this.gitRepositoryPullRequestContentCombiningTreePartProvider = new CombiningTreePartProvider({
      reviewers: this.gitRepositoryPullRequestReviewersStaticTreePartProvider,
      status: this.#gitRepositoryPullRequestStatusTreePartProvider,
      commentThread: this.#gitRepositoryPullRequestCommentThreadTreePartProvider,
      workItems: this.#gitRepositoryPullRequestWorkItemTreePartProvider,
    });
    this.workItemContentsCombiningTreePartProvider = new CombiningTreePartProvider({
      children: this.#hierarchyChildrenTreePartProvider,
      details: this.workItemDetailStaticTreePartProvider,
      linkedWorkItemGroups: this.#workItemLinkedWorkItemGroupsTreePartProvider,
    });
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

  #projectTreePartProvider: ProjectTreePartProvider;
  #pipelineRunTreePartProvider: PipelineRunTreePartProvider;
  #pinnedPipelineFolderTreePartProvider: PinnedPipelineFolderTreePartProvider;
  #pinnedPipelineTreePartProvider: PinnedPipelineTreePartProvider;
  #accountTreePartProvider: AccountTreePartProvider;
  #pipelineRunArtifactTreePartProvider: PipelineRunArtifactTreePartProvider;
  #pipelineFolderTreePartProvider: PipelineFolderTreePartProvider;
  #pipelineTreePartProvider: PipelineTreePartProvider;
  #pipelineRunTimelineTreePartProvider: PipelineRunTimelineTreePartProvider;

  #pipelineArtifactsTreeItem: Constructor<PipelineArtifactsTreeItem>;

  pipelineRunDetailCombiningTreePartProvider: TreePartProvider<any, any> | undefined;
  pipelineRootCombiningTreePartProvider: TreePartProvider<any, any> | undefined;
  pipelineRootDeduplicatingTreePartProvider: TreePartProvider<any, any> | undefined;
  pipelineRunArtifactsStaticTreePartProvider: TreePartProvider<any, any> | undefined;
  projectUnwrappingTreePartProvider: TreePartProvider<any, any> | undefined;
  accountRootUnwrappingTreePartProvider: TreePartProvider<any, any> | undefined;
  pipelineFolderAndPipelineCombiningTreePartProvider: TreePartProvider<any, any> | undefined;

  constructor(
    @inject(types.SettingsService) settingsService: SettingsService,
    @inject(types.ProjectTreePartProvider) projectTreePartProvider: ProjectTreePartProvider,
    @inject(types.PipelineRunTreePartProvider) pipelineRunTreePartProvider: PipelineRunTreePartProvider,
    @inject(types.PinnedPipelineFolderTreePartProvider) pinnedPipelineFolderTreePartProvider: PinnedPipelineFolderTreePartProvider,
    @inject(types.PinnedPipelineTreePartProvider) pinnedPipelineTreePartProvider: PinnedPipelineTreePartProvider,
    @inject(types.AccountTreePartProvider) accountTreePartProvider: AccountTreePartProvider,
    @inject(types.PipelineRunArtifactTreePartProvider) pipelineRunArtifactTreePartProvider: PipelineRunArtifactTreePartProvider,
    @inject(types.PipelineFolderTreePartProvider) pipelineFolderTreePartProvider: PipelineFolderTreePartProvider,
    @inject(types.PipelineTreePartProvider) pipelineTreePartProvider: PipelineTreePartProvider,
    @inject(types.PipelineRunTimelineTreePartProvider) pipelineRunTimelineTreePartProvider: PipelineRunTimelineTreePartProvider,
    @inject(types.PipelineArtifactsTreeItem) pipelineArtifactsTreeItem: Constructor<PipelineArtifactsTreeItem>,
  ) {
    this.#settingsService = settingsService;
    this.#projectTreePartProvider = projectTreePartProvider;
    this.#pipelineRunTreePartProvider = pipelineRunTreePartProvider;
    this.#pinnedPipelineFolderTreePartProvider = pinnedPipelineFolderTreePartProvider;
    this.#pinnedPipelineTreePartProvider = pinnedPipelineTreePartProvider;
    this.#accountTreePartProvider = accountTreePartProvider;
    this.#pipelineRunArtifactTreePartProvider = pipelineRunArtifactTreePartProvider;
    this.#pipelineFolderTreePartProvider = pipelineFolderTreePartProvider;
    this.#pipelineTreePartProvider = pipelineTreePartProvider;
    this.#pipelineRunTimelineTreePartProvider = pipelineRunTimelineTreePartProvider;
    this.#pipelineArtifactsTreeItem = pipelineArtifactsTreeItem;
  }


  @postConstruct()
  private initializePipelineTreeProvider() {
    this.pipelineRunArtifactsStaticTreePartProvider = new StaticTreePartProvider({
      artifacts: {
        treeItem: this.#pipelineArtifactsTreeItem,
      },
    });
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

  #projectTreePartProvider: ProjectTreePartProvider;
  #dashboardTreePartProvider: DashboardTreePartProvider;
  #dashboardWidgetTreePartProvider: DashboardWidgetTreePartProvider;
  #accountTreePartProvider: AccountTreePartProvider;

  #dashboardsContainerTreeItem: Constructor<DashboardsContainerTreeItem>;

  projectUnwrappingTreePartProvider: TreePartProvider<any, any> | undefined;
  projectDashboardsStaticTreePartProvider: TreePartProvider<any, any> | undefined;
  accountRootUnwrappingTreePartProvider: TreePartProvider<any, any> | undefined;

  constructor(
    @inject(types.SettingsService) settingsService: SettingsService,
    @inject(types.ProjectTreePartProvider) projectTreePartProvider: ProjectTreePartProvider,
    @inject(types.DashboardTreePartProvider) dashboardTreePartProvider: DashboardTreePartProvider,
    @inject(types.DashboardWidgetTreePartProvider) dashboardWidgetTreePartProvider: DashboardWidgetTreePartProvider,
    @inject(types.AccountTreePartProvider) accountTreePartProvider: AccountTreePartProvider,
    @inject(types.DashboardsContainerTreeItem) dashboardsContainerTreeItem: Constructor<DashboardsContainerTreeItem>,
  ) {
    this.#settingsService = settingsService;
    this.#projectTreePartProvider = projectTreePartProvider;
    this.#dashboardTreePartProvider = dashboardTreePartProvider;
    this.#dashboardWidgetTreePartProvider = dashboardWidgetTreePartProvider;
    this.#accountTreePartProvider = accountTreePartProvider;
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

  #allTeamsTreePartProvider: AllTeamsTreePartProvider;
  #workItemLinkedPullRequestsTreePartProvider: WorkItemLinkedPullRequestsTreePartProvider;
  #areaPathChildrenTreePartProvider: AreaPathChildrenTreePartProvider;
  #workItemLinkedCommitsTreePartProvider: WorkItemLinkedCommitsTreePartProvider;
  #workItemLinkedBuildsTreePartProvider: WorkItemLinkedBuildsTreePartProvider;
  #currentSprintScopeTreePartProvider: CurrentSprintScopeTreePartProvider;
  #workItemLinkedBranchesTreePartProvider: WorkItemLinkedBranchesTreePartProvider;
  #queriesContentTreePartProvider: QueriesContentTreePartProvider;
  #areaPathsContentTreePartProvider: AreaPathsContentTreePartProvider;
  #assignedToMeTreePartProvider: AssignedToMeTreePartProvider;
  #currentSprintGroupWorkItemTreePartProvider: CurrentSprintGroupWorkItemTreePartProvider;
  #backlogContentTreePartProvider: BacklogContentTreePartProvider;
  #queryFolderChildrenTreePartProvider: QueryFolderChildrenTreePartProvider;
  #queryResultsTreePartProvider: QueryResultsTreePartProvider;
  #mentionedTreePartProvider: MentionedTreePartProvider;
  #currentSprintTreePartProvider: CurrentSprintTreePartProvider;
  #attachmentTreePartProvider: AttachmentTreePartProvider;
  #myTeamsTreePartProvider: MyTeamsTreePartProvider;
  #workItemRevisionFieldsTreePartProvider: WorkItemRevisionFieldsTreePartProvider;
  #projectRootTreePartProvider: ProjectRootTreePartProvider;
  #recentlyModifiedByMeTreePartProvider: RecentlyModifiedByMeTreePartProvider;
  #pinnedWorkItemAreaPathTreePartProvider: PinnedWorkItemAreaPathTreePartProvider;
  #hierarchyChildrenTreePartProvider: HierarchyChildrenTreePartProvider;
  #projectTreePartProvider: ProjectTreePartProvider;
  #pinnedWorkItemTreePartProvider: PinnedWorkItemTreePartProvider;
  #areaPathHierarchyRootTreePartProvider: AreaPathHierarchyRootTreePartProvider;
  #workItemCommentsTreePartProvider: WorkItemCommentsTreePartProvider;
  #workItemLinkedWorkItemsTreePartProvider: WorkItemLinkedWorkItemsTreePartProvider;
  #pinnedWorkItemQueryLeafTreePartProvider: PinnedWorkItemQueryLeafTreePartProvider;
  #accountTreePartProvider: AccountTreePartProvider;
  #currentSprintScopeContentTreePartProvider: CurrentSprintScopeContentTreePartProvider;
  #hierarchyRootContentTreePartProvider: HierarchyRootContentTreePartProvider;
  #workItemHistoryTreePartProvider: WorkItemHistoryTreePartProvider;
  #pinnedWorkItemTeamTreePartProvider: PinnedWorkItemTeamTreePartProvider;
  #workItemLinkedWorkItemGroupsTreePartProvider: WorkItemLinkedWorkItemGroupsTreePartProvider;

  #mentionedTreeItem: Constructor<MentionedTreeItem>;
  #recentlyModifiedByMeTreeItem: Constructor<RecentlyModifiedByMeTreeItem>;
  #workItemLinkedPullRequestsTreeItem: Constructor<WorkItemLinkedPullRequestsTreeItem>;
  #workItemCommentsTreeItem: Constructor<WorkItemCommentsTreeItem>;
  #assignedToMeTreeItem: Constructor<AssignedToMeTreeItem>;
  #workItemLinkedCommitsTreeItem: Constructor<WorkItemLinkedCommitsTreeItem>;
  #workItemBacklogTreeItem: Constructor<WorkItemBacklogTreeItem>;
  #workItemLinkedBuildsTreeItem: Constructor<WorkItemLinkedBuildsTreeItem>;
  #workItemLinkedBranchesTreeItem: Constructor<WorkItemLinkedBranchesTreeItem>;
  #workItemAttachmentsTreeItem: Constructor<WorkItemAttachmentsTreeItem>;

  myWorkStaticTreePartProvider: TreePartProvider<any, any> | undefined;
  workItemRootCombiningTreePartProvider: TreePartProvider<any, any> | undefined;
  backlogStaticTreePartProvider: TreePartProvider<any, any> | undefined;
  workItemContentsCombiningTreePartProvider: TreePartProvider<any, any> | undefined;
  teamContentsCombiningTreePartProvider: TreePartProvider<any, any> | undefined;
  areaPathNodeCombiningTreePartProvider: TreePartProvider<any, any> | undefined;
  projectUnwrappingTreePartProvider: TreePartProvider<any, any> | undefined;
  accountRootUnwrappingTreePartProvider: TreePartProvider<any, any> | undefined;
  workItemDetailStaticTreePartProvider: TreePartProvider<any, any> | undefined;
  currentSprintUnwrappingTreePartProvider: TreePartProvider<any, any> | undefined;

  constructor(
    @inject(types.SettingsService) settingsService: SettingsService,
    @inject(types.AllTeamsTreePartProvider) allTeamsTreePartProvider: AllTeamsTreePartProvider,
    @inject(types.WorkItemLinkedPullRequestsTreePartProvider) workItemLinkedPullRequestsTreePartProvider: WorkItemLinkedPullRequestsTreePartProvider,
    @inject(types.AreaPathChildrenTreePartProvider) areaPathChildrenTreePartProvider: AreaPathChildrenTreePartProvider,
    @inject(types.WorkItemLinkedCommitsTreePartProvider) workItemLinkedCommitsTreePartProvider: WorkItemLinkedCommitsTreePartProvider,
    @inject(types.WorkItemLinkedBuildsTreePartProvider) workItemLinkedBuildsTreePartProvider: WorkItemLinkedBuildsTreePartProvider,
    @inject(types.CurrentSprintScopeTreePartProvider) currentSprintScopeTreePartProvider: CurrentSprintScopeTreePartProvider,
    @inject(types.WorkItemLinkedBranchesTreePartProvider) workItemLinkedBranchesTreePartProvider: WorkItemLinkedBranchesTreePartProvider,
    @inject(types.QueriesContentTreePartProvider) queriesContentTreePartProvider: QueriesContentTreePartProvider,
    @inject(types.AreaPathsContentTreePartProvider) areaPathsContentTreePartProvider: AreaPathsContentTreePartProvider,
    @inject(types.AssignedToMeTreePartProvider) assignedToMeTreePartProvider: AssignedToMeTreePartProvider,
    @inject(types.CurrentSprintGroupWorkItemTreePartProvider) currentSprintGroupWorkItemTreePartProvider: CurrentSprintGroupWorkItemTreePartProvider,
    @inject(types.BacklogContentTreePartProvider) backlogContentTreePartProvider: BacklogContentTreePartProvider,
    @inject(types.QueryFolderChildrenTreePartProvider) queryFolderChildrenTreePartProvider: QueryFolderChildrenTreePartProvider,
    @inject(types.QueryResultsTreePartProvider) queryResultsTreePartProvider: QueryResultsTreePartProvider,
    @inject(types.MentionedTreePartProvider) mentionedTreePartProvider: MentionedTreePartProvider,
    @inject(types.CurrentSprintTreePartProvider) currentSprintTreePartProvider: CurrentSprintTreePartProvider,
    @inject(types.AttachmentTreePartProvider) attachmentTreePartProvider: AttachmentTreePartProvider,
    @inject(types.MyTeamsTreePartProvider) myTeamsTreePartProvider: MyTeamsTreePartProvider,
    @inject(types.WorkItemRevisionFieldsTreePartProvider) workItemRevisionFieldsTreePartProvider: WorkItemRevisionFieldsTreePartProvider,
    @inject(types.ProjectRootTreePartProvider) projectRootTreePartProvider: ProjectRootTreePartProvider,
    @inject(types.RecentlyModifiedByMeTreePartProvider) recentlyModifiedByMeTreePartProvider: RecentlyModifiedByMeTreePartProvider,
    @inject(types.PinnedWorkItemAreaPathTreePartProvider) pinnedWorkItemAreaPathTreePartProvider: PinnedWorkItemAreaPathTreePartProvider,
    @inject(types.HierarchyChildrenTreePartProvider) hierarchyChildrenTreePartProvider: HierarchyChildrenTreePartProvider,
    @inject(types.ProjectTreePartProvider) projectTreePartProvider: ProjectTreePartProvider,
    @inject(types.PinnedWorkItemTreePartProvider) pinnedWorkItemTreePartProvider: PinnedWorkItemTreePartProvider,
    @inject(types.AreaPathHierarchyRootTreePartProvider) areaPathHierarchyRootTreePartProvider: AreaPathHierarchyRootTreePartProvider,
    @inject(types.WorkItemCommentsTreePartProvider) workItemCommentsTreePartProvider: WorkItemCommentsTreePartProvider,
    @inject(types.WorkItemLinkedWorkItemsTreePartProvider) workItemLinkedWorkItemsTreePartProvider: WorkItemLinkedWorkItemsTreePartProvider,
    @inject(types.PinnedWorkItemQueryLeafTreePartProvider) pinnedWorkItemQueryLeafTreePartProvider: PinnedWorkItemQueryLeafTreePartProvider,
    @inject(types.AccountTreePartProvider) accountTreePartProvider: AccountTreePartProvider,
    @inject(types.CurrentSprintScopeContentTreePartProvider) currentSprintScopeContentTreePartProvider: CurrentSprintScopeContentTreePartProvider,
    @inject(types.HierarchyRootContentTreePartProvider) hierarchyRootContentTreePartProvider: HierarchyRootContentTreePartProvider,
    @inject(types.WorkItemHistoryTreePartProvider) workItemHistoryTreePartProvider: WorkItemHistoryTreePartProvider,
    @inject(types.PinnedWorkItemTeamTreePartProvider) pinnedWorkItemTeamTreePartProvider: PinnedWorkItemTeamTreePartProvider,
    @inject(types.WorkItemLinkedWorkItemGroupsTreePartProvider) workItemLinkedWorkItemGroupsTreePartProvider: WorkItemLinkedWorkItemGroupsTreePartProvider,
    @inject(types.MentionedTreeItem) mentionedTreeItem: Constructor<MentionedTreeItem>,
    @inject(types.RecentlyModifiedByMeTreeItem) recentlyModifiedByMeTreeItem: Constructor<RecentlyModifiedByMeTreeItem>,
    @inject(types.WorkItemLinkedPullRequestsTreeItem) workItemLinkedPullRequestsTreeItem: Constructor<WorkItemLinkedPullRequestsTreeItem>,
    @inject(types.WorkItemCommentsTreeItem) workItemCommentsTreeItem: Constructor<WorkItemCommentsTreeItem>,
    @inject(types.AssignedToMeTreeItem) assignedToMeTreeItem: Constructor<AssignedToMeTreeItem>,
    @inject(types.WorkItemLinkedCommitsTreeItem) workItemLinkedCommitsTreeItem: Constructor<WorkItemLinkedCommitsTreeItem>,
    @inject(types.WorkItemBacklogTreeItem) workItemBacklogTreeItem: Constructor<WorkItemBacklogTreeItem>,
    @inject(types.WorkItemLinkedBuildsTreeItem) workItemLinkedBuildsTreeItem: Constructor<WorkItemLinkedBuildsTreeItem>,
    @inject(types.WorkItemLinkedBranchesTreeItem) workItemLinkedBranchesTreeItem: Constructor<WorkItemLinkedBranchesTreeItem>,
    @inject(types.WorkItemAttachmentsTreeItem) workItemAttachmentsTreeItem: Constructor<WorkItemAttachmentsTreeItem>,
  ) {
    this.#settingsService = settingsService;
    this.#allTeamsTreePartProvider = allTeamsTreePartProvider;
    this.#workItemLinkedPullRequestsTreePartProvider = workItemLinkedPullRequestsTreePartProvider;
    this.#areaPathChildrenTreePartProvider = areaPathChildrenTreePartProvider;
    this.#workItemLinkedCommitsTreePartProvider = workItemLinkedCommitsTreePartProvider;
    this.#workItemLinkedBuildsTreePartProvider = workItemLinkedBuildsTreePartProvider;
    this.#currentSprintScopeTreePartProvider = currentSprintScopeTreePartProvider;
    this.#workItemLinkedBranchesTreePartProvider = workItemLinkedBranchesTreePartProvider;
    this.#queriesContentTreePartProvider = queriesContentTreePartProvider;
    this.#areaPathsContentTreePartProvider = areaPathsContentTreePartProvider;
    this.#assignedToMeTreePartProvider = assignedToMeTreePartProvider;
    this.#currentSprintGroupWorkItemTreePartProvider = currentSprintGroupWorkItemTreePartProvider;
    this.#backlogContentTreePartProvider = backlogContentTreePartProvider;
    this.#queryFolderChildrenTreePartProvider = queryFolderChildrenTreePartProvider;
    this.#queryResultsTreePartProvider = queryResultsTreePartProvider;
    this.#mentionedTreePartProvider = mentionedTreePartProvider;
    this.#currentSprintTreePartProvider = currentSprintTreePartProvider;
    this.#attachmentTreePartProvider = attachmentTreePartProvider;
    this.#myTeamsTreePartProvider = myTeamsTreePartProvider;
    this.#workItemRevisionFieldsTreePartProvider = workItemRevisionFieldsTreePartProvider;
    this.#projectRootTreePartProvider = projectRootTreePartProvider;
    this.#recentlyModifiedByMeTreePartProvider = recentlyModifiedByMeTreePartProvider;
    this.#pinnedWorkItemAreaPathTreePartProvider = pinnedWorkItemAreaPathTreePartProvider;
    this.#hierarchyChildrenTreePartProvider = hierarchyChildrenTreePartProvider;
    this.#projectTreePartProvider = projectTreePartProvider;
    this.#pinnedWorkItemTreePartProvider = pinnedWorkItemTreePartProvider;
    this.#areaPathHierarchyRootTreePartProvider = areaPathHierarchyRootTreePartProvider;
    this.#workItemCommentsTreePartProvider = workItemCommentsTreePartProvider;
    this.#workItemLinkedWorkItemsTreePartProvider = workItemLinkedWorkItemsTreePartProvider;
    this.#pinnedWorkItemQueryLeafTreePartProvider = pinnedWorkItemQueryLeafTreePartProvider;
    this.#accountTreePartProvider = accountTreePartProvider;
    this.#currentSprintScopeContentTreePartProvider = currentSprintScopeContentTreePartProvider;
    this.#hierarchyRootContentTreePartProvider = hierarchyRootContentTreePartProvider;
    this.#workItemHistoryTreePartProvider = workItemHistoryTreePartProvider;
    this.#pinnedWorkItemTeamTreePartProvider = pinnedWorkItemTeamTreePartProvider;
    this.#workItemLinkedWorkItemGroupsTreePartProvider = workItemLinkedWorkItemGroupsTreePartProvider;
    this.#mentionedTreeItem = mentionedTreeItem;
    this.#recentlyModifiedByMeTreeItem = recentlyModifiedByMeTreeItem;
    this.#workItemLinkedPullRequestsTreeItem = workItemLinkedPullRequestsTreeItem;
    this.#workItemCommentsTreeItem = workItemCommentsTreeItem;
    this.#assignedToMeTreeItem = assignedToMeTreeItem;
    this.#workItemLinkedCommitsTreeItem = workItemLinkedCommitsTreeItem;
    this.#workItemBacklogTreeItem = workItemBacklogTreeItem;
    this.#workItemLinkedBuildsTreeItem = workItemLinkedBuildsTreeItem;
    this.#workItemLinkedBranchesTreeItem = workItemLinkedBranchesTreeItem;
    this.#workItemAttachmentsTreeItem = workItemAttachmentsTreeItem;
  }


  @postConstruct()
  private initializeWorkItemTreeProvider() {
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
    this.areaPathNodeCombiningTreePartProvider = new CombiningTreePartProvider({
      areaPathChildren: this.#areaPathChildrenTreePartProvider,
      hierarchy: this.#areaPathHierarchyRootTreePartProvider,
    });
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
    this.currentSprintUnwrappingTreePartProvider = new UnwrappingTreePartProvider(
      this.#currentSprintTreePartProvider,
      (items) => of(items.size === 1 && !items.has('exception')),
      () => this.#currentSprintScopeTreePartProvider,
    );
    this.workItemRootCombiningTreePartProvider = new CombiningTreePartProvider({
      pinnedWorkItems: this.#pinnedWorkItemTreePartProvider,
      pinnedAreaPaths: this.#pinnedWorkItemAreaPathTreePartProvider,
      pinnedTeams: this.#pinnedWorkItemTeamTreePartProvider,
      pinnedQueries: this.#pinnedWorkItemQueryLeafTreePartProvider,
      accounts: this.accountRootUnwrappingTreePartProvider,
    });
    this.workItemContentsCombiningTreePartProvider = new CombiningTreePartProvider({
      children: this.#hierarchyChildrenTreePartProvider,
      details: this.workItemDetailStaticTreePartProvider,
      linkedWorkItemGroups: this.#workItemLinkedWorkItemGroupsTreePartProvider,
    });
    this.teamContentsCombiningTreePartProvider = new CombiningTreePartProvider({
      sprints: this.currentSprintUnwrappingTreePartProvider,
      backlog: this.backlogStaticTreePartProvider,
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

  #projectTreePartProvider: ProjectTreePartProvider;
  #accountTreePartProvider: AccountTreePartProvider;


  projectUnwrappingTreePartProvider: TreePartProvider<any, any> | undefined;
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

  #projectTreePartProvider: ProjectTreePartProvider;
  #accountTreePartProvider: AccountTreePartProvider;


  projectUnwrappingTreePartProvider: TreePartProvider<any, any> | undefined;
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

  #pinnedAgentPoolTreePartProvider: PinnedAgentPoolTreePartProvider;
  #projectTreePartProvider: ProjectTreePartProvider;
  #agentPoolTreePartProvider: AgentPoolTreePartProvider;
  #agentTreePartProvider: AgentTreePartProvider;
  #agentJobTreePartProvider: AgentJobTreePartProvider;
  #accountTreePartProvider: AccountTreePartProvider;
  #pinnedAgentTreePartProvider: PinnedAgentTreePartProvider;

  #jobsContainerTreeItem: Constructor<JobsContainerTreeItem>;
  #agentsContainerTreeItem: Constructor<AgentsContainerTreeItem>;
  #agentJobsContainerTreeItem: Constructor<AgentJobsContainerTreeItem>;

  agentsRootCombiningTreePartProvider: TreePartProvider<any, any> | undefined;
  agentPoolChildrenStaticTreePartProvider: TreePartProvider<any, any> | undefined;
  projectUnwrappingTreePartProvider: TreePartProvider<any, any> | undefined;
  accountRootUnwrappingTreePartProvider: TreePartProvider<any, any> | undefined;
  agentChildrenStaticTreePartProvider: TreePartProvider<any, any> | undefined;

  constructor(
    @inject(types.SettingsService) settingsService: SettingsService,
    @inject(types.PinnedAgentPoolTreePartProvider) pinnedAgentPoolTreePartProvider: PinnedAgentPoolTreePartProvider,
    @inject(types.ProjectTreePartProvider) projectTreePartProvider: ProjectTreePartProvider,
    @inject(types.AgentPoolTreePartProvider) agentPoolTreePartProvider: AgentPoolTreePartProvider,
    @inject(types.AgentTreePartProvider) agentTreePartProvider: AgentTreePartProvider,
    @inject(types.AgentJobTreePartProvider) agentJobTreePartProvider: AgentJobTreePartProvider,
    @inject(types.AccountTreePartProvider) accountTreePartProvider: AccountTreePartProvider,
    @inject(types.PinnedAgentTreePartProvider) pinnedAgentTreePartProvider: PinnedAgentTreePartProvider,
    @inject(types.JobsContainerTreeItem) jobsContainerTreeItem: Constructor<JobsContainerTreeItem>,
    @inject(types.AgentsContainerTreeItem) agentsContainerTreeItem: Constructor<AgentsContainerTreeItem>,
    @inject(types.AgentJobsContainerTreeItem) agentJobsContainerTreeItem: Constructor<AgentJobsContainerTreeItem>,
  ) {
    this.#settingsService = settingsService;
    this.#pinnedAgentPoolTreePartProvider = pinnedAgentPoolTreePartProvider;
    this.#projectTreePartProvider = projectTreePartProvider;
    this.#agentPoolTreePartProvider = agentPoolTreePartProvider;
    this.#agentTreePartProvider = agentTreePartProvider;
    this.#agentJobTreePartProvider = agentJobTreePartProvider;
    this.#accountTreePartProvider = accountTreePartProvider;
    this.#pinnedAgentTreePartProvider = pinnedAgentTreePartProvider;
    this.#jobsContainerTreeItem = jobsContainerTreeItem;
    this.#agentsContainerTreeItem = agentsContainerTreeItem;
    this.#agentJobsContainerTreeItem = agentJobsContainerTreeItem;
  }


  @postConstruct()
  private initializeAgentsTreeProvider() {
    this.agentPoolChildrenStaticTreePartProvider = new StaticTreePartProvider({
      jobs: {
        treeItem: this.#jobsContainerTreeItem,
      },
      agents: {
        treeItem: this.#agentsContainerTreeItem,
      },
    });
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
    this.agentChildrenStaticTreePartProvider = new StaticTreePartProvider({
      jobs: {
        treeItem: this.#agentJobsContainerTreeItem,
      },
    });
    this.agentsRootCombiningTreePartProvider = new CombiningTreePartProvider({
      pinnedAgentPools: this.#pinnedAgentPoolTreePartProvider,
      pinnedAgents: this.#pinnedAgentTreePartProvider,
      accounts: this.accountRootUnwrappingTreePartProvider,
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
