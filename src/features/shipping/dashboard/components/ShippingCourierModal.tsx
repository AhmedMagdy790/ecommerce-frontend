// src/features/shipping/components/ShippingCourierModal.tsx

import { useRef, useMemo } from "react";
import { Controller } from "react-hook-form";
import { Truck, Globe, FileText, Key, Link as LinkIcon, Phone, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useLanguageStore } from "@/features/language/store/useLanguageStore";
import { Input } from "@/shared/components/ui/Input";
import BaseModel from "@/shared/components/BaseModal";
import { type IModal, type TranslatedText } from "@/shared/types/types";
import CustomSelect from "@/shared/components/CustomSelect";
import { checkLanguageError, getTranslatedError } from "@/shared/utils/helper";
import { LanguageOptions } from "@/shared/components/LanguageOptions";
import { ActionButtons } from "@/shared/components/ActionButtons";
import { useShippingCourierForm } from "../../hooks/useShippingCourierForm";
import type { ShippingCourier } from "../../model/types/shipping.types";
import { createTranslatedFieldRegistrar } from "@/shared/utils/formHelper";


interface IShippingCourierModal extends IModal {
  courier?: ShippingCourier<TranslatedText> | null;
}

export default function ShippingCourierModal({ isOpen, closeModal, courier }: IShippingCourierModal) {
  const { t } = useTranslation();


  const { currentLangCode, getCurrentLangName } = useLanguageStore();

  const formRef = useRef<HTMLFormElement>(null);

  const currentLangName = getCurrentLangName();


  const { 
    methods, 
    onSubmit, 
    isSubmitting, 
    submitError, 
    isEditMode 
  } = useShippingCourierForm(courier, closeModal, isOpen);

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

  const codOptions = useMemo(() => [
    { label: t("common.yes", "Yes"), value: true },
    { label: t("common.no", "No"), value: false },
  ], [t]);


  // التحقق من الأخطاء في اللغات المختلفة (يشمل الحقول الإجبارية والاختيارية المترجمة)
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
          ? t("shipping.editCourier", "Edit Shipping Courier")
          : t("shipping.addNewCourier", "Add New Shipping Courier")
      }
      description={t("shipping.modalDescription", "Configure shipping provider details, endpoints, and credentials")}
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
            title={t("modal.multilingual.section_title", "البيانات المترجمة")}
            hasLanguageError={hasLanguageError}
          />

          {/* اسم شركة الشحن (حقل مترجم إجباري) */}
          <Input
            key={`name-${currentLangCode}`}
            label={`${t("shipping.courierName", "Courier Name")} (${currentLangName})`}
            placeholder={t("shipping.namePlaceholder", "e.g. DHL, Aramex")}
            error={getTranslatedError(errors.name, currentLangCode)}
            icon={<Globe size={16} />}
            {...registerTranslatedField("name", currentLangCode)}
          />

          {/* وصف شركة الشحن (حقل مترجم اختياري يدعم null/undefined بنجاح) */}
          <Input
            key={`description-${currentLangCode}`}
            label={`${t("shipping.description", "Description")} (${currentLangName})`}
            placeholder={t("shipping.descriptionPlaceholder", "Optional details or instructions...")}
            error={getTranslatedError(errors.description, currentLangCode)}
            icon={<FileText size={16} />}
            {...registerTranslatedField("description", currentLangCode)}
          />

          <hr className="border-[var(--color-border)] my-2" />

          {/* الحقول التقنية والأساسية غير المترجمة */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={t("shipping.code", "Courier Code")}
              placeholder="e.g. dhl_express"
              error={errors.code?.message}
              icon={<Truck size={16} />}
              {...register("code")}
            />

            <Input
              label={t("shipping.phone", "Phone Number")}
              placeholder="e.g. +201234567890"
              error={errors.phone?.message}
              icon={<Phone size={16} />}
              {...register("phone")}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={t("shipping.email", "Email Address")}
              placeholder="e.g. support@courier.com"
              error={errors.email?.message}
              icon={<Mail size={16} />}
              {...register("email")}
            />

            <Input
              label={t("shipping.driver", "Driver Identifier")}
              placeholder="e.g. default_driver"
              error={errors.driver?.message}
              {...register("driver")}
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <Input
              label={t("shipping.apiEndpoint", "API Endpoint")}
              placeholder="https://api.courier.com/v1"
              error={errors.api_endpoint?.message}
              icon={<LinkIcon size={16} />}
              {...register("api_endpoint")}
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <Input
              type="password"
              label={t("shipping.apiKey", "API Key")}
              placeholder="Enter API secret key..."
              error={errors.api_key?.message}
              icon={<Key size={16} />}
              {...register("api_key")}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="supports_cod"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  label={t("shipping.supportsCod", "Supports Cash on Delivery (COD)")}
                  disabled={isSubmitting}
                  placeholder={t("common.selectOption", "Select...")}
                  options={codOptions}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.supports_cod?.message}
                />
              )}
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
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.is_active?.message}
                />
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <Input
              label={t("shipping.trackingUrl", "Tracking URL Template")}
              placeholder="https://track.courier.com?id={tracking_number}"
              error={errors.tracking_url?.message}
              {...register("tracking_url")}
            />
          </div>
        </div>
      </form>
    </BaseModel>
  );
}