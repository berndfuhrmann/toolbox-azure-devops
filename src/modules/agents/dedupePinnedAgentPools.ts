import { of } from "rxjs";
import { isPinnedInstance } from "../../common/items/PinnedItem";
import { getAgentPoolItemKey, isAgentPoolItem } from "./items/AgentPoolItem";

export function dedupePinnedAgentPools(items: Map<string, any>) {
  const pinnedAgentPools = new Set(
    items
      .values()
      .filter((item) => isPinnedInstance(item) && isAgentPoolItem(item))
      .map((item) => getAgentPoolItemKey(item)),
  );
  const toRemove = new Set(
    items
      .entries()
      .filter(
        ([_key, value]) =>
          isAgentPoolItem(value) && !isPinnedInstance(value) && pinnedAgentPools.has(getAgentPoolItemKey(value)),
      )
      .map(([key, _value]) => key),
  );
  return of(toRemove);
}
