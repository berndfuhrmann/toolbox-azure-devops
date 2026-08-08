# Project: Inofficial Azure Devops VSCode extension

This is a VSCode extension. The goal is to offer convenient ways to interact with Microsoft Azure Devops from inside of VSCode.

## Project structure

- consists of a single package in the root directory.
- `src` contains the source code
- `src-gen` contains the code generation tooling (see below)
- `test/unit` contains unit tests, using vitest
- `test/integration` contains integration tests, using vscode-test
- `test/e2e` contains vagrant configuration to spin up a TFS server in Hyper-V for testing

## Code Generation (`src-gen`)

This project uses **Eclipse Epsilon** (EGL/EOL) with Maven for model-driven code generation. Generated TypeScript files are placed in `src/generated/`.

### Components

- **Meta-Model** (`meta-model.emf`): EMFatic file defining the structure for Services, TreeProviders, TreeItems, etc.
- **Model** (`model.flexmi`): Flexmi XML instance defining all Azure DevOps services, tree providers, and tree items
- **Templates** (`.egl` files): EGL templates that transform the model into TypeScript code
  - `ApiService.egl` → generates `ApiService.ts` (API client wrapper with RxJS observables)
  - `services.egl` → generates `services.ts` (service classes with caching and pagination support)
  - `types.egl` → generates `types.ts` (inversify dependency injection symbols)
  - `register.egl` → generates `register.ts` (inversify container registration)
- **Operations** (`.eol` files): EOL helper operations used by templates
  - `common.eol`: Common operations for string manipulation
  - `services.eol`: Service-specific operations for key types, implementations, etc.
- **Generator** (`generator/`): Maven project that executes the Epsilon transformations
- **Icons** (`prepare-icons.mjs`): Node script to copy and colorize SVG icons from `@tabler/icons`

### Running Code Generation

```bash
pnpm run src-gen
```

### How it Works

1. Maven loads `model.flexmi` against `meta-model.emf`
2. EGL templates query the model using EOL operations
3. Generated TypeScript files provide:
   - API service wrappers for all Azure DevOps REST APIs
   - Dependency injection type symbols
   - Service registration and initialization code
   - RxJS-based reactive data streams with caching and pagination

### Coding style for Eclipse Epsilon

- It's ok to have unnecessary imports if that makes the generation code simpler
- Instead of making a chain of if-then-else-if, checking types, consider making an operation on the base type and override it for each type.

### Adding New Services/APIs

1. Edit `model.flexmi` to add service definitions with methods and parameters
2. Run `pnpm run src-gen` to regenerate TypeScript files
3. Implement module-specific logic in `src/modules/`

## Technology choices

- `typescript`
- `eslint`
- `prettier` (always use `pnpm exec prettier` for formatting, never `npx`)
- `@sinclair/typebox` for type checking
- `rxjs` for reactivity
- `inversify` for dependency injection
- `@nfi/tuplemap` for multi-dimensional maps

## Coding Conventions

- **Constants**: Use camelCase for constants (e.g., `const pipelineFolderMimeType = '...'`)
- **Abbreviations**: Avoid abbreviations in variable names unless they are well-known (e.g., XML, HTML, JSON, API). Write out full words to reduce mental load (e.g., use `workItemQuery` instead of `wiql`, `workItem` instead of `wi`, `parameters` instead of `params`)
- **Function Properties**: Do not use Hungarian notation suffixes like "Fn" for function-typed properties. The type system makes it clear these are functions (e.g., use `cacheKey` instead of `cacheKeyFn`, `batchLoad` instead of `batchLoadFn`)
- **Private Members**: Prefer JavaScript private fields using `#` prefix over TypeScript's `private` keyword for true runtime privacy (e.g., `#cache` instead of `private cache`)

## TreeProvider Conventions

- **Pinned Items**: When implementing tree provider sorting, pinned items should always be sorted before normal items in the tree view

## Adding a New Command

To add a new command to the extension, follow these steps:

1. **Implement the action function** in the appropriate module under `src/modules/`
   - Create or update the action file (e.g., `src/modules/pipeline/actions/folderActions.ts`)
   - The action should return a function that accepts a `TreeItem` parameter
   - Add any necessary helper functions that interact with the API
   - Use `vscode.window.showInputBox()` for user input
   - Use `vscode.window.showWarningMessage()` with `{ modal: true }` for confirmations
   - Call `refreshRefreshable(data)` after making changes to update the UI

2. **Register the command in `package.json`**
   - Add the command definition to the `contributes.commands` array
   - Add the command to the appropriate context menu in `contributes.menus.view/item/context`
   - Use the `when` clause to control when the command appears (e.g., `viewItem =~ /,pipeline.folder,/`)

3. **Register the command in `extension.ts`**
   - Import the action function from the module
   - Register it using `vscode.commands.registerCommand()`
   - Pass the container instance to the action function

4. **Write tests** in `test/unit/`
   - Create or update the test file (e.g., `test/unit/modules/pipeline/actions/folderActions.test.ts`)
   - Mock the necessary services (ApiService, AccountContextProvider, etc.)
   - Test successful execution paths
   - Test user cancellation scenarios
   - Test edge cases (invalid input, wrong tree item types, etc.)
   - Use `vi.mocked()` to mock VSCode APIs like `showInputBox` and `showWarningMessage`

## Testing using vitest

- Use `test` instead of `it`.

## Testing with vscode-test

- Not yet used, ignore for now.
