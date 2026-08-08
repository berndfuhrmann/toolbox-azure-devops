import { filter, map, Observable, pipe, scan, startWith, Subject, Subscription, switchMap } from "rxjs";
import { existingItems } from "./mapUtilities";

interface ObservableEntry<InputItem, FinalInputItem> {
  observable: Observable<FinalInputItem>;
  source: Observable<InputItem>;
}

export interface ChangeSetOfObservables<InputItem, FinalInputItem> {
  added: Map<string, ObservableEntry<InputItem, FinalInputItem>>;
  removed: Map<string, ObservableEntry<InputItem, FinalInputItem>>;
  unchanged: Map<string, ObservableEntry<InputItem, FinalInputItem>>;
}

export function changeSetOfObservablesToChangeSet<InputItem, FinalInputItem, TreeItem>(
  createTreeItem: (item: FinalInputItem) => TreeItem,
  updateItem: (item: FinalInputItem, treeItem: TreeItem) => boolean,
) {
  return pipe(
    map((x) => x as ChangeSetOfObservables<InputItem, FinalInputItem>),
    startWith({
      added: new Map<string, ObservableEntry<InputItem, FinalInputItem>>(),
      removed: new Map<string, ObservableEntry<InputItem, FinalInputItem>>(),
      unchanged: new Map<string, ObservableEntry<InputItem, FinalInputItem>>(),
    } as ChangeSetOfObservables<InputItem, FinalInputItem>),
    scan(
      (last, entries: ChangeSetOfObservables<InputItem, FinalInputItem>) => {
        const { subject, subscriptions } = last;
        entries.added.forEach((value, key) => {
          subscriptions.set(
            key,
            value.observable
              .pipe(
                scan<FinalInputItem, ["c" | "u" | "", TreeItem], undefined>((lastItemChange, finalValue) => {
                  if (lastItemChange === undefined) {
                    return ["c", createTreeItem(finalValue)] as ["c", TreeItem];
                  } else {
                    const [_, lastTreeItem] = lastItemChange;
                    return [updateItem(finalValue, lastTreeItem) ? "u" : "", lastTreeItem] as ["u" | "", TreeItem];
                  }
                }, undefined),
                filter(([changeType, _]) => changeType !== ""),
              )
              .subscribe((change) => {
                const [changeType, treeItem] = change!;
                switch (changeType) {
                  case "c":
                    subject.next({
                      added: new Map<string, TreeItem>([[key, treeItem]]),
                    });
                    break;
                  case "u":
                    subject.next({
                      updated: new Map<string, TreeItem>([[key, treeItem]]),
                    });
                    break;
                }
              }),
          );
        });
        entries.removed.forEach((v, k) => {
          subscriptions.get(k)?.unsubscribe();
          subject.next({
            removed: new Set<string>([k]),
          });
        });
        return last;
      },
      {
        subject: new Subject<{
          added?: Map<string, TreeItem>;
          updated?: Map<string, TreeItem>;
          removed?: Set<string>;
        }>(),
        subscriptions: new Map<string, Subscription>(),
      },
    ),
    switchMap((x) => x.subject),
  );
}
