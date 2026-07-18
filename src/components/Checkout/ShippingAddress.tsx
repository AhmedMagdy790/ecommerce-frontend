import { useTranslation } from "react-i18next";

export interface ShippingAddressData {
  fullName: string;
  phone: string;
  country: string;
  city: string;
  addressLine1: string;
  addressLine2: string;
  postalCode: string;
}

interface ShippingAddressProps {
  value: ShippingAddressData;
  onChange: (
    value: ShippingAddressData
  ) => void;
}

export default function ShippingAddress({
  value,
  onChange,
}: ShippingAddressProps) {
  const { t } = useTranslation("checkout");

  const handleChange = (
    key: keyof ShippingAddressData,
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
        {t("shippingAddress.title")}
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label
            htmlFor="shipping-full-name"
            className="mb-2 block text-sm font-medium"
          >
            {t("shippingAddress.fullName")}
          </label>

          <input
            id="shipping-full-name"
            type="text"
            value={value.fullName}
            onChange={(e) =>
              handleChange(
                "fullName",
                e.target.value
              )
            }
            className="w-full rounded-lg border border-[var(--color-border)] px-4 py-2 focus:border-[var(--color-primary)] outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="shipping-phone"
            className="mb-2 block text-sm font-medium"
          >
            {t("shippingAddress.phone")}
          </label>

          <input
            id="shipping-phone"
            type="tel"
            value={value.phone}
            onChange={(e) =>
              handleChange(
                "phone",
                e.target.value
              )
            }
            className="w-full rounded-lg border border-[var(--color-border)] px-4 py-2 focus:border-[var(--color-primary)] outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="shipping-country"
            className="mb-2 block text-sm font-medium"
          >
            {t("shippingAddress.country")}
          </label>

          <input
            id="shipping-country"
            type="text"
            value={value.country}
            onChange={(e) =>
              handleChange(
                "country",
                e.target.value
              )
            }
            className="w-full rounded-lg border border-[var(--color-border)] px-4 py-2 focus:border-[var(--color-primary)] outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="shipping-city"
            className="mb-2 block text-sm font-medium"
          >
            {t("shippingAddress.city")}
          </label>

          <input
            id="shipping-city"
            type="text"
            value={value.city}
            onChange={(e) =>
              handleChange(
                "city",
                e.target.value
              )
            }
            className="w-full rounded-lg border border-[var(--color-border)] px-4 py-2 focus:border-[var(--color-primary)] outline-none"
          />
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="shipping-address-1"
            className="mb-2 block text-sm font-medium"
          >
            {t("shippingAddress.addressLine1")}
          </label>

          <input
            id="shipping-address-1"
            type="text"
            value={value.addressLine1}
            onChange={(e) =>
              handleChange(
                "addressLine1",
                e.target.value
              )
            }
            className="w-full rounded-lg border border-[var(--color-border)] px-4 py-2 focus:border-[var(--color-primary)] outline-none"
          />
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="shipping-address-2"
            className="mb-2 block text-sm font-medium"
          >
            {t("shippingAddress.addressLine2")}
          </label>

          <input
            id="shipping-address-2"
            type="text"
            value={value.addressLine2}
            onChange={(e) =>
              handleChange(
                "addressLine2",
                e.target.value
              )
            }
            className="w-full rounded-lg border border-[var(--color-border)] px-4 py-2 focus:border-[var(--color-primary)] outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="shipping-postal-code"
            className="mb-2 block text-sm font-medium"
          >
            {t("shippingAddress.postalCode")}
          </label>

          <input
            id="shipping-postal-code"
            type="text"
            value={value.postalCode}
            onChange={(e) =>
              handleChange(
                "postalCode",
                e.target.value
              )
            }
            className="w-full rounded-lg border border-[var(--color-border)] px-4 py-2 focus:border-[var(--color-primary)] outline-none"
          />
        </div>
      </div>
    </section>
  );
}