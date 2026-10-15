import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router";
import { useSidebar } from "@/app/providers/SidebarContext";
import { navItems, othersItems } from "../../../constants/sidebarData";
import { SidebarLogo } from "./SidebarLogo";
import { SidebarMenuSection } from "./SidebarMenuSection";
import { useLang } from "@/shared/context/LanguageContext";

const HOVER_OPEN_DELAY = 350;
const HOVER_CLOSE_DELAY = 700;

type SubmenuState = { type: "main" | "others"; index: number } | null;

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const { dir } = useLang();

  const [submenuOverride, setSubmenuOverride] = useState<{
    pathname: string;
    value: SubmenuState;
  } | null>(null);

  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearHoverTimeout = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  }, []);

  // تنضيف الـ timeout لو الكومبوننت اتشال قبل ما الـ setTimeout يخلص
  useEffect(() => clearHoverTimeout, [clearHoverTimeout]);

  const isActive = useCallback(
    (path: string): boolean => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  // مطابقة الـ submenu المفتوح بناءً على المسار الحالي
  const routeSubmenu = useMemo<SubmenuState>(() => {
    const menuConfigs = [
      { type: "main" as const, items: navItems },
      { type: "others" as const, items: othersItems },
    ];

    for (const { type, items } of menuConfigs) {
      const matchedIndex = items.findIndex((nav) => {
        const isSubMatch = nav.subItems?.some((subItem) => isActive(subItem.path));
        const isMainMatch = nav.path ? isActive(nav.path) : false;
        return isSubMatch || isMainMatch;
      });

      if (matchedIndex !== -1) {
        return { type, index: matchedIndex };
      }
    }

    return null;
  }, [location.pathname, isActive]);

  const openSubmenu =
    submenuOverride?.pathname === location.pathname
      ? submenuOverride.value
      : routeSubmenu;

  const handleSubmenuToggle = useCallback((index: number, menuType: "main" | "others") => {
    setSubmenuOverride({
      pathname: location.pathname,
      value:
        openSubmenu?.type === menuType && openSubmenu.index === index
          ? null
          : { type: menuType, index },
    });
  }, [location.pathname, openSubmenu]);

  const showFullSidebar = Boolean(isExpanded || isHovered || isMobileOpen);
  const currentWidthClass = showFullSidebar
    ? "w-[var(--sidebar-width)]"
    : "w-[var(--sidebar-collapsed-width)]";

  const translateClasses = useMemo(() => {
    if (isMobileOpen) return "translate-x-0";
    return dir === "rtl"
      ? "md:translate-x-0 translate-x-full"
      : "md:translate-x-0 -translate-x-full";
  }, [isMobileOpen, dir]);

  const handleMouseEnter = useCallback(() => {
    if (isExpanded) return;

    clearHoverTimeout();
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(true);
    }, HOVER_OPEN_DELAY);
  }, [isExpanded, setIsHovered, clearHoverTimeout]);

  const handleMouseLeave = useCallback(() => {
    clearHoverTimeout();
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, HOVER_CLOSE_DELAY);
  }, [setIsHovered, clearHoverTimeout]);

  return (
    <aside
      aria-label="Sidebar navigation"
      className={`fixed 
        top-[calc(var(--header-height)_+_1px)] md:top-0
         flex flex-col 
        h-[calc(100vh-var(--header-height))] md:h-screen
        bg-[var(--color-background)] dark:bg-[var(--color-surface)] 
        transition-all duration-300 ease-in-out transform-gpu
        text-[var(--color-text-primary)] dark:text-[var(--color-text-primary)]
        z-[var(--z-sidebar)] overflow-hidden
        ${dir === "rtl" ? "border-s border-[var(--color-border)] right-0" : "border-e border-[var(--color-border)] left-0"}
        ${currentWidthClass}
        ${isMobileOpen ? "translate-x-0" : translateClasses}
      `}
    >
      <SidebarLogo
        isExpanded={isExpanded}
        isHovered={isHovered}
        isMobileOpen={isMobileOpen}
      />

      <div
        className="flex-1 flex flex-col overflow-y-auto sidebar-scroll duration-300 ease-linear pb-10"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <nav aria-label="Main menu" className="mb-6 px-2 pe-3 w-full">
          <div className="flex flex-col gap-2">
            <SidebarMenuSection
              title="Menu"
              items={navItems}
              menuType="main"
              isExpanded={isExpanded}
              isHovered={isHovered}
              isMobileOpen={isMobileOpen}
              openSubmenu={openSubmenu}
              isActive={isActive}
              onSubmenuToggle={handleSubmenuToggle}
            />

            <SidebarMenuSection
              title="Others"
              items={othersItems}
              menuType="others"
              isExpanded={isExpanded}
              isHovered={isHovered}
              isMobileOpen={isMobileOpen}
              openSubmenu={openSubmenu}
              isActive={isActive}
              onSubmenuToggle={handleSubmenuToggle}
            />
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;