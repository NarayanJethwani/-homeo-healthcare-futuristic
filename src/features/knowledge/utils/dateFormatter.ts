const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}(T([01]\d|2[0-3]):[0-5]\d:[0-5]\d(\.\d+)?(Z|[+-]([01]\d|2[0-3]):?[0-5]\d)?)?$/;

const MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const MONTHS_LONG = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function isValidCalendarDate(year: number, month: number, day: number): boolean {
  if (month < 1 || month > 12) return false;
  if (day < 1) return false;

  const daysInMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  // Leap year check
  const isLeap = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  if (isLeap) {
    daysInMonths[1] = 29;
  }

  return day <= daysInMonths[month - 1];
}

function parseAndFormatDate(dateStr: string, longFormat: boolean): string {
  if (!dateStr || typeof dateStr !== "string") return "";

  // Validate strict ISO/YYYY-MM-DD pattern
  if (!ISO_DATE_PATTERN.test(dateStr)) return "";

  const datePart = dateStr.split("T")[0];
  const parts = datePart.split("-");
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);

    if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
      if (isValidCalendarDate(year, month, day)) {
        const monthLabel = longFormat ? MONTHS_LONG[month - 1] : MONTHS_SHORT[month - 1];
        return `${monthLabel} ${day}, ${year}`;
      }
    }
  }

  return "";
}

/**
 * Formats a valid ISO date string into short format: e.g., "Jun 30, 2026" or "Jan 9, 2026".
 * Returns an empty string on invalid dates.
 */
export function formatMedicalDate(dateStr: string): string {
  return parseAndFormatDate(dateStr, false);
}

/**
 * Formats a valid ISO date string into long format: e.g., "June 30, 2026" or "January 9, 2026".
 * Returns an empty string on invalid dates.
 */
export function formatMedicalDateLong(dateStr: string): string {
  return parseAndFormatDate(dateStr, true);
}
