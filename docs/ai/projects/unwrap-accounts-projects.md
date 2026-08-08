# Auto-Unwrapping Single Accounts and Projects

## Problem

Users with only one account and one project see unnecessary nesting levels in all tree views:

- Root → Account → Project → Content

This adds visual clutter and requires extra clicks to reach actual content.

## Solution

Create a generic `UnwrappingTreePartProvider` that automatically "unwraps" levels when they contain only a single item. This enables:

- **1 account only**: Root → Project → Content
- **1 account + 1 project**: Root → Content
- **Multiple accounts/projects**: Current behavior (Root → Accounts → Projects → Content)

## Technical Approach

### UnwrappingTreePartProvider

A decorator pattern TreePartProvider that wraps another provider:

```typescript
class UnwrappingTreePartProvider<Item, Context> extends TreePartProvider<Item, Context> {
  constructor(
    innerProvider: TreePartProvider<Item, Context>,
    unwrapPredicate: (itemCount: number) => boolean,
    getTreePartProvider: (item: AbstractTreeItem<any>) => TreePartProvider<any, any> | undefined,
    maxDepth?: number,
  );
}
```

**Key features:**

- **Generic**: No hardcoded dependencies on StorageService or specific item types
- **Predicate-based**: Caller controls when to unwrap (e.g., `count => count === 1`)
- **Recursive**: Can unwrap multiple levels (account → project → content)
- **Context preservation**: Merged child items maintain parent context in their `data` property
- **Depth-limited**: Prevents infinite recursion

**Algorithm:**

1. Get items from inner provider
2. If item count matches unwrap predicate:
   - Create tree item from the single item
   - Use `getTreePartProvider` callback to get child provider
   - Recursively fetch children with depth tracking
   - Prefix keys as `unwrapped-${parentKey}-${childKey}` to avoid collisions
   - Return children instead of parent
3. Otherwise, return items unchanged

### Integration

Update all 7 tree providers (Repository, Pipeline, WorkItem, Dashboard, Wiki, TestPlan, Agents):

```typescript
this.#rootTreePartProvider = new UnwrappingTreePartProvider(
  new CombiningTreePartProvider({
    pinnedItems: ...,
    accounts: accountTreeProvider.getTreePartProvider(undefined),
  }),
  (count) => count === 1, // Unwrap when single item
  (item) => this.getTreePartProvider(item), // Child provider lookup
  3 // Max 3 levels of unwrapping
);
```

### Context Menu Handling

When items are unwrapped, they appear at different tree levels but:

- **ViewItem context values remain unchanged** (good for `when` clauses)
- **Item.data contains full context chain** (account + project + specific data)
- **Commands continue to work** as they rely on `item.data`, not tree position

**View-level commands:**

Add account/project management commands to view title toolbar with `when` clauses that detect when items aren't visible (future enhancement).

## Benefits

1. **Better UX for common case**: Most users have 1 account/project - tree is flatter
2. **No loss of functionality**: Multi-account/project users see current hierarchy
3. **Generic solution**: Works for any tree level, reusable
4. **Automatic adaptation**: Tree restructures when accounts/projects are added/removed
5. **Preserves all commands**: Context menus work regardless of tree depth

## Open Questions

1. **Depth limit**: Currently set to 3 - is this sufficient?
2. **Empty state**: If unwrapping results in 0 items, should we show the parent anyway?
3. **State preservation**: Should we try to preserve expansion state when transitioning between wrapped/unwrapped modes?
4. **View-level command fallback**: When account node is hidden, should account actions move to view toolbar, or is context menu on projects sufficient?

## Implementation Status

- [x] Plan documented
- [x] UnwrappingTreePartProvider implemented
- [ ] Integration with 7 tree providers
- [ ] Testing with different account/project counts
- [ ] View-level command enhancements
- [ ] Documentation updates
