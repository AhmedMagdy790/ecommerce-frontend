// src/features/payment/components/PaymentGatewayModal.tsx

import { useRef, useMemo } from "react";
import { Controller, type Path } from "react-hook-form";
import { Globe, FileText, DollarSign, Smile } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useLanguageStore } from "@/features/language/store/useLanguageStore";
import { Input } from "@/shared/components/ui/Input";
import BaseModel from "@/shared/components/BaseModal";
import { type IModal, type TranslatedText } from "@/shared/types/types";
import CustomSelect from "@/shared/components/CustomSelect";
import { checkLanguageError, getTranslatedError } from "@/shared/utils/helper";
import { LanguageOptions } from "@/shared/components/LanguageOptions";
import { ActionButtons } from "@/shared/components/ActionButtons";
import type { PaymentGateway } from "../../model/types/payment.types";
import { usePaymentGatewayForm } from "../../hooks/usePaymentGatewayForm";
import type { PaymentGatewayFormInput } from "../../model/schema/paymentGatewaySchema";
import { usePaymentGatewayOptions } from "../../hooks/usePaymentGatewayOptions";

interface IPaymentGatewayModal extends IModal {
  gateway?: PaymentGateway<TranslatedText> | null;
}

export default function PaymentGatewayModal({ isOpen, closeModal, gateway }: IPaymentGatewayModal) {
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
  } = usePaymentGatewayForm(gateway, closeModal, isOpen);

  const { gatewayOptions, isGatewaysLoading } = usePaymentGatewayOptions();

  const {
    register,
    control,
    watch,
    formState: { errors },
  } = methods;

  const selectedType = watch("type");
  
  const hideCredentials = (selectedType && selectedType !== "online");

  const registerTranslatedField = (
    field: "name" | "description",
    lang: string
  ) => {
    return register(
      `${field}.${lang}` as Path<PaymentGatewayFormInput>
    );
  };

  const statusOptions = useMemo(() => [
    { label: `🟢 ${t("status.active", "Active")}`, value: true },
    { label: `🔴 ${t("status.inactive", "Inactive")}`, value: false },
  ], [t]);

  const testModeOptions = useMemo(() => [
    { label: `🧪 ${t("payment.test", "Test Mode")}`, value: true },
    { label: `🚀 ${t("payment.live", "Live Mode")}`, value: false },
  ], [t]);

  // خيارات أنواع بوابات الدفع المتوافقة مع الـ Enum
  const typeOptions = useMemo(() => [
    {
      label: `🌐 ${t("payment.typeOnline", "Online")}`,
      value: "online",
    },
    {
      label: `💵 ${t("payment.typeOffline", "Offline")}`,
      value: "offline",
    },
    {
      label: `🏦 ${t("payment.typeTransfer", "Bank / Wallet Transfer")}`,
      value: "transfer",
    },
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
          ? t("payment.editGateway", "Edit Payment Gateway")
          : t("payment.addNewGateway", "Add New Payment Gateway")
      }
      description={t("payment.modalDescription", "Configure payment gateway credentials and transaction settings")}
      maxWidth="max-w-2xl"
    >
      <form ref={formRef} onSubmit={onSubmit} className="flex flex-col">
        {submitError && (
          <div className="p-3 mb-4 text-xs font-medium text-white bg-[var(--color-error)] rounded-[var(--radius-md)]">
            {submitError}
          </div>
        )}

        <div className="space-y-5 py-3">
          {/* قسم تبديل اللغات للترجمات */}
          <LanguageOptions
            t={t}
            title={t("modal.basic.section_title", "بيانات البوابة الأساسية")}
            hasLanguageError={hasLanguageError}
          />

          {/* اسم البوابة (مترجم) */}
          <Input
            key={`name-${currentLangCode}`}
            label={`${t("payment.gatewayName", "Gateway Name")} (${currentLangName})`}
            placeholder={t("payment.namePlaceholder", "e.g. Stripe, PayPal")}
            error={getTranslatedError(errors.name, currentLangCode)}
            icon={<Globe size={16} />}
            {...registerTranslatedField("name", currentLangCode)}
          />

          {/* وصف البوابة (مترجم - اختياري) */}
          <Input
            key={`description-${currentLangCode}`}
            label={`${t("payment.description", "Description")} (${currentLangName})`}
            placeholder={t("payment.descriptionPlaceholder", "Gateway description...")}
            error={getTranslatedError(errors.description, currentLangCode)}
            icon={<FileText size={16} />}
            {...registerTranslatedField("description", currentLangCode)}
          />

          {/* الـ Slug والنوع */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="slug"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  label={t("payment.gateway", "Payment Gateway")}
                  disabled={isSubmitting || isEditMode || isGatewaysLoading}
                  placeholder={
                    isGatewaysLoading 
                      ? t("common.loading", "Loading...") 
                      : t("payment.selectGateway", "Select Payment Gateway...")
                  }
                  options={gatewayOptions}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.slug?.message}
                />
              )}
            />

            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  label={t("payment.type", "Gateway Type")}
                  disabled={isSubmitting}
                  placeholder={t("payment.selectType", "Select Type...")}
                  options={typeOptions}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.type?.message}
                />
              )}
            />
          </div>

          {/* الرسوم الإضافية وأيقونة البوابة (icon_name) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="number"
              step="0.01"
              label={t("payment.extraFees", "Extra Fees")}
              placeholder="0.00"
              error={errors.extra_fees?.message}
              icon={<DollarSign size={16} />}
              {...register("extra_fees", { valueAsNumber: true })}
            />

            <Input
              label={t("payment.iconName", "Icon Name")}
              placeholder="e.g. credit-card, stripe-icon"
              error={errors.icon_name?.message}
              icon={<Smile size={16} />}
              {...register("icon_name")}
            />
          </div>

          {/* رفع الشعار (Logo File) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[var(--color-text-secondary)]">
              {t("payment.logo", "Gateway Logo")}
            </label>
            <input
              type="file"
              accept="image/*"
              className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[var(--color-primary)]/10 file:text-[var(--color-primary)] hover:file:bg-[var(--color-primary)]/20 cursor-pointer"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  methods.setValue("logo", file, { shouldValidate: true });
                }
              }}
            />
            {errors.logo?.message && (
              <span className="text-xs text-[var(--color-error)]">
                {String(errors.logo.message)}
              </span>
            )}
          </div>

          {/* إخفاء إعدادات الاعتماد تلقائياً إذا كانت البوابة لا تتطلب ذلك (مثل الـ COD) */}
          {!hideCredentials && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-[var(--color-background-secondary)] rounded-[var(--radius-md)] border border-[var(--color-border)] transition-all">
              <div className="md:col-span-2 text-xs font-semibold text-[var(--color-text-primary)]">
                {t("payment.credentialsTitle", "إعدادات الاعتماد والربط (API Keys)")}
              </div>

              <Input
                label={t("payment.publicKey", "Public Key / API Key")}
                placeholder="e.g. pk_test_..."
                error={errors.credentials?.public_key?.message ? String(errors.credentials.public_key.message) : undefined}
                {...register("credentials.public_key")}
              />

              <Input
                label={t("payment.secretKey", "Secret Key")}
                placeholder="e.g. sk_test_..."
                error={errors.credentials?.secret_key?.message ? String(errors.credentials.secret_key.message) : undefined}
                {...register("credentials.secret_key")}
              />
            </div>
          )}

          {/* حالات التشغيل (الحالة العامة ووضع الاختبار) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
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

            <Controller
              name="is_test_mode"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  label={t("payment.mode", "Mode")}
                  disabled={isSubmitting}
                  placeholder={t("payment.selectMode", "Select Mode...")}
                  options={testModeOptions}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.is_test_mode?.message}
                />
              )}
            />
          </div>
        </div>
      </form>
    </BaseModel>
  );
}