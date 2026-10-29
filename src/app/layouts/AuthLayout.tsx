import { Link, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLang } from "@/shared/context/LanguageContext";
import LanguageSwitcher from "@/app/shell/Navbar/LanguageSwitcher";
import { ShieldCheck, Zap, Heart, Store } from "lucide-react";

export default function AuthLayout() {
  const { isRTL } = useLang();
  const { t } = useTranslation();

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen bg-background text-text-primary"
    >
      <header className="relative z-10 flex h-20 items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link
          to="/"
          aria-label={t("common.home", "Home")}
          className="flex items-center gap-2"
        >
          <img
            src="/assets/logo.svg"
            alt={t("common.logo", "Logo")}
            className="h-9 w-auto"
          />
        </Link>

        <LanguageSwitcher />
      </header>

      <main className="mx-auto grid min-h-[calc(100vh-10rem)] w-full max-w-[1440px] grid-cols-1 items-center gap-8 px-5 py-8 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:px-12 lg:py-10">
        {/* Brand panel */}
        <section className="relative hidden min-h-[650px] flex-col justify-between overflow-hidden rounded-[2rem] bg-primary-soft p-10 lg:flex xl:p-14">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -end-24 -top-24 h-80 w-80 rounded-full bg-primary/10 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-32 -start-20 h-96 w-96 rounded-full bg-primary/15 blur-3xl"
          />

          <div className="relative z-10 max-w-lg">
            <span className="mb-5 inline-flex rounded-full border border-primary/20 bg-background/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              {t("auth.brandEyebrow", "Welcome to our store")}
            </span>

            <h1 className="text-4xl font-bold leading-tight tracking-tight xl:text-5xl">
              {t("auth.brandTitle", "Your journey starts")}{" "}
              <span className="text-primary">
                {t("auth.brandHighlight", "here")}
              </span>
            </h1>

            <p className="mt-5 max-w-md text-base leading-8 text-text-secondary">
              {t(
                "auth.brandDescription",
                "Sign in to access your account and manage your shopping experience with ease."
              )}
            </p>
          </div>

          <div className="relative z-10 my-10 flex min-h-48 items-center justify-center">
            <div className="relative flex h-52 w-52 items-center justify-center rounded-[2.5rem] border border-white/70 bg-background/70 shadow-xl backdrop-blur-xl xl:h-60 xl:w-60">
              <div className="absolute inset-4 rounded-[2rem] border border-primary/10" />
              <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-primary text-white shadow-lg shadow-primary/25">
                <Store size={48} strokeWidth={1.5} />
              </div>
              <div className="absolute -end-5 top-8 rounded-2xl border border-border bg-background p-3 shadow-lg">
                <ShieldCheck className="text-primary" size={26} />
              </div>
              <div className="absolute -start-5 bottom-8 rounded-2xl border border-border bg-background p-3 shadow-lg">
                <Zap className="text-primary" size={26} />
              </div>
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-3 gap-4">
            {[
              {
                icon: ShieldCheck,
                title: t("auth.secure", "Secure"),
                description: t("auth.secureDescription", "Your data stays protected"),
              },
              {
                icon: Zap,
                title: t("auth.fast", "Fast"),
                description: t("auth.fastDescription", "A smooth experience"),
              },
              {
                icon: Heart,
                title: t("auth.reliable", "Reliable"),
                description: t("auth.reliableDescription", "Here when you need us"),
              },
            ].map(({ icon: Icon, title, description }) => (
              <div key={title} className="text-center">
                <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-background text-primary shadow-sm">
                  <Icon size={21} />
                </div>
                <h2 className="text-sm font-semibold">{title}</h2>
                <p className="mt-1 text-xs leading-5 text-text-secondary">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Auth form */}
        <section className="mx-auto w-full max-w-md">
          <Outlet />
        </section>
      </main>

      <footer className="px-5 py-5 text-center text-xs text-text-muted">
        {t("common.copyright", {
          year: new Date().getFullYear(),
          defaultValue: `© ${new Date().getFullYear()} All rights reserved.`,
        })}
      </footer>
    </div>
  );
}