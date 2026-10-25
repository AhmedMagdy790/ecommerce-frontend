// src/components/Checkout/ShippingMethod.tsx

import { Truck, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useShippingOptions } from "@/features/checkout/hooks/useShippingOptions";
import { RadioGroup, type RadioOption } from "@/shared/components/RadioGroup";
import type { ShippingOption } from "@/features/shipping/model/types/shipping.types";
import { useLang } from "@/shared/context/LanguageContext";

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
  const { isRTL, lang } = useLang();
  const { options, loading, error } = useShippingOptions(cityId);

  if (!cityId) {
    return (
      <section 
        dir={isRTL ? "rtl" : "ltr"} 
        className="rounded-panel border border-border bg-surface p-6 shadow-xs"
      >
        <h2 
          className="mb-4 text-xl font-bold text-text-primary"
          style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
        >
          {t("shipping.title", { defaultValue: lang === "ar" ? "طريقة الشحن" : "Shipping Method" })}
        </h2>
        <p 
          className="text-sm text-text-secondary"
          style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
        >
          {t("shipping.selectCityFirst", { defaultValue: lang === "ar" ? "يرجى تحديد المدينة أولاً لعرض خيارات الشحن المتاحة." : "Please select a city first to view shipping options." })}
        </p>
      </section>
    );
  }

  if (loading) {
    return (
      <section 
        dir={isRTL ? "rtl" : "ltr"} 
        className="rounded-panel border border-border bg-surface p-6 shadow-xs"
      >
        <h2 
          className="mb-6 text-xl font-bold text-text-primary"
          style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
        >
          {t("shipping.title", { defaultValue: lang === "ar" ? "طريقة الشحن" : "Shipping Method" })}
        </h2>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section 
        dir={isRTL ? "rtl" : "ltr"} 
        className="rounded-panel border border-border bg-surface p-6 shadow-xs"
      >
        <h2 
          className="mb-4 text-xl font-bold text-text-primary"
          style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
        >
          {t("shipping.title", { defaultValue: lang === "ar" ? "طريقة الشحن" : "Shipping Method" })}
        </h2>
        <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
      </section>
    );
  }

  const radioOptions: RadioOption[] = options.map((option: ShippingOption<string>) => {
    const optionId = option.shipping_rate_id ?? option.id;
    const courierName = option.name || t("shipping.defaultCourier", { defaultValue: lang === "ar" ? "الشحن القياسي" : "Standard Shipping" });

    const cost = Number(option.cost ?? 0);
    const currencySymbol = option.currency || currency;

    const deliveryFrom = option.delivery?.from ?? 1;
    const deliveryTo = option.delivery?.to ?? deliveryFrom;

    const formattedCost = cost === 0
      ? t("shipping.free", { defaultValue: lang === "ar" ? "مجاني" : "Free" })
      : `${currencySymbol} ${cost.toFixed(2)}`;

    const estimatedDaysText = t("shipping.estimatedDays", {
      defaultValue: lang === "ar" ? `التوصيل المتوقع: ${deliveryFrom} - ${deliveryTo} أيام` : `Estimated delivery: ${deliveryFrom} - ${deliveryTo} days`,
      from: deliveryFrom,
      to: deliveryTo,
    });

    return {
      value: optionId,
      label: (
        <div className="flex items-center justify-between w-full gap-4">
          <div className="flex items-center gap-3">
            <div className="text-primary p-2 rounded-card bg-surface-secondary border border-border">
              <Truck size={20} />
            </div>
            <span 
              className="font-semibold text-text-primary"
              style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
            >
              {courierName}
            </span>
          </div>

          <span className="font-bold text-text-primary">
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
    <section 
      dir={isRTL ? "rtl" : "ltr"} 
      className="rounded-panel border border-border bg-surface p-6 shadow-xs"
    >
      <h2 
        className="mb-6 text-xl font-bold text-text-primary border-b border-border pb-4"
        style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
      >
        {t("shipping.title", { defaultValue: lang === "ar" ? "طريقة الشحن" : "Shipping Method" })}
      </h2>

      {options.length === 0 ? (
        <p 
          className="text-sm text-text-secondary"
          style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
        >
          {t("shipping.noOptions", { defaultValue: lang === "ar" ? "لا توجد طرق شحن متاحة لهذه المدينة." : "No shipping methods available for this city." })}
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