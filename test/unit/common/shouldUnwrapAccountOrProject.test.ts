import { firstValueFrom, of } from "rxjs";
import { shouldUnwrapAccountOrProject } from "../../../src/common/shouldUnwrapAccountOrProject";

test.each([
  [true, ["project"], true],
  [false, ["project"], false],
  [true, ["project", "other"], false],
  [true, ["exception"], false],
])("unwrap setting %s with items %j: %s", async (setting, keys, expected) => {
  const items = new Map(keys.map((key) => [key, {}]));
  expect(await firstValueFrom(shouldUnwrapAccountOrProject(of(setting))(items))).toBe(expected);
});

test.each([
  ["signedIn", true],
  ["signedOut", false],
])("unwraps a single account with status %s: %s", async (status, expected) => {
  const items = new Map([["account", { type: "account", signInStatus: status }]]);
  expect(await firstValueFrom(shouldUnwrapAccountOrProject(of(true))(items))).toBe(expected);
});
