import { Document, DOMParser, Element, XMLSerializer } from "@xmldom/xmldom";
import { createHash } from "crypto";
import * as fs from "fs";
import * as path from "path";
import { Uri } from "vscode";

type IconTheme = "light" | "dark";

const SvgNamespace = "http://www.w3.org/2000/svg";
const svgParser = new DOMParser();
const svgSerializer = new XMLSerializer();
const FallbackSvg = `<svg xmlns="${SvgNamespace}" viewBox="0 0 24 24"></svg>`;

export class IconService {
  #extensionUri: Uri;
  #diskIconCache: Map<string, string> = new Map();
  #compositeCache: Map<string, Uri> = new Map();

  constructor(extensionUri: Uri) {
    this.#extensionUri = extensionUri;
  }

  getNamedIcon(name: string, overlays: readonly string[] = []): { light: Uri; dark: Uri } {
    if (overlays.length === 0) {
      return {
        light: Uri.joinPath(this.#extensionUri, "resources", "light", `${name}.svg`),
        dark: Uri.joinPath(this.#extensionUri, "resources", "dark", `${name}.svg`),
      };
    }
    return {
      light: this.#getCompositeNamedIcon(name, "light", overlays),
      dark: this.#getCompositeNamedIcon(name, "dark", overlays),
    };
  }

  getSvgIcon(svg: string, overlays: readonly string[] = []): Uri {
    const hash = createHash("sha256").update(svg).digest("hex").substring(0, 16);
    const key = `svg:${hash}:${overlays.join(":")}`;
    let cached = this.#compositeCache.get(key);
    if (cached === undefined) {
      const composed = overlays.length > 0 ? this.#compose(svg, overlays) : svg;
      cached = this.#svgToUri(composed);
      this.#compositeCache.set(key, cached);
    }
    return cached;
  }

  #getCompositeNamedIcon(name: string, theme: IconTheme, overlays: readonly string[]): Uri {
    const key = `${theme}:${name}:${overlays.join(":")}`;
    let cached = this.#compositeCache.get(key);
    if (cached === undefined) {
      const baseSvg = this.#readDiskIcon(name, theme);
      const composed = this.#compose(baseSvg, overlays);
      cached = this.#svgToUri(composed);
      this.#compositeCache.set(key, cached);
    }
    return cached;
  }

  #readDiskIcon(name: string, theme: IconTheme): string {
    const key = `${theme}:${name}`;
    let cached = this.#diskIconCache.get(key);
    if (cached !== undefined) {
      return cached;
    }
    const filePath = path.join(this.#extensionUri.fsPath, "resources", theme, `${name}.svg`);
    cached = fs.readFileSync(filePath, "utf8");
    this.#diskIconCache.set(key, cached);
    return cached;
  }

  #overlayContent(name: string): string {
    const key = `overlay:${name}`;
    let cached = this.#diskIconCache.get(key);
    if (cached !== undefined) {
      return cached;
    }
    try {
      const filePath = path.join(this.#extensionUri.fsPath, "resources", "overlays", `${name}.svg`);
      cached = fs.readFileSync(filePath, "utf8");
    } catch {
      cached = "";
    }
    this.#diskIconCache.set(key, cached);
    return cached;
  }

  #parseSvg(svg: string): Element {
    try {
      const root = svgParser.parseFromString(svg, "image/svg+xml").documentElement;
      if (root?.tagName === "svg") {
        return root;
      }
    } catch {
      // fall through to fallback
    }
    return svgParser.parseFromString(FallbackSvg, "image/svg+xml").documentElement!;
  }

  #nestSvg(into: Document, source: Element, x: number, y: number, size: number): Element {
    const nested = into.createElementNS(SvgNamespace, "svg");
    for (const attr of Array.from(source.attributes)) {
      nested.setAttribute(attr.name, attr.value);
    }
    nested.setAttribute("x", String(x));
    nested.setAttribute("y", String(y));
    nested.setAttribute("width", String(size));
    nested.setAttribute("height", String(size));
    for (const child of Array.from(source.childNodes)) {
      nested.appendChild(into.importNode(child, true));
    }
    return nested;
  }

  #compose(baseSvg: string, overlayNames: readonly string[]): string {
    const baseEl = this.#parseSvg(baseSvg);

    const compositeDoc = svgParser.parseFromString(
      `<svg xmlns="${SvgNamespace}" width="16" height="16" viewBox="0 0 16 16"></svg>`,
      "image/svg+xml",
    );
    const root = compositeDoc.documentElement!;
    root.appendChild(this.#nestSvg(compositeDoc, baseEl, 0, 0, 16));

    const positions = [
      { x: 8, y: 8 },
      { x: 0, y: 8 },
      { x: 8, y: 0 },
      { x: 0, y: 0 },
    ];

    overlayNames.forEach((name, index) => {
      if (index >= positions.length) {
        return;
      }
      const overlaySvgContent = this.#overlayContent(name);
      if (!overlaySvgContent) {
        return;
      }
      const overlayEl = this.#parseSvg(overlaySvgContent);
      const pos = positions[index];
      root.appendChild(this.#nestSvg(compositeDoc, overlayEl, pos.x, pos.y, 8));
    });

    return svgSerializer.serializeToString(root);
  }

  #svgToUri(svg: string): Uri {
    return Uri.parse(`data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`);
  }
}
