export function encodeStoredPin(name: string, object: string): string {
  return JSON.stringify({ name, object });
}

export function decodeStoredPin(stored: string): { name: string; object: string } {
  try {
    const parsed = JSON.parse(stored);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      typeof parsed.name === "string" &&
      typeof parsed.object === "string"
    ) {
      return { name: parsed.name, object: parsed.object };
    }
  } catch {}
  return { name: "", object: stored };
}
