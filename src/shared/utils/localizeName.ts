import type { TranslatedText } from "@/shared/types/types";

export function getLocalizedName(nameField: TranslatedText | string | null | undefined, lang: string): string {
    if (!nameField) return "-";
    
    if (typeof nameField === "object") {
        return (nameField as Record<string, string>)[lang] || Object.values(nameField)[0] || "-";
    }
    
    return String(nameField);
}