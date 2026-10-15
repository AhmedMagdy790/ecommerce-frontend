// src/features/category/constants/categoryFormDefault.ts
import type { CategoryFormData } from "../../model/schema/categorySchema";
import { getEmptyTranslatedObject } from "@/shared/utils/langHelpers";

export const defaultValues: CategoryFormData = {
    name: getEmptyTranslatedObject(),
    description: getEmptyTranslatedObject(),
    parent_id: null,
    status: "active",
    image: null,
};