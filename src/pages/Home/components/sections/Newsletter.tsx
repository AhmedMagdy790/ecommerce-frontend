import { useState } from "react";
import { useLang } from "@/shared/context/LanguageContext";
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

  // معالجة النصوص حسب لغة الصفحة للتخلص من التضارب
  const badgeText = lang === "ar" ? "ابق على اطلاع دائم" : "STAY AHEAD OF TRENDS";
  
  const title = section.name || (lang === "ar" ? "النشرة البريدية" : "Newsletter");
  
  const description =
    section.subtitle ||
    section.description ||
    section.data?.description ||
    (lang === "ar"
      ? "احصل على أحدث التحديثات والعروض الحصرية مباشرة إلى بريدك الإلكتروني."
      : "Get the latest updates, special deals, and stories directly to your inbox.");
  
  const placeholder =
    section.placeholder ||
    section.data?.placeholder ||
    (lang === "ar" ? "أدخل بريدك الإلكتروني..." : "Enter your email address...");
  
  const buttonText =
    section.button ||
    section.data?.button ||
    (lang === "ar" ? "اشترك الآن" : "Subscribe Now");

  return (
    <section dir={isRTL ? "rtl" : "ltr"} className="px-[var(--spacing-6)] py-[var(--spacing-16)] lg:py-[var(--spacing-20)]">
      <div className="relative mx-auto max-w-[var(--container-2xl)] overflow-hidden rounded-[var(--radius-3xl)] bg-gradient-to-br from-[var(--violet-600)] via-[var(--violet-700)] to-[var(--violet-900)] p-[var(--spacing-8)] sm:p-[var(--spacing-16)] shadow-[var(--shadow-xl)]">
        
        {/* Dynamic Theme Glowing Accents */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[var(--violet-400)]/20 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-black/20 blur-[100px] pointer-events-none" />

        <div className="relative z-[var(--z-normal)] flex flex-col items-center text-center max-w-2xl mx-auto">
          
          {/* Glassmorphic Badge */}
          <div className="inline-flex items-center gap-[var(--spacing-2)] px-[var(--spacing-4)] py-[var(--spacing-1.5)] rounded-[var(--radius-full)] bg-white/10 backdrop-blur-md border border-white/20 shadow-sm mb-[var(--spacing-6)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <span className="text-[var(--text-xs)] font-[var(--font-semibold)] text-white/90 tracking-widest uppercase">
              {badgeText}
            </span>
          </div>

          {/* Title */}
          {title && (
            <h2 className="text-[var(--text-3xl)] sm:text-[var(--text-5xl)] font-[var(--font-bold)] text-white tracking-tight leading-[1.15] mb-[var(--spacing-4)]">
              {title}
            </h2>
          )}

          {/* Description */}
          {description && (
            <p className="text-[var(--text-base)] sm:text-[var(--text-lg)] font-[var(--font-normal)] text-white/85 leading-relaxed mb-[var(--spacing-8)] max-w-lg">
              {description}
            </p>
          )}

          {/* Form Container */}
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-xl flex flex-col sm:flex-row items-center gap-[var(--spacing-2)] rounded-[var(--radius-full)] bg-white/10 backdrop-blur-xl p-[var(--spacing-2)] border border-white/20 focus-within:border-white/40 focus-within:bg-white/15 transition-all duration-[var(--duration-normal)] ease-[var(--ease-default)]"
          >
            <div className="relative w-full flex-1">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={placeholder}
                disabled={isSubmitting}
                className="w-full bg-transparent px-[var(--spacing-6)] py-[var(--spacing-3)] text-[var(--text-base)] text-white placeholder-white/60 outline-none border-none focus:ring-0 disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-[var(--spacing-2)] rounded-[var(--radius-full)] bg-white px-[var(--spacing-5)] py-[var(--spacing-3)] text-[var(--text-base)] font-[var(--font-semibold)] text-[var(--violet-900)] shadow-md transition-all duration-[var(--duration-normal)] ease-[var(--ease-default)] hover:bg-white/95 hover:scale-[1.02] active:scale-95 disabled:opacity-75 cursor-pointer whitespace-nowrap"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-[var(--violet-900)] border-t-transparent rounded-full animate-spin" />
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
            <div className="mt-[var(--spacing-5)] inline-flex items-center gap-[var(--spacing-2.5)] px-[var(--spacing-5)] py-[var(--spacing-2.5)] rounded-[var(--radius-full)] bg-[var(--color-success)]/20 backdrop-blur-md border border-[var(--color-success)]/40 text-white text-[var(--text-sm)] font-[var(--font-medium)] shadow-[var(--shadow-sm)] animate-fade-in">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-success)] text-white font-bold text-xs">✓</span>
              <span>{lang === "ar" ? "تم الاشتراك بنجاح، شكراً لانضمامك!" : "Successfully subscribed, thanks for joining!"}</span>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}