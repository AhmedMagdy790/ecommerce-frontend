// src/features/users/dashboard/ui/UserModal.tsx

import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { User as UserIcon, Mail, Phone, Lock } from "lucide-react";

import { Input } from "@/shared/components/ui/Input";
import BaseModel from "@/shared/components/BaseModal";
import type { IModal } from "@/shared/types/types";

import type { User } from "../../model/types/user.types";
import { useUserForm } from "../hook/useUserForm";
import { ActionButtons } from "@/shared/components/ActionButtons";

interface IUserModal extends IModal {
  user?: User | null;
}

export default function UserModal({ isOpen, closeModal, user }: IUserModal) {
  const { t } = useTranslation("user");
  const formRef = useRef<HTMLFormElement>(null);

  const {
    methods,
    onSubmit,
    isSubmitting,
    submitError,
    isEditMode,
  } = useUserForm(user, closeModal, isOpen);

  const {
    register,
    formState: { errors },
  } = methods;

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
          t={t}
          formRef={formRef}
        />
      }
      title={
        isEditMode
          ? t("user.editUser", "Edit User")
          : t("user.addNewUser", "Add New User")
      }
      description={t("user.modalDescription", "Enter user account details and credentials")}
      maxWidth="max-w-xl"
    >
      <form ref={formRef} onSubmit={onSubmit} className="flex flex-col">
        {submitError && (
          <div className="p-3 mb-4 text-xs font-medium text-white bg-[var(--color-error)] rounded-[var(--radius-md)]">
            {submitError}
          </div>
        )}

        <div className="space-y-4 py-3">
          <Input
            type="text"
            label={t("user.name", "Name")}
            placeholder={t("user.namePlaceholder", "Enter full name...")}
            error={errors.name?.message}
            icon={<UserIcon size={16} />}
            {...register("name")}
          />

          <Input
            type="email"
            label={t("user.email", "Email")}
            placeholder="name@example.com"
            error={errors.email?.message}
            icon={<Mail size={16} />}
            {...register("email")}
          />

          <Input
            type="text"
            label={t("user.phone", "Phone")}
            placeholder="+20..."
            error={errors.phone?.message}
            icon={<Phone size={16} />}
            {...register("phone")}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="password"
              label={t("user.password", "Password")}
              placeholder="••••••••"
              error={errors.password?.message}
              icon={<Lock size={16} />}
              {...register("password")}
            />

            <Input
              type="password"
              label={t("user.passwordConfirmation", "Confirm Password")}
              placeholder="••••••••"
              error={errors.password_confirmed?.message}
              icon={<Lock size={16} />}
              {...register("password_confirmed")}
            />
          </div>
        </div>
      </form>
    </BaseModel>
  );
}