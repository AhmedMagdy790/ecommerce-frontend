import { useEffect, useMemo, useRef } from "react";
import { useForm, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { defaultSectionValues as defaultValues } from "../constants/sectionFormDefault";
import { mapSectionToForm } from "../mappers/mapSectionForm";
import { handleServerErrors } from "@/shared/utils/handleServerError";
import { langKeys } from "@/shared/utils/langHelpers";
import type { Section } from "../../model/types/section.types";
import { useSectionStore } from "../../model/store/useSectionStore";
import { sectionSchema, type SectionFormData, type SectionFormInput } from "../../model/schema/sectionSchema";
import { sectionAdapter } from "../../adapters/section.adapter";
import type { TranslatedText } from "@/shared/types/types";

export const useSectionForm = (
    initialData?: Section<TranslatedText> | null,
    closeModal?: () => void,
    isOpen?: boolean,
    pageId?: number
) => {
    const { 
        create, 
        update,
        isSubmitting, 
        submitError
    } = useSectionStore();

    const prevIsOpenRef = useRef(isOpen);

    const methods = useForm<SectionFormInput, unknown, SectionFormData>({
        resolver: zodResolver(sectionSchema),
        defaultValues: {
            ...defaultValues,
            ...(pageId ? { page_id: pageId } : {}),
        },
    });

    const { reset, handleSubmit, setError } = methods;

    const isEditMode = Boolean(initialData?.id);

    const sanitizedInitialValues = useMemo(
        () => (initialData ? mapSectionToForm(initialData) : {
            ...defaultValues,
            ...(pageId ? { page_id: pageId } : {}),
        }),
        [initialData, pageId]
    );

    useEffect(() => {
        const justOpened = !prevIsOpenRef.current && isOpen;
        prevIsOpenRef.current = isOpen;

        if (justOpened) {
            reset(isEditMode ? sanitizedInitialValues : {
                ...defaultValues,
                ...(pageId ? { page_id: pageId } : {}),
            });
        }
    }, [isOpen, reset, isEditMode, sanitizedInitialValues, pageId]);

    const resetForm = () => {
        reset({
            ...defaultValues,
            ...(pageId ? { page_id: pageId } : {}),
        });
    };

    const submitSection = async (formData: SectionFormData) => {
        if (isSubmitting) return;

        try {
            if (isEditMode && initialData?.id) {
                const payload = sectionAdapter.toUpdateDto(formData);
                await update(initialData.id, payload);
            } else {
                const payload = sectionAdapter.toCreateDto(formData);
                await create(payload);
            }

            resetForm();
            closeModal?.();
        } catch (error: unknown) {
            console.error("Failed to submit section:", error);

            const nameFields = langKeys.map(
                (lang) => `name.${lang}` as Path<SectionFormInput>
            );

            handleServerErrors(error, setError, [
                ...nameFields,
                'page_id',
                'key',
                'type',
                'sort_order',
                'is_active',
                'settings'
            ]);
        }
    };

    return {
        resetForm,
        submitSection,
        methods,
        onSubmit: handleSubmit(submitSection),
        isSubmitting,
        submitError,
        isEditMode,
    };
};