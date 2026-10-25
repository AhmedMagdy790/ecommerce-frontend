
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import type { UserProfile } from "@/shared/types/userType";
import {
  profileSchema,
  type ProfileFormValues,
} from "../schemas/profile.schema";

import { Input } from "@/shared/components/ui/Input";
import ProfileHeader from "./ProfileHeader";
import { Button } from "@/shared/components/Button";

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
      name: profile.name ?? "",
      email: profile.email ?? "",
      phone: profile.phone ?? "",
    });
  }, [
    profile?.name,
    profile?.email,
    profile?.phone,
    reset,
  ]);

  const onSubmit = async (data: ProfileFormValues) => {
    await onSave(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
      aria-busy={isSaving}
    >
      <ProfileHeader />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Input
          id="name"
          autoComplete="name"
          label={t("name")}
          placeholder={t("placeholders.name")}
          error={errors.name?.message}
          {...register("name")}
        />

        <Input
          id="email"
          type="email"
          autoComplete="email"
          label={t("email")}
          placeholder={t("placeholders.email")}
          error={errors.email?.message}
          {...register("email")}
        />

        <div className="md:col-span-2">
          <Input
            id="phone"
            type="tel"
            autoComplete="tel"
            label={t("phone")}
            placeholder={t("placeholders.phone")}
            error={errors.phone?.message}
            {...register("phone")}
          />
        </div>
      </div>

      <div className="flex justify-end border-t border-border pt-4">
        <Button
          type="submit"
          disabled={isSaving || !isDirty || !isValid}
        >
          {isSaving && (
            <span
              aria-hidden="true"
              className="
                size-4 animate-spin rounded-full
                border-2 border-current border-t-transparent
              "
            />
          )}

          {isSaving
            ? t("actions.saving", "Saving...")
            : t("actions.save", "Save Changes")}
        </Button>
      </div>
    </form>
  );
}
