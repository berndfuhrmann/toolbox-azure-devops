import { of } from "rxjs";
import { isPinnedInstance } from "../../common/items/PinnedItem";
import { getPipelineFolderItemKey, isPipelineFolderItem } from "./items/PipelineFolderItem";
import { getPipelineItemKey, isPipelineItem } from "./items/PipelineItem";

export function dedupePinnedPipelines(items: Map<string, any>) {
  const pinnedFolders = new Set(
    items
      .values()
      .filter((item) => isPinnedInstance(item) && isPipelineFolderItem(item))
      .map((item) => getPipelineFolderItemKey(item)),
  );
  const pinnedPipelines = new Set(
    items
      .values()
      .filter((item) => isPinnedInstance(item) && isPipelineItem(item))
      .map((item) => getPipelineItemKey(item)),
  );
  const toRemove = new Set(
    items
      .entries()
      .filter(
        ([_key, value]) =>
          (isPipelineFolderItem(value) &&
            pinnedFolders.has(getPipelineFolderItemKey(value)) &&
            !isPinnedInstance(value)) ||
          (isPipelineItem(value) && pinnedPipelines.has(getPipelineItemKey(value)) && !isPinnedInstance(value)),
      )
      .map(([key, _value]) => key),
  );
  return of(toRemove);
}
