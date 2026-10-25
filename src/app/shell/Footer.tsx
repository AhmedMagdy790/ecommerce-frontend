// src/components/layout/Footer.tsx

import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLang } from "@/shared/context/LanguageContext";
import { useMenuLinks } from "@/features/navigation/hooks/useMenuLinks";

type FooterLinkItem = {
  id: number;
  title: string;
  href: string;
  isActive: boolean;
  isExternal: boolean;
  sortOrder?: number;
  children?: FooterLinkItem[];
};

const Footer = () => {
  const { isRTL } = useLang();
  const { menuLinks, isLoading } = useMenuLinks("footer");
  const { t } = useTranslation("footer");

  const links: FooterLinkItem[] = menuLinks?.items ?? [];

  const supportPaths = new Set([
    "/pages/help",
    "/pages/faq",
    "/pages/contact",
    "/pages/shipping-policy",
    "/pages/return-refund-policy",
  ]);

  const legalPaths = new Set([
    "/pages/privacy-policy",
    "/pages/terms-and-conditions",
  ]);

  const activeLinks = links.filter((link) => link.isActive);

  const supportLinks = activeLinks.filter((link) =>
    supportPaths.has(link.href),
  );

  const legalLinks = activeLinks.filter((link) =>
    legalPaths.has(link.href),
  );

  const columns = [
    {
      id: "support",
      title: t("sections.support", "الدعم"),
      links: supportLinks,
    },
    {
      id: "legal",
      title: t("sections.legal", "قانوني"),
      links: legalLinks,
    },
  ];

  const linkClass =
    "transition-colors duration-200 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary";

  const headingClass =
    "mb-4 text-base font-semibold text-text-primary";

  const listClass =
    "flex flex-col gap-3 text-sm text-text-secondary";

  return (
    <footer
      dir={isRTL ? "rtl" : "ltr"}
      className="border-t border-border bg-surface pt-16 pb-8 transition-colors duration-normal"
    >
      <div className="mx-auto mb-16 grid max-w-7xl grid-cols-2 gap-x-6 gap-y-10 px-6 md:grid-cols-4 md:gap-12">
        {/* Brand */}
        <div className="col-span-2 flex flex-col gap-3 md:col-span-1">
          <Link
            to="/"
            className="mb-2 block font-sans text-xl font-bold tracking-tighter text-text-primary transition-opacity hover:opacity-80"
          >
            AURA.
          </Link>

          <p className="text-sm font-normal leading-relaxed text-text-secondary">
            {t(
              "brandDescription",
              "نرتقي بالأساسيات اليومية من خلال تصميم خالد وجودة لا تُقدّر بثمن.",
            )}
          </p>
        </div>

        {/* Shop */}
        <div>
          <h4 className={headingClass}>
            {t("sections.shop", "التسوق")}
          </h4>

          <ul className={listClass}>
            <li>
              <Link to="/products" className={linkClass}>
                {t("links.allProducts", "جميع المنتجات")}
              </Link>
            </li>

            <li>
              <Link to="/pages/brands" className={linkClass}>
                {t("links.brands", "العلامات التجارية")}
              </Link>
            </li>
          </ul>
        </div>

        {/* Dynamic Footer Columns */}
        {columns.map((column) => (
          <div key={column.id}>
            <h4 className={headingClass}>
              {column.title}
            </h4>

            <ul className={listClass}>
              {isLoading ? (
                <li aria-live="polite">
                  {t("loading", "جارٍ التحميل...")}
                </li>
              ) : (
                column.links.map((link) => (
                  <li key={link.id}>
                    {link.isExternal ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={linkClass}
                      >
                        {link.title}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className={linkClass}
                      >
                        {link.title}
                      </Link>
                    )}
                  </li>
                ))
              )}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom Bar */}
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-border px-6 pt-8 md:flex-row">
        <p className="text-center text-xs text-text-muted md:text-start">
          {t("copyright", "© 2026 متجر أورا. جميع الحقوق محفوظة.")}
        </p>

        <div className="flex gap-6 text-xs text-text-secondary">
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            Instagram
          </a>

          <a
            href="https://www.linkedin.com/"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;