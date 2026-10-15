import { useState, useEffect, useCallback, useRef } from "react";
import { useForm, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSectionStore } from "@/features/cms/section/model/store/useSectionStore";
import { SectionTypes, type Section, type SectionProduct } from "../../model/types/section.types";
import { sectionSchema, type SectionFormData, type SectionFormInput } from "../../model/schema/sectionSchema";
import { defaultSectionValues } from "../constants/sectionFormDefault";
import { getEmptyTranslatedObject, langKeys } from "@/shared/utils/langHelpers";
import { handleServerErrors } from "@/shared/utils/handleServerError";
import { sectionAdapter } from "../../adapters/section.adapter";

interface UseSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  pageId: number;
  editingSection: Section | null;
  onSectionSaved?: () => void;
}

export function useSectionModal({
  isOpen,
  onClose,
  pageId,
  editingSection,
  onSectionSaved,
}: UseSectionModalProps) {
  const { create, update, isSubmitting, submitError, clearErrors } = useSectionStore();
  const [activeTab, setActiveTab] = useState<string>("general");


  const isEditMode = Boolean(editingSection?.id);

  const prevIsOpenRef = useRef(isOpen);
  const parsedPageId = pageId ? Number(pageId) : 0;

  const methods = useForm<SectionFormInput, unknown, SectionFormData>({
    resolver: zodResolver(sectionSchema),
    defaultValues: {
      ...defaultSectionValues,
      page_id: parsedPageId,
    },
  });

  const { reset, handleSubmit, setError } = methods;

 useEffect(() => {
    const justOpened = !prevIsOpenRef.current && isOpen;
    prevIsOpenRef.current = isOpen;

    if (justOpened) {
      clearErrors();
      setActiveTab("general");

      queueMicrotask(() => {
        if (editingSection) {
          reset({
            page_id: editingSection.page_id ? Number(editingSection.page_id) : parsedPageId,
            name: editingSection.name || getEmptyTranslatedObject(),
            key: editingSection.key || "",
            type: editingSection.type || SectionTypes.HERO,
            sort_order: editingSection.sort_order ?? 0,
            is_active: editingSection.is_active ?? true,
            settings: editingSection.settings ?? null,
            // استخراج معرفات المنتجات المرتبطة مسبقاً إن وجدت
            selected_ids: Array.isArray(editingSection.products)
              ? editingSection.products.map((p: SectionProduct) => p.id)
              : [],
          });
        } else {
          reset({
            ...defaultSectionValues,
            page_id: parsedPageId,
            selected_ids: [],
          });
        }
      });
    }
  }, [isOpen, editingSection, parsedPageId, reset, clearErrors]);

  const onSubmit = useCallback(
    async (formData: SectionFormData) => {
      if (isSubmitting) return;

      try {
        if (isEditMode && editingSection?.id) {
            const payload = sectionAdapter.toUpdateDto(formData);
            console.log("payload", payload)
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
          (lang) => `name.${lang}` as Path<SectionFormInput>
        );

        handleServerErrors(error, setError, [
          ...nameFields,
          'key',
          'type',
          'sort_order',
          'is_active',
          'settings'
        ]);
      }
    },
    [isEditMode, editingSection, create, update, isSubmitting, onSectionSaved, onClose, setError]
  );

  return {
    methods,
    activeTab,
    setActiveTab,
    isSubmitting,
    submitError,
    isEditing: !!editingSection,
    onSubmit: handleSubmit(onSubmit),
  };
}