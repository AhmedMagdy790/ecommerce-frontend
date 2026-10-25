import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSettings } from "@/hooks/useSettings";
import { useLang } from "@/shared/context/LanguageContext";
import { ArrowRight } from "lucide-react";

export default function Topbar() {
  const { settings } = useSettings();
  const { t } = useTranslation("common");
  const { lang, isRTL } = useLang();

  if (!settings?.topbar) return null;

  const { messageKey, link, linkTextKey } = settings.topbar;

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="w-full bg-primary text-text-inverse"
      style={{ minHeight: "var(--height-topbar)" }}
    >
      <div className="mx-auto flex min-h-[var(--height-topbar)] w-full max-w-[var(--container-2xl)] items-center justify-center px-3 py-2 sm:px-6 lg:px-8">
        <p
          className="flex min-w-0 max-w-full items-center justify-center gap-2 text-center text-xs font-medium tracking-wide sm:text-sm"
          style={{
            fontFamily:
              lang === "ar"
                ? "var(--font-arabic)"
                : "var(--font-sans)",
          }}
        >
          <span className="min-w-0 truncate">{t(messageKey)}</span>

          {link && linkTextKey && (
            <Link
              to={link}
              className="inline-flex shrink-0 items-center gap-1 font-semibold underline underline-offset-4 transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
            >
              <span>{t(linkTextKey)}</span>
              <ArrowRight
                aria-hidden="true"
                size={14}
                className={isRTL ? "rotate-180" : ""}
              />
            </Link>
          )}
        </p>
      </div>
    </div>
  );
}