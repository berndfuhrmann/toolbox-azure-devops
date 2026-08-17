# Features

This document provides a comprehensive overview of the features and capabilities of the Azure DevOps Helper VSCode extension.

## Overview

The Azure DevOps Helper extension provides an intuitive way to access Microsoft Azure DevOps services directly from within Visual Studio Code. It offers two main tree views in the activity bar for browsing and managing repositories and pipelines.

## Core Features

### Organization Management

- **Add Organization**: Connect to Azure DevOps organizations by providing:
  - Organization URL (e.g., `https://dev.azure.com/`)
  - Organization name
  - Personal Access Token (PAT) for authentication
- **Remove Organization**: Disconnect organizations from the extension with confirmation dialog
- **Update Personal Access Token**: Update PAT credentials for existing organizations

### Configuration

- **Auto-Refresh Interval**: Configure automatic data refresh interval in milliseconds (`azure-devops-helper.autoRefreshInterval`)

## Repository Features

The extension provides a comprehensive view of Git repositories within Azure DevOps projects.

### Repository Browser

- **Browse Repositories**: View all repositories across connected organizations and projects
- **Pin Repositories**: Pin frequently used repositories for quick access
- **Open in Web**: Open repositories in external web browser
- **Refresh**: Manually refresh repository data

### Branches

- **View Branches**: Browse all branches in a repository
- **Branch Details**: View branch statistics and information

### Commits

- **Browse Commits**: View commit history for branches
- **Commit Details**: Access detailed commit information

### Tags

- **View Tags**: Browse repository tags
- **Tag Information**: View tag details and associated commits

### Files & Folders

- **Browse Repository Items**: Navigate through repository file structure
- **View Files**: Open and view file contents from any branch or commit

### Pull Requests

- **Browse Pull Requests**: View all pull requests for a repository
- **Pin Pull Requests**: Pin important pull requests for easy access
- **Pull Request Details**:
  - View reviewers and their approval status
  - See associated work items
  - View comment threads and discussions
  - Check build/validation statuses
- **Edit Pull Request**:
  - Set/change pull request title
- **Open in Web**: Open pull request in browser for full editing capabilities

## Pipeline Features

The extension provides full pipeline management capabilities with a hierarchical folder view.

### Pipeline Browser

- **Browse Pipelines**: View all build pipelines organized by project and folder
- **Pin Pipelines**: Pin frequently used pipelines for quick access
- **Folder Organization**: Pipelines are organized in folders matching Azure DevOps structure
- **Pin Folders**: Pin entire pipeline folders for quick access

### Folder Management

- **Create Folder**: Create new pipeline folders
  - Available on project root or existing folders
  - Nested folder creation supported
- **Rename Folder**: Rename existing pipeline folders
- **Delete Folder**: Delete pipeline folders with confirmation dialog
- **Move Folders**: Drag and drop folders to reorganize pipeline structure

### Pipeline Management

- **View Pipelines**: Browse all build definitions with their current status
- **Rename Pipeline**: Change pipeline names
- **Delete Pipeline**: Remove pipelines with confirmation dialog
- **Move Pipelines**: Drag and drop pipelines between folders
- **Reveal Repository**: Navigate from a pipeline to its associated repository in the Repository view
- **Open in Web**: Open pipeline in browser

### Pipeline Execution

- **Run Pipeline**: Queue a new pipeline run
  - Select branch from dropdown (main/master prioritized at top)
  - Automatically refreshes after queuing
  - Shows confirmation message with pipeline and branch name
- **View Runs**: Browse pipeline run history
- **Run Details**:
  - View run status and results
  - Access run artifacts
  - View run timeline and logs

## Common Features

These features are available across both Repository and Pipeline views:

### Pinning System

- **Pin Items**: Pin repositories, pull requests, pipelines, and folders for quick access
- **Visual Indicators**: Pinned items are marked with icons and file decorations
- **Persistent**: Pins are saved and restored between sessions
- **Unpin Items**: Remove pins when no longer needed

### Status Decorations

- **File Decorations**: Visual indicators for item status
  - Pinned items are decorated
  - Status badges for pull requests, builds, etc.

### Drag and Drop

- **Move Pipelines**: Drag pipelines to different folders
- **Move Folders**: Reorganize folder hierarchy
- **Visual Confirmation**: Confirmation dialogs prevent accidental moves

### Refresh Capabilities

- **Manual Refresh**: Refresh button available on all refreshable items
- **Auto Refresh**: Configurable automatic refresh interval
- **Hierarchical Refresh**: Refreshing a parent updates all children

### Context Integration

- **Open in Web**: Quick access to Azure DevOps web interface for items
- **External Browser**: Opens in default web browser for full functionality

### Text Document Viewer

- **View Azure DevOps Content**: Custom document provider for viewing:
  - Pull request details
  - File contents
  - Other Azure DevOps resources
- **Custom URI Scheme**: Uses `azure-devops-helper://` scheme

## Technical Features

### Architecture

- **Dependency Injection**: Built with Inversify for modular architecture
- **Reactive Programming**: RxJS-based reactive data streams
- **Code Generation**: Model-driven approach using Eclipse Epsilon (EMF, Flexmi)
  - Service definitions generated from models
  - Tree providers auto-generated
  - Type-safe API wrappers
- **Type Safety**: TypeBox runtime type validation

### API Integration

The extension integrates with multiple Azure DevOps REST APIs:

- **Alert API**: Security alerts and analysis
- **Build API**: Pipeline definitions, runs, artifacts, logs
- **Core API**: Projects and teams
- **File Container API**: Artifact storage
- **Git API**: Repositories, branches, commits, pull requests, refs
- **Pipelines API**: Pipeline runs and execution
- **Work Item Tracking API**: Work items linked to pull requests

### Caching & Performance

- **Intelligent Caching**: API responses cached for performance
- **Pagination Support**: Handles large data sets efficiently
- **Progressive Loading**: Load data on-demand as tree expands

## User Interface

### Activity Bar

- **Custom Icon**: Azure DevOps logo in activity bar
- **Two Views**:
  - Repositories view (collapsed by default)
  - Pipelines view (collapsed by default)

### Icons

- **Custom Icons**: Tabler Icons set for consistent UI
- **Theme Support**: Separate light and dark theme icons
- **Colorized SVGs**: Icons adapted for VSCode theme integration

### Context Menus

- **Contextual Actions**: Right-click menus with relevant actions for each item type
- **Inline Actions**: Frequently used actions available directly in tree view
- **Keyboard Shortcuts**: Standard VSCode navigation shortcuts work

## Extension Commands

All available commands (prefixed with `azure-devops-helper.`):

### Global Commands

- `addOrganization` - Add new organization
- `removeOrganization` - Remove organization
- `updatePersonalAccessToken` - Update PAT credentials
- `refresh` - Refresh tree item
- `openInWeb` - Open in external browser
- `pin` - Pin item
- `unpin` - Unpin item
- `openTextFile` - Open text document

### Repository Commands

- `gitRepository.pullRequest.setTitle` - Change pull request title

### Pipeline Commands

- `pipeline.createFolder` - Create pipeline folder
- `pipeline.renameFolder` - Rename pipeline folder
- `pipeline.deleteFolder` - Delete pipeline folder
- `pipeline.revealRepository` - Navigate to pipeline's repository
- `pipeline.renamePipeline` - Rename pipeline
- `pipeline.runPipeline` - Queue pipeline run
- `pipeline.deletePipeline` - Delete pipeline

## Future Capabilities

Based on the service model, the extension has infrastructure for (but may not fully implement):

- Release management
- Work item tracking integration
- Wiki integration
- Test plans and results
- Policy management
- Task agents
- Security and permissions
- Dashboards
- Notifications

## Development Features

### Testing

- **Unit Tests**: Vitest-based unit testing
- **Component Tests**: Vitest-based component testing
- **Integration Tests**: VSCode test framework integration
- **Mocking**: Comprehensive mocking for VSCode APIs

### Code Quality

- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript**: Full type safety with strict mode
- **Watch Mode**: Automatic compilation during development
