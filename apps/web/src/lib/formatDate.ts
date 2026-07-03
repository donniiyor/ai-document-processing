export function formatDocumentDate(
    date: Date | string,
    locale: string,
): string {
    return new Intl.DateTimeFormat(locale, {
        dateStyle: "medium",
    }).format(new Date(date));
}
