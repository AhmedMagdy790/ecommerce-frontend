import { useState, useEffect, useCallback, useRef } from "react";
import { useForm, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSectionItemStore } from "../../model/store/useSectionItemStore";
import type { SectionItem } from "../../model/types/sectionItem.types";
import { sectionItemSchema, type SectionItemFormData, type SectionItemFormInput } from "../../model/schema/sectionItemSchema";
import { getEmptyTranslatedObject, langKeys } from "@/shared/utils/langHelpers";
import { handleServerErrors } from "@/shared/utils/handleServerError";
import { sectionItemAdapter } from "../../adapters/sectionItem.adapter";


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
  const { create, update, isSubmitting, submitError, clearErrors } = useSectionItemStore();
  
  const [activeTab, setActiveTab] = useState<string>("general");

  const isEditMode = Boolean(sectionItem?.id);
  const prevIsOpenRef = useRef(isOpen);
  const parsedSectionId = sectionId ? Number(sectionId) : 0;


  const methods = useForm<SectionItemFormInput, unknown, SectionItemFormData>({
    resolver: zodResolver(sectionItemSchema),
    defaultValues: {
      section_id: parsedSectionId,
      title: getEmptyTranslatedObject(),
      subtitle: getEmptyTranslatedObject(),
      description: getEmptyTranslatedObject(),
      image: "",
      link: "",
      product_id: null,
      button_text: getEmptyTranslatedObject(),
      action_text: getEmptyTranslatedObject(),
      float_title: getEmptyTranslatedObject(),
      float_subtitle: getEmptyTranslatedObject(),
      stat_number: getEmptyTranslatedObject(),
      stat_text: getEmptyTranslatedObject(),
      sort_order: 0,
      data: null,
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
        if (sectionItem) {
          reset({
            section_id: sectionItem.section_id ? Number(sectionItem.section_id) : parsedSectionId,
            title: sectionItem.title,
            subtitle: sectionItem.subtitle || getEmptyTranslatedObject(),
            description: sectionItem.description || getEmptyTranslatedObject(),
            image: sectionItem.image || "",
            link: sectionItem.link || "",
            product_id: sectionItem.product_id ? Number(sectionItem.product_id) : null,
            button_text: sectionItem.button_text || getEmptyTranslatedObject(),
            action_text: sectionItem.action_text || getEmptyTranslatedObject(),
            float_title: sectionItem.float_title || getEmptyTranslatedObject(),
            float_subtitle: sectionItem.float_subtitle || getEmptyTranslatedObject(),
            stat_number: sectionItem.stat_number || getEmptyTranslatedObject(),
            stat_text: sectionItem.stat_text || getEmptyTranslatedObject(),
            sort_order: sectionItem.sort_order ?? 0,
            data: Array.isArray(sectionItem.data) 
                ? null // أو تحويلها لشكل كائن إذا لزم الأمر، مثل: { items: sectionItem.data }
                : sectionItem.data ?? null,
          });
        } else {
          reset({
            section_id: parsedSectionId,
            title: getEmptyTranslatedObject(),
            subtitle: getEmptyTranslatedObject(),
            description: getEmptyTranslatedObject(),
            image: "",
            link: "",
            product_id: null,
            button_text: getEmptyTranslatedObject(),
            action_text: getEmptyTranslatedObject(),
            float_title: getEmptyTranslatedObject(),
            float_subtitle: getEmptyTranslatedObject(),
            stat_number: getEmptyTranslatedObject(),
            stat_text: getEmptyTranslatedObject(),
            sort_order: 0,
            data: [],
          });
        }
      });
    }
  }, [isOpen, sectionItem, parsedSectionId, reset, clearErrors]);

  const onSubmit = useCallback(
    async (formData: SectionItemFormData) => {
      if (isSubmitting) return;

      console.log("formData", formData)
      const completeData = {
        ...formData,
        section_id: parsedSectionId,
      };

      try {
        if (isEditMode && sectionItem?.id) {
          const payload = sectionItemAdapter.toUpdateDto(completeData);

          await update(sectionItem.id, payload);
        } else {
          const payload = sectionItemAdapter.toCreateDto(completeData);
          await create(payload);
        }

        onItemSaved?.();
        closeModal();
      } catch (error: unknown) {
        console.error("Failed to submit section item:", error);

        const translatedFields = [
          'title',
          'subtitle',
          'description',
          'button_text',
          'action_text',
          'float_title',
          'float_subtitle',
          'stat_number',
          'stat_text'
        ] as const;

        const errorFields: Path<SectionItemFormInput>[] = [];

        translatedFields.forEach((field) => {
          langKeys.forEach((lang) => {
            errorFields.push(`${field}.${lang}` as Path<SectionItemFormInput>);
          });
        });

        handleServerErrors(error, setError, [
          ...errorFields,
          'image',
          'link',
          'product_id',
          'sort_order',
          'data'
        ]);
      }
    },
    [parsedSectionId, sectionItem, create, update, isSubmitting, onItemSaved, closeModal, setError, isEditMode]
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