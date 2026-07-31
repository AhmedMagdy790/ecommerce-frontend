import { useLang } from "@/shared/context/LanguageContext";

const Footer = () => {
  const { lang, isRTL } = useLang();

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
        {/* Brand Column */}
        <div className="col-span-2 md:col-span-1" style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-3)" }}>
          <a 
            href="/" 
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
          </a>
          <p 
            style={{
              fontSize: "var(--text-sm)",
              fontWeight: "var(--font-normal)",
              fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)",
              color: "var(--color-text-secondary)",
              lineHeight: 1.6,
            }}
          >
            {lang === "ar" 
              ? "نارتقي بالأساسيات اليومية من خلال تصميم خالد جودة لا تُقدّر بثمن." 
              : "Elevating everyday essentials with timeless design and uncompromising quality."}
          </p>
        </div>

        {/* Shop Column */}
        <div>
          <h4 
            style={{
              fontSize: "var(--text-base)",
              fontWeight: "var(--font-semibold)",
              fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)",
              color: "var(--color-text-primary)",
              marginBottom: "var(--spacing-4)",
            }}
          >
            {lang === "ar" ? "التسوق" : "Shop"}
          </h4>
          <ul 
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--spacing-3)",
              fontSize: "var(--text-sm)",
              fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)",
              color: "var(--color-text-secondary)",
            }}
          >
            <li><a href="#" className="transition-colors hover:text-[var(--color-primary)]">{lang === "ar" ? "وصل حديثاً" : "New Arrivals"}</a></li>
            <li><a href="#" className="transition-colors hover:text-[var(--color-primary)]">{lang === "ar" ? "الأكثر مبيعاً" : "Best Sellers"}</a></li>
            <li><a href="#" className="transition-colors hover:text-[var(--color-primary)]">{lang === "ar" ? "الإكسسوارات" : "Accessories"}</a></li>
          </ul>
        </div>

        {/* Support Column */}
        <div>
          <h4 
            style={{
              fontSize: "var(--text-base)",
              fontWeight: "var(--font-semibold)",
              fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)",
              color: "var(--color-text-primary)",
              marginBottom: "var(--spacing-4)",
            }}
          >
            {lang === "ar" ? "الدعم" : "Support"}
          </h4>
          <ul 
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--spacing-3)",
              fontSize: "var(--text-sm)",
              fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)",
              color: "var(--color-text-secondary)",
            }}
          >
            <li><a href="#" className="transition-colors hover:text-[var(--color-primary)]">{lang === "ar" ? "اتصل بنا" : "Contact Us"}</a></li>
            <li><a href="#" className="transition-colors hover:text-[var(--color-primary)]">{lang === "ar" ? "سياسة الشحن" : "Shipping Policy"}</a></li>
            <li><a href="#" className="transition-colors hover:text-[var(--color-primary)]">{lang === "ar" ? "المرتجعات" : "Returns"}</a></li>
          </ul>
        </div>

        {/* Legal Column */}
        <div>
          <h4 
            style={{
              fontSize: "var(--text-base)",
              fontWeight: "var(--font-semibold)",
              fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)",
              color: "var(--color-text-primary)",
              marginBottom: "var(--spacing-4)",
            }}
          >
            {lang === "ar" ? "قانوني" : "Legal"}
          </h4>
          <ul 
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--spacing-3)",
              fontSize: "var(--text-sm)",
              fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)",
              color: "var(--color-text-secondary)",
            }}
          >
            <li><a href="#" className="transition-colors hover:text-[var(--color-primary)]">{lang === "ar" ? "سياسة الخصوصية" : "Privacy Policy"}</a></li>
            <li><a href="#" className="transition-colors hover:text-[var(--color-primary)]">{lang === "ar" ? "شروط الخدمة" : "Terms of Service"}</a></li>
          </ul>
        </div>
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
            fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)",
            color: "var(--color-text-muted)",
          }}
        >
          {lang === "ar" ? "© 2026 متجر أورا. جميع الحقوق محفوظة." : "© 2026 AURA Store. All rights reserved."}
        </p>
        
        <div 
          className="flex"
          style={{
            gap: "var(--spacing-6)",
            fontSize: "var(--text-xs)",
            fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)",
            color: "var(--color-text-secondary)",
          }}
        >
          <a href="#" className="transition-colors hover:text-[var(--color-primary)]">Instagram</a>
          <a href="#" className="transition-colors hover:text-[var(--color-primary)]">Twitter</a>
          <a href="#" className="transition-colors hover:text-[var(--color-primary)]">LinkedIn</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;