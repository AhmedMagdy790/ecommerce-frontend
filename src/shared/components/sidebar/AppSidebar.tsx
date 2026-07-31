import React, { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { useLocation } from "react-router";
import { useSidebar } from "@/app/providers/SidebarContext";
import { navItems, othersItems } from "./sidebarData";
import { SidebarLogo } from "./SidebarLogo";
import { SidebarMenuSection } from "./SidebarMenuSection";
import { useLang } from "@/shared/context/LanguageContext";

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered, toggleMobileSidebar } = useSidebar();
  const location = useLocation();
  const { dir } = useLang();

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  // Match submenus based on current route path
  useEffect(() => {
    let submenuMatched = false;
    const menuConfigs = [
      { type: "main" as const, items: navItems },
      { type: "others" as const, items: othersItems },
    ];

    menuConfigs.forEach(({ type, items }) => {
      items.forEach((nav, index) => {
        nav.subItems?.forEach((subItem) => {
          if (isActive(subItem.path)) {
            setOpenSubmenu({ type, index });
            submenuMatched = true;
          }
        });
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location.pathname, isActive]);

  // Recalculate submenu height dynamically for animations
  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      const element = subMenuRefs.current[key];
      if (element) {
        setSubMenuHeight((prev) => ({
          ...prev,
          [key]: element.scrollHeight,
        }));
      }
    }
  }, [openSubmenu]);

  // استخدام useCallback لمنع تغير مرجع الدالة مع كل رندر
  const handleSubmenuToggle = useCallback((index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prev) =>
      prev?.type === menuType && prev?.index === index ? null : { type: menuType, index }
    );
  }, []);

  const showFullSidebar = isExpanded || isHovered || isMobileOpen;

  // Correcting mobile translate logic based on direction (RTL vs LTR)
  const getMobileTranslateClass = () => {
    if (isMobileOpen) {
      return "translate-x-0";
    }
    if (dir === "rtl") {
      return "translate-x-full";
    }
    return "-translate-x-full";
  };

  const handleMouseEnter = useCallback(() => {
    if (!isExpanded) setIsHovered(true);
  }, [isExpanded, setIsHovered]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, [setIsHovered]);

  return (
    <aside
      className={`fixed 
        top-[calc(var(--header-height)_+_1px)] lg:top-0
        px-1 md:px-2 flex flex-col 
        h-[calc(100vh-var(--header-height))] md:h-screen
        bg-[var(--color-background)] dark:bg-[var(--color-surface)] transition-all duration-300 ease-in-out
        text-[var(--color-text-primary)] dark:text-[var(--color-text-primary)]
        border-e border-[var(--color-border)] inset-s-0 z-[var(--z-sidebar)]
        ${showFullSidebar ? "w-[var(--sidebar-width)]" : "w-[var(--sidebar-collapsed-width)]"}
        ${getMobileTranslateClass()}
        md:translate-x-0`}
    >
      <SidebarLogo 
        isExpanded={isExpanded} 
        isHovered={isHovered} 
        isMobileOpen={isMobileOpen} 
      />

      <div 
        className="flex flex-col overflow-y-auto sidebar-scroll duration-300 ease-linear"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <nav className="mb-6 min-h-dvh px-2">
          <div className="flex flex-col gap-4">
            <SidebarMenuSection
              title="Menu"
              items={navItems}
              menuType="main"
              isExpanded={isExpanded}
              isHovered={isHovered}
              isMobileOpen={isMobileOpen}
              openSubmenu={openSubmenu}
              subMenuHeight={subMenuHeight}
              subMenuRefs={subMenuRefs}
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
              subMenuHeight={subMenuHeight}
              subMenuRefs={subMenuRefs}
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