import React from "react";
import { Link } from "react-router";
import logoDark from "@/assets/images/logos/dark1-logo.svg";
import logo from "@/assets/images/logos/logo-adminmart.svg";
import { useTheme } from "@/app/providers/ThemeContext";

type SidebarLogoProps = {
  isExpanded: boolean;
  isHovered: boolean;
  isMobileOpen: boolean;
};

export const SidebarLogo: React.FC<SidebarLogoProps> = ({
  isExpanded,
  isHovered,
  isMobileOpen,
}) => {
  const showFullLogo = isExpanded || isHovered || isMobileOpen;
  const { resolvedTheme } = useTheme();

  return (
    <div className={`py-4 px-2  flex ${!showFullLogo ? "lg:justify-center" : "justify-start"}`}>
      <Link to="/">
        {showFullLogo ? (
          <>
            <img className={resolvedTheme === "dark" ? 'hidden' : ""} src={logo} alt="Logo" width={150} height={40} />
            <img className={resolvedTheme === "dark" ? 'block' : 'hidden'} src={logoDark} alt="Logo" width={150} height={40} />
          </>
        ) : (
          <img src="/images/logo/logo-icon.svg" alt="Logo" width={32} height={32} />
        )}
      </Link>
    </div>
  );
};