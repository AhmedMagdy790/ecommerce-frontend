
import { useEffect, useMemo, useRef } from "react";
import { useForm, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { mapSectionToForm } from "../mappers/mapSectionForm";
import { createDefaultSectionValues } from "../constants/sectionFormDefault";

import { handleServerErrors } from "@/shared/utils/handleServerError";
import { langKeys } from "@/shared/utils/langHelpers";

import type { Section } from "../../model/types/section.types";
import type { TranslatedText } from "@/shared/types/types";

import { useSectionStore } from "../../model/store/useSectionStore";
import {
    sectionSchema,
    type SectionFormData,
    type SectionFormInput,
} from "../../model/schema/sectionSchema";

import { sectionAdapter } from "../../adapters/section.adapter";

export const useSectionForm = (
    initialData?: Section<TranslatedText> | null,
    closeModal?: () => void,
    isOpen?: boolean,
    pageId?: number,
) => {
    const {
        create,
        update,
        isSubmitting,
        submitError,
    } = useSectionStore();

    const prevIsOpenRef = useRef(isOpen);

    // In edit mode, fall back to the page ID stored on the section.
    const resolvedPageId = pageId ?? initialData?.page_id ?? 0;

    const isEditMode = Boolean(initialData?.id);

    const defaultValues = useMemo(
        () => createDefaultSectionValues(resolvedPageId),
        [resolvedPageId],
    );

    const sanitizedInitialValues = useMemo(
        () => mapSectionToForm(resolvedPageId, initialData),
        [resolvedPageId, initialData],
    );

    const methods = useForm<SectionFormInput, unknown, SectionFormData>({
        resolver: zodResolver(sectionSchema),
        defaultValues,
    });

    const { reset, handleSubmit, setError } = methods;

    useEffect(() => {
        const justOpened = !prevIsOpenRef.current && isOpen;

        prevIsOpenRef.current = isOpen;

        if (justOpened) {
            reset(sanitizedInitialValues);
        }
    }, [isOpen, reset, sanitizedInitialValues]);

    const resetForm = () => {
        reset(createDefaultSectionValues(resolvedPageId));
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
                (lang) => `name.${lang}` as Path<SectionFormInput>,
            );

            handleServerErrors(error, setError, [
                ...nameFields,
                "page_id",
                "key",
                "type",
                "sort_order",
                "is_active",
                "settings",
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