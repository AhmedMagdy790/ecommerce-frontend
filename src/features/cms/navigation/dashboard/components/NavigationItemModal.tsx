import { useRef, useMemo, useEffect } from "react";
import { Controller } from "react-hook-form";
import { Link as LinkIcon, Layers, Hash } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useLanguageStore } from "@/features/language/store/useLanguageStore";
import { Input } from "@/shared/components/ui/Input";
import BaseModel from "@/shared/components/BaseModal";
import { type IModal, type TranslatedText } from "@/shared/types/types";
import CustomSelect from "@/shared/components/CustomSelect";
import { checkLanguageError, getTranslatedError } from "@/shared/utils/helper";
import { LanguageOptions } from "@/shared/components/LanguageOptions";
import { ActionButtons } from "@/shared/components/ActionButtons";
import { createTranslatedFieldRegistrar } from "@/shared/utils/formHelper";

import { useNavigationItemForm } from "../hook/useNavigationItemForm";
import type { NavMenuItem } from "../../model/types/navigation.types";
import { getLocalizedName } from "@/shared/utils/localizeName";
import { usePageStore } from "@/features/cms/page/model/store/usePageStore";

interface INavigationItemModal extends IModal {
  navMenuId: number;
  parentId?: number | null;
  item?: NavMenuItem<TranslatedText> | null;
}

export default function NavigationItemModal({ 
  isOpen, 
  closeModal, 
  navMenuId, 
  parentId = null, 
  item 
}: INavigationItemModal) {
  const { t } = useTranslation();
  const { currentLangCode, getCurrentLangName } = useLanguageStore();
  const currentLangName = getCurrentLangName();

  const formRef = useRef<HTMLFormElement>(null);

  const { 
    methods, 
    onSubmit, 
    isSubmitting, 
    submitError, 
    isEditMode 
  } = useNavigationItemForm(navMenuId, item, closeModal, isOpen, parentId);

  const { items: pagesList, fetch: fetchPages } = usePageStore();

  useEffect(() => {
    if (isOpen) {
      fetchPages({ per_page: 100 });
    }
  }, [isOpen, fetchPages]);

  const {
    register,
    control,
    formState: { errors },
  } = methods;


  const registerTranslatedField = createTranslatedFieldRegistrar(register);

  const statusOptions = useMemo(() => [
    { label: `🟢 ${t("status.active", "Active")}`, value: true },
    { label: `🔴 ${t("status.inactive", "Inactive")}`, value: false },
  ], [t]);

  const pagesOptions = useMemo(() => {
    const options = (pagesList || []).map((page) => ({
      label: getLocalizedName(page.title, currentLangName),
      value: Number(page.id),
    }));

    return [
      {
        label: t("navigation.noPage", "بدون صفحة (رابط مخصص فقط)"),
        value: "",
      },
      ...options,
    ];
  }, [pagesList, currentLangName, t]);

  const hasLanguageError = (lang: string) => {
    return checkLanguageError(methods.formState.errors, lang, ["title"]);
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
          ? t("navigation.editItem", "Edit Navigation Item")
          : t("navigation.addNewItem", "Add New Navigation Item")
      }
      description={t("navigation.itemModalDescription", "Configure navigation link, page reference, or dropdown child items")}
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
            title={t("modal.multilingual.section_title", "البيانات المترجمة")}
            hasLanguageError={hasLanguageError}
          />

          {/* عنوان العنصر المترجم */}
          <Input
            key={`title-${currentLangCode}`}
            label={`${t("navigation.itemTitle", "Item Title")} (${currentLangName})`}
            placeholder={t("navigation.titlePlaceholder", "e.g. About Us, Services")}
            error={getTranslatedError(errors.title, currentLangCode)}
            icon={<Layers size={16} />}
            {...registerTranslatedField("title", currentLangCode)}
          />

          <hr className="border-[var(--color-border)] my-2" />

          {/* رابط مخصص (Custom URL) */}
          <Input
            label={t("navigation.customUrl", "Custom URL")}
            placeholder="e.g. /contact or https://example.com"
            error={errors.url?.message}
            icon={<LinkIcon size={16} />}
            {...register("url")}
          />


        <Controller
            name="page_id"
            control={control}
            render={({ field }) => (
              <CustomSelect
                label={t("navigation.pageId", "Internal Page (Optional)")}
                disabled={isSubmitting}
                placeholder={t("navigation.selectPage", "اختر صفحة داخلية...")}
                options={pagesOptions}
                value={field.value ?? ""}
                onChange={(selectedOption) => {

                  const val = selectedOption ? Number(selectedOption) : null;
                  field.onChange(val);
                }}
                error={errors.page_id?.message}
              />
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="number"
              label={t("navigation.sortOrder", "Sort Order")}
              placeholder="0"
              error={errors.sort_order?.message}
              icon={<Hash size={16} />}
              {...register("sort_order", { valueAsNumber: true })}
            />

            <Controller
              name="is_active"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  label={t("common.status", "Status")}
                  disabled={isSubmitting}
                  placeholder={t("common.selectStatus", "Select Status...")}
                  options={statusOptions}
                  value={field.value ?? true}
                  onChange={field.onChange}
                  error={errors.is_active?.message}
                />
              )}
            />
          </div>
        </div>
      </form>
    </BaseModel>
  );
}