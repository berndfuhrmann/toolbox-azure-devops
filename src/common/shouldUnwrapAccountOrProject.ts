import { map, type Observable } from "rxjs";
import { isSignedOutAccountItem } from "../modules/core/items/AccountItem";

export function shouldUnwrapAccountOrProject<Item>(config: Observable<boolean>) {
  return (items: Map<string, Item>) =>
    config.pipe(
      map(
        (configValue) =>
          configValue &&
          !items.has("exception") &&
          items.size === 1 &&
          // a signed-out organization has to stay visible, so that the user can sign in
          ![...items.values()].some((item) =>
            isSignedOutAccountItem(item as { type?: unknown; signInStatus?: unknown }),
          ),
      ),
    );
}
