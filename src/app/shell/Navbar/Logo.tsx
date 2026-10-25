import { useState } from "react";
import { Link } from "react-router-dom";
import { appConfig } from "@/config/app";
import { useLang } from "@/shared/context/LanguageContext";

export default function Logo() {
  const { lang, isRTL } = useLang();
  const [hasError, setHasError] = useState(false);

  const fallbackInitial = appConfig.name?.trim().charAt(0).toUpperCase() || "A";

  return (
    <Link
      to="/"
      dir={isRTL ? "rtl" : "ltr"}
      aria-label={appConfig.name}
      className="group inline-flex min-w-0 shrink-0 items-center gap-2 transition-opacity duration-200 hover:opacity-90 sm:gap-2.5"
    >
      <span className="relative inline-flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-control border border-border bg-surface-secondary shadow-sm transition-transform duration-200 group-hover:scale-105 sm:size-10">
        {!hasError && appConfig.logo ? (
          <img
            src={appConfig.logo}
            alt=""
            onError={() => setHasError(true)}
            className="size-7 object-contain"
            loading="eager"
          />
        ) : (
          <span className="text-lg font-bold text-primary">
            {fallbackInitial}
          </span>
        )}
      </span>

      <span
        className="max-w-[100px] truncate text-base font-bold tracking-tight text-text-primary sm:max-w-[140px] sm:text-lg"
        style={{
          fontFamily:
            lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)",
        }}
      >
        {appConfig.name}
      </span>
    </Link>
  );
}