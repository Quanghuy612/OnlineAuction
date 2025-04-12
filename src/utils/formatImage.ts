/**
 * Converts a File object to an Object URL for displaying the image.
 * @param file - The image file (e.g., from input or database).
 * @returns A temporary object URL for the image.
 */
export const formatImage = (file: File): string => {
    return URL.createObjectURL(file);
};
