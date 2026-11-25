function format(date: Date | string | number, options: Intl.DateTimeFormatOptions) {
  const value = new Date(date);
  return Number.isNaN(value.getTime()) ? "Invalid Date" : new Intl.DateTimeFormat(undefined, options).format(value);
}

// The medium style spells out the month where a numeric date could be misread, e.g. "Nov 5, 2026" in English.
export function formatDate(date: Date | string | number): string {
  return format(date, { dateStyle: "medium" });
}

export function formatDateTime(date: Date | string | number): string {
  return format(date, { dateStyle: "medium", timeStyle: "short" });
}
