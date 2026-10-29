
import { Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ArrowRight, Package } from "lucide-react";

import { ROUTES } from "@/constants/navigation";
import { useLang } from "@/shared/context/LanguageContext";

const OrdersSection = lazy(
  () => import("@/pages/Profile/components/OrdersSection"),
);

function OrdersSkeleton() {
  return (
    <div className="animate-pulse space-y-4" role="status">
      <span className="sr-only">Loading orders...</span>

      {Array.from({ length: 3 }, (_, index) => (
        <div
          key={index}
          className="space-y-3 rounded-xl border border-border p-4 sm:p-5"
        >
          <div className="h-5 w-1/3 rounded-md bg-surface-secondary" />
          <div className="h-4 w-2/3 rounded-md bg-surface-secondary" />
          <div className="h-10 w-full rounded-md bg-surface-secondary" />
        </div>
      ))}
    </div>
  );
}

export default function MyOrdersPage() {
  const { t } = useTranslation("profile");
  const { isRTL } = useLang();

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  return (
    <main className="min-h-[80vh] py-6 sm:py-10">
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
            <Package className="size-5" aria-hidden="true" />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
            {t("overview.orders.title", {
              defaultValue: "Your orders",
            })}
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary sm:text-base">
            {t("overview.orders.description", {
              defaultValue:
                "Track orders and review your purchase history.",
            })}
          </p>
        </header>

        <section aria-label={t("overview.orders.title", {
          defaultValue: "Your orders",
        })} className="min-w-0">
          <Suspense fallback={<OrdersSkeleton />}>
            <OrdersSection />
          </Suspense>
        </section>
      </div>
    </main>
  );
}