import { DateTime } from "luxon";

export const formatDateToString = (date: string | Date | null): string => {
    if (!date) return "";

    const parsedDate = typeof date === "string" ? DateTime.fromISO(date) : DateTime.fromJSDate(date);

    return parsedDate.isValid ? parsedDate.toFormat("dd/MM/yyyy") : "";
};

export const formatDateTimeToString = (date: string | Date | null): string => {
    if (!date) return "";

    const parsedDate = typeof date === "string" ? DateTime.fromISO(date) : DateTime.fromJSDate(date);

    return parsedDate.isValid ? parsedDate.toFormat("dd/MM/yyyy - HH:mm") : "";
};

export const parseStringToDate = (dateString: string): string | null => {
    if (!dateString) return null;

    const parsedDate = DateTime.fromFormat(dateString, "dd/MM/yyyy");

    return parsedDate.isValid ? parsedDate.toISODate() : null;
};
