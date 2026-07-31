import { lazy, Suspense, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ProfileSkeleton } from "./components/ProfileSkeleton";
import { ProfileSidebar } from "./components/ProfileSidebar";
import { PROFILE_TABS, type TabKey } from "@/constants/profile-tabs";
import { useProfile } from "./hooks/useProfile";

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
    [t]
  );

  const tabContent: Record<TabKey, React.ReactNode> = {
    info: (
      <ProfileInfoForm
        profile={profile}
        onSave={updateProfile}
        isSaving={isSaving}
      />
    ),
    security: <SecuritySection />,
    orders: <OrdersSection />,
  };

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <main 
      className="mx-auto px-4 py-8 min-h-[80vh]"
      style={{ maxWidth: "var(--container-2xl)" }}
    >
      {/* Header الرئيسي */}
      <header className="mb-8">
        <h1 
          className="tracking-tight"
          style={{ 
            fontSize: "var(--text-3xl)", 
            fontWeight: "var(--font-bold)", 
            color: "var(--color-text-primary)" 
          }}
        >
          {t("title")}
        </h1>
        <p 
          className="mt-1"
          style={{ 
            fontSize: "var(--text-sm)", 
            color: "var(--color-text-secondary)" 
          }}
        >
          {t("description")}
        </p>
      </header>

      {/* المحتوى الرئيسي: Sidebar + المحتوى المتغير */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* الـ Sidebar يأخذ 4 أعمدة */}
        <div className="lg:col-span-4">
          <ProfileSidebar
            tabs={tabs}
            activeTab={activeTab}
            onSelectTab={setActiveTab}
          />
        </div>

        {/* محتوى التبويب يأخذ 8 أعمدة مع مطابقة متغيرات الـ Theme */}
        <div 
          className="lg:col-span-8 p-6 lg:p-8 transition-all"
          style={{ 
            backgroundColor: "var(--color-surface)", 
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-2xl)",
            boxShadow: "var(--shadow-sm)"
          }}
        >
          <Suspense fallback={<ProfileSkeleton />}>
            {tabContent[activeTab]}
          </Suspense>
        </div>
      </div>
    </main>
  );
}