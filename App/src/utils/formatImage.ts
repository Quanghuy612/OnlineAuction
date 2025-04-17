export function formatImage(data: Uint8Array | string | null | undefined): string {
    const fallbackImage = "/images/default.png";

    if (!data) return fallbackImage;

    // If it's already a base64 string, assume it's valid
    if (typeof data === "string") {
        return `data:image/jpeg;base64,${data}`;
    }

    // If it's a Uint8Array, convert to base64 string
    const mimeType = (() => {
        const png = [0x89, 0x50, 0x4e, 0x47];
        const jpeg = [0xff, 0xd8, 0xff];
        const webp = [0x52, 0x49, 0x46, 0x46];

        const startsWith = (sig: number[]) => sig.every((b, i) => data[i] === b);

        if (startsWith(png)) return "image/png";
        if (startsWith(jpeg)) return "image/jpeg";
        if (startsWith(webp) && String.fromCharCode(...data.slice(8, 12)) === "WEBP") {
            return "image/webp";
        }

        return "image/jpeg";
    })();

    const base64 = btoa(String.fromCharCode(...data));
    return `data:${mimeType};base64,${base64}`;
}
