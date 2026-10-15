import { useEffect, useMemo, useRef } from "react";
import { useForm, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema, type CategoryFormData, type CategoryFormInput } from "../../model/schema/categorySchema";
import { useCategoryStore } from "../../model/store/useCategoryStore";
import type { InitialCategoryData } from "../../model/types/categoryForm.types";
import { defaultValues } from "../constants/categoryFormDefault";
import { mapCategoryToForm } from "../mappers/mapCategoryForm";
import { categoryAdapter } from "../../adapters/category.adapter";
import { handleServerErrors } from "@/shared/utils/handleServerError";
import { langKeys } from "@/shared/utils/langHelpers";


export const useCategoryForm = (
    initialData?: InitialCategoryData | null,
    closeModal?: () => void,
    isOpen?: boolean
) => {
    const { 
        create, 
        update,
        isSubmitting, 
        submitError
    } = useCategoryStore();

    const prevIsOpenRef = useRef(isOpen);

    const methods = useForm<CategoryFormInput, unknown, CategoryFormData>({
        resolver: zodResolver(categorySchema),
        defaultValues
    });

    const { reset, handleSubmit, setError } = methods;

    const isEditMode = Boolean(initialData?.id);

    const sanitizedInitialValues = useMemo(
        () => (initialData ? mapCategoryToForm(initialData) : defaultValues),
        [initialData]
    );

    useEffect(() => {
        const justOpened = !prevIsOpenRef.current && isOpen;
        prevIsOpenRef.current = isOpen;

        if (justOpened) {
            reset(isEditMode ? sanitizedInitialValues : defaultValues);
        }
    }, [isOpen, reset, isEditMode, sanitizedInitialValues]);

    const resetForm = () => {
        reset(defaultValues);
    };

    const submitCategory = async (formData: CategoryFormData) => {
        if (isSubmitting) return;

        try {
            if (isEditMode && initialData?.id) {
                const payload = categoryAdapter.toUpdateDto(formData);
                await update(initialData.id, payload);
            } else {
                const payload = categoryAdapter.toCreateDto(formData);
                await create(payload);
            }

            resetForm();
            closeModal?.();
        } catch (error: unknown) {
            console.error("Failed to submit category:", error);

            const nameFields = langKeys.map(
                (lang) => `name.${lang}` as Path<CategoryFormInput>
            );

            const descriptionFields = langKeys.map(
                (lang) => `description.${lang}` as Path<CategoryFormInput>
            );

            handleServerErrors(error, setError, [
                ...nameFields,
                ...descriptionFields,
                'image',
                'parent_id',
                'status'
            ]);
        }
    };

    return {
        resetForm,
        submitCategory,
        methods,
        onSubmit: handleSubmit(submitCategory),
        isSubmitting,
        submitError,
        isEditMode,
    };
};