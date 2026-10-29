
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LockKeyhole,
  Eye,
  EyeOff,
  CheckCircle2,
  LoaderCircle,
  KeyRound,
} from "lucide-react";

import {
  passwordSchema,
  type PasswordFormValues,
} from "../schemas/password.schema";

import { Input } from "@/shared/components/ui/Input";
import { useUpdatePassword } from "../hooks/useUpdatePassword";

type PasswordField =
  | "current_password"
  | "new_password"
  | "new_password_confirmation";

export default function SecuritySection() {
  const { t } = useTranslation("profile");
  const { updatePassword, isUpdatingPassword } = useUpdatePassword();

  const [visibleFields, setVisibleFields] = useState<
    Partial<Record<PasswordField, boolean>>
  >({});

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    mode: "onBlur",
  });

  const toggleVisibility = (field: PasswordField) => {
    setVisibleFields((previous) => ({
      ...previous,
      [field]: !previous[field],
    }));
  };

  const onSubmit = async (data: PasswordFormValues) => {
    await updatePassword(data);
  };

  const passwordFields: {
    name: PasswordField;
    label: string;
    autoComplete: "current-password" | "new-password";
    description: string;
  }[] = [
    {
      name: "current_password",
      label: t("sections.security.currentPassword", "Current password"),
      autoComplete: "current-password",
      description: t(
        "sections.security.currentPasswordHint",
        "Enter your current password to verify your identity.",
      ),
    },
    {
      name: "new_password",
      label: t("sections.security.newPassword", "New password"),
      autoComplete: "new-password",
      description: t(
        "sections.security.newPasswordHint",
        "Choose a strong password you have not used before.",
      ),
    },
    {
      name: "new_password_confirmation",
      label: t("sections.security.confirmPassword", "Confirm new password"),
      autoComplete: "new-password",
      description: t(
        "sections.security.confirmPasswordHint",
        "Enter your new password again.",
      ),
    },
  ];

  return (
    <section className="min-w-0 space-y-6">
      <header className="flex items-start gap-3 border-b border-border pb-5">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <KeyRound size={20} aria-hidden="true" />
        </div>

        <div className="min-w-0">
          <h2 className="text-lg font-semibold tracking-tight text-text-primary sm:text-xl">
            {t("sections.security.changePassword", "Change password")}
          </h2>

          <p className="mt-1 max-w-xl text-sm leading-6 text-text-secondary">
            {t(
              "sections.security.changePasswordDescription",
              "Update your password regularly to help protect your account.",
            )}
          </p>
        </div>
      </header>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
        aria-busy={isUpdatingPassword}
      >
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
          {passwordFields.map((field) => (
            <div
              key={field.name}
              className={
                field.name === "current_password"
                  ? "min-w-0 md:col-span-2"
                  : "min-w-0"
              }
            >
              <Input
                id={field.name}
                type={visibleFields[field.name] ? "text" : "password"}
                autoComplete={field.autoComplete}
                label={field.label}
                placeholder="••••••••"
                error={errors[field.name]?.message}
                {...register(field.name)}
                endAdornment={
                  <button
                    type="button"
                    onClick={() => toggleVisibility(field.name)}
                    aria-label={
                      visibleFields[field.name]
                        ? t("sections.security.hidePassword", "Hide password")
                        : t("sections.security.showPassword", "Show password")
                    }
                    aria-pressed={Boolean(visibleFields[field.name])}
                    className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-surface-secondary hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    {visibleFields[field.name] ? (
                      <EyeOff size={18} aria-hidden="true" />
                    ) : (
                      <Eye size={18} aria-hidden="true" />
                    )}
                  </button>
                }
              />

              {!errors[field.name] && (
                <p className="mt-2 text-xs leading-5 text-text-secondary">
                  {field.description}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-start gap-2 border-t border-border pt-5">
          <LockKeyhole
            size={17}
            className="mt-0.5 shrink-0 text-text-secondary"
            aria-hidden="true"
          />

          <p className="text-xs leading-5 text-text-secondary">
            {t(
              "sections.security.passwordPrivacy",
              "Your password should be private. Never share it with anyone.",
            )}
          </p>
        </div>

        <div className="flex justify-start border-t border-border pt-5">
          <button
            type="submit"
            disabled={isUpdatingPassword}
            className={[
              "inline-flex min-h-11 w-full items-center justify-center gap-2",
              "rounded-control bg-primary px-5 py-3",
              "text-sm font-semibold text-text-inverse shadow-sm",
              "transition-colors hover:bg-primary-hover",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
              "disabled:cursor-not-allowed disabled:opacity-60",
              "sm:w-auto sm:min-w-48",
            ].join(" ")}
          >
            {isUpdatingPassword ? (
              <LoaderCircle
                size={18}
                className="animate-spin"
                aria-hidden="true"
              />
            ) : (
              <CheckCircle2 size={18} aria-hidden="true" />
            )}

            <span>
              {isUpdatingPassword
                ? t("sections.security.updating", "Updating...")
                : t("sections.security.updatePassword", "Update password")}
            </span>
          </button>
        </div>
      </form>
    </section>
  );
}