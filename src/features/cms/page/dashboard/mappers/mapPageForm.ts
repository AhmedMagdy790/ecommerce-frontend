import type { TranslatedText } from "@/shared/types/types";
import type { PageFormData } from "../../model/schema/pageSchema";
import type { Page } from "../../model/types/page.types";
import { defaultValues } from "../constants/pageFormDefault";

export function mapPageToForm(
    page?: Page<TranslatedText> | null
): PageFormData {

    if (!page) {
        return defaultValues;
    }

    return {
        ...defaultValues,
        title: page.title ?? defaultValues.title,
        slug: page.slug ?? defaultValues.slug,
        content: page.content ?? defaultValues.content,
        meta_title: page.meta_title ?? defaultValues.meta_title,
        meta_description: page.meta_description ?? defaultValues.meta_description,
        is_active: page.is_active ?? defaultValues.is_active,
    };
}