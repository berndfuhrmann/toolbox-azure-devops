# Work Items — Remaining Work

## Still To Implement

### Work Item Creation

- As a developer, I want to quickly create a work item (type, title, area, sprint, assignee) using input boxes without leaving VS Code.
- As a developer, I want to open a richer form (webview) for full work item creation including description, tags, priority, and story points.
- As a team lead, I want to create a work item and immediately assign it to a team member (create-and-assign flow).

### Inline Field Editing (gaps)

- `workItemSetSprintAction` is implemented but **not registered** in `registerCommands.ts` or `package.json`.
- Tags: inline editing not yet implemented.
- Priority: inline editing not yet implemented.

### Priority Visible in Tree

Work items show effort (story points) in the tooltip but not **priority**. Priority should be added to the tooltip alongside the other fields.

### Add Comment

- As a developer, I want to add a quick comment on a work item directly from VS Code.

### Settings

None of the planned settings are defined in `package.json` yet.

| Setting                    | Purpose                                                     |
| -------------------------- | ----------------------------------------------------------- |
| Preferred team per project | Pre-selects one team for quicker access                     |
| Sprint view grouping       | `by-assignee` or `by-state` default                         |
| Max items per page         | Pagination limit for performance                            |
| Show closed/past sprints   | Toggle to reveal historical sprints                         |
| Max hierarchy depth        | Limits parent-child expansion depth                         |
| Hierarchy type mapping     | Override which WIT categories map to which level (advanced) |

### Drag to Reassign (Future)

As a team lead, I want to reassign items by dragging them between assignee nodes in the sprint view.

## Sketch: Work Item History

### Requirement

- As a developer, I want to expand a `History` node on a work item to see all revisions in reverse chronological order.
- Each revision should show who made the change, when, and which fields changed (old value → new value).

### API

`WorkItemTrackingApi.getUpdates(workItemId, project, top, skip)` returns `WorkItemUpdate[]`.

Each `WorkItemUpdate` has:

- `rev`: revision number
- `revisedDate`: `Date`
- `revisedBy`: `IdentityRef` (`displayName`, `uniqueName`)
- `fields`: `{ [fieldReferenceName: string]: { oldValue: any; newValue: any } }`
- `relations`: `{ added, removed, updated }` (relation changes, if any)

### Tree Structure

```text
[Work Item node] expands to:
  Linked Items         ← done
    [Link type: Target title (#ID)]
  Comments             ← done
    [Comment author: snippet...]
  Attachments          ← done
  History              ← new
    [Rev N · YYYY-MM-DD · Author]
      [FieldLabel: oldValue → newValue]
      [FieldLabel: oldValue → newValue]
      ...
```

### New Tree Items

- **`WorkItemHistoryTreeItem`** — "History" container node under each work item. Collapsed by default; context tag `workItem.history`.
- **`WorkItemRevisionTreeItem`** — one revision. Label: `Rev N · YYYY-MM-DD · DisplayName`. Collapsible when it has displayable field changes; tooltip shows all changed fields.
- **`WorkItemRevisionFieldChangeTreeItem`** — one field change. Label: `FieldLabel: oldValue → newValue`. Leaf node.

### New Data Items

- **`WorkItemRevisionItem`** — wraps a `WorkItemUpdate` plus inherited `WorkItemItem` context (account, project, container).
- **`WorkItemRevisionFieldChangeItem`** — one changed field: `{ fieldReferenceName, fieldLabel, oldValue, newValue }` plus `WorkItemRevisionItem` context.

### New Tree Part Providers

- **`WorkItemHistoryTreePartProvider`** — given a `WorkItemItem` context, calls `getUpdates(workItemId, projectId, top, skip)`, emits `WorkItemRevisionItem` per revision sorted descending by `rev`. Supports pagination (load more).
- **`WorkItemRevisionFieldsTreePartProvider`** — given a `WorkItemRevisionItem` context, emits one `WorkItemRevisionFieldChangeItem` per entry in `fields`, filtering out noise fields (`System.Watermark`, `System.ChangedDate`, `System.ChangedBy`, `System.Rev`).

## Remaining Implementation Scope

1. Wire up `workItemSetSprintAction` (register command + add to `package.json` manifest)
2. Priority in work item tooltip
3. Inline tag and priority editing
4. Add comment action
5. Work Item History tree nodes (items, tree items, tree part providers)
6. Work item creation (quick input boxes + webview form)
7. Settings (`package.json` contributes.configuration)
