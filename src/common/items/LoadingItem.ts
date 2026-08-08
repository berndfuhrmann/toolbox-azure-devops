export const loadingSymbol = Symbol("loading");

export interface LoadingItem {
  name: string;
  icon: string;
  [loadingSymbol]: true;
}

export function isLoadingItem(item: any) {
  return item && typeof item === "object" && loadingSymbol in item;
}
