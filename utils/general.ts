import { DateTime } from "luxon";

/**
 * Formats a given ISO date string into a human-readable format.
 *
 * @param dateString - The ISO date string to format.
 * @returns The formatted date string in the format "MMMM d, yyyy h:mm a".
 */
export const formatDate = (dateString: string) => {
  const parsedDate = DateTime.fromISO(dateString, { zone: "utc" });
  const formattedDate = parsedDate.toFormat("MMMM d, yyyy h:mm a");

  return formattedDate;
};

/**
 * Converts a given ISO date string to a UTC DateTime object.
 *
 * @param dateString - The ISO date string to be converted.
 * @returns A DateTime object representing the given date in UTC.
 */
export const toUTCDateTime = (dateString: string) => {
  return DateTime.fromISO(dateString, { zone: "utc" });
};

/**
 * Checks if two date ranges overlap.
 *
 * @param checkInA - The check-in date of the first range.
 * @param checkOutA - The check-out date of the first range.
 * @param checkInB - The check-in date of the second range.
 * @param checkOutB - The check-out date of the second range.
 * @returns `true` if the date ranges overlap, otherwise `false`.
 */
export const isDateRangeOverlapping = (
  checkInA: DateTime,
  checkOutA: DateTime,
  checkInB: DateTime,
  checkOutB: DateTime,
) => {
  return (
    checkInA < checkOutB && checkOutA > checkInB // Overlapping ranges
  );
};
