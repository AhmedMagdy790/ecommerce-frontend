import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UserRound,
  Mail,
  Phone,
  UserPen
} from "lucide-react";


import {
  profileSchema,
  type ProfileFormValues,
} from "../schemas/profile.schema";

import { Input } from "@/shared/components/ui/Input";
import { Button } from "@/shared/components/Button";
import ProfileHeader from "./ProfileHeader";
import type { UpdateProfilePayload } from "@/features/users/model/types/user.dto";
import type { User } from "@/features/users/model/types/user.types";


interface ProfileInfoFormProps {
  profile: User | null;
  onSave: (data: UpdateProfilePayload) => Promise<User>;
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
  }, [profile?.name, profile?.email, profile?.phone, reset]);

  const onSubmit = async (data: ProfileFormValues) => {
    await onSave(data);
  };

  return (
    <section className="space-y-6">
      <header className="flex items-start gap-3 border-b border-border pb-5">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <UserPen size={22} strokeWidth={1.8} />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-bold tracking-tight text-text-primary sm:text-2xl">
            {t("sections.info.title", "Personal information")}
          </h2>

          <p className="mt-1 text-sm leading-6 text-text-secondary">
            {t(
              "sections.info.description",
              "Manage your personal details and contact information.",
            )}
          </p>
        </div>
      </header>

      <div className="overflow-hidden rounded-panel border border-border bg-surface">
        <div className="border-b border-border bg-surface-secondary/30 p-4 sm:p-5">
          <ProfileHeader profile={profile} />
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5 p-4 sm:p-6"
          aria-busy={isSaving}
        >
          <div>
            <h3 className="text-sm font-semibold text-text-primary">
              {t("sections.info.contactTitle", "Contact details")}
            </h3>

            <p className="mt-1 text-xs leading-5 text-text-secondary">
              {t(
                "sections.info.contactDescription",
                "Keep your information up to date.",
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-2">
            <Input
              id="name"
              autoComplete="name"
              label={t("name")}
              placeholder={t("placeholders.name")}
              icon={<UserRound size={17} />}
              error={errors.name?.message}
              {...register("name")}
            />

            <Input
              id="email"
              type="email"
              autoComplete="email"
              label={t("email")}
              placeholder={t("placeholders.email")}
              icon={<Mail size={17} />}
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
                icon={<Phone size={17} />}
                error={errors.phone?.message}
                {...register("phone")}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-5 text-text-secondary">
              {isDirty
                ? t(
                    "sections.info.unsavedChanges",
                    "You have unsaved changes.",
                  )
                : t(
                    "sections.info.upToDate",
                    "Your information is up to date.",
                  )}
            </p>

            <Button
              isLoading={isSaving}
              disabled={!isDirty || !isValid}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}