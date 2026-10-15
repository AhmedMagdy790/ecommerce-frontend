import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { passwordSchema, type PasswordFormValues } from "../schemas/password.schema";
import { Input } from "@/shared/components/ui/Input";
import { useUpdatePassword } from "../hooks/useUpdatePassword"; // استدعاء الهوك العزل

export default function SecuritySection() {
  const { t } = useTranslation("profile");
  const { updatePassword, isSubmitting } = useUpdatePassword(); // استخدام الهوك

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  // الـ onSubmit أصبح يستدعي دالة جاهزة من الهوك المعزول
  const onSubmit = (data: PasswordFormValues) => {
    updatePassword(data, () => reset());
  };

  return (
    <section>
      <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">
        {t("sections.security.title", "Security & Password")}
      </h2>
      <p className="text-sm text-[var(--color-text-secondary)] mb-6">
        {t("sections.security.description", "Manage your password and security settings.")}
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          id="current_password"
          type="password"
          label={t("sections.security.currentPassword", "Current Password")}
          placeholder="••••••••"
          error={errors.current_password?.message}
          {...register("current_password")}
        />

        <Input
          id="new_password"
          type="password"
          label={t("sections.security.newPassword", "New Password")}
          placeholder="••••••••"
          error={errors.new_password?.message}
          {...register("new_password")}
        />

        <Input
          id="new_password_confirmation"
          type="password"
          label={t("sections.security.confirmPassword", "Confirm New Password")}
          placeholder="••••••••"
          error={errors.new_password_confirmation?.message}
          {...register("new_password_confirmation")}
        />

        <div className="flex justify-end pt-4 border-t border-[var(--color-border)]">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2.5 bg-[var(--button-bg)] text-[var(--button-text)] text-sm font-medium rounded-[var(--radius-lg)] hover:bg-[var(--button-bg-hover)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer shadow-sm"
          >
            {isSubmitting && (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {isSubmitting ? "Updating..." : "Update Password"}
          </button>
        </div>
      </form>
    </section>
  );
}