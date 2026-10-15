import type { TranslatedText } from "@/shared/types/types";
import type { SectionFormData } from "../../model/schema/sectionSchema";
import type { Section } from "../../model/types/section.types";
import { defaultSectionValues as defaultValues } from "../constants/sectionFormDefault";

export function mapSectionToForm(
    section?: Section<TranslatedText> | null
): SectionFormData {

    if (!section) {
        return defaultValues;
    }

    return {
        ...defaultValues,
        page_id: section.page_id ?? defaultValues.page_id,
        name: section.name ?? defaultValues.name,
        key: section.key ?? defaultValues.key,
        type: section.type ?? defaultValues.type,
        sort_order: section.sort_order ?? defaultValues.sort_order,
        is_active: section.is_active ?? defaultValues.is_active,
        settings: section.settings ?? defaultValues.settings,
    };
}