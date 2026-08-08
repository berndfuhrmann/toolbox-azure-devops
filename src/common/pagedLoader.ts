import { PagedList } from "azure-devops-node-api/interfaces/common/VSSInterfaces";
export async function pagedLoader<T>(loader: (token: string | undefined) => Promise<PagedList<T>>) {
  const result: T[] = [];
  let token: undefined | string = undefined;
  do {
    const items = await loader(token);
    token = items.continuationToken;
    result.push(...items);
  } while (token !== undefined);
  return result;
}
