import { useEffect, useMemo, useRef } from "react";
import { useForm, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { pageSchema, type PageFormData, type PageFormInput } from "../../model/schema/pageSchema";
import { usePageStore } from "../../model/store/usePageStore";
import type { Page } from "../../model/types/page.types";
import { defaultValues } from "../constants/pageFormDefault";
import { mapPageToForm } from "../mappers/mapPageForm";
import { pageAdapter } from "../../adapters/page.adapter";
import { handleServerErrors } from "@/shared/utils/handleServerError";
import { langKeys } from "@/shared/utils/langHelpers";
import type { TranslatedText } from "@/shared/types/types";

export const usePageForm = (
    initialData?: Page<TranslatedText> | null,
    closeModal?: () => void,
    isOpen?: boolean
) => {
    const { 
        create, 
        update,
        isSubmitting, 
        submitError
    } = usePageStore();

    const prevIsOpenRef = useRef(isOpen);

    const methods = useForm<PageFormInput, unknown, PageFormData>({
        resolver: zodResolver(pageSchema),
        defaultValues
    });

    const { reset, handleSubmit, setError } = methods;

    const isEditMode = Boolean(initialData?.id);

    const sanitizedInitialValues = useMemo(
        () => (initialData ? mapPageToForm(initialData) : defaultValues),
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

    const submitPage = async (formData: PageFormData) => {
        if (isSubmitting) return;

        try {
            if (isEditMode && initialData?.id) {
                const payload = pageAdapter.toUpdateDto(formData);
                await update(initialData.id, payload);
            } else {
                const payload = pageAdapter.toCreateDto(formData);
                await create(payload);
            }

            resetForm();
            closeModal?.();
        } catch (error: unknown) {
            console.error("Failed to submit page:", error);

            const titleFields = langKeys.map(
                (lang) => `title.${lang}` as Path<PageFormInput>
            );

            const contentFields = langKeys.map(
                (lang) => `content.${lang}` as Path<PageFormInput>
            );

            handleServerErrors(error, setError, [
                ...titleFields,
                ...contentFields,
                'slug',
                'is_active'
            ]);
        }
    };

    return {
        resetForm,
        submitPage,
        methods,
        onSubmit: handleSubmit(submitPage),
        isSubmitting,
        submitError,
        isEditMode,
    };
};