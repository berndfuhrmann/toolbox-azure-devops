import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import * as fs from "fs";
import { Uri } from "vscode";
import { IconService } from "../../../../src/common/icons/IconService";

vi.mock("fs", async (importOriginal) => {
  const actual = await importOriginal<typeof import("fs")>();
  return { ...actual, readFileSync: vi.fn() };
});

const LightBaseSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="#000000" fill="none"><path d="M5 12h14"/></svg>`;
const DarkBaseSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="#c5c5c5" fill="none"><path d="M5 12h14"/></svg>`;
const OverlaySvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="#d6a500" fill="none"><path d="M12 5v14"/></svg>`;

const DataUriPrefix = "data:image/svg+xml;base64,";
const extensionUri = Uri.file("/test/extension");

function decodeDataUri(uri: Uri): string {
  const str = uri.toString(true);
  expect(str.startsWith(DataUriPrefix), `expected data URI, got: ${str.slice(0, 60)}`).toBe(true);
  return Buffer.from(str.slice(DataUriPrefix.length), "base64").toString("utf8");
}

function assertIsDataUri(uri: Uri): void {
  expect(uri.toString(true).startsWith(DataUriPrefix)).toBe(true);
}

function normalizePath(p: unknown) {
  return String(p).replace(/\\/g, "/");
}

function mockReadFileSync(overlayExists = true) {
  vi.mocked(fs.readFileSync as (path: unknown, options?: unknown) => string).mockImplementation((filePath) => {
    const p = normalizePath(filePath);
    if (p.includes("/resources/light/")) return LightBaseSvg;
    if (p.includes("/resources/dark/")) return DarkBaseSvg;
    if (overlayExists && p.includes("/resources/overlays/")) return OverlaySvg;
    throw Object.assign(new Error(`ENOENT: ${filePath}`), { code: "ENOENT" });
  });
}

let service: IconService;

beforeEach(() => {
  service = new IconService(extensionUri);
});

afterEach(() => {
  vi.resetAllMocks();
});

describe("getNamedIcon", () => {
  describe("without overlays", () => {
    test("returns file URIs, no disk reads", () => {
      service.getNamedIcon("folder");
      expect(fs.readFileSync).not.toHaveBeenCalled();
    });

    test("light URI points to resources/light/{name}.svg", () => {
      const { light } = service.getNamedIcon("folder");
      expect(normalizePath(light.toString())).toContain("/resources/light/folder.svg");
    });

    test("dark URI points to resources/dark/{name}.svg", () => {
      const { dark } = service.getNamedIcon("folder");
      expect(normalizePath(dark.toString())).toContain("/resources/dark/folder.svg");
    });
  });

  describe("with overlays", () => {
    test("returns data URIs", () => {
      mockReadFileSync();
      const { light, dark } = service.getNamedIcon("folder", ["pin"]);
      assertIsDataUri(light);
      assertIsDataUri(dark);
    });

    test("light and dark composites differ", () => {
      mockReadFileSync();
      const { light, dark } = service.getNamedIcon("folder", ["pin"]);
      expect(light.toString()).not.toBe(dark.toString());
    });

    test("light composite preserves light stroke color", () => {
      mockReadFileSync();
      const { light } = service.getNamedIcon("folder", ["pin"]);
      expect(decodeDataUri(light)).toContain("#000000");
    });

    test("dark composite preserves dark stroke color", () => {
      mockReadFileSync();
      const { dark } = service.getNamedIcon("folder", ["pin"]);
      expect(decodeDataUri(dark)).toContain("#c5c5c5");
    });

    test("overlay color appears in composite when overlay file exists", () => {
      mockReadFileSync(true);
      const { light } = service.getNamedIcon("folder", ["pin"]);
      expect(decodeDataUri(light)).toContain("#d6a500");
    });

    test("missing overlay file is silently skipped, base icon still renders", () => {
      mockReadFileSync(false);
      const { light } = service.getNamedIcon("folder", ["pin"]);
      const svg = decodeDataUri(light);
      expect(svg).toContain("#000000");
      expect(svg).not.toContain("#d6a500");
    });

    test("result is cached — same Uri instances on repeated calls", () => {
      mockReadFileSync();
      const first = service.getNamedIcon("folder", ["pin"]);
      const second = service.getNamedIcon("folder", ["pin"]);
      expect(first.light).toBe(second.light);
      expect(first.dark).toBe(second.dark);
    });

    test("disk reads are cached — readFileSync called once per theme across repeated calls", () => {
      mockReadFileSync();
      service.getNamedIcon("folder", ["pin"]);
      service.getNamedIcon("folder", ["pin"]);
      const iconCalls = vi.mocked(fs.readFileSync).mock.calls.filter(([p]) => {
        const normalized = normalizePath(p);
        return normalized.includes("/resources/light/") || normalized.includes("/resources/dark/");
      });
      expect(iconCalls.length).toBe(2); // once for light, once for dark
    });
  });
});

describe("getSvgIcon", () => {
  test("without overlays returns a data URI", () => {
    assertIsDataUri(service.getSvgIcon(LightBaseSvg));
  });

  test("without overlays encoded SVG is recoverable", () => {
    const uri = service.getSvgIcon(LightBaseSvg);
    expect(decodeDataUri(uri)).toContain("<path");
  });

  test("without overlays result is cached — same Uri instance", () => {
    const first = service.getSvgIcon(LightBaseSvg);
    const second = service.getSvgIcon(LightBaseSvg);
    expect(first).toBe(second);
  });

  test("different SVGs produce different Uris", () => {
    const a = service.getSvgIcon(LightBaseSvg);
    const b = service.getSvgIcon(DarkBaseSvg);
    expect(a.toString()).not.toBe(b.toString());
  });

  test("with overlays includes overlay color", () => {
    mockReadFileSync(true);
    const uri = service.getSvgIcon(LightBaseSvg, ["pin"]);
    expect(decodeDataUri(uri)).toContain("#d6a500");
  });

  test("with overlays missing overlay file is silently skipped", () => {
    mockReadFileSync(false);
    const uri = service.getSvgIcon(LightBaseSvg, ["pin"]);
    const svg = decodeDataUri(uri);
    expect(svg).not.toContain("#d6a500");
    expect(svg).toContain("#000000");
  });

  test("with overlays result is cached — same Uri instance", () => {
    mockReadFileSync();
    const first = service.getSvgIcon(LightBaseSvg, ["pin"]);
    const second = service.getSvgIcon(LightBaseSvg, ["pin"]);
    expect(first).toBe(second);
  });

  test("with overlays, malformed base SVG falls back to empty SVG and does not throw", () => {
    mockReadFileSync();
    let uri!: Uri;
    expect(() => {
      uri = service.getSvgIcon("<definitely-not-an-svg/>", ["pin"]);
    }).not.toThrow();
    assertIsDataUri(uri);
  });

  test("with overlays, non-SVG root element falls back to empty SVG and does not throw", () => {
    mockReadFileSync();
    let uri!: Uri;
    expect(() => {
      uri = service.getSvgIcon(`<root xmlns="http://www.w3.org/2000/svg"><path d="M0 0"/></root>`, ["pin"]);
    }).not.toThrow();
    assertIsDataUri(uri);
  });
});
