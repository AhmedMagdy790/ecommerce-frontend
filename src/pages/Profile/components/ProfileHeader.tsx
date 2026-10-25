
import { useTranslation } from "react-i18next";

export default function ProfileHeader() {
  const { t } = useTranslation("profile");

  return (
    <header className="mb-8 border-b border-border pb-6">
      <h2 className="text-3xl font-bold tracking-tight text-text-primary">
        {t("title")}
      </h2>

      <p className="mt-1 text-sm text-text-secondary">
        {t("description")}
      </p>
    </header>
  );
}
