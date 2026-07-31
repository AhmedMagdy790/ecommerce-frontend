import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "@/shared/components/Input";
import type { FieldError } from "react-hook-form";

export interface BillingAddressData {
  fullName: string;
  address: string;
  city: string;
  country: string;
  postalCode?: string | undefined;
}

interface BillingAddressProps {
  value: BillingAddressData;
  onChange: (value: BillingAddressData) => void;
  shippingAddress?: {
    fullName: string;
    addressLine1: string;
    city: string;
    country: string;
    postalCode?: string | undefined;
  };
  onSameAsShippingChange?: (isSame: boolean) => void;

  error?: {
    fullName?: FieldError;
    address?: FieldError;
    city?: FieldError;
    country?: FieldError;
    postalCode?: FieldError;
  };
}

export default function BillingAddress({
  value,
  onChange,
  shippingAddress,
  onSameAsShippingChange,
  error,
}: BillingAddressProps) {
  const { t } = useTranslation("checkout");

  const [sameAsShipping, setSameAsShipping] = useState(true);

  const handleCheckboxChange = (checked: boolean) => {
    setSameAsShipping(checked);
    onSameAsShippingChange?.(checked);

    if (checked && shippingAddress) {
      onChange({
        fullName: shippingAddress.fullName,
        address: shippingAddress.addressLine1,
        city: shippingAddress.city,
        country: shippingAddress.country,
        postalCode: shippingAddress.postalCode,
      });
    }
  };

  const handleChange = (
    key: keyof BillingAddressData,
    newValue: string
  ) => {
    onChange({
      ...value,
      [key]: newValue,
    });
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
        {t("billing.title")}
      </h2>

      <label className="mb-6 flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={sameAsShipping}
          onChange={(e) => handleCheckboxChange(e.target.checked)}
          className="h-4 w-4 rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
        />

        <span className="text-sm font-medium">
          {t("billing.sameAsShipping")}
        </span>
      </label>

      {!sameAsShipping && (
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Input
              id="billing-full-name"
              label={t("billing.fullName")}
              type="text"
              value={value.fullName}
              onChange={(e) =>
                handleChange("fullName", e.target.value)
              }
              placeholder={t("billing.fullName")}
              error={error?.fullName?.message}
            />
          </div>

          <div>
            <Input
              id="billing-country"
              label={t("billing.country")}
              type="text"
              value={value.country}
              onChange={(e) =>
                handleChange("country", e.target.value)
              }
              placeholder={t("billing.country")}
              error={error?.country?.message}
            />
          </div>

          <div>
            <Input
              id="billing-city"
              label={t("billing.city")}
              type="text"
              value={value.city}
              onChange={(e) =>
                handleChange("city", e.target.value)
              }
              placeholder={t("billing.city")}
              error={error?.city?.message}
            />
          </div>

          <div>
            <Input
              id="billing-postal-code"
              label={t("billing.postalCode")}
              type="text"
              value={value.postalCode ?? ""}
              onChange={(e) =>
                handleChange("postalCode", e.target.value)
              }
              placeholder={t("billing.postalCode")}
              error={error?.postalCode?.message}
            />
          </div>

          <div className="md:col-span-2">
            <Input
              id="billing-address"
              label={t("billing.address")}
              type="text"
              value={value.address}
              onChange={(e) =>
                handleChange("address", e.target.value)
              }
              placeholder={t("billing.address")}
              error={error?.address?.message}
            />
          </div>
        </div>
      )}
    </section>
  );
}