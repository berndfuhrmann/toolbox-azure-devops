import { of } from "rxjs";
import { isPinnedInstance } from "../../common/items/PinnedItem";
import { getGitRepositoryItemKey, isGitRepositoryItem } from "./items/GitRepositoryItem";

export function dedupePinnedRepositories(items: Map<string, any>) {
  const pinnedRepositories = new Set(
    items
      .values()
      .filter((item) => isPinnedInstance(item) && isGitRepositoryItem(item))
      .map((item) => getGitRepositoryItemKey(item)),
  );
  const toRemove = new Set(
    items
      .entries()
      .filter(
        ([_key, value]) =>
          isGitRepositoryItem(value) &&
          !isPinnedInstance(value) &&
          pinnedRepositories.has(getGitRepositoryItemKey(value)),
      )
      .map(([key, _value]) => key),
  );
  return of(toRemove);
}
