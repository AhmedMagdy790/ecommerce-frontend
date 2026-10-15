import { getEmptyTranslatedObject } from "@/shared/utils/langHelpers";
import type { PageFormData } from "../../model/schema/pageSchema";

export const defaultValues: PageFormData = {
    title: getEmptyTranslatedObject(),
    slug: "",
    content: getEmptyTranslatedObject(),
    meta_title: getEmptyTranslatedObject(),
    meta_description: getEmptyTranslatedObject(),
    is_active: true,
};