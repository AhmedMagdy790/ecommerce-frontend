import { useState, useRef, useMemo } from "react";
import { Controller } from "react-hook-form";
import { User, Mail, Phone, Lock, UserPlus, UserCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Input } from "@/shared/components/ui/Input";
import BaseModel from "@/shared/components/BaseModal";
import { type IModal } from "@/shared/types/types";
import CustomSelect from "@/shared/components/CustomSelect";
import { ImageUploadField } from "@/shared/components/ImageUploadField";
import { checkLanguageError } from "@/shared/utils/helper";
import { LanguageOptions } from "@/shared/components/LanguageOptions";
import { ActionButtons } from "@/shared/components/ActionButtons";

import type { User as UserType } from "@/features/users/model/types/user.types";
import { useManagerForm } from "../hooks/useManagerForm";
import { useRoleOptions } from "@/features/roles/hooks/useRoleOptions";
import { useUserStore } from "@/features/users/model/store/useUserStore";
import { UserSelectField } from "@/features/users/components/UserSelectField";

interface IManagerModal extends IModal {
  user?: UserType | null;
}

export default function ManagerModal({ isOpen, closeModal, user }: IManagerModal) {
  const { t } = useTranslation("managers");
  const { t: tc } = useTranslation("common");

  const formRef = useRef<HTMLFormElement>(null);

  // وضع الإنشاء: خيار بين (مستخدم موجود) أو (مستخدم جديد)
  const [creationMode, setCreationMode] = useState<"select" | "create">("select");
  const users = useUserStore((state) => state.items);

  const { roleOptions, isRolesLoading } = useRoleOptions();
  const { methods, onSubmit, isSubmitting, submitError, isEditMode } = useManagerForm(
    user,
    closeModal,
    isOpen
  );

  const { register, control, setValue, formState: { errors } } = methods;

  const handleModeChange = (mode: "select" | "create") => {
    setCreationMode(mode);
    setValue("mode", mode);


    setValue("user_id", "");
    setValue("name", "");
    setValue("email", "");
    setValue("phone", "");
  };

  const handleSelectUser = (selectedId: string | number) => {

    const foundUser = users.find(
      (u) => String(u.id) === String(selectedId)
    );
    console.log("foundUser", foundUser)

    if (foundUser) {
      setValue("name", foundUser.name || "");
      setValue("email", foundUser.email || "");
      setValue("phone", foundUser.phone || "");
    }
  };

  const statusOptions = useMemo(
    () => [
      { label: `🟢 ${tc("status.active", "نشط")}`, value: "active" },
      { label: `🔴 ${tc("status.inactive", "غير نشط")}`, value: "inactive" },
    ],
    [t]
  );

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
          ? t("editManager", "تعديل بيانات المشرف")
          : t("addNewManager", "إضافة مشرف")
      }
      description={t("modalDescription", "أدخل بيانات المشرف والصلاحيات الموكلة له")}
      maxWidth="max-w-xl"
    >
      <form ref={formRef} onSubmit={onSubmit} className="flex flex-col">
        {submitError && (
          <div className="p-3 mb-4 text-xs font-medium text-white bg-[var(--color-error)] rounded-[var(--radius-md)]">
            {submitError}
          </div>
        )}

        {!isEditMode && (
          <div className="flex gap-2 p-1 mb-4 bg-muted/40 rounded-lg">
            <button
              type="button"
              onClick={() => handleModeChange("select")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-md transition-all ${
                creationMode === "select"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <UserCheck size={14} />
              {t("selectExistingUser", "اختيار من المستخدمين")}
            </button>
            <button
              type="button"
              onClick={() => handleModeChange("create")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-md transition-all ${
                creationMode === "create"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <UserPlus size={14} />
              {t("createNewUser", "إنشاء مستخدم جديد")}
            </button>
          </div>
        )}

        <div className="space-y-5 py-3">
          {!isEditMode && creationMode === "select" && (
            <UserSelectField
              name="user_id"
              control={control}
              label={t("selectUserLabel", "اختيار المستخدم")}
              onUserSelect={handleSelectUser}
              disabled={isSubmitting}
            />
          )}

          <LanguageOptions
            t={t}
            title={t("modal.basic.section_title", "البيانات الأساسية")}
            hasLanguageError={hasLanguageError}
          />

          <Input
            key={`name`}
            label={t("managerName", "اسم المشرف")}
            placeholder={t("namePlaceholder", "أدخل اسم المشرف...")}
            disabled={!isEditMode && creationMode === "select"}
            error={errors?.name?.message}
            icon={<User size={16} />}
            {...register("name")}
          />

          <Controller
            name="avatar"
            control={control}
            render={({ field }) => (
              <div
                className={!isEditMode && creationMode === "select" ? "pointer-events-none opacity-50" : undefined}
                aria-disabled={!isEditMode && creationMode === "select"}
              >
                <ImageUploadField
                  value={field.value ?? null}
                  variant="default"
                  onChange={(file) => field.onChange(file)}
                  error={errors.avatar?.message?.toString()}
                />
              </div>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={tc("email", "البريد الإلكتروني")}
              type="email"
              disabled={!isEditMode && creationMode === "select"}
              placeholder="example@domain.com"
              error={errors.email?.message}
              icon={<Mail size={16} />}
              {...register("email")}
            />

            <Input
              label={tc("phone", "رقم الهاتف")}
              type="tel"
              disabled={!isEditMode && creationMode === "select"}
              placeholder="+20123456789"
              error={errors.phone?.message}
              icon={<Phone size={16} />}
              {...register("phone")}
            />
          </div>

          {(isEditMode || creationMode === "create") && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={
                  isEditMode
                    ? tc("passwordOptional", "كلمة المرور (اختياري)")
                    : tc("password", "كلمة المرور")
                }
                type="password"
                placeholder="••••••••"
                error={errors.password?.message}
                icon={<Lock size={16} />}
                {...register("password")}
              />

              <Input
                label={tc("confirmPassword", "تأكيد كلمة المرور")}
                type="password"
                placeholder="••••••••"
                error={errors.password_confirmation?.message}
                icon={<Lock size={16} />}
                {...register("password_confirmation")}
              />
            </div>
          )}

          {/* 🛡️ الحالة والدور الوظيفي */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  label={tc("status.label", "الحالة")}
                  disabled={isSubmitting}
                  placeholder={tc("selectStatus", "اختر الحالة...")}
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
                  label={t("role", "الدور / الصلاحيات")}
                  disabled={isSubmitting || isRolesLoading}
                  placeholder={t("selectRole", "اختر الدور...")}
                  options={roleOptions}
                  value={field.value}
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