
import { Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";

import { ROUTES } from "@/constants/navigation";
import { useLang } from "@/shared/context/LanguageContext";
import { Container } from "@/shared/components/layout/Container";

const SecuritySection = lazy(
  () => import("../components/SecuritySection"),
);

function SecuritySkeleton() {
  return (
    <div className="animate-pulse space-y-5" role="status">
      <span className="sr-only">
        {`Loading security settings...`}
      </span>

      <div className="h-5 w-1/3 rounded-md bg-surface-secondary" />

      <div className="space-y-2">
        <div className="h-4 w-1/4 rounded-md bg-surface-secondary" />
        <div className="h-11 w-full rounded-control bg-surface-secondary" />
      </div>

      <div className="space-y-2">
        <div className="h-4 w-1/4 rounded-md bg-surface-secondary" />
        <div className="h-11 w-full rounded-control bg-surface-secondary" />
      </div>

      <div className="h-11 w-32 rounded-control bg-surface-secondary" />
    </div>
  );
}

export default function SecurityPage() {
  const { t } = useTranslation("profile");
  const { isRTL } = useLang();

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  return (
    <main className="min-h-[80vh] bg-background py-6 sm:py-8 lg:py-10">
      <Container>
        <div className="mx-auto w-full max-w-4xl">
          <nav
            aria-label={t("overview.breadcrumbLabel", {
              defaultValue: "Breadcrumb",
            })}
            className="mb-6"
          >
            <Link
              to={ROUTES.SETTINGS}
              className="
                inline-flex items-center gap-2 rounded-md
                text-sm font-medium text-text-secondary
                transition-colors hover:text-text-primary
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-primary focus-visible:ring-offset-2
              "
            >
              <BackIcon className="size-4" aria-hidden="true" />
              {t("overview.title", {
                defaultValue: "Your Account",
              })}
            </Link>
          </nav>

          <header className="mb-6 sm:mb-8">
            <div className="mb-3 flex size-11 items-center justify-center rounded-xl border border-border bg-surface text-text-secondary">
              <ShieldCheck className="size-5" aria-hidden="true" />
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
              {t("sections.security.title", {
                defaultValue: "Password and security",
              })}
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary sm:text-base">
              {t("sections.security.description", {
                defaultValue:
                  "Update your password to help keep your account secure.",
              })}
            </p>
          </header>

          <section
            aria-label={t("sections.security.title", {
              defaultValue: "Password and security",
            })}
            className="min-w-0 rounded-panel border border-border bg-surface p-4 shadow-sm sm:p-6 lg:p-8"
          >
            <Suspense fallback={<SecuritySkeleton />}>
              <SecuritySection />
            </Suspense>
          </section>
        </div>
      </Container>
    </main>
  );
}