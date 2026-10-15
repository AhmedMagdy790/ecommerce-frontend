import type { CategoryFormData } from "../../model/schema/categorySchema";
import type { InitialCategoryData } from "../../model/types/categoryForm.types";
import { defaultValues } from "../constants/categoryFormDefault";

export function mapCategoryToForm(
    category?: InitialCategoryData | null
): CategoryFormData {

    if (!category) {
        return defaultValues;
    }

    return {
        ...defaultValues,
        name: category.name ?? defaultValues.name,
        description: category.description ?? defaultValues.description,
        parent_id: category?.parent?.id ?? null,
        status: category.status ?? "active",
        image: category.image ?? null,
    };
}