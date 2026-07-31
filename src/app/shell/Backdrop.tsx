import React from "react";
import { useSidebar } from "@/app/providers/SidebarContext";

const Backdrop: React.FC = () => {
  const { isMobileOpen, toggleMobileSidebar } = useSidebar();

  if (!isMobileOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[var(--z-modal-backdrop)] bg-gray-900/50 backdrop-blur-xs lg:hidden transition-opacity duration-300"
      onClick={toggleMobileSidebar}
    />
  );
};

export default Backdrop;