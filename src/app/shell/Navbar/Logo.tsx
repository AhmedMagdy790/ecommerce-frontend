// src/components/layout/Logo.tsx

import { useState } from "react";
import { Link } from "react-router-dom";
import { appConfig } from "@/config/app";
import { useLang } from "@/shared/context/LanguageContext";

export default function Logo() {
  const { lang, isRTL } = useLang();
  const [hasError, setHasError] = useState(false);

  // استخراج أول حرف من اسم التطبيق لاستخدامه كـ Fallback
  const fallbackInitial = appConfig.name ? appConfig.name.charAt(0).toUpperCase() : "A";

  return (
    <Link 
      to="/" 
      dir={isRTL ? "rtl" : "ltr"}
      className="group inline-flex items-center gap-[var(--spacing-3)] shrink-0 transition-opacity duration-[var(--duration-fast)] hover:opacity-90"
    >
      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-[var(--radius-md)] bg-[var(--color-surface-secondary)] border border-[var(--color-border)] shadow-[var(--shadow-xs)] transition-transform duration-[var(--duration-normal)] group-hover:scale-105">
        {!hasError && appConfig.logo ? (
          <img
            src={appConfig.logo}
            alt={appConfig.name}
            onError={() => setHasError(true)}
            className="h-7 w-7 object-contain"
            loading="eager"
          />
        ) : (
          <span className="text-[var(--text-lg)] font-[var(--font-bold)] text-[var(--color-primary)]">
            {fallbackInitial}
          </span>
        )}
      </div>

      <span 
        className="text-[var(--text-xl)] font-[var(--font-bold)] tracking-tight text-[var(--color-text-primary)] select-none"
        style={{
          fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)",
        }}
      >
        {appConfig.name}
      </span>
    </Link>
  );
}