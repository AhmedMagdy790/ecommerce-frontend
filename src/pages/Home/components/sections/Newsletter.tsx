// src/pages/Home/components/sections/Newsletter.tsx

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLang } from "@/shared/context/LanguageContext";
import { Container } from "@/shared/components/layout/Container";
import type { Section } from "@/features/cms/section/model/types/section.types";

interface NewsletterSectionData {
  subtitle?: string;
  description?: string;
  placeholder?: string;
  button?: string;
  [key: string]: unknown;
}

interface NewsletterProps {
  section: Section<string> & {
    subtitle?: string;
    description?: string;
    placeholder?: string;
    button?: string;
    data?: NewsletterSectionData;
  };
}

export default function Newsletter({ section }: NewsletterProps) {
  const { t } = useTranslation("common");
  const { lang, isRTL } = useLang();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSubmitted(true);
      setEmail("");
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error("Subscription failed", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  // النصوص الافتراضية مع دعم الترجمة
  const badgeText = t("newsletter.badge", {
    defaultValue: lang === "ar" ? "ابق على اطلاع دائم" : "STAY AHEAD OF TRENDS",
  });
  
  const title = section.name || t("newsletter.title", {
    defaultValue: lang === "ar" ? "النشرة البريدية" : "Newsletter",
  });
  
  const description =
    section.subtitle ||
    section.description ||
    section.data?.description ||
    t("newsletter.description", {
      defaultValue: lang === "ar"
        ? "احصل على أحدث التحديثات والعروض الحصرية مباشرة إلى بريدك الإلكتروني."
        : "Get the latest updates, special deals, and stories directly to your inbox.",
    });
  
  const placeholder =
    section.placeholder ||
    section.data?.placeholder ||
    t("newsletter.placeholder", {
      defaultValue: lang === "ar" ? "أدخل بريدك الإلكتروني..." : "Enter your email address...",
    });
  
  const buttonText =
    section.button ||
    section.data?.button ||
    t("newsletter.button", {
      defaultValue: lang === "ar" ? "اشترك الآن" : "Subscribe Now",
    });

  return (
    <section dir={isRTL ? "rtl" : "ltr"} className="py-16 lg:py-20 bg-background">
      <Container>
        <div className="relative mx-auto overflow-hidden rounded-panel bg-gradient-to-br from-primary via-primary-hover to-[var(--brand-primary-active, #4c1d95)] p-8 sm:p-16 shadow-xl">
          
          {/* Dynamic Theme Glowing Accents */}
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-[120px] pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-black/20 blur-[100px] pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">
            
            {/* Glassmorphic Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-sm mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              <span className="text-xs font-semibold text-white/90 tracking-widest uppercase">
                {badgeText}
              </span>
            </div>

            {/* Title */}
            {title && (
              <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-[1.15] mb-4">
                {title}
              </h2>
            )}

            {/* Description */}
            {description && (
              <p className="text-base sm:text-lg font-normal text-white/85 leading-relaxed mb-8 max-w-lg">
                {description}
              </p>
            )}

            {/* Form Container */}
            <form
              onSubmit={handleSubmit}
              className="w-full max-w-xl flex flex-col sm:flex-row items-center gap-2 rounded-full bg-white/10 backdrop-blur-xl p-2 border border-white/20 focus-within:border-white/40 focus-within:bg-white/15 transition-all duration-[var(--duration-normal)] ease-[var(--ease-default)]"
            >
              <div className="relative w-full flex-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={placeholder}
                  disabled={isSubmitting}
                  className="w-full bg-transparent px-6 py-3 text-base text-white placeholder-white/60 outline-none border-none focus:ring-0 disabled:opacity-50"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-base font-semibold text-primary shadow-md transition-all duration-[var(--duration-normal)] ease-[var(--ease-default)] hover:bg-white/95 hover:scale-[1.02] active:scale-95 disabled:opacity-75 cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{buttonText}</span>
                    <svg 
                      className={`w-4 h-4 transition-transform duration-[var(--duration-normal)] ${isRTL ? "rotate-180" : ""}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Success Alert */}
            {submitted && (
              <div className="mt-5 inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/40 text-white text-sm font-medium shadow-xs animate-fade-in">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white font-bold text-xs">✓</span>
                <span>
                  {t("newsletter.success", {
                    defaultValue: lang === "ar" ? "تم الاشتراك بنجاح، شكراً لانضمامك!" : "Successfully subscribed, thanks for joining!",
                  })}
                </span>
              </div>
            )}

          </div>
        </div>
      </Container>
    </section>
  );
}