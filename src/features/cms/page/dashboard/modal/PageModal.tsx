import { useRef, useMemo } from "react";
import { Controller, type Path } from "react-hook-form";
import { FileText, Link as LinkIcon, Search } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useLanguageStore } from "@/features/language/store/useLanguageStore";
import { Input } from "@/shared/components/ui/Input";
import BaseModel from "@/shared/components/BaseModal";
import { type IModal } from "@/shared/types/types";
import CustomSelect from "@/shared/components/CustomSelect";
import { Textarea } from "@/shared/components/Textarea";
import { ActionButtons } from "@/shared/components/ActionButtons";
import { checkLanguageError, getTranslatedError } from "@/shared/utils/helper";
import { usePageForm } from "../hooks/usePageForm";
import type { PageFormInput } from "../../model/schema/pageSchema";
import { LanguageOptions } from "@/shared/components/LanguageOptions";

interface IPageModal extends IModal {
  page?: Parameters<typeof usePageForm>[0];
}

export default function PageModal({ isOpen, closeModal, page }: IPageModal) {
  const { t } = useTranslation("cms");

  const formRef = useRef<HTMLFormElement>(null);


  const { currentLangCode, getCurrentLangName } = useLanguageStore();

  const currentLangName = getCurrentLangName();

  const { 
    methods, 
    onSubmit, 
    isSubmitting, 
    submitError, 
    isEditMode 
  } = usePageForm(page, closeModal, isOpen);

  const {
    register,
    control,
    formState: { errors },
  } = methods;

  const registerTranslatedField = (
    field: "title" | "content" | "meta_title" | "meta_description",
    lang: string
  ) => {
    return register(
      `${field}.${lang}` as Path<PageFormInput>
    );
  };

  const statusOptions = useMemo(() => [
    { label: `🟢 ${t("status.active", "Active")}`, value: "true" },
    { label: `🔴 ${t("status.inactive", "Inactive")}`, value: "false" },
  ], [t]);

  const hasLanguageError = (lang: string) => {
    return checkLanguageError(methods.formState.errors, lang, ["name", "description"]);
  };



  return (
    <BaseModel
      isOpen={isOpen}
      isLoading={isSubmitting}
      closeModal={closeModal}
      action={
        <ActionButtons
          closeModal={closeModal}
          isEditMode={isEditMode}
          isSubmitting={isSubmitting}
          formRef={formRef}
          t={t}
        />
      }
      title={
        isEditMode
          ? t("page.editPage", "Edit Page")
          : t("page.addNewPage", "Add New Page")
      }
      description={t("page.modalDescription", "Enter page details to manage it in store")}
      maxWidth="max-w-xl"
    >
      <form ref={formRef} onSubmit={onSubmit} className="flex flex-col">
        {submitError && (
          <div className="p-3 mb-4 text-xs font-medium text-white bg-[var(--color-error)] rounded-[var(--radius-md)]">
            {submitError}
          </div>
        )}

        <div className="space-y-5 py-3">

          {/* Language Selector Bar */}

          <LanguageOptions
            t={t}
            title={t(
              "modal.basic.section_title",
              "بيانات المنتج الأساسية"
            )}
            hasLanguageError={hasLanguageError}
          />
  

          {/* Title Field (Localized) */}
          <Input
            key={`title-${currentLangCode}`}
            label={`${t("page.title", "Page Title")} (${currentLangName})`}
            placeholder={t("page.titlePlaceholder", "e.g. Privacy Policy")}
            error={getTranslatedError(errors.title, currentLangCode)}
            icon={<FileText size={16} />}
            {...registerTranslatedField("title", currentLangCode)}
          />

          {/* Slug Field (Non-localized) */}
          <Input
            label={t("page.slug", "Slug")}
            placeholder={t("page.slugPlaceholder", "e.g. privacy-policy")}
            error={errors.slug?.message?.toString()}
            icon={<LinkIcon size={16} />}
            {...register("slug")}
          />

          {/* Status Field */}
          <Controller
            name="is_active"
            control={control}
            render={({ field }) => (
              <CustomSelect
                label={t("common.status", "Status")}
                disabled={isSubmitting}
                placeholder={t("common.selectStatus", "Select Status...")}
                options={statusOptions}
                value={field.value !== undefined ? String(field.value) : "true"}
                onChange={(val) => field.onChange(val === "true")}
                error={errors.is_active?.message?.toString()}
              />
            )}
          />

          {/* Content Field (Localized) */}
          <Textarea
            key={`content-${currentLangCode}`}
            label={`${t("page.content", "Page Content")} (${currentLangName})`}
            placeholder={t(
              "page.contentPlaceholder",
              "Write your page content here..."
            )}
            error={getTranslatedError(errors.content, currentLangCode)}
            {...registerTranslatedField("content", currentLangCode)}
          />

          {/* Meta Title Field (Localized) */}
          <Input
            key={`meta_title-${currentLangCode}`}
            label={`${t("page.metaTitle", "Meta Title")} (${currentLangName})`}
            placeholder={t("page.metaTitlePlaceholder", "e.g. Privacy Policy - Store Name")}
            error={getTranslatedError(errors.meta_title, currentLangCode)}
            icon={<Search size={16} />}
            {...registerTranslatedField("meta_title", currentLangCode)}
          />

          {/* Meta Description Field (Localized) */}
          <Textarea
            key={`meta_description-${currentLangCode}`}
            label={`${t("page.metaDescription", "Meta Description")} (${currentLangName})`}
            placeholder={t(
              "page.metaDescriptionPlaceholder",
              "Write meta description for SEO..."
            )}
            error={getTranslatedError(errors.meta_description, currentLangCode)}
            {...registerTranslatedField("meta_description", currentLangCode)}
          />

        </div>
      </form>
    </BaseModel>
  );
}