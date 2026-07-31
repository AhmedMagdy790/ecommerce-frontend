import React from "react";
import { SidebarProvider, useSidebar } from "@/app/providers/SidebarContext";
import { Outlet } from "react-router";
import AppHeader from "../shell/AppHeader";
// import Backdrop from "../shell/Backdrop";
import AppSidebar from "../../shared/components/sidebar/AppSidebar";

const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered } = useSidebar();


  return (
    <div className="min-h-screen lg:flex">
      <AppSidebar />

      <main
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isExpanded || isHovered
            ? "lg:ms-[var(--sidebar-width)]"
            : "lg:ms-[var(--sidebar-collapsed-width)]"
        }`}
      >
        <AppHeader />

        <div className="mx-auto max-w-(--container-2xl) p-4 md:p-6">
          <Outlet />
        </div>
      </main>

      {/* <Backdrop /> */}
    </div>
  );
};

const DashboardLayout:  React.FC = () => {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default DashboardLayout;