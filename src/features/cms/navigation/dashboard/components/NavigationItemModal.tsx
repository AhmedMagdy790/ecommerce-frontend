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
  const { t } = useTranslation("navigation");
  const { t: tc } = useTranslation("common");
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
    { label: `🟢 ${tc("status.active", "Active")}`, value: true },
    { label: `🔴 ${tc("status.inactive", "Inactive")}`, value: false },
  ], [tc]);

  const pagesOptions = useMemo(() => {
    const options = (pagesList || []).map((page) => ({
      label: getLocalizedName(page.title, currentLangName),
      value: Number(page.id),
    }));

    return [
      {
        label: t("noPage", "بدون صفحة (رابط مخصص فقط)"),
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
          ? t("editItem", "Edit Navigation Item")
          : t("addNewItem", "Add New Navigation Item")
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
            label={`${t("itemTitle", "Item Title")} (${currentLangName})`}
            placeholder={t("titlePlaceholder", "e.g. About Us, Services")}
            error={getTranslatedError(errors.title, currentLangCode)}
            icon={<Layers size={16} />}
            {...registerTranslatedField("title", currentLangCode)}
          />

          <hr className="border-[var(--color-border)] my-2" />

          {/* رابط مخصص (Custom URL) */}
          <Input
            label={t("customUrl", "Custom URL")}
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
                label={t("pageId", "Internal Page (Optional)")}
                disabled={isSubmitting}
                placeholder={t("selectPage", "اختر صفحة داخلية...")}
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
              label={t("sortOrder", "Sort Order")}
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
                  label={tc("status.label", "Status")}
                  disabled={isSubmitting}
                  placeholder={tc("selectStatus", "Select Status...")}
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