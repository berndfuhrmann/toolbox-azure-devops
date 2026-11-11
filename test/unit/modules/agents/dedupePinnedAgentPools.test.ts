import { firstValueFrom } from "rxjs";
import { dedupePinnedAgentPools } from "../../../../src/modules/agents/dedupePinnedAgentPools";

function agentPool(accountId: string, agentPoolId: number, extra: object = {}) {
  return { type: "agentPool", account: { accountId }, agentPoolId, ...extra };
}

describe("dedupePinnedAgentPools", () => {
  test("removes the normal agent pool when the same pool is pinned", async () => {
    const items = new Map<string, any>([
      ["pinnedAgentPools|1", agentPool("account", 7, { pinned: true, pinnedInstance: true })],
      ["accounts|7", agentPool("account", 7, { pinned: true })],
      ["accounts|8", agentPool("account", 8)],
    ]);

    expect(await firstValueFrom(dedupePinnedAgentPools(items))).toEqual(new Set(["accounts|7"]));
  });

  test("keeps agent pools with the same id from a different account", async () => {
    const items = new Map<string, any>([
      ["pinnedAgentPools|1", agentPool("account-a", 7, { pinned: true, pinnedInstance: true })],
      ["accounts|7", agentPool("account-b", 7)],
    ]);

    expect(await firstValueFrom(dedupePinnedAgentPools(items))).toEqual(new Set());
  });

  test("ignores items that are not agent pools", async () => {
    const items = new Map<string, any>([
      ["pinnedAgentPools|1", agentPool("account", 7, { pinned: true, pinnedInstance: true })],
      ["accounts|account", { type: "account", account: { accountId: "account" }, agentPoolId: 7 }],
    ]);

    expect(await firstValueFrom(dedupePinnedAgentPools(items))).toEqual(new Set());
  });
});
