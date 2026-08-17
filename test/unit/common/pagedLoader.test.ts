import { pagedLoader } from "../../../src/common/pagedLoader";
import { PagedList } from "azure-devops-node-api/interfaces/common/VSSInterfaces";

async function runTest(length: number) {
  const elements = [...Array(length).keys()];
  const loader = async (token: string | undefined) => {
    let start = 0;
    if (typeof token === "string") {
      start = Number(token);
    }
    const end = start + 3;
    const result: PagedList<number> = elements.slice(start, end);
    result.continuationToken = end < elements.length ? `${start + 3}` : undefined;
    return result;
  };
  const result = await pagedLoader(loader);
  expect(result).toMatchObject(elements);
}

test("0", async () => {
  runTest(0);
});

test("1", async () => {
  runTest(1);
});

test("5", async () => {
  runTest(1);
});

test("20", async () => {
  runTest(1);
});
