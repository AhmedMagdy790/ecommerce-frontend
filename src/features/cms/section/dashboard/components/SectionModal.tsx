import { useRef } from "react";
import { type Path } from "react-hook-form";
import { Package } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useLanguageStore } from "@/features/language/store/useLanguageStore";
import { Input } from "@/shared/components/ui/Input";
import { Label } from "@/shared/components/ui/label";
import BaseModel from "@/shared/components/BaseModal";
import { Switch } from "@/shared/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/shared/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/components/ui/tabs";
import { useSectionModal } from "../hooks/useSectionModal";
import { SectionTypes, type SectionType, type Section, SectionKeys } from "../../model/types/section.types";
import type { SectionFormInput } from "../../model/schema/sectionSchema";
import { checkLanguageError, getTranslatedError } from "@/shared/utils/helper";
import { LanguageOptions } from "@/shared/components/LanguageOptions";
import { SectionSelectIdsSelector } from "./SectionSelectIdsSelector";
import { useSectionContentOptions } from "../hooks/useSectionSelectIdsOptions";
import type { TranslatedText } from "@/shared/types/types";

interface SectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  pageId: number;
  editingSection: Section<TranslatedText> | null;
  onSectionSaved?: () => void;
}

export function SectionModal({
  isOpen,
  onClose,
  pageId,
  editingSection,
  onSectionSaved,
}: SectionModalProps) {
  const { t } = useTranslation();


  const formRef = useRef<HTMLFormElement>(null);
  const currentLangCode = useLanguageStore((state) => state.currentLangCode);
  const getCurrentLangName = useLanguageStore((state) => state.getCurrentLangName);
  const currentLangName = getCurrentLangName();

  const {
    methods,
    activeTab,
    setActiveTab,
    isSubmitting,
    submitError,
    isEditing,
    onSubmit,
  } = useSectionModal({
    isOpen,
    onClose,
    pageId,
    editingSection,
    onSectionSaved,
  });

  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = methods;

  const { contentOptions, isContentLoading, setSearch, search } = useSectionContentOptions(watch("type"))

  const registerTranslatedField = (
    field: "name",
    lang: string
  ) => {
    return register(
      `${field}.${lang}` as Path<SectionFormInput>
    );
  };


  const hasLanguageError = (lang: string) => {
    return checkLanguageError(errors, lang, ["name"]);
  };

  const settings = watch("settings") ?? {};

  return (
    <BaseModel
      isOpen={isOpen}
      isLoading={isSubmitting}
      closeModal={onClose}
      action={
        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={onClose}
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
          ? t("sections.editSection", "Edit Section")
          : t("sections.addNewSection", "Add New Section")
      }
      description={t("sections.modalDescription", "Enter section details to manage it in page")}
      maxWidth="max-w-2xl"
    >
      <form ref={formRef} onSubmit={onSubmit} className="flex flex-col">
        {submitError && (
          <div className="p-3 mb-4 text-xs font-medium text-white bg-[var(--color-error)] rounded-[var(--radius-md)]">
            {submitError}
          </div>
        )}

        <div className="space-y-5 py-3">
          <LanguageOptions
            t={t}
            title={t(
              "modal.basic.section_title",
              "بيانات القسم الأساسية"
            )}
            hasLanguageError={hasLanguageError}
          />

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="general">General Info</TabsTrigger>
              <TabsTrigger value="settings">Settings & Design</TabsTrigger>
            </TabsList>

            {/* General Tab */}
            <TabsContent value="general" className="space-y-4 py-4">
              {/* Translated Name */}
              <Input
                key={`name-${currentLangCode}`}
                label={`${t("sections.sectionName", "Section Name")} (${currentLangName})`}
                placeholder={t("sections.namePlaceholder", "e.g. Hero Banner")}
                error={getTranslatedError(errors.name, currentLangCode)}
                icon={<Package size={16} />}
                {...registerTranslatedField("name", currentLangCode)}
              />

              {/* Section Key */}
              <div className="flex flex-col gap-2 w-full">
                <Label>Section Key</Label>

                <Select
                  value={watch("key")}
                  onValueChange={(value) =>
                    setValue("key", value, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select section key" />
                  </SelectTrigger>

                  <SelectContent className="z-[var(--z-dropdown)] bg-[var(--dropdown-bg)] border-[var(--dropdown-border)]">
                    {Object.entries(SectionKeys).map(([key, value]) => (
                      <SelectItem key={key} value={value}>
                        {value.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {errors.key?.message && (
                  <span className="text-xs text-[var(--color-error)] font-medium px-1">
                    {errors.key.message}
                  </span>
                )}
              </div>


              {/* Section Type */}
              <div className="flex flex-col gap-2 w-full">
                <Label>Section Type</Label>
                <Select
                  onValueChange={(val) => setValue("type", val as SectionType, { shouldValidate: true })}
                  value={watch("type")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select section type" />
                  </SelectTrigger>
                  <SelectContent className="z-[var(--z-dropdown)] bg-[var(--dropdown-bg)]/80 backdrop-blur-md border-[var(--dropdown-border)] shadow-[var(--shadow-lg)]">
                    {Object.entries(SectionTypes).map(([key, value]) => (
                      <SelectItem key={key} value={value}>
                        {value.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.type?.message && (
                  <span className="text-xs text-[var(--color-error)] font-medium px-1">
                    {errors.type.message}
                  </span>
                )}
              </div>


              {contentOptions && (
                <SectionSelectIdsSelector
                  type={watch("type")}
                  search={search}
                  onSearchChange={(search) => setSearch(search)}
                  options={contentOptions.map((option) => ({
                    ...option,
                    value: Number(option.value),
                  }))}
                  selectedIds={watch("selected_ids") ?? []}
                  onChange={(ids) =>
                    setValue("selected_ids", ids, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                  error={errors.selected_ids?.message}
                  isLoading={isContentLoading}
                />
              )}

              {/* 👈 وضعنا sort_order هنا ليكون في الواجهة الأساسية */}
              <Input
                type="number"
                label="Sort Order"
                error={errors.sort_order?.message}
                {...register("sort_order", { valueAsNumber: true })}
              />

              {/* 👈 وضعنا is_active هنا أيضاً بجانب الترتيب */}
              <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label className="text-base">Active Status</Label>
                </div>
                <Switch
                  checked={watch("is_active")}
                  onCheckedChange={(checked) => setValue("is_active", checked, { shouldValidate: true })}
                />
              </div>
            </TabsContent>

            {/* Settings Tab (خاص بالإعدادات والتصميم والمرونة المستقبلية) */}
            <TabsContent value="settings" className="space-y-4 py-4">
              <div className="flex flex-col gap-2 w-full">
                <Label>Section Layout / Variant</Label>
                <Select
                  onValueChange={(val) => setValue("settings.layout", val, { shouldValidate: true })}
                  value={typeof settings.layout === "string" ? settings.layout : ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select layout variant" />
                  </SelectTrigger>
                  <SelectContent className="z-[var(--z-dropdown)] bg-[var(--dropdown-bg)]/80 backdrop-blur-md border-[var(--dropdown-border)] shadow-[var(--shadow-lg)]">
                    <SelectItem value="collection">Collection (Default)</SelectItem>
                    <SelectItem value="full_width">Full Width</SelectItem>
                    <SelectItem value="slider">Slider</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Input
                label="Background Color (Optional)"
                placeholder="e.g. #f8f9fa"
                {...register("settings.background_color")}
              />
            </TabsContent>
          </Tabs>
        </div>
      </form>
    </BaseModel>
  );
}