import type { TranslatedText } from "@/shared/types/types";
import type { SectionFormInput } from "../../model/schema/sectionSchema";
import type { Section } from "../../model/types/section.types";
import { createDefaultSectionValues } from "../constants/sectionFormDefault";

export function mapSectionToForm(
    pageId: number,
    section?: Section<TranslatedText> | null,
): SectionFormInput {
    const defaults = createDefaultSectionValues(pageId);

    if (!section) {
        return defaults;
    }

    return {
        ...defaults,
        page_id: section.page_id ?? defaults.page_id,
        name: section.name ?? defaults.name,
        key: section.key ?? defaults.key,
        type: section.type ?? defaults.type,
        sort_order: section.sort_order ?? defaults.sort_order,
        is_active: section.is_active ?? defaults.is_active,
        settings: section.settings ?? defaults.settings,
    };
}