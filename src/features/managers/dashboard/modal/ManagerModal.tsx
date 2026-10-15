// src/features/managers/dashboard/components/ManagerModal.tsx

import { useRef, useMemo } from "react";
import { Controller, type Path } from "react-hook-form";
import { User, Mail, Phone, Lock } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useLanguageStore } from "@/features/language/store/useLanguageStore";
import { Input } from "@/shared/components/ui/Input";
import BaseModel from "@/shared/components/BaseModal";
import { type IModal } from "@/shared/types/types";
import CustomSelect from "@/shared/components/CustomSelect";
import { ImageUploadField } from "@/shared/components/ImageUploadField";
import { checkLanguageError, getTranslatedError } from "@/shared/utils/helper";
import { LanguageOptions } from "@/shared/components/LanguageOptions";
import { ActionButtons } from "@/shared/components/ActionButtons";

import type { User as UserType } from "@/features/users/model/types/user.types";
import type { UserFormInput } from "@/features/users/model/schema/userSchema";
import { useManagerForm } from "../hooks/useManagerForm";
import { useRoleOptions } from "@/features/roles/hooks/useRoleOptions";

interface IManagerModal extends IModal {
  user?: UserType | null;
}

export default function ManagerModal({ isOpen, closeModal, user }: IManagerModal) {
  const { t } = useTranslation();

  const { currentLangCode, getCurrentLangName } = useLanguageStore();
  const currentLangName = getCurrentLangName();

  const formRef = useRef<HTMLFormElement>(null);

  // 1. جلب خيارات الأدوار الجاهزة مع حالة التحميل
  const { roleOptions, isRolesLoading } = useRoleOptions();

  // 2. ربط الـ Hook الخاص بالفورم
  const { 
    methods, 
    onSubmit, 
    isSubmitting, 
    submitError, 
    isEditMode 
  } = useManagerForm(user, closeModal, isOpen);

  const {
    register,
    control,
    formState: { errors },
  } = methods;

  // تسجيل الحقول المترجمة (الاسم)
  const registerTranslatedField = (field: "name", lang: string) => {
    return register(`${field}.${lang}` as Path<UserFormInput>);
  };

  // خيارات حالة الحساب
  const statusOptions = useMemo(() => [
    { label: `🟢 ${t("status.active", "نشط")}`, value: "active" },
    { label: `🔴 ${t("status.inactive", "غير نشط")}`, value: "inactive" },
  ], [t]);

  // فحص أخطاء الترجمة للغات
  const hasLanguageError = (lang: string) => {
    return checkLanguageError(methods.formState.errors, lang, ["name"]);
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
          ? t("managers.editManager", "تعديل بيانات المشرف")
          : t("managers.addNewManager", "إضافة مشرف جديد")
      }
      description={t("managers.modalDescription", "أدخل بيانات المشرف والصلاحيات الموكلة له")}
      maxWidth="max-w-xl"
    >
      <form ref={formRef} onSubmit={onSubmit} className="flex flex-col">
        {submitError && (
          <div className="p-3 mb-4 text-xs font-medium text-white bg-[var(--color-error)] rounded-[var(--radius-md)]">
            {submitError}
          </div>
        )}

        <div className="space-y-5 py-3">
          {/* 🌐 شريط اختيار اللغات للحقول المترجمة */}
          <LanguageOptions
            t={t}
            title={t("modal.basic.section_title", "البيانات الأساسية")}
            hasLanguageError={hasLanguageError}
          />

          {/* 👤 اسم المشرف (مترجم) */}
          <Input
            key={`name-${currentLangCode}`}
            label={`${t("managers.managerName", "اسم المشرف")} (${currentLangName})`}
            placeholder={t("managers.namePlaceholder", "أدخل اسم المشرف...")}
            error={getTranslatedError(errors.name, currentLangCode)}
            icon={<User size={16} />}
            {...registerTranslatedField("name", currentLangCode)}
          />

          {/* 🖼️ الصورة الشخصية (Avatar) */}
          <Controller
            name="avatar"
            control={control}
            render={({ field }) => (
              <ImageUploadField
                value={field.value ?? null}
                variant="default"
                onChange={(file) => field.onChange(file)}
                error={errors.avatar?.message?.toString()}
              />
            )}
          />

          {/* 📧 البريد الإلكتروني والهاتف */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={t("common.email", "البريد الإلكتروني")}
              type="email"
              placeholder="example@domain.com"
              error={errors.email?.message}
              icon={<Mail size={16} />}
              {...register("email")}
            />

            <Input
              label={t("common.phone", "رقم الهاتف")}
              type="tel"
              placeholder="+20123456789"
              error={errors.phone?.message}
              icon={<Phone size={16} />}
              {...register("phone")}
            />
          </div>

          {/* 🔑 كلمة المرور وتأكيد كلمة المرور */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={
                isEditMode
                  ? t("managers.passwordOptional", "كلمة المرور (اختياري)")
                  : t("common.password", "كلمة المرور")
              }
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              icon={<Lock size={16} />}
              {...register("password")}
            />

            <Input
              label={t("common.confirmPassword", "تأكيد كلمة المرور")}
              type="password"
              placeholder="••••••••"
              error={errors.password_confirmation?.message}
              icon={<Lock size={16} />}
              {...register("password_confirmation")}
            />
          </div>

          {/* 🛡️ الحالة والدور الوظيفي المدمج (Status & Role) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  label={t("common.status", "الحالة")}
                  disabled={isSubmitting}
                  placeholder={t("common.selectStatus", "اختر الحالة...")}
                  options={statusOptions}
                  value={field.value?.toString() || "active"}
                  onChange={field.onChange}
                  error={errors.status?.message}
                />
              )}
            />

            <Controller
              name="roles"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  label={t("managers.role", "الدور / الصلاحيات")}
                  disabled={isSubmitting || isRolesLoading}
                  placeholder={t("managers.selectRole", "اختر الدور...")}
                  options={roleOptions}
                  value={
                    Array.isArray(field.value) && field.value.length > 0
                      ? String(field.value[0])
                      : typeof field.value === "string" || typeof field.value === "number"
                      ? String(field.value)
                      : ""
                  }
                  onChange={(val) => field.onChange(val ? [val] : [])}
                  error={errors.roles?.message}
                />
              )}
            />
          </div>
        </div>
      </form>
    </BaseModel>
  );
}