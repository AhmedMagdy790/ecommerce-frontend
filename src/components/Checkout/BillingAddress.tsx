import { useState } from "react";
import { useTranslation } from "react-i18next";

export interface BillingAddressData {
  fullName: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
}

interface BillingAddressProps {
  value: BillingAddressData;
  onChange: (value: BillingAddressData) => void;
}

export default function BillingAddress({
  value,
  onChange,
}: BillingAddressProps) {
  const { t } = useTranslation("checkout");

  const [sameAsShipping, setSameAsShipping] =
    useState(true);

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

      <label className="mb-6 flex items-center gap-3">
        <input
          type="checkbox"
          checked={sameAsShipping}
          onChange={(e) =>
            setSameAsShipping(e.target.checked)
          }
        />

        <span>
          {t("billing.sameAsShipping")}
        </span>
      </label>

      {!sameAsShipping && (
        <div className="grid gap-4 md:grid-cols-2">
          <input
            type="text"
            placeholder={t("billing.fullName")}
            value={value.fullName}
            onChange={(e) =>
              handleChange(
                "fullName",
                e.target.value
              )
            }
            className="rounded-lg border border-[var(--color-border)] px-4 py-2"
          />

          <input
            type="text"
            placeholder={t("billing.address")}
            value={value.address}
            onChange={(e) =>
              handleChange(
                "address",
                e.target.value
              )
            }
            className="rounded-lg border border-[var(--color-border)] px-4 py-2 md:col-span-2"
          />

          <input
            type="text"
            placeholder={t("billing.city")}
            value={value.city}
            onChange={(e) =>
              handleChange(
                "city",
                e.target.value
              )
            }
            className="rounded-lg border border-[var(--color-border)] px-4 py-2"
          />

          <input
            type="text"
            placeholder={t("billing.country")}
            value={value.country}
            onChange={(e) =>
              handleChange(
                "country",
                e.target.value
              )
            }
            className="rounded-lg border border-[var(--color-border)] px-4 py-2"
          />

          <input
            type="text"
            placeholder={t("billing.postalCode")}
            value={value.postalCode}
            onChange={(e) =>
              handleChange(
                "postalCode",
                e.target.value
              )
            }
            className="rounded-lg border border-[var(--color-border)] px-4 py-2"
          />
        </div>
      )}
    </section>
  );
}