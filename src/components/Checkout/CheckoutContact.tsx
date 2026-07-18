import { useTranslation } from "react-i18next";

export interface CheckoutContactData {
  fullName: string;
  email: string;
  phone: string;
}

interface CheckoutContactProps {
  value: CheckoutContactData;
  onChange: (value: CheckoutContactData) => void;
}

export default function CheckoutContact({
  value,
  onChange,
}: CheckoutContactProps) {
  const { t } = useTranslation("checkout");

  const handleChange = (
    key: keyof CheckoutContactData,
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
        {t("contact.title")}
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label
            htmlFor="fullName"
            className="mb-2 block text-sm font-medium"
          >
            {t("contact.fullName")}
          </label>

          <input
            id="fullName"
            type="text"
            value={value.fullName}
            onChange={(e) =>
              handleChange("fullName", e.target.value)
            }
            placeholder={t("contact.fullName")}
            className="
              w-full
              rounded-lg
              border
              border-[var(--color-border)]
              px-4
              py-2
              outline-none
              transition-colors
              focus:border-[var(--color-primary)]
            "
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium"
          >
            {t("contact.email")}
          </label>

          <input
            id="email"
            type="email"
            value={value.email}
            onChange={(e) =>
              handleChange("email", e.target.value)
            }
            placeholder={t("contact.email")}
            className="
              w-full
              rounded-lg
              border
              border-[var(--color-border)]
              px-4
              py-2
              outline-none
              transition-colors
              focus:border-[var(--color-primary)]
            "
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="mb-2 block text-sm font-medium"
          >
            {t("contact.phone")}
          </label>

          <input
            id="phone"
            type="tel"
            value={value.phone}
            onChange={(e) =>
              handleChange("phone", e.target.value)
            }
            placeholder={t("contact.phone")}
            className="
              w-full
              rounded-lg
              border
              border-[var(--color-border)]
              px-4
              py-2
              outline-none
              transition-colors
              focus:border-[var(--color-primary)]
            "
          />
        </div>
      </div>
    </section>
  );
}