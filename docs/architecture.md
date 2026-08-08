# Architecture

I've just jolted down some notes about the architecture here. By no means complete yet.

## Scope

The core idea behind this extension is to allow developers to interact with Azure Devops for everyday tasks without having to leave their code editor. This extension shouldn't contain every feature and function of Azure Devops. For example:

This is should be supported, since they are common tasks for a developer:

- view and edit work items
- view and edit pull requests

These function should not be supported, since they are rarely used and should be performed using the already provided Azure Devops web interface:

- creating and configuring a new project
- creating new area paths

## Tree Views

The main way to interact with this extension are tree views. Objects from Azure Devops are shown in a tree view which allows easy navigation and interaction with those objects.

### Noteworthy Tree Items

#### Account

In all tree views, `Account` are fundamental. Users can add, edit and remove accounts, each with their own credentials. Accounts can be on different servers.

#### Project

`Account` items can contain multiple `Project` items. These form the basis for almost everything else.

### Refresh items

While data for `Account` items is provided from the user, almost everything else is loaded using web requests. To keep the UI in a up-to-date state, the data is re-requested under these conditions:

- A configurable amount of time has elapsed so the data is now considered stale
- the user has triggered a refresh
- an action is known to have changed some data

The user can click a refresh icon on the item. This has to refresh the item itself (label, icon, tooltip, etc.) and direct children of this item.
If any items are unwrapped, all items hidden must also be refreshed.
