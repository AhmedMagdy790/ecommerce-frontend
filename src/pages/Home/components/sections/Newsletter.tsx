// src/pages/Home/components/sections/Newsletter.tsx
import { useState } from "react";
import type { Section } from "../SectionRenderer";
import { useTranslation } from "react-i18next";
import { useLang } from "@/shared/context/LanguageContext";

interface NewsletterProps {
  section: Section & {
    data?: {
      description?: { ar: string; en: string } | string;
      placeholder?: { ar: string; en: string } | string;
      button?: { ar: string; en: string } | string;
    };
  };
}

export default function Newsletter({ section }: NewsletterProps) {
  const { t } = useTranslation("home");
  const { lang, isRTL } = useLang();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Helper to safely extract localized text
  const getLocalizedText = (textObj: any) => {
    if (!textObj) return "";
    if (typeof textObj === "string") {
      return t(textObj, { defaultValue: textObj });
    }
    return textObj[lang] || textObj.en || textObj.ar || "";
  };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("Subscribing email:", email);
    setSubmitted(true);
    setEmail("");
    setTimeout(() => setSubmitted(false), 4000);
  }

  const title = getLocalizedText(section.name);
  const description = getLocalizedText(section.data?.description);
  const placeholder = getLocalizedText(section.data?.placeholder || (lang === "ar" ? "أدخل بريدك الإلكتروني الشخصي..." : "Enter your email address..."));
  const buttonText = getLocalizedText(section.data?.button || (lang === "ar" ? "انضم الآن" : "Subscribe Now"));

  return (
    <section dir={isRTL ? "rtl" : "ltr"} className="px-[var(--spacing-6)] py-[var(--spacing-20)]">
      <div className="relative mx-auto max-w-[var(--container-xl)] overflow-hidden rounded-[var(--radius-3xl)] bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-primary)] to-[var(--color-primary-active)] p-[var(--spacing-10)] sm:p-[var(--spacing-16)] shadow-[var(--shadow-2xl)]">
        
        {/* Dynamic Glowing Accents Behind the Box */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-20 pointer-events-none blur-[100px] bg-white" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full opacity-10 pointer-events-none blur-[100px] bg-black" />

        <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">
          
          {/* Glassmorphic Minimalist Badge */}
          <div className="inline-flex items-center gap-[var(--spacing-2)] px-[var(--spacing-4)] py-[var(--spacing-1.5)] rounded-[var(--radius-full)] bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg mb-[var(--spacing-6)]">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <span className="text-[var(--text-xs)] font-[var(--font-semibold)] text-white tracking-widest uppercase">
              {lang === "ar" ? "ابق على اطلاع دائم" : "Stay Ahead of Trends"}
            </span>
          </div>

          <h2 className="text-[var(--text-3xl)] sm:text-[var(--text-5xl)] font-[var(--font-bold)] text-[var(--color-text-inverse)] tracking-tight leading-[1.1] mb-[var(--spacing-4)]">
            {title}
          </h2>

          {description && (
            <p className="text-[var(--text-base)] sm:text-[var(--text-lg)] font-[var(--font-normal)] text-white/85 leading-relaxed mb-[var(--spacing-10)] max-w-lg">
              {description}
            </p>
          )}

          {/* Form Container with High-End Glassmorphism */}
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-xl flex flex-col sm:flex-row items-center gap-[var(--spacing-3)] rounded-[var(--radius-2xl)] bg-white/10 backdrop-blur-2xl p-[var(--spacing-2)] border border-white/20 shadow-[var(--shadow-xl)]"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={placeholder}
              className="w-full flex-1 rounded-[var(--radius-xl)] bg-transparent px-[var(--spacing-6)] py-[var(--spacing-4)] text-[var(--text-base)] text-[var(--color-text-inverse)] placeholder-white/60 outline-none border-none focus:ring-0"
            />

            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-[var(--spacing-2)] rounded-[var(--radius-xl)] bg-[var(--color-background)] px-[var(--spacing-8)] py-[var(--spacing-4)] text-[var(--text-base)] font-[var(--font-semibold)] text-[var(--color-text-primary)] shadow-lg transition-all duration-[var(--duration-normal)] ease-[var(--ease-default)] hover:bg-gray-50 hover:scale-[1.02] active:scale-95 whitespace-nowrap"
            >
              <span>{buttonText}</span>
              <svg 
                className={`w-4 h-4 transition-transform duration-300 ${isRTL ? "rotate-180" : ""}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </form>

          {/* Success Notification Feedback */}
          {submitted && (
            <div className="mt-[var(--spacing-4)] inline-flex items-center gap-[var(--spacing-2)] px-[var(--spacing-4)] py-[var(--spacing-2)] rounded-[var(--radius-full)] bg-emerald-500/20 backdrop-blur-md border border-emerald-500/40 text-emerald-100 text-[var(--text-sm)] font-[var(--font-medium)] animate-fade-in">
              <span>✓</span>
              <span>{lang === "ar" ? "تم الاشتراك بنجاح، شكراً لانضمامك!" : "Successfully subscribed, thanks for joining!"}</span>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}