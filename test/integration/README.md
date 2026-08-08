# Integration Tests

Integration tests for the Azure DevOps VSCode extension. These tests run in a real VSCode instance and test the full extension functionality.

## Architecture

Integration tests differ from unit tests in several ways:

- **Real VSCode Environment**: Tests run in an actual VSCode instance via `@vscode/test-electron`
- **Real Extension Activation**: The extension is activated and the full dependency injection container is used
- **Test Isolation**: Tests use `MemoryStorageService` instead of `VSCodeStorageService` to avoid persisting state
- **Mock Azure DevOps APIs**: API calls to Azure DevOps are mocked (currently limited - tests focus on storage-driven updates)

## Structure

```
test/integration/
├── extension.test.ts        # Main test suite that imports all test files
├── helpers.ts               # Shared test utilities
├── mocks/
│   ├── MemoryStorageService.ts  # In-memory storage for test isolation
│   └── MockData.ts          # Sample test data
└── README.md                # This file
```

## Running Tests

```bash
# Compile tests and extension, then run integration tests
pnpm run inttest

# Or step by step:
pnpm run compile-tests  # Compile TypeScript tests to out/
pnpm run compile        # Compile extension
pnpm run lint          # Check code quality
pnpm exec vscode-test   # Run tests in VSCode
```

## Writing Tests

### Basic Pattern

```typescript
import * as assert from "assert";
import { types } from "../../src/generated/types";
import { YourTreeProvider } from "../../src/modules/.../YourTreeProvider";
import { getExtensionContainer, getStorageService } from "./helpers";

suite("YourTreeProvider Integration Tests", () => {
  let provider: YourTreeProvider;

  setup(async () => {
    const container = getExtensionContainer();
    provider = container.get<YourTreeProvider>(types.YourTreeProvider);

    // Clear state for test isolation
    const storageService = getStorageService(container);
    storageService.clear();
  });

  test("should do something", async () => {
    // Your test here
  });
});
```

### Helper Functions

#### `getExtensionContainer()`

Gets the extension's dependency injection container. On first call, replaces `VSCodeStorageService` with `MemoryStorageService` for test isolation.

#### `getStorageService(container)`

Returns the `MemoryStorageService` instance used for testing. Use this to manipulate accounts and pinned items.

```typescript
const storageService = getStorageService(container);
await storageService.addAccount(createTestAccount());
storageService.clear(); // Reset state
```

#### `setupTreeView(provider, viewId)`

Creates a real VSCode tree view for the provider and returns:

- `treeView`: The VSCode TreeView instance
- `waitForUpdate()`: Promise that resolves when `onDidChangeTreeData` fires
- `dispose()`: Clean up the tree view

```typescript
const { waitForUpdate, dispose } = setupTreeView(provider, "test-tree-id");
const updatePromise = waitForUpdate();
// ... make changes ...
await updatePromise; // Waits for tree refresh
dispose(); // Clean up
```

#### `assertTreeStructure(provider, parent, predicates)`

Assert that the tree structure matches expectations:

```typescript
await assertTreeStructure(provider, undefined, [(item) => item instanceof AccountTreeItem && item.label === "MyOrg"]);
```

## Current Test Coverage

- ⏳ **PipelineTreeProvider**: Not yet implemented
- ⏳ **RepositoryTreeProvider**: Not yet implemented
- ⏳ **WorkItemTreeProvider**: Not yet implemented
- ⏳ **Command Execution**: Not yet implemented

## Future Enhancements

1. **Mock Azure DevOps API**: Currently tests focus on storage-driven updates. Add mocking for API responses to test full data flow including project listings, repositories, pipelines, etc.

2. **Command Testing**: Test context menu commands like "Create Folder", "Delete Pipeline", etc.

3. **Pinning Integration**: Test pinning/unpinning items and verify decoration updates.

4. **Multi-level Expansion**: Test deep tree hierarchies (account → project → pipeline → run → artifact).

5. **Error Handling**: Test error cases like invalid accounts, network failures, API errors.

## Notes

- Integration tests use Mocha (not Vitest like unit tests)
- Tests should be independent - use `setup()` to clear state
- Tests run slower than unit tests - keep them focused on integration concerns
- Use unit tests for detailed logic testing, integration tests for full data flow
