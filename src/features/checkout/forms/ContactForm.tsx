import { useFormContext } from "react-hook-form";
import { Button } from "@/shared/components/Button";
import { useTranslation } from "react-i18next";
import { useLang } from "@/shared/context/LanguageContext";

interface ContactFormProps {
  onNext: () => void;
}

export default function ContactForm({ onNext }: ContactFormProps) {
  const { t } = useTranslation("checkout");
  const { isRTL } = useLang();
  const { register, formState: { errors } } = useFormContext();

  return (
    <section 
      dir={isRTL ? "rtl" : "ltr"}
      className="rounded-panel border border-border bg-surface p-6 space-y-6 shadow-xs"
    >
      <h2 className="text-xl font-bold text-text-primary">
        {t("contact.title")}
      </h2>

      <div className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-1.5">
            {t("contact.fullName")}
          </label>
          <input
            type="text"
            {...register("customer_name")}
            className="w-full rounded-card border border-border bg-surface-secondary px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            placeholder={t("contact.placeholders.fullName")}
          />
          {errors.customer_name && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400 font-medium">
              {String(errors.customer_name.message)}
            </p>
          )}
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-1.5">
            {t("contact.email")}
          </label>
          <input
            type="email"
            {...register("customer_email")}
            className="w-full rounded-card border border-border bg-surface-secondary px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            placeholder={t("contact.placeholders.email")}
          />
          {errors.customer_email && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400 font-medium">
              {String(errors.customer_email.message)}
            </p>
          )}
        </div>

        {/* Primary Phone */}
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-1.5">
            {t("contact.phonePrimary")}
          </label>
          <input
            type="text"
            {...register("phone_primary")}
            className="w-full rounded-card border border-border bg-surface-secondary px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            placeholder={t("contact.placeholders.phonePrimary")}
          />
          {errors.phone_primary && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400 font-medium">
              {String(errors.phone_primary.message)}
            </p>
          )}
        </div>

        {/* Secondary Phone */}
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-1.5">
            {t("contact.phoneSecondary")}
          </label>
          <input
            type="text"
            {...register("phone_secondary")}
            className="w-full rounded-card border border-border bg-surface-secondary px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            placeholder={t("contact.placeholders.phoneSecondary")}
          />
          {errors.phone_secondary && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400 font-medium">
              {String(errors.phone_secondary.message)}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-border">
        <Button type="button" onClick={onNext}>
          {t("buttons.continueToShipping")}
        </Button>
      </div>
    </section>
  );
}