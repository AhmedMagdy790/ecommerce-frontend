import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  passwordSchema,
  type PasswordFormValues,
} from "../schemas/password.schema";

import { Input } from "@/shared/components/ui/Input";
import { useUpdatePassword } from "../hooks/useUpdatePassword";

export default function SecuritySection() {
  const { t } = useTranslation("profile");
  const { updatePassword, isSubmitting } = useUpdatePassword();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: PasswordFormValues) => {
    await updatePassword(data, () => reset());
  };

  return (
    <section>
      <header className="mb-6">
        <h2 className="mb-2 text-xl font-bold text-text-primary">
          {t("sections.security.title", "Security & Password")}
        </h2>

        <p className="text-sm text-text-secondary">
          {t(
            "sections.security.description",
            "Manage your password and security settings.",
          )}
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          id="current_password"
          type="password"
          autoComplete="current-password"
          label={t(
            "sections.security.currentPassword",
            "Current Password",
          )}
          placeholder="••••••••"
          error={errors.current_password?.message}
          {...register("current_password")}
        />

        <Input
          id="new_password"
          type="password"
          autoComplete="new-password"
          label={t("sections.security.newPassword", "New Password")}
          placeholder="••••••••"
          error={errors.new_password?.message}
          {...register("new_password")}
        />

        <Input
          id="new_password_confirmation"
          type="password"
          autoComplete="new-password"
          label={t(
            "sections.security.confirmPassword",
            "Confirm New Password",
          )}
          placeholder="••••••••"
          error={errors.new_password_confirmation?.message}
          {...register("new_password_confirmation")}
        />

        <div className="flex justify-end border-t border-border pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="
              inline-flex cursor-pointer items-center gap-2
              rounded-control bg-primary px-5 py-2.5
              text-sm font-medium text-text-inverse shadow-sm
              transition-colors hover:bg-primary-hover
              focus-visible:outline-2 focus-visible:outline-offset-2
              focus-visible:outline-primary
              disabled:cursor-not-allowed disabled:opacity-50
            "
          >
            {isSubmitting && (
              <span
                aria-hidden="true"
                className="
                  size-4 animate-spin rounded-full
                  border-2 border-current border-t-transparent
                "
              />
            )}

            <span>
              {isSubmitting
                ? t("sections.security.updating", "Updating...")
                : t(
                    "sections.security.updatePassword",
                    "Update Password",
                  )}
            </span>
          </button>
        </div>
      </form>
    </section>
  );
}