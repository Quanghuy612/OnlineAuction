import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Converts a UTC datetime string to local time and formats it.
 *
 * @param utcDateStr - The UTC datetime string (e.g., from the backend).
 * @param format - Optional format string (default: "DD/MM/YYYY HH:mm")
 * @param tz - Optional timezone (default: local timezone of the browser)
 * @returns Formatted local time string
 */
export const formatToLocalTime = (utcDateStr: string, format = "DD/MM/YYYY - HH:mm", tz?: string): string => {
    try {
        const localTz = tz || dayjs.tz.guess(); // e.g., 'Asia/Bangkok'
        return dayjs.utc(utcDateStr).tz(localTz).format(format);
    } catch (e) {
        console.error("Invalid date string:" + e, utcDateStr);
        return utcDateStr;
    }
};
