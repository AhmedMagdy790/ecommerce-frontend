import { Link } from "react-router-dom";
import { TriangleAlert, House } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function NotFoundPage() {
  const { t } = useTranslation("common");

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-4 text-center">
      <div
        className="
          mb-6
          flex
          h-24
          w-24
          items-center
          justify-center
          rounded-full
          bg-[var(--color-surface)]
        "
      >
        <TriangleAlert
          size={48}
          className="text-[var(--color-warning)]"
          aria-hidden="true"
        />
      </div>

      <span className="mb-2 text-6xl font-bold text-[var(--color-primary)]">
        404
      </span>

      <h1 className="mb-3 text-3xl font-bold text-[var(--color-text-primary)]">
        {t("notFound.title")}
      </h1>

      <p className="mb-8 max-w-md text-[var(--color-text-secondary)]">
        {t("notFound.description")}
      </p>

      <Link
        to="/"
        className="
          inline-flex
          items-center
          gap-2
          rounded-xl
          bg-[var(--color-primary)]
          px-6
          py-3
          font-medium
          text-[var(--color-text-inverse)]
          transition-colors
          duration-[var(--duration-fast)]
          hover:bg-[var(--color-primary-hover)]
        "
      >
        <House size={18} />

        {t("notFound.backHome")}
      </Link>
    </main>
  );
}