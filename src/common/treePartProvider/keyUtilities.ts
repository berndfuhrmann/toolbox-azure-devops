export function createCompositeKey(parentKey: string | null, childKey: string) {
  return JSON.stringify([parentKey, childKey]);
}

export function getChildKey(compositeKey: string) {
  const json = JSON.parse(compositeKey);
  return json[1] as string;
}
