# Change Log

## [0.0.5] - Fixed Bug When Expanding Work Items

This release fixes a bug where expanding a work item before it finished loading would cause some of its children to not appear. The children now show up correctly even if the work item is expanded during loading.

## [0.0.4] - Initial Release

### What This Extension Does

Toolbox for Azure DevOps is a VSCode extension that provides convenient access to Microsoft Azure DevOps from within Visual Studio Code. It enables developers to interact with Azure DevOps services without leaving their IDE.

### Authorization

Authentication to Azure DevOps Cloud, Azure DevOps Server, and TFS is handled via Personal Access Tokens (PAT). When adding an organization, users enter their server address (defaulting to dev.azure.com), organization name, and PAT.

### Tree Views

The extension provides four tree views, each displaying specific items from your Azure DevOps organization:

**Work Items**
- Work items assigned to you and your teams
- Saved queries, area paths, and work item hierarchy
- Work item details including comments, history, and attachments
- Linked items: commits, pull requests, branches, builds, and related work items

**Repositories**
- Repositories with files, commits, branches, and tags
- Pull requests with reviewers, statuses, comments, and linked work items
- Open items directly in the editor or in the web browser

**Pipelines**
- Pipeline folders, pipelines, and runs
- Run artifacts and timeline records
- Create, rename, and delete folders
- Run, cancel, and re-run pipelines
- Rename and delete pipelines

**Agents**
- Agent pools and individual agents
- Jobs running on agents

### Available Actions

All tree items support:
- **Pin/Unpin**: Keep frequently accessed items visible at the top
- **Open in Web**: View items in the Azure DevOps web portal
- **Refresh**: Manually refresh tree data (also supports configurable auto-refresh)

Work item actions:
- Set state, title, effort (story points), and assignee
- Download attachments
- Copy work item ID

Pipeline actions:
- Create, rename, and delete pipeline folders
- Rename and delete pipelines
- Run, cancel, and re-run pipelines

### Configuration

The extension offers these settings:
- **Auto-refresh interval**: Configure how often data is automatically refreshed
- **Unwrap accounts**: Display account items directly when only one account exists
- **Unwrap projects**: Display project items directly when only one project exists per account

### Technical Details

The extension is built with TypeScript and uses:
- **RxJS** for reactive data streams with caching and pagination
- **Inversify** for dependency injection
- **@sinclair/typebox** for runtime type checking
- **Eclipse Epsilon** for model-driven code generation of Azure DevOps API wrappers
- **azure-devops-node-api** for REST API communication
