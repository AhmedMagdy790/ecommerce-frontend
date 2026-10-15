import React from "react";
import { Link } from "react-router";
import { ChevronDownIcon } from "@/assets/icons";
import type { NavItem } from "../../../constants/sidebarData";

export const SidebarItemRow = React.memo(({
  nav,
  index,
  menuType,
  showText,
  isOpen,
  isActive,
  onSubmenuToggle,
}: {
  nav: NavItem;
  index: number;
  menuType: "main" | "others";
  showText: boolean;
  isOpen: boolean;
  isActive: (path: string) => boolean;
  onSubmenuToggle: (index: number, menuType: "main" | "others") => void;
}) => {
  const isMainActive = nav.path ? isActive(nav.path) : false;
  const hasActiveSubItem = nav.subItems?.some((subItem) => isActive(subItem.path)) ?? false;
  const isAnyActive = isMainActive || hasActiveSubItem || isOpen;

  return (
    <li>
      {nav.subItems ? (
       <button
          onClick={() => onSubmenuToggle(index, menuType)}
          className={`menu-item group min-w-full overflow-hidden text-[var(--color-white)] ${
            isAnyActive ? "menu-item-active" : "menu-item-inactive"
          } cursor-pointer ${!showText ? "md:justify-center" : "md:justify-start"}`}
        >
          <span
            className={`menu-item-icon-size ${
              isAnyActive ? "menu-item-icon-active" : "menu-item-icon-inactive"
            }`}
          >
            {nav.icon}
          </span>
          {showText && <span className="menu-item-text text-nowrap">{nav.name}</span>}
          {showText && (
            <ChevronDownIcon
              className={`ms-auto w-3 h-3 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          )}
        </button>
      ) : (
        nav.path && (
          <Link
            to={nav.path}
            className={`menu-item group ${
              isMainActive ? "menu-item-active" : "menu-item-inactive"
            }`}
          >
            <span
              className={`menu-item-icon-size ${
                isMainActive
                  ? "menu-item-icon-active"
                  : "menu-item-icon-inactive"
              }`}
            > 
              {nav.icon}
            </span>
            {showText && <span className="menu-item-text">{nav.name}</span>}
          </Link>
        )
      )}

      {nav.subItems && showText && (
        <div
          className={`submenu-container ${isOpen ? "open" : ""}`}
        >
          <ul className="mt-2 space-y-1 ms-9">
            
            {nav.subItems.map((subItem) => {
              const isSubActive = isActive(subItem.path);
              
              return (
                <li key={subItem.path || subItem.name}>
                  <Link
                    to={subItem.path}
                    className={`menu-dropdown-item text-nowrap overflow-hidden ${
                      isSubActive
                        ? "menu-dropdown-item-active"
                        : "menu-dropdown-item-inactive"
                    }`}
                  >
                    {subItem.name}
                    <span className="flex items-center gap-1 ms-auto">
                      {(subItem.new || subItem.pro) && (
                        <span
                          className={`ms-auto ${
                            isSubActive
                              ? "menu-dropdown-badge-active"
                              : "menu-dropdown-badge-inactive"
                          } menu-dropdown-badge`}
                        >
                          {subItem.new ? "new" : "pro"}
                        </span>
                      )}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </li>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.isOpen === nextProps.isOpen &&
    prevProps.showText === nextProps.showText &&
    prevProps.nav === nextProps.nav &&
    prevProps.isActive === nextProps.isActive
  );
});

SidebarItemRow.displayName = "SidebarItemRow";