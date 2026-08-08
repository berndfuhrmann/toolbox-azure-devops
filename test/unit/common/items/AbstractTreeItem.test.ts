import { expect, test, describe, beforeEach } from "vitest";
import { IconService } from "../../../../src/common/icons/IconService";
import { AbstractTreeItem } from "../../../../src/common/treeItems/AbstractTreeItem";
import { MarkdownString, TreeItemCollapsibleState, TreeItemLabel, Uri } from "vscode";

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function makeSubject() {
  return new (class extends AbstractTreeItem<any> {
    constructor() {
      super();
    }
    public addContextTag(tag: string) {
      return super.addContextTag(tag);
    }
    public removeContextTag(tag: string) {
      return super.removeContextTag(tag);
    }
    public updateIcon(iconName: string | undefined) {
      return super.updateIcon(iconName);
    }
    public setIcon(iconName: string | undefined) {
      return super.setIcon(iconName);
    }
    public setIconService(service: IconService) {
      return super.setIconService(service);
    }
    public updateLabel(label: string | TreeItemLabel | undefined) {
      return super.updateLabel(label);
    }
    public updateTooltip(tooltip: string | MarkdownString | undefined) {
      return super.updateTooltip(tooltip);
    }
    public updateCollapsibleState(collapsibleState: TreeItemCollapsibleState | undefined) {
      return super.updateCollapsibleState(collapsibleState);
    }
  })();
}

let subject: ReturnType<typeof makeSubject>;
beforeEach(() => {
  subject = makeSubject();
});

test("constructor", async () => {
  expect(subject.id).toMatch(uuidRegex);
  expect(subject.contextValue).toBe(",");
  expect(subject.resourceUri?.scheme.startsWith("toolbox")).toBeTruthy();
  expect(subject.resourceUri?.path).toBe(subject.id);
});

describe("context tags", () => {
  test("add 1", () => {
    subject.addContextTag("test");
    expect(subject.contextValue).toBe(",test,");
  });
  test("add 1 twice", () => {
    subject.addContextTag("test");
    subject.addContextTag("test");
    expect(subject.contextValue).toBe(",test,");
  });
  test("add 2", () => {
    subject.addContextTag("alpha");
    subject.addContextTag("beta");
    expect(subject.contextValue).toBe(",alpha,beta,");
  });
  test("add 2, 1 twice", () => {
    subject.addContextTag("alpha");
    subject.addContextTag("beta");
    subject.addContextTag("alpha");
    expect(subject.contextValue).toBe(",alpha,beta,");
  });
  test("remove 1", () => {
    subject.addContextTag("test");
    subject.removeContextTag("test");
    expect(subject.contextValue).toBe(",");
  });
  test("remove non-existant", () => {
    subject.removeContextTag("test");
    subject.addContextTag("test");
    expect(subject.contextValue).toBe(",test,");
  });
  test("remove non-existant, keep 1", () => {
    subject.addContextTag("test1");
    subject.removeContextTag("test2");
    expect(subject.contextValue).toBe(",test1,");
  });
});

test("updateFrom", () => {
  expect(subject.updateFrom({})).toBeFalsy();
});

describe("setIcon", () => {
  test("default", () => {
    expect(subject.iconPath).toBeUndefined();
  });
  test("set icon", () => {
    subject.setIconService(new IconService(Uri.file("/test/extension")));
    subject.setIcon("test");
    expect(subject.iconPath).toMatchObject({
      light: expect.objectContaining({
        path: expect.stringContaining("test.svg"),
      }),
      dark: expect.objectContaining({
        path: expect.stringContaining("test.svg"),
      }),
    });
  });
  test("unset icon", () => {
    subject.setIconService(new IconService(Uri.file("/test/extension")));
    subject.setIcon("test");
    subject.setIcon(undefined);
    expect(subject.iconPath).toBeUndefined();
  });
  test("change service updates icon path", () => {
    subject.setIconService(new IconService(Uri.file("/test/extension1")));
    subject.setIcon("test");
    const firstIconPath = subject.iconPath;

    subject.setIconService(new IconService(Uri.file("/test/extension2")));
    const secondIconPath = subject.iconPath;

    expect(firstIconPath).not.toEqual(secondIconPath);
    expect(secondIconPath).toMatchObject({
      light: expect.objectContaining({
        path: expect.stringContaining("extension2"),
      }),
      dark: expect.objectContaining({
        path: expect.stringContaining("extension2"),
      }),
    });
  });
});

describe("updateIcon", () => {
  test("default", () => {
    expect(subject.updateIcon(undefined)).toBeFalsy();
    expect(subject.iconPath).toBeUndefined();
  });
  test("setting icon", () => {
    subject.setIconService(new IconService(Uri.file("/test/extension")));
    expect(subject.updateIcon("test")).toBeTruthy();
    expect(subject.iconPath).not.toBeUndefined();
  });
  test("setting icon, no change", () => {
    subject.updateIcon(undefined);
    expect(subject.updateIcon(undefined)).toBeFalsy();
    expect(subject.iconPath).toBeUndefined();
  });
  test("unset icon", () => {
    subject.setIconService(new IconService(Uri.file("/test/extension")));
    subject.setIcon("test");
    expect(subject.updateIcon(undefined)).toBeTruthy();
    expect(subject.iconPath).toBeUndefined();
  });
  test("change service updates icon path", () => {
    subject.setIconService(new IconService(Uri.file("/test/extension1")));
    subject.updateIcon("myicon");
    const firstIconPath = subject.iconPath;

    subject.setIconService(new IconService(Uri.file("/test/extension2")));
    const secondIconPath = subject.iconPath;

    expect(firstIconPath).not.toEqual(secondIconPath);
    expect(secondIconPath).toMatchObject({
      light: expect.objectContaining({
        path: expect.stringContaining("extension2"),
      }),
      dark: expect.objectContaining({
        path: expect.stringContaining("extension2"),
      }),
    });
  });
});

describe("updateLabel", () => {
  test("default", () => {
    expect(subject.label).toBe("");
  });
  test("set to string", () => {
    expect(subject.updateLabel("test")).toBeTruthy();
    expect(subject.label).toBe("test");
  });
  test("set to string twice", () => {
    subject.updateLabel("test");
    expect(subject.updateLabel("test")).toBeFalsy();
    expect(subject.label).toBe("test");
  });
  test("set to TreeItemLabel", () => {
    const label = {
      label: "test-label",
      highlights: [[3, 4]] as [number, number][],
    };
    subject.updateLabel(label);
    expect(subject.label).toMatchObject(label);
  });

  test("set to same TreeItemLabel", () => {
    const label = {
      label: "test-label",
      highlights: [[3, 4]] as [number, number][],
    };
    const newLabel = structuredClone(label);
    subject.updateLabel(label);
    expect(subject.updateLabel(newLabel)).toBeFalsy();
    expect(subject.label).toMatchObject(label);
  });

  test("set to same TreeItemLabel", () => {
    const label = {
      label: "test-label",
      highlights: [[3, 4]] as [number, number][],
    };
    const newLabel = structuredClone(label);
    newLabel.highlights[0][0] = 2;
    subject.updateLabel(label);
    expect(subject.updateLabel(newLabel)).toBeTruthy();
    expect(subject.label).toMatchObject(newLabel);
  });
});

describe("updateTooltip", () => {
  test("default", () => {
    expect(subject.tooltip).toBeUndefined();
  });
  test("undefined, no change", () => {
    expect(subject.updateTooltip(undefined)).toBeFalsy();
    expect(subject.tooltip).toBeUndefined();
  });
  test("set to string", () => {
    expect(subject.updateTooltip("test")).toBeTruthy();
    expect(subject.tooltip).toBe("test");
  });
  test("set to string, no change", () => {
    subject.updateTooltip("test");
    expect(subject.updateTooltip("test")).toBeFalsy();
    expect(subject.tooltip).toBe("test");
  });
  test("set to Markdown", () => {
    expect(subject.updateTooltip(new MarkdownString("* bullet"))).toBeTruthy();
    expect(subject.tooltip).toMatchObject(new MarkdownString("* bullet"));
  });
  test("set to Markdown twice", () => {
    subject.updateTooltip(new MarkdownString("* bullet"));
    expect(subject.updateTooltip(new MarkdownString("* bullet"))).toBeFalsy();
    expect(subject.tooltip).toMatchObject(new MarkdownString("* bullet"));
  });
  test("set to different Markdown", () => {
    subject.updateTooltip(new MarkdownString("* bullet"));
    expect(subject.updateTooltip(new MarkdownString("1 number"))).toBeTruthy();
    expect(subject.tooltip).toMatchObject(new MarkdownString("1 number"));
  });
});

describe("updateCollapsibleState", () => {
  test("default", () => {
    expect(subject.collapsibleState).toBe(TreeItemCollapsibleState.None);
  });
  test("set to value", () => {
    expect(subject.updateCollapsibleState(TreeItemCollapsibleState.Collapsed)).toBeTruthy();
    expect(subject.collapsibleState).toBe(TreeItemCollapsibleState.Collapsed);
  });
  test("set to value twice", () => {
    subject.updateCollapsibleState(TreeItemCollapsibleState.Collapsed);
    expect(subject.updateCollapsibleState(TreeItemCollapsibleState.Collapsed)).toBeFalsy();
    expect(subject.collapsibleState).toBe(TreeItemCollapsibleState.Collapsed);
  });
  test("set to different twice", () => {
    subject.updateCollapsibleState(TreeItemCollapsibleState.Collapsed);
    expect(subject.updateCollapsibleState(TreeItemCollapsibleState.None)).toBeTruthy();
    expect(subject.collapsibleState).toBe(TreeItemCollapsibleState.None);
  });
});
