import { useTranslation } from "react-i18next";

export default function ProfileHeader() {
  const { t } = useTranslation("profile");

  return (
    <header className="mb-[var(--spacing-8)] border-b border-[var(--color-border)] pb-[var(--spacing-6)]">
      <h1 className="text-[var(--text-3xl)] font-[var(--font-bold)] text-[var(--color-text-primary)] tracking-tight">
        {t("title")}
      </h1>

      <p className="mt-[var(--spacing-1)] text-[var(--text-sm)] text-[var(--color-text-secondary)]">
        {t("description")}
      </p>
    </header>
  );
}