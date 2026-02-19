/**
 * Format a date to a readable string.
 * @param date - The date to format (string | number | Date)
 * @param options - Optional formatting options
 * @returns formatted date string
 */
export function formatDate(
  date: string | number | Date,
  options?: Intl.DateTimeFormatOptions,
  locale: string = "en-US",
): string {
  if (!date) return "";

  const parsedDate =
    typeof date === "string" || typeof date === "number"
      ? new Date(date)
      : date;

  try {
    return parsedDate.toLocaleDateString(locale, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      ...options,
    });
  } catch (error) {
    console.error("Invalid date:", date);
    return "";
  }
}
