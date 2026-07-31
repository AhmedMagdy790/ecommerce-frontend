// src/pages/Checkout/components/steps/AddressStep.tsx

import { useFormContext } from "react-hook-form";
import { Button } from "@/shared/components/Button";
import { useTranslation } from "react-i18next";

interface AddressStepProps {
  onNext: () => void;
  onBack: () => void;
}

export default function AddressStep({ onNext, onBack }: AddressStepProps) {
  const { t } = useTranslation("checkout");
  const { register, formState: { errors } } = useFormContext();

  return (
    <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-6 space-y-6">
      <h2 className="text-xl font-semibold">{t("address.title", "Shipping Address")}</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-1">
            {t("address.firstName", "First Name")}
          </label>
          <input
            type="text"
            {...register("first_name")}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)]"
          />
          {errors.first_name && (
            <p className="mt-1 text-xs text-[var(--color-error)] font-medium">
              {String(errors.first_name.message)}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            {t("address.lastName", "Last Name")}
          </label>
          <input
            type="text"
            {...register("last_name")}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)]"
          />
          {errors.last_name && (
            <p className="mt-1 text-xs text-[var(--color-error)] font-medium">
              {String(errors.last_name.message)}
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-1">
            {t("address.street", "Street Address")}
          </label>
          <input
            type="text"
            {...register("street")}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)]"
            placeholder="123 Main St"
          />
          {errors.street && (
            <p className="mt-1 text-xs text-[var(--color-error)] font-medium">
              {String(errors.street.message)}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            {t("address.cityId", "City ID / Select City")}
          </label>
          <input
            type="number"
            {...register("city_id", { valueAsNumber: true })}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)]"
            placeholder="e.g. 31756"
          />
          {errors.city_id && (
            <p className="mt-1 text-xs text-[var(--color-error)] font-medium">
              {String(errors.city_id.message)}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            {t("address.postalCode", "Postal Code")}
          </label>
          <input
            type="text"
            {...register("postal_code")}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--color-primary)]"
          />
          {errors.postal_code && (
            <p className="mt-1 text-xs text-[var(--color-error)] font-medium">
              {String(errors.postal_code.message)}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4">
        <Button type="button" variant="secondary" onClick={onBack}>
          {t("buttons.back", "Back")}
        </Button>

        <Button type="button" onClick={onNext}>
          {t("buttons.next", "Continue to Shipping")}
        </Button>
      </div>
    </section>
  );
}