// src/components/Checkout/ShippingMethod.tsx

import { Truck, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useShippingOptions } from "@/features/checkout/hooks/useShippingOptions";
import { RadioGroup, type RadioOption } from "@/shared/components/RadioGroup";
import type { ShippingOption } from "@/features/shipping/model/types/shipping.types";

interface ShippingMethodProps {
  cityId?: number | string;
  value?: number | string | null;
  onChange: (option: ShippingOption | null) => void;
  currency?: string;
}

export default function ShippingMethod({
  cityId,
  value,
  onChange,
  currency = "USD",
}: ShippingMethodProps) {
  const { t } = useTranslation("checkout");
  const { options, loading, error } = useShippingOptions(cityId);

  if (!cityId) {
    return (
      <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-6">
        <h2 className="mb-6 text-xl font-semibold">{t("shipping.title", "Shipping Method")}</h2>
        <p className="text-sm text-[var(--color-text-secondary)]">
          {t("shipping.selectCityFirst", "Please select a city first to view shipping options.")}
        </p>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-6">
        <h2 className="mb-6 text-xl font-semibold">{t("shipping.title", "Shipping Method")}</h2>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-[var(--color-primary)]" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-6">
        <h2 className="mb-6 text-xl font-semibold">{t("shipping.title", "Shipping Method")}</h2>
        <p className="text-sm text-[var(--color-error)]">{error}</p>
      </section>
    );
  }

  const radioOptions: RadioOption[] = options.map((option: ShippingOption<string>) => {
    const optionId = option.shipping_rate_id ?? option.id;
    const courierName = option.name || t("shipping.defaultCourier", "Standard Shipping");

    const cost = Number(option.cost ?? 0);
    const currencySymbol = option.currency || currency;

    const deliveryFrom = option.delivery?.from ?? 1;
    const deliveryTo = option.delivery?.to ?? deliveryFrom;

    const formattedCost = cost === 0
      ? t("shipping.free", "Free")
      : `${currencySymbol} ${cost.toFixed(2)}`;

    const estimatedDaysText = t("shipping.estimatedDays", "Estimated delivery: {{from}} - {{to}} days", {
      from: deliveryFrom,
      to: deliveryTo,
    });

    return {
      value: optionId,
      label: (
        <div className="flex items-center justify-between w-full gap-4">
          <div className="flex items-center gap-3">
            <div className="text-[var(--color-primary)] p-2 rounded-lg bg-[var(--color-surface)]">
              <Truck size={20} />
            </div>
            <span className="font-medium text-[var(--color-text-primary)]">
              {courierName}
            </span>
          </div>

          <span className="font-semibold text-[var(--color-text-primary)]">
            {formattedCost}
          </span>
        </div>
      ),
      description: estimatedDaysText,
    };
  });

  const handleRadioChange = (selectedId: string | number) => {
    if (value !== undefined && value !== null && value !== "" && String(value) === String(selectedId)) {
      onChange(null);
      return;
    }

    const matchedOption = options.find(
      (opt) => String(opt.shipping_rate_id ?? opt.id) === String(selectedId)
    );

    onChange(matchedOption || null);
  };

  return (
    <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-6">
      <h2 className="mb-6 text-xl font-semibold">
        {t("shipping.title", "Shipping Method")}
      </h2>

      {options.length === 0 ? (
        <p className="text-sm text-[var(--color-text-secondary)]">
          {t("shipping.noOptions", "No shipping methods available for this city.")}
        </p>
      ) : (
        <RadioGroup
          name="shippingMethod"
          options={radioOptions}
          value={value}
          onChange={handleRadioChange}
          allowDeselect={true}
        />
      )}
    </section>
  );
}