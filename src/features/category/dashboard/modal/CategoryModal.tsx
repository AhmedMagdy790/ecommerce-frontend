// src/features/category/components/CategoryModal.tsx
import { useRef, useMemo } from "react";
import { Controller, type Path } from "react-hook-form";
import { Package } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useLanguageStore } from "@/features/language/store/useLanguageStore";
import { Input } from "@/shared/components/ui/Input";
import BaseModel from "@/shared/components/BaseModal";
import { type IModal, type TranslatedText } from "@/shared/types/types";
import CustomSelect from "@/shared/components/CustomSelect";
import { Textarea } from "@/shared/components/Textarea";

import type { Category } from "../../model/types/category.types";
import { useCategoryForm } from "../hook/useCategoryForm";
import { useCategoryStore } from "../../model/store/useCategoryStore";
import type { CategoryFormInput } from "../../model/schema/categorySchema";
import { getLocalizedName } from "@/shared/utils/localizeName";
import { ImageUploadField } from "@/shared/components/ImageUploadField";
import { checkLanguageError, getTranslatedError } from "@/shared/utils/helper";
import { LanguageOptions } from "@/shared/components/LanguageOptions";
import { ActionButtons } from "@/shared/components/ActionButtons";

interface ICategoryModal extends IModal {
  category?: Category<TranslatedText> | null;
}

export default function CategoryModal({ isOpen, closeModal, category }: ICategoryModal) {
  const { t, i18n } = useTranslation();
  const currentAppLang = i18n.language;

  const { currentLangCode, getCurrentLangName } = useLanguageStore();

  const currentLangName = getCurrentLangName();


  const formRef = useRef<HTMLFormElement>(null);
  const { items } = useCategoryStore();



  const { 
    methods, 
    onSubmit, 
    isSubmitting, 
    submitError, 
    isEditMode 
  } = useCategoryForm(category, closeModal, isOpen);

  const {
    register,
    control,
    formState: { errors },
  } = methods;

  const registerTranslatedField = (
    field: "name" | "description",
    lang: string
  ) => {
    return register(
      `${field}.${lang}` as Path<CategoryFormInput>
    );
  };


  const statusOptions = useMemo(() => [
    { label: `🟢 ${t("status.active", "Active")}`, value: "active" },
    { label: `🔴 ${t("status.inactive", "Inactive")}`, value: "inactive" },
  ], [t]);

  const categoryOptions = useMemo(() => {
  const options = (items || [])
    .filter(
      (cat) => String(cat.id) !== String(category?.id)
    )
    .map((cat) => ({
      label:
        typeof cat.name === "object"
          ? getLocalizedName(
              cat.name,
              currentAppLang
            )
          : String(cat.name),
      value: String(cat.id),
    }));

    return [
      {
        label: t(
          "categories.mainCategoryNone",
          "Main Category (None)"
        ),
        value: "",
      },
      ...options,
    ];
  }, [items, category, currentAppLang, t]);

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
      />}
      title={
        isEditMode
          ? t("categories.editCategory", "Edit Category")
          : t("categories.addNewCategory", "Add New Category")
      }
      description={t("categories.modalDescription", "Enter category details to manage it in store")}
      maxWidth="max-w-xl"
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
              "بيانات المنتج الأساسية"
            )}
            hasLanguageError={hasLanguageError}
          />

         <Input
            key={`name-${currentLangCode}`}
            label={`${t("categories.categoryName", "Category Name")} (${currentLangName})`}
            placeholder={t("categories.namePlaceholder", "e.g. Electronics")}
            error={getTranslatedError(errors.name, currentLangCode)}
            icon={<Package size={16} />}
             {...registerTranslatedField("name", currentLangCode)}
          />

          {/* 🖼️ حقل الصورة المستقل */}
          <Controller
            name="image"
            control={control}
            render={({ field }) => (
              <ImageUploadField
                value={field.value ?? null}
                variant="default"
                onChange={(file) => field.onChange(file)}
                error={errors.image?.message?.toString()}
              />
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  label={t("common.status", "Status")}
                  disabled={isSubmitting}
                  placeholder={t("common.selectStatus", "Select Status...")}
                  options={statusOptions}
                  value={field.value?.toString() || "active"}
                  onChange={field.onChange}
                  error={errors.status?.message}
                />
              )}
            />

            <Controller
              name="parent_id"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  label={t("categories.parentCategoryOptional", "Parent Category (Optional)")}
                  disabled={isSubmitting}
                  placeholder={t("categories.selectParent", "Select Parent...")}
                  options={categoryOptions}
                  value={field.value !== null && field.value !== undefined ? String(field.value) : ""}
                  onChange={(val) => {
                    if (val === "" || val == null) {
                      field.onChange(null);
                      return;
                    }

                    field.onChange(Number(val));
                  }}
                  error={errors.parent_id?.message}
                />
              )}
            />
          </div>

          <Textarea
              key={`desc-${currentLangCode}`}
              label={`${t("categories.categoryDescription", "Category Description")} (${currentLangName})`}
              placeholder={t(
                  "categories.descriptionPlaceholder",
                  "Write a short category description..."
              )}
              error={getTranslatedError(errors.description, currentLangCode)}
               {...registerTranslatedField("description", currentLangCode)}
          />
        </div>
      </form>
    </BaseModel>
  );
}