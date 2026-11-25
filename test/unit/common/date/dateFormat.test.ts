import { formatDate, formatDateTime } from "../../../../src/common/date/dateFormat";

const date = new Date(2026, 10, 5, 14, 5, 30);

// the expected values depend on the default locale
describe("dateFormat", () => {
  test("formats dates", () => {
    const expected = new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(date);
    expect(formatDate(date)).toBe(expected);
    expect(formatDate(date.getTime())).toBe(expected);
  });

  test("formats dates with time", () => {
    const expected = new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(date);
    expect(formatDateTime(date.toISOString())).toBe(expected);
  });

  test("does not throw on invalid dates", () => {
    expect(formatDate("x")).toBe("Invalid Date");
  });
});
