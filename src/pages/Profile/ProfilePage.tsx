
import { lazy, Suspense, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { ProfileSkeleton } from "./components/ProfileSkeleton";
import { ProfileSidebar } from "./components/ProfileSidebar";
import { PROFILE_TABS, type TabKey } from "@/constants/profile-tabs";
import { useProfile } from "./hooks/useProfile";
import { Container } from "@/shared/components/layout/Container";

const OrdersSection = lazy(() => import("./components/OrdersSection"));
const SecuritySection = lazy(() => import("./components/SecuritySection"));
const ProfileInfoForm = lazy(() => import("./components/ProfileInfoForm"));

export default function ProfilePage() {
  const { profile, isLoading, isSaving, updateProfile } = useProfile();
  const [activeTab, setActiveTab] = useState<TabKey>("info");
  const { t } = useTranslation("profile");

  const tabs = useMemo(
    () =>
      PROFILE_TABS.map((tab) => ({
        ...tab,
        label: t(tab.label),
        description: t(tab.description),
      })),
    [t],
  );

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <main className="min-h-[80vh] py-8">
      <Container>
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">
            {t("title")}
          </h1>

          <p className="mt-1 text-sm text-text-secondary">
            {t("description")}
          </p>
        </header>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <ProfileSidebar
              tabs={tabs}
              activeTab={activeTab}
              onSelectTab={setActiveTab}
            />
          </aside>


          <section
            id={`panel-${activeTab}`}
            role="tabpanel"
            aria-labelledby={`tab-${activeTab}`}
            tabIndex={0}
            className="
              min-w-0 rounded-panel border border-border
              bg-surface p-6 shadow-sm transition-colors
              lg:col-span-8 lg:p-8
            "
          >
            <Suspense
              fallback={
                <div
                  className="space-y-4"
                  role="status"
                  aria-label={t("loading")}
                >
                  <div className="h-6 w-1/3 animate-pulse rounded-control bg-surface-secondary" />
                  <div className="h-4 w-full animate-pulse rounded-control bg-surface-secondary" />
                  <div className="h-4 w-2/3 animate-pulse rounded-control bg-surface-secondary" />
                </div>
              }
            >
              {activeTab === "info" && (
                <ProfileInfoForm
                  profile={profile}
                  onSave={async (data) => {
                    await updateProfile(data);
                  }}
                  isSaving={isSaving}
                />
              )}

              {activeTab === "security" && <SecuritySection />}

              {activeTab === "orders" && <OrdersSection />}
            </Suspense>
          </section>
        </div>
      </Container>
    </main>
  );
}
