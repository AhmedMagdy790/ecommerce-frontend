import { useRef } from "react";
import { type Path } from "react-hook-form";
import { Layers } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useLanguageStore } from "@/features/language/store/useLanguageStore";
import { Input } from "@/shared/components/ui/Input";
import { Label } from "@/shared/components/ui/label";
import BaseModel from "@/shared/components/BaseModal";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/components/ui/tabs";
import { useSectionItemModal } from "../hooks/useSectionItemModal";
import type { SectionItemFormInput } from "../../model/schema/sectionItemSchema";
import { checkLanguageError, getTranslatedError } from "@/shared/utils/helper";
import { LanguageOptions } from "@/shared/components/LanguageOptions";
import type { SectionItem } from "../../model/types/sectionItem.types";

interface SectionItemModalProps {
  isOpen: boolean;
  closeModal: () => void;
  sectionId: number;
  editingItem: SectionItem | null;
  onItemSaved?: () => void;
}

export function SectionItemModal({
  isOpen,
  closeModal,
  sectionId,
  editingItem,
  onItemSaved,
}: SectionItemModalProps) {
  const { t } = useTranslation();
   const currentLangCode = useLanguageStore((state) => state.currentLangCode);
   const getCurrentLangName = useLanguageStore((state) => state.getCurrentLangName);

  const currentLangName = getCurrentLangName();


  const formRef = useRef<HTMLFormElement>(null);

  const {
    methods,
    activeTab,
    setActiveTab,
    isSubmitting,
    submitError,
    isEditing,
    onSubmit,
  } = useSectionItemModal({
    isOpen,
    closeModal,
    sectionId: sectionId,
    sectionItem: editingItem,
    onItemSaved,
  });

  const {
    register,
    formState: { errors }
  } = methods;

  console.log("errors", errors)


  const registerTranslatedField = (
    field: "title" | "subtitle" | "description" | "button_text" | "action_text" | "float_title" | "float_subtitle" | "stat_number" | "stat_text",
    lang: string
  ) => {
    return register(
      `${field}.${lang}` as Path<SectionItemFormInput>
    );
  };

  const hasLanguageError = (lang: string) => {
    return checkLanguageError(errors, lang, ["title", "subtitle", "description"]);
  };

  return (
    <BaseModel
      isOpen={isOpen}
      isLoading={isSubmitting}
      closeModal={closeModal}
      action={
        <div className="flex gap-2 justify-end">
          <button 
            type="button" 
            onClick={closeModal} 
            className="px-4 py-2 border rounded-md text-sm font-medium hover:bg-muted"
          >
            {t("common.cancel", "Cancel")}
          </button>
          <button 
            type="button" 
            onClick={() => formRef.current?.requestSubmit()} 
            disabled={isSubmitting}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
          >
            {isSubmitting ? t("common.saving", "Saving...") : isEditing ? t("common.update", "Update") : t("common.create", "Create")}
          </button>
        </div>
      }
      title={
        isEditing
          ? t("sections.editItem", "Edit Section Item")
          : t("sections.addNewItem", "Add New Section Item")
      }
      description={t("sections.itemModalDescription", "Enter item details for this section")}
      maxWidth="max-w-3xl"
    >
      <form ref={formRef} onSubmit={onSubmit} className="flex flex-col">
        {submitError && (
          <div className="p-3 mb-4 text-xs font-medium text-white bg-[var(--color-error)] rounded-[var(--radius-md)]">
            {submitError}
          </div>
        )}

        <div className="space-y-5 py-3">
          {/* شريط تبديل اللغات للعناصر */}
          <LanguageOptions
            t={t}
            title={t("modal.basic.item_title", "بيانات العنصر متعددة اللغات")}
            hasLanguageError={hasLanguageError}
          />

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general">{t("sections.tabs.general", "General")}</TabsTrigger>
              <TabsTrigger value="media">{t("sections.tabs.media", "Media & Links")}</TabsTrigger>
              <TabsTrigger value="advanced">{t("sections.tabs.advanced", "Advanced / Cards")}</TabsTrigger>
            </TabsList>

            {/* General Tab */}
            <TabsContent value="general" className="space-y-4 py-4">
              <Input
                key={`title-${currentLangCode}`}
                label={`${t("sections.itemTitle", "Title")} (${currentLangName})`}
                placeholder={t("sections.titlePlaceholder", "e.g. Hero Main Title")}
                error={getTranslatedError(errors.title, currentLangCode)}
                icon={<Layers size={16} />}
                {...registerTranslatedField("title", currentLangCode)}
              />

              <Input
                key={`subtitle-${currentLangCode}`}
                label={`${t("sections.itemSubtitle", "Subtitle")} (${currentLangName})`}
                placeholder={t("sections.subtitlePlaceholder", "e.g. Secondary text")}
                error={getTranslatedError(errors.subtitle, currentLangCode)}
                {...registerTranslatedField("subtitle", currentLangCode)}
              />

              <div className="flex flex-col gap-1.5">
                <Label>{t("sections.itemDescription", "Description")} ({currentLangName})</Label>
                <textarea
                  key={`description-${currentLangCode}`}
                  className="flex min-h-[90px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder={t("sections.descriptionPlaceholder", "Enter detailed description...")}
                  {...registerTranslatedField("description", currentLangCode)}
                />
                {getTranslatedError(errors.description, currentLangCode) && (
                  <span className="text-xs text-[var(--color-error)] font-medium px-1">
                    {getTranslatedError(errors.description, currentLangCode)}
                  </span>
                )}
              </div>
            </TabsContent>

            {/* Media & Links Tab */}
            <TabsContent value="media" className="space-y-4 py-4">
              <Input
                label={t("sections.itemImage", "Image URL")}
                placeholder="https://images.unsplash.com/..."
                error={errors.image?.message}
                {...register("image")}
              />

              <Input
                label={t("sections.itemLink", "Link / URL")}
                placeholder="/about or https://..."
                error={errors.link?.message}
                {...register("link")}
              />

              <Input
                key={`button_text-${currentLangCode}`}
                label={`${t("sections.buttonText", "Button Text")} (${currentLangName})`}
                placeholder="e.g. Read More"
                error={getTranslatedError(errors.button_text, currentLangCode)}
                {...registerTranslatedField("button_text", currentLangCode)}
              />
            </TabsContent>

            {/* Advanced / Floating Cards Tab */}
            <TabsContent value="advanced" className="space-y-4 py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                key={`float_title-${currentLangCode}`}
                label={`${t("sections.floatTitle", "Floating Card Title")} (${currentLangName})`}
                error={getTranslatedError(errors.float_title, currentLangCode)}
                {...registerTranslatedField("float_title", currentLangCode)}
              />

              <Input
                key={`float_subtitle-${currentLangCode}`}
                label={`${t("sections.floatSubtitle", "Floating Card Subtitle")} (${currentLangName})`}
                error={getTranslatedError(errors.float_subtitle, currentLangCode)}
                {...registerTranslatedField("float_subtitle", currentLangCode)}
              />

              <Input
                key={`stat_number-${currentLangCode}`}
                label={`${t("sections.statNumber", "Stat Number")} (${currentLangName})`}
                placeholder="e.g. 10+"
                error={getTranslatedError(errors.stat_number, currentLangCode)}
                {...registerTranslatedField("stat_number", currentLangCode)}
              />

              <Input
                key={`stat_text-${currentLangCode}`}
                label={`${t("sections.statText", "Stat Text")} (${currentLangName})`}
                placeholder="e.g. Years of Experience"
                error={getTranslatedError(errors.stat_text, currentLangCode)}
                {...registerTranslatedField("stat_text", currentLangCode)}
              />

              <div className="md:col-span-2">
                <Input
                  type="number"
                  label={t("sections.sortOrder", "Sort Order")}
                  error={errors.sort_order?.message}
                  {...register("sort_order", { valueAsNumber: true })}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </form>
    </BaseModel>
  );
}