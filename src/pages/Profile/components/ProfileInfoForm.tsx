import type { UserProfile } from "@/shared/types/userType";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  profileSchema,
  type ProfileFormValues,
} from "../schemas/profile.schema";
import { Input } from "@/shared/components/ui/Input";
import ProfileHeader from "./ProfileHeader";

interface ProfileInfoFormProps {
  profile?: UserProfile;
  onSave: (data: ProfileFormValues) => Promise<void>;
  isSaving: boolean;
}

export default function ProfileInfoForm({
  profile,
  onSave,
  isSaving,
}: ProfileInfoFormProps) {
  const { t } = useTranslation("profile");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (!profile) return;

    reset({
      name: profile.name,
      email: profile.email,
      phone: profile.phone ?? "",
    });
  }, [profile, reset]);

  const onSubmit = async (data: ProfileFormValues) => {
    await onSave(data);
  };

  return (
    <form 
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 transition-all"

    >
      <ProfileHeader />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5" style={{ gap: "var(--spacing-5)" }}>
        <Input
          id="name"
          label={t("name")}
          placeholder={t("placeholders.name")}
          error={errors.name?.message}
          {...register("name")}
        />

        <Input
          id="email"
          type="email"
          label={t("email")}
          placeholder={t("placeholders.email")}
          error={errors.email?.message}
          {...register("email")}
        />

        <div className="md:col-span-2">
          <Input
            id="phone"
            type="tel"
            label={t("phone")}
            placeholder={t("placeholders.phone")}
            error={errors.phone?.message}
            {...register("phone")}
          />
        </div>
      </div>

      <div 
        className="flex justify-end pt-4 border-t"
        style={{ 
          borderColor: "var(--color-border)",
          paddingTop: "var(--spacing-4)" 
        }}
      >
        <button
          type="submit"
          disabled={isSaving || !isDirty || !isValid}
          className="transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
          style={{
            paddingLeft: "var(--spacing-5)",
            paddingRight: "var(--spacing-5)",
            paddingTop: "var(--spacing-2.5)",
            paddingBottom: "var(--spacing-2.5)",
            backgroundColor: "var(--button-bg)",
            color: "var(--button-text)",
            fontSize: "var(--text-sm)",
            fontWeight: "var(--font-medium)",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-sm)"
          }}
        >
          {isSaving && (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          {isSaving ? t("actions.saving", "Saving...") : t("actions.save", "Save Changes")}
        </button>
      </div>
    </form>
  );
}