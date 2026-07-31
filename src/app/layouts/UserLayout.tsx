// src/components/layout/UserLayout.tsx

import { Outlet } from "react-router-dom";
import { useLang } from "@/shared/context/LanguageContext";

import Topbar from "../shell/Topbar";
import Navbar from "../shell/Navbar";
import Footer from "../shell/Footer";
import { AuthProvider } from "@/app/providers/AuthProvider";

export default function UserLayout() {
  const { isRTL } = useLang();

  return (
    <AuthProvider>
      <div
        dir={isRTL ? "rtl" : "ltr"}
        className="flex min-h-screen flex-col bg-[var(--color-background)] text-[var(--color-text-primary)] transition-colors duration-[var(--duration-normal)]"
      >
        {/* Sticky Header with Backdrop Blur and Cinematic Polish */}
        <header 
          className="sticky top-0 w-full z-[var(--z-header)] bg-[var(--header-bg)]/90 backdrop-blur-xl border-b border-[var(--header-border)] shadow-[var(--shadow-xs)]"
        >
          <Topbar />
          <Navbar />
        </header>

        {/* Main Content Area */}
        <main
          id="main-content"
          className="flex-1 w-full overflow-x-hidden py-[var(--spacing-8)]"
        >
          <div className="w-full mx-auto max-w-[var(--container-2xl)] px-[var(--spacing-4)] sm:px-[var(--spacing-6)] lg:px-[var(--spacing-8)]">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </AuthProvider>
  );
}