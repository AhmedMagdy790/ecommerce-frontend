
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useForm, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useSectionItemStore } from "../../model/store/useSectionItemStore";
import type { SectionItem } from "../../model/types/sectionItem.types";
import {
    sectionItemSchema,
    type SectionItemFormData,
    type SectionItemFormInput,
} from "../../model/schema/sectionItemSchema";

import { langKeys } from "@/shared/utils/langHelpers";
import { handleServerErrors } from "@/shared/utils/handleServerError";

import { sectionItemAdapter } from "../../adapters/sectionItem.adapter";
import { createDefaultSectionItemValues } from "../constants/sectionFormDefault";

interface UseSectionItemModalProps {
    isOpen: boolean;
    closeModal: () => void;
    sectionId: number | undefined;
    sectionItem: SectionItem | null;
    onItemSaved?: () => void;
}

export function useSectionItemModal({
    isOpen,
    closeModal,
    sectionId,
    sectionItem,
    onItemSaved,
}: UseSectionItemModalProps) {
    const {
        create,
        update,
        isSubmitting,
        submitError,
        clearErrors,
    } = useSectionItemStore();

    const [activeTab, setActiveTab] = useState("general");
    const prevIsOpenRef = useRef(isOpen);

    const isEditMode = Boolean(sectionItem?.id);

    // Prefer the existing item's section when editing.
    const resolvedSectionId = sectionItem?.section_id ?? sectionId ?? 0;

    const defaultValues = useMemo(
        () => createDefaultSectionItemValues(resolvedSectionId),
        [resolvedSectionId],
    );

    const methods = useForm<
        SectionItemFormInput,
        unknown,
        SectionItemFormData
    >({
        resolver: zodResolver(sectionItemSchema),
        defaultValues,
    });

    const { reset, handleSubmit, setError } = methods;

    const sanitizedInitialValues = useMemo<SectionItemFormInput>(() => {
        if (!sectionItem) {
            return defaultValues;
        }

        return {
            ...createDefaultSectionItemValues(resolvedSectionId),
            section_id: sectionItem.section_id ?? resolvedSectionId,
            product_id: sectionItem.product_id ?? null,
            title: sectionItem.title ?? defaultValues.title,
            subtitle: sectionItem.subtitle ?? defaultValues.subtitle,
            description: sectionItem.description ?? defaultValues.description,
            image: sectionItem.image ?? "",
            link: sectionItem.link ?? "",
            button_text: sectionItem.button_text ?? defaultValues.button_text,
            action_text: sectionItem.action_text ?? defaultValues.action_text,
            float_title: sectionItem.float_title ?? defaultValues.float_title,
            float_subtitle:
                sectionItem.float_subtitle ?? defaultValues.float_subtitle,
            stat_number: sectionItem.stat_number ?? defaultValues.stat_number,
            stat_text: sectionItem.stat_text ?? defaultValues.stat_text,
            sort_order: sectionItem.sort_order ?? 0,
            data: sectionItem.data ?? null,
        };
    }, [sectionItem, defaultValues, resolvedSectionId]);

    useEffect(() => {
        const justOpened = !prevIsOpenRef.current && isOpen;
        prevIsOpenRef.current = isOpen;

        if (!justOpened) return;

        clearErrors();
        setActiveTab("general");
        reset(sanitizedInitialValues);
    }, [isOpen, clearErrors, reset, sanitizedInitialValues]);

    const onSubmit = useCallback(
        async (formData: SectionItemFormData) => {
            if (isSubmitting) return;

            if (!Number.isInteger(resolvedSectionId) || resolvedSectionId <= 0) {
                setError("section_id", {
                    type: "validate",
                    message: "A valid section is required.",
                });
                return;
            }

            const completeData = {
                ...formData,
                section_id: resolvedSectionId,
            };

            try {
                if (isEditMode && sectionItem?.id) {
                    const payload =
                        sectionItemAdapter.toUpdateDto(completeData);

                    await update(sectionItem.id, payload);
                } else {
                    const payload =
                        sectionItemAdapter.toCreateDto(completeData);

                    await create(payload);
                }

                onItemSaved?.();
                closeModal();
            } catch (error: unknown) {
                console.error("Failed to submit section item:", error);

                const translatedFields = [
                    "title",
                    "subtitle",
                    "description",
                    "button_text",
                    "action_text",
                    "float_title",
                    "float_subtitle",
                    "stat_number",
                    "stat_text",
                ] as const;

                const errorFields: Path<SectionItemFormInput>[] = [];

                translatedFields.forEach((field) => {
                    langKeys.forEach((lang) => {
                        errorFields.push(
                            `${field}.${lang}` as Path<SectionItemFormInput>,
                        );
                    });
                });

                handleServerErrors(error, setError, [
                    ...errorFields,
                    "section_id",
                    "image",
                    "link",
                    "product_id",
                    "sort_order",
                    "data",
                ]);
            }
        },
        [
            resolvedSectionId,
            sectionItem,
            create,
            update,
            isSubmitting,
            onItemSaved,
            closeModal,
            setError,
            isEditMode,
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