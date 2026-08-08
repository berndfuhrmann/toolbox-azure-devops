# AI generated list of ideas. No commitment for implementation.

## General

### Authorization & Security

- [ ] **OAuth Authentication**: Use OAuth instead of PATs
  - Register client id in Microsoft Entra
  - Implement OAuth flow with MSAL
  - Store and refresh tokens securely
  - Support for Conditional Access Policies

- [ ] **Audit Log Viewer**: Display audit events from the organization
  - List recent activities and changes
  - Filter by user, action type, date range
  - Export audit logs

### User Interface Improvements

- [ ] **Search Functionality**
  - Global search across repositories, pipelines, work items
  - Recent items quick access
  - Search history

- [ ] **Notification Center**
  - Show notifications from Azure DevOps
  - Mark as read/unread
  - Filter by type (PR, build, work item)
  - Configure notification preferences

## Repositories View

### Pull Request Enhancements

- [ ] **Complete PR Workflow**
  - Set PR description
  - Add/remove reviewers
  - Add/remove work items
  - Set auto-complete options
  - Abandon/reactivate pull requests
  - Complete pull requests
  - Cherry-pick commits

- [ ] **PR Comments & Discussions**
  - View comment threads in detail
  - Add new comments
  - Reply to comments
  - Resolve/unresolve threads
  - Mark comments as "Won't fix" or "Closed"

- [ ] **PR Policies**
  - View branch policies
  - View policy evaluation status
  - Override policy failures (if authorized)

- [ ] **PR Diff Viewer**
  - Show file changes inline
  - Compare files side-by-side
  - Navigate between changed files
  - View specific file versions

### Branch Management

- [ ] **Branch Operations**
  - Create new branch
  - Delete branch
  - Lock/unlock branch
  - Set default branch
  - Compare branches

- [ ] **Branch Policies**
  - View branch policies
  - Configure minimum reviewers
  - Configure build validation
  - Configure required reviewers
  - Configure merge strategies

### Repository Operations

- [ ] **Repository Management**
  - Create repository
  - Delete repository
  - Rename repository
  - Set default branch
  - Fork repository

- [ ] **File Operations**
  - Create new file
  - Edit file content
  - Delete file
  - Rename/move file
  - Download file/folder

- [ ] **Commit Operations**
  - View commit details
  - Compare commits
  - Cherry-pick commit
  - Revert commit

### Security & Alerts

- [ ] **Advanced Security Integration** (if GHAzDO enabled)
  - View secret scanning alerts
  - View code scanning alerts (CodeQL)
  - View dependency scanning alerts
  - Dismiss/resolve alerts
  - Link alerts to work items

## Pipelines View

### Pipeline Creation & Management

- [ ] **Create Pipeline**
  - Wizard for new YAML pipeline
  - Select repository and branch
  - Choose template (starter, existing)
  - Configure triggers

- [ ] **Advanced Pipeline Operations**
  - Clone/duplicate pipeline
  - Import/export pipeline definition
  - Pause/disable pipeline
  - Enable/disable pipeline

- [ ] **Pipeline Run Management**
  - Cancel running build
  - Retry failed build
  - Re-run specific stage
  - Approve/reject deployment stages
  - View run variables
  - View run parameters

- [ ] **Pipeline Logs & Diagnostics**
  - Stream live logs during run
  - Download logs
  - Search logs
  - View timeline with task durations
  - View system diagnostics

- [ ] **Pipeline Artifacts**
  - Browse artifacts
  - Download artifacts
  - View artifact manifest
  - Publish new artifacts

- [ ] **Pipeline Variables**
  - View variable groups
  - Edit variable values
  - Create new variables
  - Secret variable management

### Environments & Approvals

- [ ] **Environments Management**
  - List environments
  - View environment deployments
  - View environment resources
  - Configure approvals and checks

- [ ] **Deployment Approvals**
  - View pending approvals
  - Approve/reject deployments
  - Add approval comments
  - View approval history

### Classic Release Pipelines

- [ ] **Release Pipeline Support**
  - View release pipelines
  - View release history
  - Create new release
  - View release stages
  - Approve/reject stage
  - View release logs

## Work Items & Boards (New View)

### Work Item Management

- [ ] **Work Item Tree View**
  - Browse work items by project
  - Filter by assigned to me, created by me
  - Filter by work item type (Bug, Task, User Story, Epic)
  - Filter by state (Active, Resolved, Closed)
  - Group by area path, iteration

- [ ] **Work Item Operations**
  - Create new work item
  - Edit work item fields
  - Change work item state
  - Assign work item
  - Add/remove tags
  - Add comments
  - Add attachments
  - Link work items
  - Delete work item

- [ ] **Work Item Details**
  - View all fields
  - View history
  - View related work items
  - View linked pull requests
  - View linked commits
  - View linked builds

- [ ] **Queries**
  - Run saved queries
  - Create new queries
  - Edit queries
  - Share queries
  - Export query results

### Board Views

- [ ] **Kanban Board Integration**
  - View board lanes
  - Move cards between lanes
  - View card details
  - Quick edit card fields

- [ ] **Sprint Planning**
  - View sprint backlog
  - View sprint capacity
  - Plan sprint
  - View burndown chart

## Test Plans (New View)

### Test Management

- [ ] **Test Plans**
  - List test plans
  - Create test plan
  - View test suites
  - View test cases

- [ ] **Test Execution**
  - Run manual test
  - Record test results
  - Mark test as pass/fail
  - Add test comments
  - Attach screenshots

- [ ] **Test Results**
  - View test run history
  - View test results by pipeline
  - View flaky tests
  - Export test results

## Agents & Task Management (New View)

### Agent Pools

- [ ] **Agent Pool Management**
  - List agent pools
  - View pool details
  - View pool agents
  - View pool statistics

- [ ] **Agent Monitoring**
  - List agents in pool
  - View agent status (online/offline)
  - View agent capabilities
  - View running jobs on agent
  - View agent queue

- [ ] **Agent Jobs**
  - View pending jobs
  - View running jobs
  - Cancel job
  - View job timeline

### Task Agent API Integration

- [ ] **Deployment Groups**
  - List deployment groups
  - View targets
  - View deployment history

- [ ] **Maintenance Jobs**
  - View scheduled maintenance
  - Configure retention policies

## Wiki (New View)

### Wiki Management

- [ ] **Wiki Browser**
  - List wikis in project
  - Browse wiki pages
  - View page content with Monaco editor
  - View page hierarchy

- [ ] **Wiki Operations**
  - Create new page
  - Edit page content
  - Delete page
  - Move page
  - Upload attachments

- [ ] **Wiki Search**
  - Search wiki content
  - Navigate to search results

## Dashboards & Reporting

### Dashboard Integration

- [ ] **Dashboard Viewer**
  - List dashboards
  - View dashboard widgets
  - Refresh widgets
  - Pin dashboard to view

- [ ] **Widget Support**
  - Query results widget
  - Chart widgets
  - Build history widget
  - Release history widget

### Analytics & Insights

- [ ] **Project Analytics**
  - View project health metrics
  - View code coverage trends
  - View build success rate
  - View deployment frequency

- [ ] **Personal Insights**
  - My active work items
  - My pending approvals
  - My PRs requiring action
  - Recent activity timeline

## Package Management (Artifacts)

### Artifact Feeds

- [ ] **Feed Management**
  - List feeds
  - View packages in feed
  - View package versions
  - View package details

- [ ] **Package Operations**
  - Publish package
  - Delete package version
  - Promote package
  - View package dependencies

## Advanced Features

### Custom Queries & Filters

- [ ] **Saved Filters**
  - Save custom filters for views
  - Quick filter application
  - Share filters with team

### Integration Features

- [ ] **Terminal Integration**
  - Run Azure DevOps CLI commands
  - Quick command palette for common operations

- [ ] **Codelens Integration**
  - Show build status in files
  - Show work item references
  - Show PR status for current branch

- [ ] **Status Bar**
  - Show current pipeline status
  - Show pending approvals count
  - Show assigned work items count

### Workspace Integration

- [ ] **Multi-Organization Support**
  - Switch between organizations
  - View items across organizations
  - Consolidate notifications

- [ ] **Team Favorites**
  - Sync team favorites from Azure DevOps
  - Quick access to favorite items

## Performance & Quality

### Optimization

- [ ] **Lazy Loading**
  - Load tree items on-demand
  - Progressive rendering for large lists

- [ ] **Background Sync**
  - Periodic background refresh
  - Differential updates
  - Conflict resolution

### Developer Experience

- [ ] **Keyboard Shortcuts**
  - Define custom shortcuts for common actions
  - Quick action palette

- [ ] **Settings & Configuration**
  - Per-organization settings
  - View preferences (compact/normal)
  - Default filters configuration

## Service-Specific API Integration

### Not Yet Utilized APIs

- [ ] **Policy API**: Branch policies, approval policies
- [ ] **Profile API**: User profile information
- [ ] **Notification API**: Notification subscriptions
- [ ] **Extension Management API**: Installed extensions, marketplace
- [ ] **Feature Management API**: Feature flags
- [ ] **Security Roles API**: Permissions and roles
- [ ] **Project Analysis API**: Code analysis results
- [ ] **Management API**: Organization settings

## Documentation & Testing

- [ ] **API Documentation**: Document all available commands
- [ ] **Integration Tests**: Add tests for critical workflows
- [ ] **E2E Tests**: Test complete user scenarios
- [ ] **Performance Tests**: Benchmark API calls and rendering
