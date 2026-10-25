
import { Fragment } from "react";
import { ChevronLeft, ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLang } from "@/shared/context/LanguageContext";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
}

export function Breadcrumbs({
  items = [],
  className = "",
  showHome = true,
}: BreadcrumbsProps) {
  const { t } = useTranslation("breadcrumbs");
  const { isRTL } = useLang();

  const Separator = isRTL ? ChevronLeft : ChevronRight;

  const breadcrumbs: BreadcrumbItem[] = [
    ...(showHome ? [{ label: t("home"), href: "/" }] : []),
    ...items,
  ];

  return (
    <nav
      aria-label={t("navigationLabel")}
      className={className}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <ol className="flex flex-wrap items-center gap-2 text-sm">
        {breadcrumbs.map((item, index) => {
          const isCurrent = index === breadcrumbs.length - 1;
          const isHome = showHome && index === 0;

          return (
            <Fragment key={`${item.href ?? item.label}-${index}`}>
              {index > 0 && (
                <li aria-hidden="true" className="text-text-muted">
                  <Separator size={16} />
                </li>
              )}

              <li className="flex min-w-0 items-center">
                {isCurrent || !item.href ? (
                  <span
                    aria-current={isCurrent ? "page" : undefined}
                    className={
                      isCurrent
                        ? "truncate font-medium text-text-primary"
                        : "truncate text-text-secondary"
                    }
                  >
                    {isHome && (
                      <Home
                        size={16}
                        className="inline-block"
                        aria-hidden="true"
                      />
                    )}
                    {isHome && <span className="sr-only">{item.label}</span>}
                    {!isHome && item.label}
                  </span>
                ) : (
                  <Link
                    to={item.href}
                    className="truncate text-text-secondary transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                  >
                    {isHome ? (
                      <>
                        <Home
                          size={16}
                          aria-hidden="true"
                        />
                        <span className="sr-only">{item.label}</span>
                      </>
                    ) : (
                      item.label
                    )}
                  </Link>
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
