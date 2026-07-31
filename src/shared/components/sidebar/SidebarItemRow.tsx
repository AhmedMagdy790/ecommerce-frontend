import React from "react";
import { Link } from "react-router";
import { ChevronDownIcon } from "@/assets/icons";
import type { NavItem } from "./sidebarData";


export const SidebarItemRow = React.memo(({
  nav,
  index,
  menuType,
  showText,
  isOpen,
  keyStr,
  subMenuHeight,
  subMenuRefs,
  isActive,
  onSubmenuToggle,
}: {
  nav: NavItem;
  index: number;
  menuType: "main" | "others";
  showText: boolean;
  isOpen: boolean;
  keyStr: string;
  subMenuHeight: Record<string, number>;
  subMenuRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
  isActive: (path: string) => boolean;
  onSubmenuToggle: (index: number, menuType: "main" | "others") => void;
}) => {
  return (
    <li>
      {nav.subItems ? (
        <button
          onClick={() => onSubmenuToggle(index, menuType)}
          className={`menu-item group min-w-full overflow-hidden ${
            isOpen ? "menu-item-active" : "menu-item-inactive"
          } cursor-pointer ${!showText ? "lg:justify-center" : "lg:justify-start"}`}
        >
          <span
            className={`menu-item-icon-size ${
              isOpen ? "menu-item-icon-active" : "menu-item-icon-inactive"
            }`}
          >
            {nav.icon}
          </span>
          {showText && <span className="menu-item-text text-nowrap">{nav.name}</span>}
          {showText && (
            <ChevronDownIcon
              className={`ms-auto w-5 h-5 transition-transform duration-200 ${
                isOpen ? "rotate-180 text-[var(--color-primary)]" : ""
              }`}
            />
          )}
        </button>
      ) : (
        nav.path && (
          <Link
            to={nav.path}
            className={`menu-item group ${
              isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
            }`}
          >
            <span
              className={`menu-item-icon-size ${
                isActive(nav.path)
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

      {nav.subItems && (showText) && (
        <div
          ref={(el) => {
            subMenuRefs.current[keyStr] = el;
          }}
          className="overflow-hidden transition-all duration-[var(--duration-normal)]"
          style={{
            height: isOpen ? `${subMenuHeight[keyStr] || 0}px` : "0px",
          }}
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
    prevProps.subMenuHeight[prevProps.keyStr] === nextProps.subMenuHeight[nextProps.keyStr] &&
    prevProps.nav === nextProps.nav
  );
});

SidebarItemRow.displayName = "SidebarItemRow";