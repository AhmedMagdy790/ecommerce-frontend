import { NavLink } from "react-router-dom";
import { NAV_LINKS } from "@/constants/navigation";

export default function DesktopMenu() {
  return (
    <nav
      className="hidden lg:flex items-center gap-8"
      aria-label="Main navigation"
    >
      {NAV_LINKS.map((link) => (
        <NavLink
          key={link.name}
          to={link.href}
          className={({ isActive }) =>
            `
              relative
              py-2
              text-sm
              font-medium
              transition-colors
              ${
                isActive
                  ? "text-primary"
                  : "text-text-secondary hover:text-text-primary"
              }
            `
          }
        >
          {({ isActive }) => (
            <>
              {link.name}

              <span
                className={`
                  absolute
                  -bottom-1
                  left-0
                  h-0.5
                  w-full
                  origin-left
                  rounded-full
                  bg-primary
                  transition-transform
                  ${
                    isActive
                      ? "scale-x-100"
                      : "scale-x-0"
                  }
                `}
              />
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}