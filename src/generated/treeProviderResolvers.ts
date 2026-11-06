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
import { SwitchingTreePartProvider } from "../common/treePartProvider/SwitchingTreePartProvider";
import { selectSignInStatus } from "../modules/core/selectSignInStatus";
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
import { GitRepositoryPullRequestCommentThreadTreePartProvider } from "../modules/repository/treePartProviders/GitRepositoryPullRequestCommentThreadTreePartProvider";
import { PipelineRunTimelineTreePartProvider } from "../modules/pipeline/treePartProviders/PipelineRunTimelineTreePartProvider";
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
import { HierarchyRootContentTreePartProvider } from "../modules/workItem/treePartProviders/HierarchyRootContentTreePartProvider";
import { PinnedWorkItemAreaPathTreePartProvider } from "../modules/workItem/treePartProviders/PinnedWorkItemAreaPathTreePartProvider";
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
import { CurrentSprintGroupWorkItemTreePartProvider } from "../modules/workItem/treePartProviders/CurrentSprintGroupWorkItemTreePartProvider";
import { AgentJobTreePartProvider } from "../modules/agents/treePartProviders/AgentJobTreePartProvider";
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
import { HierarchyChildrenTreePartProvider } from "../modules/workItem/treePartProviders/HierarchyChildrenTreePartProvider";
import { GitRepositoryTagTreePartProvider } from "../modules/repository/treePartProviders/GitRepositoryTagTreePartProvider";
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
import { GitRepositoryCommitTreePartProvider } from "../modules/repository/treePartProviders/GitRepositoryCommitTreePartProvider";
import { WorkItemLinkedBuildsTreePartProvider } from "../modules/workItem/treePartProviders/WorkItemLinkedBuildsTreePartProvider";
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
import { PipelineFolderTreeItem } from "../modules/pipeline/treeItems/PipelineFolderTreeItem";
import { WorkItemQueryFolderTreeItem } from "../modules/workItem/treeItems/WorkItemQueryFolderTreeItem";
import { PinnedWorkItemTreePartProvider } from "../modules/workItem/treePartProviders/PinnedWorkItemTreePartProvider";
import { PipelineRunTreePartProvider } from "../modules/pipeline/treePartProviders/PipelineRunTreePartProvider";
import { WorkItemCurrentSprintUnassignedScopeTreeItem } from "../modules/workItem/treeItems/WorkItemCurrentSprintUnassignedScopeTreeItem";
import { PinnedWorkItemTeamTreePartProvider } from "../modules/workItem/treePartProviders/PinnedWorkItemTeamTreePartProvider";


@injectable()
export class RepositoryTreeProviderResolver {
  #settingsService: SettingsService;

  #gitRepositoryItemTreePartProvider: GitRepositoryItemTreePartProvider;
  #workItemRevisionFieldsTreePartProvider: WorkItemRevisionFieldsTreePartProvider;
  #workItemLinkedWorkItemsTreePartProvider: WorkItemLinkedWorkItemsTreePartProvider;
  #workItemLinkedWorkItemGroupsTreePartProvider: WorkItemLinkedWorkItemGroupsTreePartProvider;
  #workItemLinkedBuildsTreePartProvider: WorkItemLinkedBuildsTreePartProvider;
  #gitRepositoryPullRequestStatusTreePartProvider: GitRepositoryPullRequestStatusTreePartProvider;
  #gitRepositoryPullRequestReviewerTreePartProvider: GitRepositoryPullRequestReviewerTreePartProvider;
  #workItemLinkedBranchesTreePartProvider: WorkItemLinkedBranchesTreePartProvider;
  #gitRepositoryPullRequestWorkItemTreePartProvider: GitRepositoryPullRequestWorkItemTreePartProvider;
  #workItemLinkedPullRequestsTreePartProvider: WorkItemLinkedPullRequestsTreePartProvider;
  #pinnedGitRepositoryTreePartProvider: PinnedGitRepositoryTreePartProvider;
  #projectTreePartProvider: ProjectTreePartProvider;
  #gitRepositoryTagTreePartProvider: GitRepositoryTagTreePartProvider;
  #gitRepositoryTreePartProvider: GitRepositoryTreePartProvider;
  #gitRepositoryPullRequestCommentThreadTreePartProvider: GitRepositoryPullRequestCommentThreadTreePartProvider;
  #attachmentTreePartProvider: AttachmentTreePartProvider;
  #gitRepositoryCommitTreePartProvider: GitRepositoryCommitTreePartProvider;
  #workItemCommentsTreePartProvider: WorkItemCommentsTreePartProvider;
  #pinnedGitRepositoryPullRequestTreePartProvider: PinnedGitRepositoryPullRequestTreePartProvider;
  #workItemLinkedCommitsTreePartProvider: WorkItemLinkedCommitsTreePartProvider;
  #gitRepositoryPullRequestTreePartProvider: GitRepositoryPullRequestTreePartProvider;
  #accountTreePartProvider: AccountTreePartProvider;
  #workItemHistoryTreePartProvider: WorkItemHistoryTreePartProvider;
  #hierarchyChildrenTreePartProvider: HierarchyChildrenTreePartProvider;
  #gitRepositoryBranchTreePartProvider: GitRepositoryBranchTreePartProvider;

  #workItemLinkedCommitsTreeItem: Constructor<WorkItemLinkedCommitsTreeItem>;
  #workItemLinkedBuildsTreeItem: Constructor<WorkItemLinkedBuildsTreeItem>;
  #workItemAttachmentsTreeItem: Constructor<WorkItemAttachmentsTreeItem>;
  #gitRepositoryPullRequestReviewersTreeItem: Constructor<GitRepositoryPullRequestReviewersTreeItem>;
  #workItemLinkedPullRequestsTreeItem: Constructor<WorkItemLinkedPullRequestsTreeItem>;
  #workItemLinkedBranchesTreeItem: Constructor<WorkItemLinkedBranchesTreeItem>;
  #gitRepositoryTagsTreeItem: Constructor<GitRepositoryTagsTreeItem>;
  #gitRepositoryItemsTreeItem: Constructor<GitRepositoryItemsTreeItem>;
  #workItemCommentsTreeItem: Constructor<WorkItemCommentsTreeItem>;
  #gitRepositoryCommitsTreeItem: Constructor<GitRepositoryCommitsTreeItem>;
  #gitRepositoryPullRequestsTreeItem: Constructor<GitRepositoryPullRequestsTreeItem>;
  #gitRepositoryBranchesTreeItem: Constructor<GitRepositoryBranchesTreeItem>;

  gitRepositoryBranchDetailStaticTreePartProvider: TreePartProvider<any, any> | undefined;
  accountRootUnwrappingTreePartProvider: TreePartProvider<any, any> | undefined;
  workItemContentsCombiningTreePartProvider: TreePartProvider<any, any> | undefined;
  gitRepositoryDetailStaticTreePartProvider: TreePartProvider<any, any> | undefined;
  gitRepositoryCommitDetailStaticTreePartProvider: TreePartProvider<any, any> | undefined;
  projectSignInSwitchingTreePartProvider: TreePartProvider<any, any> | undefined;
  projectUnwrappingTreePartProvider: TreePartProvider<any, any> | undefined;
  gitRepositoryPullRequestReviewersStaticTreePartProvider: TreePartProvider<any, any> | undefined;
  repositoryRootCombiningTreePartProvider: TreePartProvider<any, any> | undefined;
  workItemDetailStaticTreePartProvider: TreePartProvider<any, any> | undefined;
  gitRepositoryPullRequestContentCombiningTreePartProvider: TreePartProvider<any, any> | undefined;
  repositoryRootDeduplicatingTreePartProvider: TreePartProvider<any, any> | undefined;

  constructor(
    @inject(types.SettingsService) settingsService: SettingsService,
    @inject(types.GitRepositoryItemTreePartProvider) gitRepositoryItemTreePartProvider: GitRepositoryItemTreePartProvider,
    @inject(types.WorkItemRevisionFieldsTreePartProvider) workItemRevisionFieldsTreePartProvider: WorkItemRevisionFieldsTreePartProvider,
    @inject(types.WorkItemLinkedWorkItemsTreePartProvider) workItemLinkedWorkItemsTreePartProvider: WorkItemLinkedWorkItemsTreePartProvider,
    @inject(types.WorkItemLinkedWorkItemGroupsTreePartProvider) workItemLinkedWorkItemGroupsTreePartProvider: WorkItemLinkedWorkItemGroupsTreePartProvider,
    @inject(types.WorkItemLinkedBuildsTreePartProvider) workItemLinkedBuildsTreePartProvider: WorkItemLinkedBuildsTreePartProvider,
    @inject(types.GitRepositoryPullRequestStatusTreePartProvider) gitRepositoryPullRequestStatusTreePartProvider: GitRepositoryPullRequestStatusTreePartProvider,
    @inject(types.GitRepositoryPullRequestReviewerTreePartProvider) gitRepositoryPullRequestReviewerTreePartProvider: GitRepositoryPullRequestReviewerTreePartProvider,
    @inject(types.WorkItemLinkedBranchesTreePartProvider) workItemLinkedBranchesTreePartProvider: WorkItemLinkedBranchesTreePartProvider,
    @inject(types.GitRepositoryPullRequestWorkItemTreePartProvider) gitRepositoryPullRequestWorkItemTreePartProvider: GitRepositoryPullRequestWorkItemTreePartProvider,
    @inject(types.WorkItemLinkedPullRequestsTreePartProvider) workItemLinkedPullRequestsTreePartProvider: WorkItemLinkedPullRequestsTreePartProvider,
    @inject(types.PinnedGitRepositoryTreePartProvider) pinnedGitRepositoryTreePartProvider: PinnedGitRepositoryTreePartProvider,
    @inject(types.ProjectTreePartProvider) projectTreePartProvider: ProjectTreePartProvider,
    @inject(types.GitRepositoryTagTreePartProvider) gitRepositoryTagTreePartProvider: GitRepositoryTagTreePartProvider,
    @inject(types.GitRepositoryTreePartProvider) gitRepositoryTreePartProvider: GitRepositoryTreePartProvider,
    @inject(types.GitRepositoryPullRequestCommentThreadTreePartProvider) gitRepositoryPullRequestCommentThreadTreePartProvider: GitRepositoryPullRequestCommentThreadTreePartProvider,
    @inject(types.AttachmentTreePartProvider) attachmentTreePartProvider: AttachmentTreePartProvider,
    @inject(types.GitRepositoryCommitTreePartProvider) gitRepositoryCommitTreePartProvider: GitRepositoryCommitTreePartProvider,
    @inject(types.WorkItemCommentsTreePartProvider) workItemCommentsTreePartProvider: WorkItemCommentsTreePartProvider,
    @inject(types.PinnedGitRepositoryPullRequestTreePartProvider) pinnedGitRepositoryPullRequestTreePartProvider: PinnedGitRepositoryPullRequestTreePartProvider,
    @inject(types.WorkItemLinkedCommitsTreePartProvider) workItemLinkedCommitsTreePartProvider: WorkItemLinkedCommitsTreePartProvider,
    @inject(types.GitRepositoryPullRequestTreePartProvider) gitRepositoryPullRequestTreePartProvider: GitRepositoryPullRequestTreePartProvider,
    @inject(types.AccountTreePartProvider) accountTreePartProvider: AccountTreePartProvider,
    @inject(types.WorkItemHistoryTreePartProvider) workItemHistoryTreePartProvider: WorkItemHistoryTreePartProvider,
    @inject(types.HierarchyChildrenTreePartProvider) hierarchyChildrenTreePartProvider: HierarchyChildrenTreePartProvider,
    @inject(types.GitRepositoryBranchTreePartProvider) gitRepositoryBranchTreePartProvider: GitRepositoryBranchTreePartProvider,
    @inject(types.WorkItemLinkedCommitsTreeItem) workItemLinkedCommitsTreeItem: Constructor<WorkItemLinkedCommitsTreeItem>,
    @inject(types.WorkItemLinkedBuildsTreeItem) workItemLinkedBuildsTreeItem: Constructor<WorkItemLinkedBuildsTreeItem>,
    @inject(types.WorkItemAttachmentsTreeItem) workItemAttachmentsTreeItem: Constructor<WorkItemAttachmentsTreeItem>,
    @inject(types.GitRepositoryPullRequestReviewersTreeItem) gitRepositoryPullRequestReviewersTreeItem: Constructor<GitRepositoryPullRequestReviewersTreeItem>,
    @inject(types.WorkItemLinkedPullRequestsTreeItem) workItemLinkedPullRequestsTreeItem: Constructor<WorkItemLinkedPullRequestsTreeItem>,
    @inject(types.WorkItemLinkedBranchesTreeItem) workItemLinkedBranchesTreeItem: Constructor<WorkItemLinkedBranchesTreeItem>,
    @inject(types.GitRepositoryTagsTreeItem) gitRepositoryTagsTreeItem: Constructor<GitRepositoryTagsTreeItem>,
    @inject(types.GitRepositoryItemsTreeItem) gitRepositoryItemsTreeItem: Constructor<GitRepositoryItemsTreeItem>,
    @inject(types.WorkItemCommentsTreeItem) workItemCommentsTreeItem: Constructor<WorkItemCommentsTreeItem>,
    @inject(types.GitRepositoryCommitsTreeItem) gitRepositoryCommitsTreeItem: Constructor<GitRepositoryCommitsTreeItem>,
    @inject(types.GitRepositoryPullRequestsTreeItem) gitRepositoryPullRequestsTreeItem: Constructor<GitRepositoryPullRequestsTreeItem>,
    @inject(types.GitRepositoryBranchesTreeItem) gitRepositoryBranchesTreeItem: Constructor<GitRepositoryBranchesTreeItem>,
  ) {
    this.#settingsService = settingsService;
    this.#gitRepositoryItemTreePartProvider = gitRepositoryItemTreePartProvider;
    this.#workItemRevisionFieldsTreePartProvider = workItemRevisionFieldsTreePartProvider;
    this.#workItemLinkedWorkItemsTreePartProvider = workItemLinkedWorkItemsTreePartProvider;
    this.#workItemLinkedWorkItemGroupsTreePartProvider = workItemLinkedWorkItemGroupsTreePartProvider;
    this.#workItemLinkedBuildsTreePartProvider = workItemLinkedBuildsTreePartProvider;
    this.#gitRepositoryPullRequestStatusTreePartProvider = gitRepositoryPullRequestStatusTreePartProvider;
    this.#gitRepositoryPullRequestReviewerTreePartProvider = gitRepositoryPullRequestReviewerTreePartProvider;
    this.#workItemLinkedBranchesTreePartProvider = workItemLinkedBranchesTreePartProvider;
    this.#gitRepositoryPullRequestWorkItemTreePartProvider = gitRepositoryPullRequestWorkItemTreePartProvider;
    this.#workItemLinkedPullRequestsTreePartProvider = workItemLinkedPullRequestsTreePartProvider;
    this.#pinnedGitRepositoryTreePartProvider = pinnedGitRepositoryTreePartProvider;
    this.#projectTreePartProvider = projectTreePartProvider;
    this.#gitRepositoryTagTreePartProvider = gitRepositoryTagTreePartProvider;
    this.#gitRepositoryTreePartProvider = gitRepositoryTreePartProvider;
    this.#gitRepositoryPullRequestCommentThreadTreePartProvider = gitRepositoryPullRequestCommentThreadTreePartProvider;
    this.#attachmentTreePartProvider = attachmentTreePartProvider;
    this.#gitRepositoryCommitTreePartProvider = gitRepositoryCommitTreePartProvider;
    this.#workItemCommentsTreePartProvider = workItemCommentsTreePartProvider;
    this.#pinnedGitRepositoryPullRequestTreePartProvider = pinnedGitRepositoryPullRequestTreePartProvider;
    this.#workItemLinkedCommitsTreePartProvider = workItemLinkedCommitsTreePartProvider;
    this.#gitRepositoryPullRequestTreePartProvider = gitRepositoryPullRequestTreePartProvider;
    this.#accountTreePartProvider = accountTreePartProvider;
    this.#workItemHistoryTreePartProvider = workItemHistoryTreePartProvider;
    this.#hierarchyChildrenTreePartProvider = hierarchyChildrenTreePartProvider;
    this.#gitRepositoryBranchTreePartProvider = gitRepositoryBranchTreePartProvider;
    this.#workItemLinkedCommitsTreeItem = workItemLinkedCommitsTreeItem;
    this.#workItemLinkedBuildsTreeItem = workItemLinkedBuildsTreeItem;
    this.#workItemAttachmentsTreeItem = workItemAttachmentsTreeItem;
    this.#gitRepositoryPullRequestReviewersTreeItem = gitRepositoryPullRequestReviewersTreeItem;
    this.#workItemLinkedPullRequestsTreeItem = workItemLinkedPullRequestsTreeItem;
    this.#workItemLinkedBranchesTreeItem = workItemLinkedBranchesTreeItem;
    this.#gitRepositoryTagsTreeItem = gitRepositoryTagsTreeItem;
    this.#gitRepositoryItemsTreeItem = gitRepositoryItemsTreeItem;
    this.#workItemCommentsTreeItem = workItemCommentsTreeItem;
    this.#gitRepositoryCommitsTreeItem = gitRepositoryCommitsTreeItem;
    this.#gitRepositoryPullRequestsTreeItem = gitRepositoryPullRequestsTreeItem;
    this.#gitRepositoryBranchesTreeItem = gitRepositoryBranchesTreeItem;
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
    this.gitRepositoryCommitDetailStaticTreePartProvider = new StaticTreePartProvider({
      items: {
        treeItem: this.#gitRepositoryItemsTreeItem,
      },
    });
    this.projectSignInSwitchingTreePartProvider = new SwitchingTreePartProvider(selectSignInStatus, {
      signedIn: this.#projectTreePartProvider,
    });
    this.projectUnwrappingTreePartProvider = new UnwrappingTreePartProvider(
      this.projectSignInSwitchingTreePartProvider,
      shouldUnwrapAccountOrProject(this.#settingsService.unwrapProjects()),
      (i) => this.getTreePartProvider(i),
    );
    this.gitRepositoryPullRequestReviewersStaticTreePartProvider = new StaticTreePartProvider({
      reviewers: {
        treeItem: this.#gitRepositoryPullRequestReviewersTreeItem,
      },
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

  #pipelineTreePartProvider: PipelineTreePartProvider;
  #pipelineRunTreePartProvider: PipelineRunTreePartProvider;
  #pipelineRunTimelineTreePartProvider: PipelineRunTimelineTreePartProvider;
  #accountTreePartProvider: AccountTreePartProvider;
  #projectTreePartProvider: ProjectTreePartProvider;
  #pinnedPipelineTreePartProvider: PinnedPipelineTreePartProvider;
  #pipelineFolderTreePartProvider: PipelineFolderTreePartProvider;
  #pinnedPipelineFolderTreePartProvider: PinnedPipelineFolderTreePartProvider;
  #pipelineRunArtifactTreePartProvider: PipelineRunArtifactTreePartProvider;

  #pipelineArtifactsTreeItem: Constructor<PipelineArtifactsTreeItem>;

  accountRootUnwrappingTreePartProvider: TreePartProvider<any, any> | undefined;
  projectSignInSwitchingTreePartProvider: TreePartProvider<any, any> | undefined;
  projectUnwrappingTreePartProvider: TreePartProvider<any, any> | undefined;
  pipelineRunDetailCombiningTreePartProvider: TreePartProvider<any, any> | undefined;
  pipelineRunArtifactsStaticTreePartProvider: TreePartProvider<any, any> | undefined;
  pipelineFolderAndPipelineCombiningTreePartProvider: TreePartProvider<any, any> | undefined;
  pipelineRootCombiningTreePartProvider: TreePartProvider<any, any> | undefined;
  pipelineRootDeduplicatingTreePartProvider: TreePartProvider<any, any> | undefined;

  constructor(
    @inject(types.SettingsService) settingsService: SettingsService,
    @inject(types.PipelineTreePartProvider) pipelineTreePartProvider: PipelineTreePartProvider,
    @inject(types.PipelineRunTreePartProvider) pipelineRunTreePartProvider: PipelineRunTreePartProvider,
    @inject(types.PipelineRunTimelineTreePartProvider) pipelineRunTimelineTreePartProvider: PipelineRunTimelineTreePartProvider,
    @inject(types.AccountTreePartProvider) accountTreePartProvider: AccountTreePartProvider,
    @inject(types.ProjectTreePartProvider) projectTreePartProvider: ProjectTreePartProvider,
    @inject(types.PinnedPipelineTreePartProvider) pinnedPipelineTreePartProvider: PinnedPipelineTreePartProvider,
    @inject(types.PipelineFolderTreePartProvider) pipelineFolderTreePartProvider: PipelineFolderTreePartProvider,
    @inject(types.PinnedPipelineFolderTreePartProvider) pinnedPipelineFolderTreePartProvider: PinnedPipelineFolderTreePartProvider,
    @inject(types.PipelineRunArtifactTreePartProvider) pipelineRunArtifactTreePartProvider: PipelineRunArtifactTreePartProvider,
    @inject(types.PipelineArtifactsTreeItem) pipelineArtifactsTreeItem: Constructor<PipelineArtifactsTreeItem>,
  ) {
    this.#settingsService = settingsService;
    this.#pipelineTreePartProvider = pipelineTreePartProvider;
    this.#pipelineRunTreePartProvider = pipelineRunTreePartProvider;
    this.#pipelineRunTimelineTreePartProvider = pipelineRunTimelineTreePartProvider;
    this.#accountTreePartProvider = accountTreePartProvider;
    this.#projectTreePartProvider = projectTreePartProvider;
    this.#pinnedPipelineTreePartProvider = pinnedPipelineTreePartProvider;
    this.#pipelineFolderTreePartProvider = pipelineFolderTreePartProvider;
    this.#pinnedPipelineFolderTreePartProvider = pinnedPipelineFolderTreePartProvider;
    this.#pipelineRunArtifactTreePartProvider = pipelineRunArtifactTreePartProvider;
    this.#pipelineArtifactsTreeItem = pipelineArtifactsTreeItem;
  }


  @postConstruct()
  private initializePipelineTreeProvider() {
    this.projectSignInSwitchingTreePartProvider = new SwitchingTreePartProvider(selectSignInStatus, {
      signedIn: this.#projectTreePartProvider,
    });
    this.projectUnwrappingTreePartProvider = new UnwrappingTreePartProvider(
      this.projectSignInSwitchingTreePartProvider,
      shouldUnwrapAccountOrProject(this.#settingsService.unwrapProjects()),
      (i) => this.getTreePartProvider(i),
    );
    this.pipelineRunArtifactsStaticTreePartProvider = new StaticTreePartProvider({
      artifacts: {
        treeItem: this.#pipelineArtifactsTreeItem,
      },
    });
    this.pipelineFolderAndPipelineCombiningTreePartProvider = new CombiningTreePartProvider({
      pipelineFolder: this.#pipelineFolderTreePartProvider,
      pipeline: this.#pipelineTreePartProvider,
    });
    this.accountRootUnwrappingTreePartProvider = new UnwrappingTreePartProvider(
      this.#accountTreePartProvider,
      shouldUnwrapAccountOrProject(this.#settingsService.unwrapAccounts()),
      () => this.projectUnwrappingTreePartProvider,
    );
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
  #accountTreePartProvider: AccountTreePartProvider;
  #projectTreePartProvider: ProjectTreePartProvider;
  #dashboardTreePartProvider: DashboardTreePartProvider;

  #dashboardsContainerTreeItem: Constructor<DashboardsContainerTreeItem>;

  accountRootUnwrappingTreePartProvider: TreePartProvider<any, any> | undefined;
  projectSignInSwitchingTreePartProvider: TreePartProvider<any, any> | undefined;
  projectUnwrappingTreePartProvider: TreePartProvider<any, any> | undefined;
  projectDashboardsStaticTreePartProvider: TreePartProvider<any, any> | undefined;

  constructor(
    @inject(types.SettingsService) settingsService: SettingsService,
    @inject(types.DashboardWidgetTreePartProvider) dashboardWidgetTreePartProvider: DashboardWidgetTreePartProvider,
    @inject(types.AccountTreePartProvider) accountTreePartProvider: AccountTreePartProvider,
    @inject(types.ProjectTreePartProvider) projectTreePartProvider: ProjectTreePartProvider,
    @inject(types.DashboardTreePartProvider) dashboardTreePartProvider: DashboardTreePartProvider,
    @inject(types.DashboardsContainerTreeItem) dashboardsContainerTreeItem: Constructor<DashboardsContainerTreeItem>,
  ) {
    this.#settingsService = settingsService;
    this.#dashboardWidgetTreePartProvider = dashboardWidgetTreePartProvider;
    this.#accountTreePartProvider = accountTreePartProvider;
    this.#projectTreePartProvider = projectTreePartProvider;
    this.#dashboardTreePartProvider = dashboardTreePartProvider;
    this.#dashboardsContainerTreeItem = dashboardsContainerTreeItem;
  }


  @postConstruct()
  private initializeDashboardTreeProvider() {
    this.projectSignInSwitchingTreePartProvider = new SwitchingTreePartProvider(selectSignInStatus, {
      signedIn: this.#projectTreePartProvider,
    });
    this.projectUnwrappingTreePartProvider = new UnwrappingTreePartProvider(
      this.projectSignInSwitchingTreePartProvider,
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

  #recentlyModifiedByMeTreePartProvider: RecentlyModifiedByMeTreePartProvider;
  #pinnedWorkItemQueryLeafTreePartProvider: PinnedWorkItemQueryLeafTreePartProvider;
  #areaPathHierarchyRootTreePartProvider: AreaPathHierarchyRootTreePartProvider;
  #workItemRevisionFieldsTreePartProvider: WorkItemRevisionFieldsTreePartProvider;
  #workItemLinkedWorkItemsTreePartProvider: WorkItemLinkedWorkItemsTreePartProvider;
  #workItemLinkedWorkItemGroupsTreePartProvider: WorkItemLinkedWorkItemGroupsTreePartProvider;
  #workItemLinkedBuildsTreePartProvider: WorkItemLinkedBuildsTreePartProvider;
  #currentSprintScopeContentTreePartProvider: CurrentSprintScopeContentTreePartProvider;
  #areaPathChildrenTreePartProvider: AreaPathChildrenTreePartProvider;
  #workItemLinkedBranchesTreePartProvider: WorkItemLinkedBranchesTreePartProvider;
  #areaPathsContentTreePartProvider: AreaPathsContentTreePartProvider;
  #workItemLinkedPullRequestsTreePartProvider: WorkItemLinkedPullRequestsTreePartProvider;
  #projectTreePartProvider: ProjectTreePartProvider;
  #queryFolderChildrenTreePartProvider: QueryFolderChildrenTreePartProvider;
  #assignedToMeTreePartProvider: AssignedToMeTreePartProvider;
  #queriesContentTreePartProvider: QueriesContentTreePartProvider;
  #attachmentTreePartProvider: AttachmentTreePartProvider;
  #currentSprintScopeTreePartProvider: CurrentSprintScopeTreePartProvider;
  #mentionedTreePartProvider: MentionedTreePartProvider;
  #pinnedWorkItemTeamTreePartProvider: PinnedWorkItemTeamTreePartProvider;
  #currentSprintGroupWorkItemTreePartProvider: CurrentSprintGroupWorkItemTreePartProvider;
  #backlogContentTreePartProvider: BacklogContentTreePartProvider;
  #myTeamsTreePartProvider: MyTeamsTreePartProvider;
  #hierarchyRootContentTreePartProvider: HierarchyRootContentTreePartProvider;
  #queryResultsTreePartProvider: QueryResultsTreePartProvider;
  #workItemCommentsTreePartProvider: WorkItemCommentsTreePartProvider;
  #workItemLinkedCommitsTreePartProvider: WorkItemLinkedCommitsTreePartProvider;
  #pinnedWorkItemTreePartProvider: PinnedWorkItemTreePartProvider;
  #currentSprintTreePartProvider: CurrentSprintTreePartProvider;
  #allTeamsTreePartProvider: AllTeamsTreePartProvider;
  #accountTreePartProvider: AccountTreePartProvider;
  #projectRootTreePartProvider: ProjectRootTreePartProvider;
  #workItemHistoryTreePartProvider: WorkItemHistoryTreePartProvider;
  #hierarchyChildrenTreePartProvider: HierarchyChildrenTreePartProvider;
  #pinnedWorkItemAreaPathTreePartProvider: PinnedWorkItemAreaPathTreePartProvider;

  #recentlyModifiedByMeTreeItem: Constructor<RecentlyModifiedByMeTreeItem>;
  #workItemLinkedCommitsTreeItem: Constructor<WorkItemLinkedCommitsTreeItem>;
  #workItemLinkedBuildsTreeItem: Constructor<WorkItemLinkedBuildsTreeItem>;
  #workItemAttachmentsTreeItem: Constructor<WorkItemAttachmentsTreeItem>;
  #mentionedTreeItem: Constructor<MentionedTreeItem>;
  #workItemLinkedPullRequestsTreeItem: Constructor<WorkItemLinkedPullRequestsTreeItem>;
  #workItemLinkedBranchesTreeItem: Constructor<WorkItemLinkedBranchesTreeItem>;
  #assignedToMeTreeItem: Constructor<AssignedToMeTreeItem>;
  #workItemBacklogTreeItem: Constructor<WorkItemBacklogTreeItem>;
  #workItemCommentsTreeItem: Constructor<WorkItemCommentsTreeItem>;

  accountRootUnwrappingTreePartProvider: TreePartProvider<any, any> | undefined;
  backlogStaticTreePartProvider: TreePartProvider<any, any> | undefined;
  workItemContentsCombiningTreePartProvider: TreePartProvider<any, any> | undefined;
  projectSignInSwitchingTreePartProvider: TreePartProvider<any, any> | undefined;
  projectUnwrappingTreePartProvider: TreePartProvider<any, any> | undefined;
  areaPathNodeCombiningTreePartProvider: TreePartProvider<any, any> | undefined;
  currentSprintUnwrappingTreePartProvider: TreePartProvider<any, any> | undefined;
  myWorkStaticTreePartProvider: TreePartProvider<any, any> | undefined;
  workItemRootCombiningTreePartProvider: TreePartProvider<any, any> | undefined;
  teamContentsCombiningTreePartProvider: TreePartProvider<any, any> | undefined;
  workItemDetailStaticTreePartProvider: TreePartProvider<any, any> | undefined;

  constructor(
    @inject(types.SettingsService) settingsService: SettingsService,
    @inject(types.RecentlyModifiedByMeTreePartProvider) recentlyModifiedByMeTreePartProvider: RecentlyModifiedByMeTreePartProvider,
    @inject(types.PinnedWorkItemQueryLeafTreePartProvider) pinnedWorkItemQueryLeafTreePartProvider: PinnedWorkItemQueryLeafTreePartProvider,
    @inject(types.AreaPathHierarchyRootTreePartProvider) areaPathHierarchyRootTreePartProvider: AreaPathHierarchyRootTreePartProvider,
    @inject(types.WorkItemRevisionFieldsTreePartProvider) workItemRevisionFieldsTreePartProvider: WorkItemRevisionFieldsTreePartProvider,
    @inject(types.WorkItemLinkedWorkItemsTreePartProvider) workItemLinkedWorkItemsTreePartProvider: WorkItemLinkedWorkItemsTreePartProvider,
    @inject(types.WorkItemLinkedWorkItemGroupsTreePartProvider) workItemLinkedWorkItemGroupsTreePartProvider: WorkItemLinkedWorkItemGroupsTreePartProvider,
    @inject(types.WorkItemLinkedBuildsTreePartProvider) workItemLinkedBuildsTreePartProvider: WorkItemLinkedBuildsTreePartProvider,
    @inject(types.CurrentSprintScopeContentTreePartProvider) currentSprintScopeContentTreePartProvider: CurrentSprintScopeContentTreePartProvider,
    @inject(types.AreaPathChildrenTreePartProvider) areaPathChildrenTreePartProvider: AreaPathChildrenTreePartProvider,
    @inject(types.WorkItemLinkedBranchesTreePartProvider) workItemLinkedBranchesTreePartProvider: WorkItemLinkedBranchesTreePartProvider,
    @inject(types.AreaPathsContentTreePartProvider) areaPathsContentTreePartProvider: AreaPathsContentTreePartProvider,
    @inject(types.WorkItemLinkedPullRequestsTreePartProvider) workItemLinkedPullRequestsTreePartProvider: WorkItemLinkedPullRequestsTreePartProvider,
    @inject(types.ProjectTreePartProvider) projectTreePartProvider: ProjectTreePartProvider,
    @inject(types.QueryFolderChildrenTreePartProvider) queryFolderChildrenTreePartProvider: QueryFolderChildrenTreePartProvider,
    @inject(types.AssignedToMeTreePartProvider) assignedToMeTreePartProvider: AssignedToMeTreePartProvider,
    @inject(types.QueriesContentTreePartProvider) queriesContentTreePartProvider: QueriesContentTreePartProvider,
    @inject(types.AttachmentTreePartProvider) attachmentTreePartProvider: AttachmentTreePartProvider,
    @inject(types.CurrentSprintScopeTreePartProvider) currentSprintScopeTreePartProvider: CurrentSprintScopeTreePartProvider,
    @inject(types.MentionedTreePartProvider) mentionedTreePartProvider: MentionedTreePartProvider,
    @inject(types.PinnedWorkItemTeamTreePartProvider) pinnedWorkItemTeamTreePartProvider: PinnedWorkItemTeamTreePartProvider,
    @inject(types.CurrentSprintGroupWorkItemTreePartProvider) currentSprintGroupWorkItemTreePartProvider: CurrentSprintGroupWorkItemTreePartProvider,
    @inject(types.BacklogContentTreePartProvider) backlogContentTreePartProvider: BacklogContentTreePartProvider,
    @inject(types.MyTeamsTreePartProvider) myTeamsTreePartProvider: MyTeamsTreePartProvider,
    @inject(types.HierarchyRootContentTreePartProvider) hierarchyRootContentTreePartProvider: HierarchyRootContentTreePartProvider,
    @inject(types.QueryResultsTreePartProvider) queryResultsTreePartProvider: QueryResultsTreePartProvider,
    @inject(types.WorkItemCommentsTreePartProvider) workItemCommentsTreePartProvider: WorkItemCommentsTreePartProvider,
    @inject(types.WorkItemLinkedCommitsTreePartProvider) workItemLinkedCommitsTreePartProvider: WorkItemLinkedCommitsTreePartProvider,
    @inject(types.PinnedWorkItemTreePartProvider) pinnedWorkItemTreePartProvider: PinnedWorkItemTreePartProvider,
    @inject(types.CurrentSprintTreePartProvider) currentSprintTreePartProvider: CurrentSprintTreePartProvider,
    @inject(types.AllTeamsTreePartProvider) allTeamsTreePartProvider: AllTeamsTreePartProvider,
    @inject(types.AccountTreePartProvider) accountTreePartProvider: AccountTreePartProvider,
    @inject(types.ProjectRootTreePartProvider) projectRootTreePartProvider: ProjectRootTreePartProvider,
    @inject(types.WorkItemHistoryTreePartProvider) workItemHistoryTreePartProvider: WorkItemHistoryTreePartProvider,
    @inject(types.HierarchyChildrenTreePartProvider) hierarchyChildrenTreePartProvider: HierarchyChildrenTreePartProvider,
    @inject(types.PinnedWorkItemAreaPathTreePartProvider) pinnedWorkItemAreaPathTreePartProvider: PinnedWorkItemAreaPathTreePartProvider,
    @inject(types.RecentlyModifiedByMeTreeItem) recentlyModifiedByMeTreeItem: Constructor<RecentlyModifiedByMeTreeItem>,
    @inject(types.WorkItemLinkedCommitsTreeItem) workItemLinkedCommitsTreeItem: Constructor<WorkItemLinkedCommitsTreeItem>,
    @inject(types.WorkItemLinkedBuildsTreeItem) workItemLinkedBuildsTreeItem: Constructor<WorkItemLinkedBuildsTreeItem>,
    @inject(types.WorkItemAttachmentsTreeItem) workItemAttachmentsTreeItem: Constructor<WorkItemAttachmentsTreeItem>,
    @inject(types.MentionedTreeItem) mentionedTreeItem: Constructor<MentionedTreeItem>,
    @inject(types.WorkItemLinkedPullRequestsTreeItem) workItemLinkedPullRequestsTreeItem: Constructor<WorkItemLinkedPullRequestsTreeItem>,
    @inject(types.WorkItemLinkedBranchesTreeItem) workItemLinkedBranchesTreeItem: Constructor<WorkItemLinkedBranchesTreeItem>,
    @inject(types.AssignedToMeTreeItem) assignedToMeTreeItem: Constructor<AssignedToMeTreeItem>,
    @inject(types.WorkItemBacklogTreeItem) workItemBacklogTreeItem: Constructor<WorkItemBacklogTreeItem>,
    @inject(types.WorkItemCommentsTreeItem) workItemCommentsTreeItem: Constructor<WorkItemCommentsTreeItem>,
  ) {
    this.#settingsService = settingsService;
    this.#recentlyModifiedByMeTreePartProvider = recentlyModifiedByMeTreePartProvider;
    this.#pinnedWorkItemQueryLeafTreePartProvider = pinnedWorkItemQueryLeafTreePartProvider;
    this.#areaPathHierarchyRootTreePartProvider = areaPathHierarchyRootTreePartProvider;
    this.#workItemRevisionFieldsTreePartProvider = workItemRevisionFieldsTreePartProvider;
    this.#workItemLinkedWorkItemsTreePartProvider = workItemLinkedWorkItemsTreePartProvider;
    this.#workItemLinkedWorkItemGroupsTreePartProvider = workItemLinkedWorkItemGroupsTreePartProvider;
    this.#workItemLinkedBuildsTreePartProvider = workItemLinkedBuildsTreePartProvider;
    this.#currentSprintScopeContentTreePartProvider = currentSprintScopeContentTreePartProvider;
    this.#areaPathChildrenTreePartProvider = areaPathChildrenTreePartProvider;
    this.#workItemLinkedBranchesTreePartProvider = workItemLinkedBranchesTreePartProvider;
    this.#areaPathsContentTreePartProvider = areaPathsContentTreePartProvider;
    this.#workItemLinkedPullRequestsTreePartProvider = workItemLinkedPullRequestsTreePartProvider;
    this.#projectTreePartProvider = projectTreePartProvider;
    this.#queryFolderChildrenTreePartProvider = queryFolderChildrenTreePartProvider;
    this.#assignedToMeTreePartProvider = assignedToMeTreePartProvider;
    this.#queriesContentTreePartProvider = queriesContentTreePartProvider;
    this.#attachmentTreePartProvider = attachmentTreePartProvider;
    this.#currentSprintScopeTreePartProvider = currentSprintScopeTreePartProvider;
    this.#mentionedTreePartProvider = mentionedTreePartProvider;
    this.#pinnedWorkItemTeamTreePartProvider = pinnedWorkItemTeamTreePartProvider;
    this.#currentSprintGroupWorkItemTreePartProvider = currentSprintGroupWorkItemTreePartProvider;
    this.#backlogContentTreePartProvider = backlogContentTreePartProvider;
    this.#myTeamsTreePartProvider = myTeamsTreePartProvider;
    this.#hierarchyRootContentTreePartProvider = hierarchyRootContentTreePartProvider;
    this.#queryResultsTreePartProvider = queryResultsTreePartProvider;
    this.#workItemCommentsTreePartProvider = workItemCommentsTreePartProvider;
    this.#workItemLinkedCommitsTreePartProvider = workItemLinkedCommitsTreePartProvider;
    this.#pinnedWorkItemTreePartProvider = pinnedWorkItemTreePartProvider;
    this.#currentSprintTreePartProvider = currentSprintTreePartProvider;
    this.#allTeamsTreePartProvider = allTeamsTreePartProvider;
    this.#accountTreePartProvider = accountTreePartProvider;
    this.#projectRootTreePartProvider = projectRootTreePartProvider;
    this.#workItemHistoryTreePartProvider = workItemHistoryTreePartProvider;
    this.#hierarchyChildrenTreePartProvider = hierarchyChildrenTreePartProvider;
    this.#pinnedWorkItemAreaPathTreePartProvider = pinnedWorkItemAreaPathTreePartProvider;
    this.#recentlyModifiedByMeTreeItem = recentlyModifiedByMeTreeItem;
    this.#workItemLinkedCommitsTreeItem = workItemLinkedCommitsTreeItem;
    this.#workItemLinkedBuildsTreeItem = workItemLinkedBuildsTreeItem;
    this.#workItemAttachmentsTreeItem = workItemAttachmentsTreeItem;
    this.#mentionedTreeItem = mentionedTreeItem;
    this.#workItemLinkedPullRequestsTreeItem = workItemLinkedPullRequestsTreeItem;
    this.#workItemLinkedBranchesTreeItem = workItemLinkedBranchesTreeItem;
    this.#assignedToMeTreeItem = assignedToMeTreeItem;
    this.#workItemBacklogTreeItem = workItemBacklogTreeItem;
    this.#workItemCommentsTreeItem = workItemCommentsTreeItem;
  }


  @postConstruct()
  private initializeWorkItemTreeProvider() {
    this.backlogStaticTreePartProvider = new StaticTreePartProvider({
      backlog: {
        treeItem: this.#workItemBacklogTreeItem,
      },
    });
    this.projectSignInSwitchingTreePartProvider = new SwitchingTreePartProvider(selectSignInStatus, {
      signedIn: this.#projectTreePartProvider,
    });
    this.projectUnwrappingTreePartProvider = new UnwrappingTreePartProvider(
      this.projectSignInSwitchingTreePartProvider,
      shouldUnwrapAccountOrProject(this.#settingsService.unwrapProjects()),
      (i) => this.getTreePartProvider(i),
    );
    this.areaPathNodeCombiningTreePartProvider = new CombiningTreePartProvider({
      areaPathChildren: this.#areaPathChildrenTreePartProvider,
      hierarchy: this.#areaPathHierarchyRootTreePartProvider,
    });
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
    this.teamContentsCombiningTreePartProvider = new CombiningTreePartProvider({
      sprints: this.currentSprintUnwrappingTreePartProvider,
      backlog: this.backlogStaticTreePartProvider,
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
    this.accountRootUnwrappingTreePartProvider = new UnwrappingTreePartProvider(
      this.#accountTreePartProvider,
      shouldUnwrapAccountOrProject(this.#settingsService.unwrapAccounts()),
      () => this.projectUnwrappingTreePartProvider,
    );
    this.workItemContentsCombiningTreePartProvider = new CombiningTreePartProvider({
      children: this.#hierarchyChildrenTreePartProvider,
      details: this.workItemDetailStaticTreePartProvider,
      linkedWorkItemGroups: this.#workItemLinkedWorkItemGroupsTreePartProvider,
    });
    this.workItemRootCombiningTreePartProvider = new CombiningTreePartProvider({
      pinnedWorkItems: this.#pinnedWorkItemTreePartProvider,
      pinnedAreaPaths: this.#pinnedWorkItemAreaPathTreePartProvider,
      pinnedTeams: this.#pinnedWorkItemTeamTreePartProvider,
      pinnedQueries: this.#pinnedWorkItemQueryLeafTreePartProvider,
      accounts: this.accountRootUnwrappingTreePartProvider,
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


  accountRootUnwrappingTreePartProvider: TreePartProvider<any, any> | undefined;
  projectSignInSwitchingTreePartProvider: TreePartProvider<any, any> | undefined;
  projectUnwrappingTreePartProvider: TreePartProvider<any, any> | undefined;

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


  accountRootUnwrappingTreePartProvider: TreePartProvider<any, any> | undefined;
  projectSignInSwitchingTreePartProvider: TreePartProvider<any, any> | undefined;
  projectUnwrappingTreePartProvider: TreePartProvider<any, any> | undefined;

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
  #accountTreePartProvider: AccountTreePartProvider;
  #agentTreePartProvider: AgentTreePartProvider;
  #projectTreePartProvider: ProjectTreePartProvider;
  #pinnedAgentPoolTreePartProvider: PinnedAgentPoolTreePartProvider;
  #agentPoolTreePartProvider: AgentPoolTreePartProvider;
  #agentJobTreePartProvider: AgentJobTreePartProvider;

  #jobsContainerTreeItem: Constructor<JobsContainerTreeItem>;
  #agentJobsContainerTreeItem: Constructor<AgentJobsContainerTreeItem>;
  #agentsContainerTreeItem: Constructor<AgentsContainerTreeItem>;

  accountRootUnwrappingTreePartProvider: TreePartProvider<any, any> | undefined;
  agentsRootCombiningTreePartProvider: TreePartProvider<any, any> | undefined;
  projectSignInSwitchingTreePartProvider: TreePartProvider<any, any> | undefined;
  projectUnwrappingTreePartProvider: TreePartProvider<any, any> | undefined;
  agentChildrenStaticTreePartProvider: TreePartProvider<any, any> | undefined;
  agentPoolChildrenStaticTreePartProvider: TreePartProvider<any, any> | undefined;

  constructor(
    @inject(types.SettingsService) settingsService: SettingsService,
    @inject(types.PinnedAgentTreePartProvider) pinnedAgentTreePartProvider: PinnedAgentTreePartProvider,
    @inject(types.AccountTreePartProvider) accountTreePartProvider: AccountTreePartProvider,
    @inject(types.AgentTreePartProvider) agentTreePartProvider: AgentTreePartProvider,
    @inject(types.ProjectTreePartProvider) projectTreePartProvider: ProjectTreePartProvider,
    @inject(types.PinnedAgentPoolTreePartProvider) pinnedAgentPoolTreePartProvider: PinnedAgentPoolTreePartProvider,
    @inject(types.AgentPoolTreePartProvider) agentPoolTreePartProvider: AgentPoolTreePartProvider,
    @inject(types.AgentJobTreePartProvider) agentJobTreePartProvider: AgentJobTreePartProvider,
    @inject(types.JobsContainerTreeItem) jobsContainerTreeItem: Constructor<JobsContainerTreeItem>,
    @inject(types.AgentJobsContainerTreeItem) agentJobsContainerTreeItem: Constructor<AgentJobsContainerTreeItem>,
    @inject(types.AgentsContainerTreeItem) agentsContainerTreeItem: Constructor<AgentsContainerTreeItem>,
  ) {
    this.#settingsService = settingsService;
    this.#pinnedAgentTreePartProvider = pinnedAgentTreePartProvider;
    this.#accountTreePartProvider = accountTreePartProvider;
    this.#agentTreePartProvider = agentTreePartProvider;
    this.#projectTreePartProvider = projectTreePartProvider;
    this.#pinnedAgentPoolTreePartProvider = pinnedAgentPoolTreePartProvider;
    this.#agentPoolTreePartProvider = agentPoolTreePartProvider;
    this.#agentJobTreePartProvider = agentJobTreePartProvider;
    this.#jobsContainerTreeItem = jobsContainerTreeItem;
    this.#agentJobsContainerTreeItem = agentJobsContainerTreeItem;
    this.#agentsContainerTreeItem = agentsContainerTreeItem;
  }


  @postConstruct()
  private initializeAgentsTreeProvider() {
    this.projectSignInSwitchingTreePartProvider = new SwitchingTreePartProvider(selectSignInStatus, {
      signedIn: this.#projectTreePartProvider,
    });
    this.projectUnwrappingTreePartProvider = new UnwrappingTreePartProvider(
      this.projectSignInSwitchingTreePartProvider,
      shouldUnwrapAccountOrProject(this.#settingsService.unwrapProjects()),
      (i) => this.getTreePartProvider(i),
    );
    this.agentChildrenStaticTreePartProvider = new StaticTreePartProvider({
      jobs: {
        treeItem: this.#agentJobsContainerTreeItem,
      },
    });
    this.agentPoolChildrenStaticTreePartProvider = new StaticTreePartProvider({
      jobs: {
        treeItem: this.#jobsContainerTreeItem,
      },
      agents: {
        treeItem: this.#agentsContainerTreeItem,
      },
    });
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
