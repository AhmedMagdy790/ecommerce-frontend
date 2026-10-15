import React from "react";
import { HorizontaLDots } from "@/assets/icons";
import type { NavItem } from "../../../constants/sidebarData";
import { SidebarItemRow } from "./SidebarItemRow";

type OpenSubmenuState = {
  type: "main" | "others";
  index: number;
} | null;

type SidebarMenuSectionProps = {
  title: string;
  items: NavItem[];
  menuType: "main" | "others";
  isExpanded: boolean;
  isHovered: boolean;
  isMobileOpen: boolean;
  openSubmenu: OpenSubmenuState;
  isActive: (path: string) => boolean;
  onSubmenuToggle: (index: number, menuType: "main" | "others") => void;
};

export const SidebarMenuSection: React.FC<SidebarMenuSectionProps> = React.memo(({
  title,
  items,
  menuType,
  isExpanded,
  isHovered,
  isMobileOpen,
  openSubmenu,
  isActive,
  onSubmenuToggle,
}) => {
  const showText = isExpanded || isHovered || isMobileOpen;

  return (
    <div>
      <h2
        className={`mb-4 px-2 text-xs uppercase flex leading-[20px] text-gray-400 ${
          !showText ? "justify-center" : "justify-start"
        }`}
      >
        {showText ? title : <HorizontaLDots className="size-6" />}
      </h2>
      <ul className="flex flex-col gap-4">
        {items.map((nav, index) => {
          const isOpen = openSubmenu?.type === menuType && openSubmenu?.index === index;

          return (
            <SidebarItemRow
              key={nav.name}
              nav={nav}
              index={index}
              menuType={menuType}
              showText={showText}
              isOpen={isOpen}
              isActive={isActive}
              onSubmenuToggle={onSubmenuToggle}
            />
          );
        })}
      </ul>
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.title === nextProps.title &&
    prevProps.isExpanded === nextProps.isExpanded &&
    prevProps.isHovered === nextProps.isHovered &&
    prevProps.isMobileOpen === nextProps.isMobileOpen &&
    prevProps.items === nextProps.items &&
    prevProps.openSubmenu === nextProps.openSubmenu
  );
});

SidebarMenuSection.displayName = "SidebarMenuSection";