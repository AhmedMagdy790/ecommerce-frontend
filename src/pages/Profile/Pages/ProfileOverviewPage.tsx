
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  UserRound,
  ShieldCheck,
  Package,
  ChevronRight,
  ChevronLeft,
  Settings2,
} from "lucide-react";

import { ROUTES } from "@/constants/navigation";
import { useLang } from "@/shared/context/LanguageContext";

export default function ProfileOverviewPage() {
  const { t } = useTranslation("profile");
  const { isRTL } = useLang();

  const sections = [
    {
      id: "orders",
      title: t("overview.orders.title", {
        defaultValue: "Your orders",
      }),
      description: t("overview.orders.description", {
        defaultValue: "Track orders and review your purchase history.",
      }),
      to: ROUTES.SETTINGS_ORDERS,
      icon: Package,
    },
    {
      id: "info",
      title: t("overview.personalInfo.title", {
        defaultValue: "Login & personal information",
      }),
      description: t("overview.personalInfo.description", {
        defaultValue: "Manage your name, email address, and phone number.",
      }),
      to: ROUTES.SETTINGS_PROFILE,
      icon: UserRound,
    },
    {
      id: "security",
      title: t("overview.security.title", {
        defaultValue: "Security",
      }),
      description: t("overview.security.description", {
        defaultValue: "Update your password and protect your account.",
      }),
      to: ROUTES.SETTINGS_SECURITY,
      icon: ShieldCheck,
    },
  ];

  const DirectionIcon = isRTL ? ChevronLeft : ChevronRight;

  return (
    <main className="min-h-[80vh] py-6 sm:py-10">
      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-8 sm:mb-10">
          <div className="mb-3 flex size-12 items-center justify-center rounded-xl border border-border bg-surface text-text-secondary">
            <Settings2 className="size-6" aria-hidden="true" />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
            {t("overview.title", {
              defaultValue: "Your Account",
            })}
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary sm:text-base">
            {t("overview.description", {
              defaultValue:
                "Manage your orders, personal information, and account security.",
            })}
          </p>
        </header>

        <section
          aria-label={t("overview.sectionsTitle", {
            defaultValue: "Your account options",
          })}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
        >
          {sections.map((section) => {
            const Icon = section.icon;

            return (
              <Link
                key={section.id}
                to={section.to}
                className="
                  group flex min-w-0 items-start gap-4 rounded-xl
                  border border-border bg-surface p-4
                  transition-colors hover:border-primary/40
                  hover:bg-surface-secondary
                  focus-visible:outline-none focus-visible:ring-2
                  focus-visible:ring-primary focus-visible:ring-offset-2
                  sm:p-5
                "
              >
                <span
                  className="
                    flex size-11 shrink-0 items-center justify-center
                    rounded-lg border border-border bg-background
                    text-text-secondary transition-colors
                    group-hover:border-primary/30 group-hover:text-primary
                  "
                >
                  <Icon className="size-5" aria-hidden="true" />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-text-primary sm:text-base">
                    {section.title}
                  </span>

                  <span className="mt-2 block text-sm leading-6 text-text-secondary">
                    {section.description}
                  </span>
                </span>

                <DirectionIcon
                  className="mt-1 size-4 shrink-0 text-text-muted transition-colors group-hover:text-text-primary"
                  aria-hidden="true"
                />
              </Link>
            );
          })}
        </section>
      </div>
    </main>
  );
}