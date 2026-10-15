// src/pages/Checkout/forms/ContactForm.tsx

import { useFormContext } from "react-hook-form";
import { Button } from "@/shared/components/Button";
import { useTranslation } from "react-i18next";

interface ContactFormProps {
  onNext: () => void;
}

export default function ContactForm({ onNext }: ContactFormProps) {
  const { t } = useTranslation("checkout");
  const { register, formState: { errors } } = useFormContext();


  return (
    <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-6 space-y-6">
      <h2 className="text-xl font-semibold">{t("contact.title", "Contact Information")}</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            {t("contact.name", "Full Name")}
          </label>
          <input
            type="text"
            {...register("customer_name")}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)]"
            placeholder="John Doe"
          />
          {errors.customer_name && (
            <p className="mt-1 text-xs text-[var(--color-error)] font-medium">
              {String(errors.customer_name.message)}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            {t("contact.email", "Email Address")}
          </label>
          <input
            type="email"
            {...register("customer_email")}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)]"
            placeholder="name@example.com"
          />
          {errors.customer_email && (
            <p className="mt-1 text-xs text-[var(--color-error)] font-medium">
              {String(errors.customer_email.message)}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            {t("contact.phonePrimary", "Primary Phone Number")}
          </label>
          <input
            type="text"
            {...register("phone_primary")}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)]"
            placeholder="+20 123 456 7890"
          />
          {errors.phone_primary && (
            <p className="mt-1 text-xs text-[var(--color-error)] font-medium">
              {String(errors.phone_primary.message)}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            {t("contact.phoneSecondary", "Secondary Phone Number (Optional)")}
          </label>
          <input
            type="text"
            {...register("phone_secondary")}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)]"
            placeholder="+20 198 765 4321"
          />
          {errors.phone_secondary && (
            <p className="mt-1 text-xs text-[var(--color-error)] font-medium">
              {String(errors.phone_secondary.message)}
            </p>
          )}
        </div>

      </div>

      <div className="flex justify-end pt-4">
        <Button type="button" onClick={onNext}>
          {t("buttons.next", "Continue to Shipping")}
        </Button>
      </div>
    </section>
  );
}