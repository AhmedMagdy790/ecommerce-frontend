// src/components/Checkout/ShippingMethod.tsx

import { Truck, Zap, Package, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { JSX } from "react";
import { useShippingOptions } from "@/features/checkout/hooks/useShippingOptions";
import type { ShippingOption } from "@/features/checkout/types/checkout";
import { RadioGroup, type RadioOption } from "@/shared/components/RadioGroup";

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
  const { t, i18n } = useTranslation("checkout");
  const { options, loading, error } = useShippingOptions(cityId);

  const getLocalizedText = (field: Record<string, string> | string | null | undefined): string => {
    if (!field) return "";
    if (typeof field === "string") return field;
    const currentLocale = i18n.language;
    return field[currentLocale] || field["ar"] || field["en"] || Object.values(field)[0] || "";
  };

  const getCourierIcon = (name: string): JSX.Element => {
    const lower = name.toLowerCase();
    if (lower.includes("express") || lower.includes("fast") || lower.includes("سريع")) {
      return <Zap size={20} />;
    }
    if (lower.includes("pickup") || lower.includes("store") || lower.includes("استلام")) {
      return <Package size={20} />;
    }
    return <Truck size={20} />;
  };

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

  // Transform options into RadioOption format for the reusable RadioGroup component
  const radioOptions: RadioOption[] = options.map((option: ShippingOption) => {
    const optionId = option.shipping_rate_id ?? option.id;
    const courierName = getLocalizedText(
      option.courier?.name ?? option.name ?? "Standard Shipping"
    );

    const cost = Number(
      option.shipping_details?.shipping_fee ?? 
      option.rates?.final_price ?? 
      option.rates?.cost ?? 
      0
    );

    const currencySymbol = option.shipping_details?.currency || currency;

    const deliveryFrom = 
      option.shipping_details?.estimated_delivery_from ?? 
      option.rates?.delivery_days ?? 
      option.rates?.delivery_time;

    const deliveryTo = option.shipping_details?.estimated_delivery_to;

    const formattedCost = cost === 0
      ? t("shipping.free", "Free")
      : `${currencySymbol} ${cost.toFixed(2)}`;

    const estimatedDaysText = (deliveryFrom || deliveryTo)
      ? t("shipping.estimatedDays", "Estimated delivery: {{from}} - {{to}} days", {
          from: deliveryFrom ?? 1,
          to: deliveryTo ?? deliveryFrom ?? 3,
        })
      : null;

    return {
      value: optionId,
      label: (
        <div className="flex items-center justify-between w-full gap-4">
          <div className="flex items-center gap-3">
            <div className="text-[var(--color-primary)]">
              {getCourierIcon(courierName)}
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

  const handleRadioChange = (selectedId: any) => {
    // If the currently selected option is clicked again, toggle off/reset
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
    <section
      className="
        rounded-xl
        border
        border-[var(--color-border)]
        bg-[var(--color-background)]
        p-6
      "
    >
      <h2 className="mb-6 text-xl font-semibold">
        {t("shipping.title", "Shipping Method")}
      </h2>

      {options.length === 0 ? (
        <p className="text-sm text-[var(--color-text-secondary)]">
          {t("shipping.noOptions", "No shipping options available for this city.")}
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