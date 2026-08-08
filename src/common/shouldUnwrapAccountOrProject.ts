import { map, type Observable } from "rxjs";

export function shouldUnwrapAccountOrProject<Item>(config: Observable<boolean>) {
  return (items: Map<string, Item>) =>
    config.pipe(map((configValue) => configValue && !items.has("exception") && items.size === 1));
}
