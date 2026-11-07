import { compareProjectContext, createProjectItem } from "../../../../../src/modules/core/items/ProjectItem";

vi.mock("../../../../../src/modules/core/items/AccountItem", async (importOriginal) => ({
  ...(await importOriginal()),
  compareAccountContext: vi.fn(),
}));
import { createAccountItem, compareAccountContext } from "../../../../../src/modules/core/items/AccountItem";
import { Account } from "../../../../../src/modules/core/account";
import { Container } from "inversify";

const accountBase = createAccountItem({} as Account, new Container(), "signedIn");

describe("compareProjectContext", () => {
  test("returns true if both account and project are equal", () => {
    const a = createProjectItem(accountBase, { id: "1", name: "A" }, {});
    const b = createProjectItem(accountBase, { id: "1", name: "A" }, {});
    (compareAccountContext as ReturnType<typeof vi.fn>).mockReturnValue(true);
    expect(compareProjectContext(a, b)).toBe(true);
  });

  test("returns false if compareAccountContext is false", () => {
    const a = createProjectItem(accountBase, { id: "1", name: "A" }, {});
    const b = createProjectItem(accountBase, { id: "2", name: "B" }, {});
    (compareAccountContext as ReturnType<typeof vi.fn>).mockReturnValue(false);
    expect(compareProjectContext(a, b)).toBe(false);
  });

  test("returns false if project is not deep equal", () => {
    const a = createProjectItem(accountBase, { id: "1", name: "A" }, {});
    const b = createProjectItem(accountBase, { id: "2", name: "B" }, {});
    (compareAccountContext as ReturnType<typeof vi.fn>).mockReturnValue(true);
    expect(compareProjectContext(a, b)).toBe(false);
  });
});
