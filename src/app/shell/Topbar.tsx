// src/components/layout/Topbar.tsx

import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSettings } from "@/hooks/useSettings";
import { useLang } from "@/shared/context/LanguageContext";

export default function Topbar() {
  const { settings } = useSettings();
  const { t } = useTranslation("common");
  const { lang, isRTL } = useLang();

  // Guard in case settings or topbar is not defined yet
  if (!settings?.topbar) return null;

  const { messageKey, link, linkTextKey } = settings.topbar;

  return (
    <div 
      dir={isRTL ? "rtl" : "ltr"}
      className="relative z-[var(--z-index-sticky)] flex w-full items-center justify-center transition-colors duration-[var(--duration-normal)] bg-[var(--color-primary)] text-[var(--color-text-inverse)]"
      style={{ height: "var(--height-topbar)" }}
    >
      <div className="mx-auto flex w-full max-w-[var(--container-2xl)] items-center justify-center px-[var(--spacing-4)] py-[var(--spacing-2)] overflow-hidden">
        <p 
          className="flex flex-wrap items-center justify-center gap-[var(--spacing-2)] text-center text-[var(--text-xs)] sm:text-[var(--text-sm)] font-[var(--font-medium)] tracking-wide"
          style={{ fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)" }}
        >
          <span className="truncate">{t(messageKey)}</span>

          {link && linkTextKey && (
            <Link
              to={link}
              className="inline-flex items-center gap-1 font-[var(--font-semibold)] underline underline-offset-4 transition-opacity duration-[var(--duration-fast)] hover:opacity-80"
            >
              <span>{t(linkTextKey)}</span>
              <svg 
                className={`w-3.5 h-3.5 ${isRTL ? "rotate-180" : ""}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          )}
        </p>
      </div>
    </div>
  );
}