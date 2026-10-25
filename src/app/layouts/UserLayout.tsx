import { Outlet } from "react-router-dom";
import { useLang } from "@/shared/context/LanguageContext";

import Topbar from "../shell/Topbar";
import Navbar from "../shell/Navbar";
import Footer from "../shell/Footer";
import { Container } from "@/shared/components/layout/Container";

export default function UserLayout() {
  const { isRTL } = useLang();

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="flex min-h-screen flex-col bg-background text-text-primary transition-colors duration-200"
    >
      <header className="sticky top-0 z-[var(--z-header)] w-full border-b border-header-border bg-header/90 shadow-xs backdrop-blur-xl">
        <Topbar />
        <Navbar />
      </header>

      <main
        id="main-content"
        className="w-full min-w-0 flex-1 overflow-x-clip py-8"
      >
        <Container>
          <Outlet />
        </Container>
      </main>

      <Footer />
    </div>
  );
}