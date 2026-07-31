import { useTranslation } from "react-i18next";

interface OrderNotesProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
}

export default function OrderNotes({
  value,
  onChange,
  maxLength = 500,
}: OrderNotesProps) {
  const { t } = useTranslation("checkout");

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
      <h2 className="mb-2 text-xl font-semibold">
        {t("notes.title")}
      </h2>

      <p className="mb-4 text-sm text-[var(--color-text-secondary)]">
        {t("notes.description")}
      </p>

      <textarea
        rows={5}
        value={value}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t("notes.placeholder")}
        className="
          w-full
          resize-none
          rounded-lg
          border
          border-[var(--color-border)]
          bg-[var(--color-background)]
          px-4
          py-3
          outline-none
          transition-colors
          focus:border-[var(--color-primary)]
        "
      />

      <div className="mt-2 text-end text-sm text-[var(--color-text-secondary)]">
        {value.length} / {maxLength}
      </div>
    </section>
  );
}