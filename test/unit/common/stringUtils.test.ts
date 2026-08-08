import { createCodeSpan, formatDuration } from "../../../src/common/stringUtils";
import { describe, test, expect } from "vitest";

describe("formatDuration", () => {
  const d = (iso: string) => new Date(iso);

  test("formats seconds only", () => {
    expect(formatDuration(d("2024-01-01T00:00:00Z"), d("2024-01-01T00:00:45Z"))).toBe("45s");
  });

  test("formats minutes and seconds", () => {
    expect(formatDuration(d("2024-01-01T00:00:00Z"), d("2024-01-01T00:02:15Z"))).toBe("2m 15s");
  });

  test("formats zero seconds", () => {
    expect(formatDuration(d("2024-01-01T00:00:00Z"), d("2024-01-01T00:00:00Z"))).toBe("0s");
  });

  test("truncates sub-second precision", () => {
    expect(formatDuration(d("2024-01-01T00:00:00.000Z"), d("2024-01-01T00:00:01.999Z"))).toBe("1s");
  });

  test("formats exactly 60 seconds as 1m 0s", () => {
    expect(formatDuration(d("2024-01-01T00:00:00Z"), d("2024-01-01T00:01:00Z"))).toBe("1m 0s");
  });
});

describe("createCodeSpan", () => {
  test("wraps plain text in single backticks", () => {
    expect(createCodeSpan("hello")).toBe("`hello`");
  });

  test("wraps empty string in single backticks", () => {
    expect(createCodeSpan("")).toBe("``");
  });

  test("uses double backticks when content contains a single backtick", () => {
    expect(createCodeSpan("foo`bar")).toBe("``foo`bar``");
  });

  test("uses triple backticks when content contains double backticks", () => {
    expect(createCodeSpan("foo``bar")).toBe("```foo``bar```");
  });

  test("delimiter length is based on the longest run of backticks", () => {
    expect(createCodeSpan("`a``b```c")).toBe("````" + "`a``b```c" + "````");
  });

  test("wraps a path with backslashes in single backticks", () => {
    expect(createCodeSpan("\\MyFolder\\Sub")).toBe("`\\MyFolder\\Sub`");
  });
});
