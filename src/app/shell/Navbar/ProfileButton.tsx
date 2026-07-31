// src/components/layout/ProfileButton.tsx

import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "react-i18next";
import { ROUTES } from "@/constants/navigation";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";
import { Dropdown } from "@/shared/components/dashboard/ui/dropdown/Dropdown";
import { DropdownItem } from "@/shared/components/dashboard/ui/dropdown/DropdownItem";
import { useLang } from "@/shared/context/LanguageContext";

export default function ProfileButton() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { user, isAuthenticated, logout } = useAuth();
  const { t } = useTranslation("common");
  const { lang, isRTL } = useLang();
  const navigate = useNavigate();

  const toggleDropdown = () => setIsOpen((prev) => !prev);
  const closeDropdown = () => setIsOpen(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Safe extraction of user name
  const userName = typeof user?.name === "string" ? user.name : "";
  const userInitial = userName ? userName.charAt(0).toUpperCase() : "";

  // If not authenticated, show a modern login button
  if (!isAuthenticated) {
    return (
      <Link
        to={ROUTES.LOGIN}
        dir={isRTL ? "rtl" : "ltr"}
        aria-label={t("auth.login")}
        className="inline-flex items-center justify-center h-10 px-[var(--spacing-5)] rounded-[var(--radius-xl)] bg-[var(--color-primary)] text-[var(--color-text-inverse)] text-[var(--text-sm)] font-[var(--font-semibold)] shadow-[var(--shadow-sm)] transition-all duration-[var(--duration-fast)] ease-[var(--ease-default)] hover:opacity-90 hover:scale-105 active:scale-95"
        style={{
          fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)",
        }}
      >
        {t("auth.login")}
      </Link>
    );
  }

  return (
    <div ref={containerRef} className="relative flex items-center" dir={isRTL ? "rtl" : "ltr"}>
      <button
        onClick={toggleDropdown}
        aria-label={userName ? t("welcome_user", { name: userName }) : t("profile.account")}
        className="group inline-flex items-center h-10 px-[var(--spacing-3)] rounded-[var(--radius-xl)] bg-[var(--color-surface-secondary)] border border-[var(--color-border)] gap-[var(--spacing-2)] transition-all duration-[var(--duration-fast)] ease-[var(--ease-default)] hover:border-[var(--color-border-hover)] hover:shadow-[var(--shadow-xs)] focus:outline-none"
      >
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt={userName || "User Avatar"}
            className="h-7 w-7 rounded-[var(--radius-full)] object-cover border border-[var(--color-border)]"
          />
        ) : (
          <div
            className="flex items-center justify-center h-7 w-7 rounded-[var(--radius-full)] bg-[var(--color-primary)] text-[var(--color-text-inverse)] text-[var(--text-xs)] font-[var(--font-semibold)] shadow-xs"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            {userInitial}
          </div>
        )}

        <span 
          className="hidden xl:block truncate max-w-[120px] text-[var(--text-sm)] font-[var(--font-medium)] text-[var(--color-text-primary)]"
          style={{
            fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)",
          }}
        >
          {userName}
        </span>

        <ChevronDown 
          size={14} 
          className={`text-[var(--color-text-muted)] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} 
        />
      </button>

      {/* Styled Dropdown Menu */}
      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        triggerRef={containerRef}
        className="flex flex-col w-[260px] p-[var(--spacing-2)] bg-[var(--color-background)] border border-[var(--color-border)] rounded-[var(--radius-2xl)] shadow-[var(--shadow-xl)] z-[var(--z-dropdown)] backdrop-blur-xl"
      >
        {/* Dropdown Header */}
        <div 
          className="px-[var(--spacing-3)] py-[var(--spacing-3)] border-b border-[var(--color-border)] mb-[var(--spacing-1)]"
          style={{
            fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)",
          }}
        >
          <p className="text-[var(--text-xs)] text-[var(--color-text-muted)]">
            {t("signed_in_as")}
          </p>
          <p className="truncate text-[var(--text-sm)] font-[var(--font-semibold)] text-[var(--color-text-primary)] mt-0.5">
            {userName}
          </p>
        </div>

        <ul className="flex flex-col gap-[var(--spacing-1)]">
          <li>
            <DropdownItem
              onClick={() => {
                closeDropdown();
                navigate(ROUTES.PROFILE);
              }}
              className="flex items-center w-full gap-[var(--spacing-3)] p-[var(--spacing-2.5)] rounded-[var(--radius-lg)] text-[var(--text-sm)] text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-secondary)] hover:text-[var(--color-text-primary)] cursor-pointer group"
              style={{
                fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)",
              }}
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary)]/10 text-[var(--color-primary)] transition-transform group-hover:scale-110">
                <User size={16} />
              </div>
              <span className="font-[var(--font-medium)]">{t("navigation.profile")}</span>
            </DropdownItem>
          </li>

          <li>
            <DropdownItem
              onClick={() => {
                closeDropdown();
                navigate(ROUTES.SETTINGS || "/settings");
              }}
              className="flex items-center w-full gap-[var(--spacing-3)] p-[var(--spacing-2.5)] rounded-[var(--radius-lg)] text-[var(--text-sm)] text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-secondary)] hover:text-[var(--color-text-primary)] cursor-pointer group"
              style={{
                fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)",
              }}
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-surface-secondary)] text-[var(--color-text-muted)] border border-[var(--color-border)] transition-transform group-hover:scale-110">
                <Settings size={16} />
              </div>
              <span className="font-[var(--font-medium)]">{t("profile.settings")}</span>
            </DropdownItem>
          </li>

          <div className="my-[var(--spacing-1)] border-t border-[var(--color-border)]" />

          <li>
            <DropdownItem
              onClick={() => {
                closeDropdown();
                if (logout) logout();
              }}
              className="flex items-center w-full gap-[var(--spacing-3)] p-[var(--spacing-2.5)] rounded-[var(--radius-lg)] text-[var(--text-sm)] text-red-600 dark:text-red-400 transition-colors hover:bg-red-500/10 cursor-pointer group"
              style={{
                fontFamily: lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)",
              }}
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-[var(--radius-md)] bg-red-500/10 text-red-600 dark:text-red-400 transition-transform group-hover:scale-110">
                <LogOut size={16} />
              </div>
              <span className="font-[var(--font-semibold)]">{t("auth.logout")}</span>
            </DropdownItem>
          </li>
        </ul>
      </Dropdown>
    </div>
  );
}