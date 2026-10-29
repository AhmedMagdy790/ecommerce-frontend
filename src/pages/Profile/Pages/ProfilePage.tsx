
import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ArrowRight, UserRound } from "lucide-react";

import { ROUTES } from "@/constants/navigation";
import { ProfileSkeleton } from "../components/ProfileSkeleton";
import { useProfile } from "../hooks/useProfile";
import { useLang } from "@/shared/context/LanguageContext";
import { useAuthStore } from "@/features/auth/model/store/useAuthStore";

const ProfileInfoForm = lazy(
  () => import("../components/ProfileInfoForm"),
);

export default function ProfilePage() {
  const {
    isSaving,
    updateProfile,
  } = useProfile();

  const profile = useAuthStore((state) => state.user);
  const isInitialized = useAuthStore(
    (state) => state.isInitialized,
  );


  const { t } = useTranslation("profile");
  const { isRTL } = useLang();

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

 
  if (!isInitialized) {
    return <ProfileSkeleton />;
  }

  return (
    <main className="min-h-[80vh] bg-background py-6 sm:py-8 lg:py-10">
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
            <UserRound className="size-5" aria-hidden="true" />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
            {t("sections.info.title", {
              defaultValue: "Personal information",
            })}
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary sm:text-base">
            {t("sections.info.description", {
              defaultValue:
                "Manage your name, email address, and phone number.",
            })}
          </p>
        </header>

        <section className="min-w-0 overflow-hidden rounded-panel border border-border bg-surface p-4 shadow-sm sm:p-6 lg:p-8">
          <Suspense
            fallback={
              <div
                className="space-y-4"
                role="status"
                aria-label={t("loading", {
                  defaultValue: "Loading",
                })}
              >
                <span className="sr-only">
                  {t("loading", { defaultValue: "Loading" })}
                </span>
                <div className="h-6 w-1/3 animate-pulse rounded-control bg-surface-secondary" />
                <div className="h-4 w-full animate-pulse rounded-control bg-surface-secondary" />
                <div className="h-4 w-2/3 animate-pulse rounded-control bg-surface-secondary" />
                <div className="h-24 w-full animate-pulse rounded-panel bg-surface-secondary" />
              </div>
            }
          >
            <ProfileInfoForm
              profile={profile}
              onSave={updateProfile}
              isSaving={isSaving}
            />
          </Suspense>
        </section>
      </div>
    </main>
  );
}