import React, { createContext, useCallback, useContext, useState, useMemo } from "react";
import { useIsMobile } from "./useIsMobile";

type SidebarItem = "dashboard" | "orders" | "products" | "settings";

type SidebarContextType = {
  isExpanded: boolean;
  isMobileOpen: boolean;
  isHovered: boolean;
  activeItem: SidebarItem | null;
  openSubmenu: string | null;
  toggleSidebar: () => void;
  toggleMobileSidebar: () => void;
  setIsHovered: (isHovered: boolean) => void;
  setActiveItem: (item: SidebarItem | null) => void;
  toggleSubmenu: (item: string) => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

// This hook intentionally shares the provider's context from this module.
// eslint-disable-next-line react-refresh/only-export-components
export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const isMobile = useIsMobile();

  // الحالة للديسكتوب (مبدئياً مفتوحة لضمان عدم حدوث وميض أو تمركز خاطئ)
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  // الحالة خاصة بالموبايل فقط
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [activeItem, setActiveItem] = useState<SidebarItem | null>(null);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const toggleSidebar = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);


  const toggleMobileSidebar = useCallback(() => {
    setIsMobileOpen((prev) => !prev);
  }, []);

  const toggleSubmenu = useCallback((item: string) => {
    setOpenSubmenu((prev) => (prev === item ? null : item));
  }, []);

  const visibleMobileOpen = isMobile && isMobileOpen;

  const value = useMemo(
    () => ({
      // على الموبايل نعتمد كلياً على isMobileOpen، وعلى الديسكتوب نعتمد على isExpanded
      isExpanded,
      isMobileOpen: visibleMobileOpen,
      isHovered,
      activeItem,
      openSubmenu,
      toggleSidebar,
      toggleMobileSidebar,
      setIsHovered,
      setActiveItem,
      toggleSubmenu,
    }),
    [
      isExpanded,
      visibleMobileOpen,
      isHovered,
      activeItem,
      openSubmenu,
      toggleSidebar,
      toggleMobileSidebar,
      toggleSubmenu,
    ]
  );

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
};