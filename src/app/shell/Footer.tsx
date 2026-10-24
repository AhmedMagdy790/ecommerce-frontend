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

  // فلترة الروابط النشطة فقط
  const activeLinks = links.filter((link) => link.isActive);

  const supportLinks = activeLinks.filter((link) =>
    supportPaths.has(link.href)
  );

  const legalLinks = activeLinks.filter((link) =>
    legalPaths.has(link.href)
  );

  const columns = [
    {
      title: t("sections.support", "الدعم"),
      links: supportLinks,
    },
    {
      title: t("sections.legal", "قانوني"),
      links: legalLinks,
    },
  ];

  const linkClass = "transition-colors hover:text-[var(--color-primary)]";

  return (
    <footer
      dir={isRTL ? "rtl" : "ltr"}
      className="border-t transition-colors duration-normal"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
        paddingTop: "var(--spacing-16)",
        paddingBottom: "var(--spacing-8)",
      }}
    >
      <div
        className="mx-auto grid grid-cols-2 md:grid-cols-4"
        style={{
          maxWidth: "var(--container-2xl)",
          paddingLeft: "var(--spacing-6)",
          paddingRight: "var(--spacing-6)",
          gap: "var(--spacing-12)",
          marginBottom: "var(--spacing-16)",
        }}
      >
        {/* Brand */}
        <div
          className="col-span-2 md:col-span-1"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--spacing-3)",
          }}
        >
          <Link
            to="/"
            className="block tracking-tighter transition-opacity hover:opacity-80"
            style={{
              fontSize: "var(--text-xl)",
              fontWeight: "var(--font-bold)",
              fontFamily: "var(--font-sans)",
              color: "var(--color-text-primary)",
              marginBottom: "var(--spacing-2)",
            }}
          >
            AURA.
          </Link>

          <p
            style={{
              fontSize: "var(--text-sm)",
              fontWeight: "var(--font-normal)",
              color: "var(--color-text-secondary)",
              lineHeight: 1.6,
            }}
          >
            {t(
              "brandDescription",
              "نرتقي بالأساسيات اليومية من خلال تصميم خالد وجودة لا تُقدّر بثمن."
            )}
          </p>
        </div>

        {/* Shop */}
        <div>
          <h4
            style={{
              fontSize: "var(--text-base)",
              fontWeight: "var(--font-semibold)",
              color: "var(--color-text-primary)",
              marginBottom: "var(--spacing-4)",
            }}
          >
            {t("sections.shop", "التسوق")}
          </h4>

          <ul
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--spacing-3)",
              fontSize: "var(--text-sm)",
              color: "var(--color-text-secondary)",
            }}
          >
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
          <div key={column.title}>
            <h4
              style={{
                fontSize: "var(--text-base)",
                fontWeight: "var(--font-semibold)",
                color: "var(--color-text-primary)",
                marginBottom: "var(--spacing-4)",
              }}
            >
              {column.title}
            </h4>

            <ul
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--spacing-3)",
                fontSize: "var(--text-sm)",
                color: "var(--color-text-secondary)",
              }}
            >
              {isLoading ? (
                <li>{t("loading", "جارٍ التحميل...")}</li>
              ) : (
                column.links.map((link) => (
                  <li key={link.id}>
                    {link.isExternal ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className={linkClass}
                      >
                        {link.title}
                      </a>
                    ) : (
                      <Link to={link.href} className={linkClass}>
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
      <div
        className="mx-auto flex flex-col md:flex-row justify-between items-center border-t"
        style={{
          maxWidth: "var(--container-2xl)",
          paddingLeft: "var(--spacing-6)",
          paddingRight: "var(--spacing-6)",
          paddingTop: "var(--spacing-8)",
          borderColor: "var(--color-border)",
          gap: "var(--spacing-4)",
        }}
      >
        <p
          style={{
            fontSize: "var(--text-xs)",
            color: "var(--color-text-muted)",
          }}
        >
          {t("copyright", "© 2026 متجر أورا. جميع الحقوق محفوظة.")}
        </p>

        <div
          className="flex"
          style={{
            gap: "var(--spacing-6)",
            fontSize: "var(--text-xs)",
            color: "var(--color-text-secondary)",
          }}
        >
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noreferrer"
            className={linkClass}
          >
            Instagram
          </a>
          <a
            href="https://www.linkedin.com/"
            target="_blank"
            rel="noreferrer"
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