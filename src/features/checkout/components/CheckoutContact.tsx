import { Input } from "@/shared/components/ui/Input";
import { useTranslation } from "react-i18next";
import type { FieldError } from "react-hook-form";

export interface CheckoutContactData {
  fullName: string;
  email: string;
  phone: string;
}

interface CheckoutContactProps {
  value: CheckoutContactData;
  onChange: (value: CheckoutContactData) => void;
  error?: {
    fullName?: FieldError;
    email?: FieldError;
    phone?: FieldError;
  };
}

export default function CheckoutContact({
  value,
  onChange,
  error,
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
          <Input
            id="fullName"
            label={t("contact.fullName")}
            type="text"
            value={value.fullName}
            onChange={(e) =>
              handleChange("fullName", e.target.value)
            }
            placeholder={t("contact.fullName")}
            error={error?.fullName?.message}
          />
        </div>

        <div>
          <Input
            id="email"
            label={t("contact.email")}
            type="email"
            value={value.email}
            onChange={(e) =>
              handleChange("email", e.target.value)
            }
            placeholder={t("contact.email")}
            error={error?.email?.message}
          />
        </div>

        <div>
          <Input
            id="phone"
            label={t("contact.phone")}
            type="tel"
            value={value.phone}
            onChange={(e) =>
              handleChange("phone", e.target.value)
            }
            placeholder={t("contact.phone")}
            error={error?.phone?.message}
          />
        </div>
      </div>
    </section>
  );
}