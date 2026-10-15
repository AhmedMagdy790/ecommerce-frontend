import React from "react";
import { SidebarProvider, useSidebar } from "@/app/providers/SidebarContext";
import { Outlet } from "react-router";
import AppHeader from "../shell/AppHeader";
import AppSidebar from "../../shared/components/sidebar/AppSidebar";
import { useLang } from "@/shared/context/LanguageContext";
import { cn } from "@/lib/utils";

const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered } = useSidebar();
  const { dir } = useLang();

  const isSidebarOpen = isExpanded || isHovered;

  const sidebarCurrentWidth = isSidebarOpen
    ? "var(--sidebar-width)"
    : "var(--sidebar-collapsed-width)";

  return (
    <div className="min-h-screen flex w-full overflow-x-hidden bg-[var(--color-background)] relative">
      <AppSidebar />

      <div 
        className={cn(
          "w-full flex flex-col min-w-0 transition-all duration-300 ease-in-out transform-gpu",
          dir === "rtl"
            ? "md:mr-[var(--current-sidebar-width)] md:w-[calc(100%-var(--current-sidebar-width))]"
            : "md:ml-[var(--current-sidebar-width)] md:w-[calc(100%-var(--current-sidebar-width))]"
        )}
        style={{
          // تعريف متغير CSS ديناميكي ليستخدمه Tailwind في الـ Classes بالأعلى
          "--current-sidebar-width": sidebarCurrentWidth,
        } as React.CSSProperties}
      >
        <AppHeader />

        <main className="flex-1 flex flex-col">
          <section className="mx-auto max-w-(--container-2xl) p-4 md:p-6 w-full">
            <Outlet />
          </section>
        </main>
      </div>
    </div>
  );
};

const DashboardLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default DashboardLayout;