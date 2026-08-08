import { randomUUID } from "crypto";
import { isDeepStrictEqual } from "node:util";
import { Command, MarkdownString, TreeItem, TreeItemCollapsibleState, TreeItemLabel, Uri } from "vscode";
import { extensionUrlScheme } from "../../config";
import { IconService } from "../icons/IconService";
import type { AbstractTreeProvider } from "../AbstractTreeProvider";

export abstract class AbstractTreeItem<Data> extends TreeItem {
  public data!: Data;
  #treeProvider: AbstractTreeProvider<any> | undefined;
  #iconName: string | undefined;
  #iconSVG: string | undefined;
  #iconOverlays: readonly string[] = [];
  #iconService: IconService | undefined = undefined;

  constructor() {
    super("");
    this.id = randomUUID();
    this.contextValue = ",";
    this.resourceUri = Uri.from({
      scheme: extensionUrlScheme,
      path: this.id,
    });
  }

  public get treeProvider(): AbstractTreeProvider<any> {
    if (this.#treeProvider === undefined) {
      throw new Error("treeProvider not set");
    }
    return this.#treeProvider;
  }

  public set treeProvider(value: AbstractTreeProvider<any>) {
    if (this.#treeProvider !== undefined) {
      throw new Error("treeProvider already set");
    }
    this.#treeProvider = value;
  }

  #getTagString(tag: string) {
    return `,${tag},`;
  }

  public hasTag(tag: string) {
    return this.contextValue !== undefined && this.contextValue.includes(this.#getTagString(tag));
  }

  protected addContextTag(tag: string) {
    if (!this.contextValue) {
      this.contextValue = ",";
    }
    if (this.hasTag(tag)) {
      return false;
    }
    this.contextValue += `${tag},`;
    return true;
  }

  protected removeContextTag(tag: string) {
    if (!this.contextValue) {
      this.contextValue = ",";
    }
    const index = this.contextValue.indexOf(this.#getTagString(tag));
    if (index < 0) {
      return false;
    }
    this.contextValue =
      this.contextValue.substring(0, index) +
      this.contextValue.substring(index + tag.length + 1, this.contextValue.length);
    return true;
  }

  protected updateTag(tag: string, present: boolean) {
    if (present) {
      return this.addContextTag(tag);
    } else {
      return this.removeContextTag(tag);
    }
  }

  public updateFrom(input: Data) {
    this.data = input;
    return false;
  }

  protected updateLabel(label: string | TreeItemLabel | undefined) {
    if (isDeepStrictEqual(this.label, label)) {
      return false;
    } else {
      this.label = label;
      return true;
    }
  }

  protected updateTooltip(tooltip: string | MarkdownString | undefined) {
    if (isDeepStrictEqual(this.tooltip, tooltip)) {
      return false;
    } else {
      this.tooltip = tooltip;
      return true;
    }
  }

  protected updateDescription(description: string | boolean | undefined) {
    if (isDeepStrictEqual(this.description, description)) {
      return false;
    } else {
      this.description = description;
      return true;
    }
  }

  protected updateCollapsibleState(collapsibleState: TreeItemCollapsibleState | undefined) {
    const oldValue = this.collapsibleState;
    if (oldValue !== collapsibleState) {
      this.collapsibleState = collapsibleState;
      return true;
    } else {
      return false;
    }
  }

  protected updateIcon(iconName: string | undefined, overlays?: readonly string[]): boolean {
    const newOverlays = overlays ?? this.#iconOverlays;
    if (this.#iconName === iconName && this.#overlaysEqual(this.#iconOverlays, newOverlays)) {
      return false;
    }
    this.setIcon(iconName, newOverlays);
    return true;
  }

  protected updateIconSVG(iconSVG: string | undefined, overlays?: readonly string[]): boolean {
    const newOverlays = overlays ?? this.#iconOverlays;
    if (this.#iconSVG === iconSVG && this.#overlaysEqual(this.#iconOverlays, newOverlays)) {
      return false;
    }
    this.setIconSVG(iconSVG, newOverlays);
    return true;
  }

  protected updateIconOverlays(overlays: readonly string[]): boolean {
    if (this.#overlaysEqual(this.#iconOverlays, overlays)) {
      return false;
    }
    this.#iconOverlays = overlays;
    this.#updateIconPath();
    return true;
  }

  #overlaysEqual(a: readonly string[], b: readonly string[]): boolean {
    if (a === b) {
      return true;
    }
    if (a.length !== b.length) {
      return false;
    }
    return a.every((v, i) => v === b[i]);
  }

  #compareCommand(c1: Command | undefined, c2: Command | undefined) {
    if (c1 === c2) {
      return true;
    }
    if (c1 === undefined || c2 === undefined) {
      return false;
    }
    if (c1.command !== c2.command) {
      return false;
    }
    if (c1.title !== c2.title) {
      return false;
    }
    if (c1.tooltip !== c2.tooltip) {
      return false;
    }
    if (c1.arguments !== c2.arguments) {
      const a1 = c1.arguments;
      const a2 = c2.arguments;
      if (a1 === undefined || a2 === undefined) {
        return false;
      }
      if (a1.length !== a2.length) {
        return false;
      }
      for (let i = 0; i < a1.length; i++) {
        if (a1[i] !== a2[i]) {
          return false;
        }
      }
    }
    return true;
  }

  protected updateCommand(command: Command | undefined) {
    const oldValue = this.command;
    if (this.#compareCommand(oldValue, command)) {
      return false;
    } else {
      this.command = command;
      return true;
    }
  }

  protected setIconService(service: IconService) {
    this.#iconService = service;
    this.#updateIconPath();
  }

  #updateIconPath() {
    this.iconPath = undefined;
    if (!this.#iconService) {
      return;
    }
    if (typeof this.#iconName === "string") {
      this.iconPath = this.#iconService.getNamedIcon(this.#iconName, this.#iconOverlays);
    } else if (typeof this.#iconSVG === "string") {
      this.iconPath = this.#iconService.getSvgIcon(this.#iconSVG, this.#iconOverlays);
    }
  }

  protected setIcon(iconName: string | undefined, overlays?: readonly string[]) {
    this.#iconName = iconName;
    this.#iconSVG = undefined;
    if (overlays !== undefined) {
      this.#iconOverlays = overlays;
    }
    this.#updateIconPath();
  }

  protected setIconSVG(iconSVG: string | undefined, overlays?: readonly string[]) {
    this.#iconSVG = iconSVG;
    this.#iconName = undefined;
    if (overlays !== undefined) {
      this.#iconOverlays = overlays;
    }
    this.#updateIconPath();
  }
}
