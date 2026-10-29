
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useForm, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useSectionStore } from "@/features/cms/section/model/store/useSectionStore";
import type { Section } from "../../model/types/section.types";
import {
    sectionSchema,
    type SectionFormData,
    type SectionFormInput,
} from "../../model/schema/sectionSchema";

import { createDefaultSectionValues } from "../constants/sectionFormDefault";
import { mapSectionToForm } from "../mappers/mapSectionForm";
import { langKeys } from "@/shared/utils/langHelpers";
import { handleServerErrors } from "@/shared/utils/handleServerError";
import { sectionAdapter } from "../../adapters/section.adapter";
import type { TranslatedText } from "@/shared/types/types";

interface UseSectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    pageId: number;
    editingSection: Section<TranslatedText> | null;
    onSectionSaved?: () => void;
}

export function useSectionModal({
    isOpen,
    onClose,
    pageId,
    editingSection,
    onSectionSaved,
}: UseSectionModalProps) {
    const {
        create,
        update,
        isSubmitting,
        submitError,
        clearErrors,
    } = useSectionStore();

    const [activeTab, setActiveTab] = useState("general");
    const prevIsOpenRef = useRef(isOpen);

    const isEditMode = Boolean(editingSection?.id);

    const defaultValues = useMemo(
        () => ({
            ...createDefaultSectionValues(pageId),
            selected_ids: [],
        }),
        [pageId],
    );

    const formValues = useMemo(
        () => {
            if (!editingSection) {
                return defaultValues;
            }

            return {
                ...mapSectionToForm(pageId, editingSection),
                selected_ids: Array.isArray(editingSection.products)
                    ? editingSection.products.map((product) => product.id)
                    : [],
            };
        },
        [pageId, editingSection, defaultValues],
    );

    const methods = useForm<SectionFormInput, unknown, SectionFormData>({
        resolver: zodResolver(sectionSchema),
        defaultValues,
    });

    const { reset, handleSubmit, setError } = methods;

    useEffect(() => {
        const justOpened = !prevIsOpenRef.current && isOpen;
        prevIsOpenRef.current = isOpen;

        if (!justOpened) return;

        clearErrors();
        setActiveTab("general");
        reset(formValues);
    }, [isOpen, clearErrors, reset, formValues]);

    const onSubmit = useCallback(
        async (formData: SectionFormData) => {
            if (isSubmitting) return;

            try {
                if (isEditMode && editingSection?.id) {
                    const payload = sectionAdapter.toUpdateDto(formData);
                    await update(editingSection.id, payload);
                } else {
                    const payload = sectionAdapter.toCreateDto(formData);
                    await create(payload);
                }

                onSectionSaved?.();
                onClose();
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
        },
        [
            isEditMode,
            editingSection,
            create,
            update,
            isSubmitting,
            onSectionSaved,
            onClose,
            setError,
        ],
    );

    return {
        methods,
        activeTab,
        setActiveTab,
        isSubmitting,
        submitError,
        isEditing: isEditMode,
        onSubmit: handleSubmit(onSubmit),
    };
}