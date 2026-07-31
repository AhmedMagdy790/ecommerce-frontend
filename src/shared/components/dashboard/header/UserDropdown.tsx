import { useState, useRef, useCallback } from "react";
import React from "react";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { useLang } from "@/shared/context/LanguageContext";
import { useAuthStore } from "@/store/authStore";
import { Button } from "../../Button";

function UserDropdownComponent() {
  const { user, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useLang();

  const toggleDropdown = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    closeDropdown();
  }, [logout, closeDropdown]);

  // كلاس موحد لعناصر القائمة لتقليل التكرار وتسهيل القراءة (DRY Principle)
  const menuItemClass = `
    flex items-center gap-3 px-2.5 py-2 w-full rounded-md
    text-sm font-medium transition-colors duration-200
    text-[var(--color-text-secondary)]
    hover:bg-[var(--color-surface-secondary)] hover:text-[var(--color-text-primary)]
    focus:bg-[var(--color-surface-secondary)] focus:text-[var(--color-text-primary)] focus:outline-none
  `;

  return (
    <div
      ref={containerRef}
      className="
        relative
        max-w-[300px]
        text-[var(--color-text-primary)]
      "
    >
      {/* Trigger Button */}
      <button
        onClick={toggleDropdown}
        className="
          flex items-center
          p-1 pr-2 lg:pr-3
          hover:bg-[var(--color-surface-secondary)]
          rounded-full focus:outline-none
          focus:ring-2 focus:ring-[var(--color-border)] focus:ring-offset-1 focus:ring-offset-[var(--color-background)]
          transition-colors duration-200
          gap-2
        "
        aria-expanded={isOpen}
      >
        <span
          className="
            relative flex overflow-hidden
            h-9 w-9
            rounded-full border border-[var(--color-border)]
            shrink-0
          "
        >
          <img
            src={user?.avatar}
            alt={user?.name}
            className="
              object-cover
              h-full w-full
              aspect-square
            "
          />
        </span>

        <span
          className="
            hidden lg:block
            min-w-0
            text-sm text-[var(--color-text-primary)] font-medium
          "
        >
          {user?.name}
        </span>

        <svg
          className={`hidden lg:block shrink-0 text-[var(--color-text-muted)] transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          width="16"
          height="16"
          viewBox="0 0 18 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Dropdown Card */}
      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        triggerRef={containerRef}
        className="
          flex flex-col
          w-[260px]
          p-1.5
          bg-[var(--color-background)]
          rounded-xl border border-[var(--color-border)]
          shadow-lg shadow-black/5 dark:shadow-black/20
        "
      >
        {/* User Profile Header */}
        <div
          className="
            flex items-center
            px-2 py-2.5 mb-1
            border-b border-[var(--color-border)]
            gap-3
          "
        >
          <span
            className="
              relative flex overflow-hidden
              h-10 w-10
              rounded-full border border-[var(--color-border)]
              shrink-0
            "
          >
            <img
              src={user?.avatar}
              alt={user?.name}
              className="
                object-cover
                h-full w-full
                aspect-square
              "
            />
          </span>

          <div
            className="
              flex flex-col
              min-w-0
            "
          >
            <span
              className="
                truncate text-sm text-[var(--color-text-primary)] font-medium
              "
            >
              {user?.name}
            </span>
            <span
              className="
                truncate text-xs text-[var(--color-text-muted)]
              "
            >
              {user?.email}
            </span>
          </div>
        </div>

        {/* Links List */}
        <ul
          className="
            flex flex-col
            py-1 mb-1
            border-b border-[var(--color-border)]
            gap-0.5
          "
        >
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              to="/dashboard/profile"
              className={menuItemClass}
            >
              {t("settings.title")}
            </DropdownItem>
          </li>
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              to="/dashboard/profile"
              className={menuItemClass}
            >
              {t("profile.title")}
            </DropdownItem>
          </li>
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              to="/dashboard/profile"
              className={menuItemClass}
            >
              {t("support.title")}
            </DropdownItem>
          </li>
        </ul>

        {/* Logout Action */}
        <div
          className="
            pt-0.5
          "
        >
          <Button
            onClick={handleLogout}
            className="
              flex items-center justify-start w-full gap-3 px-2.5 py-2
              rounded-md text-sm font-medium transition-colors duration-200
              text-[var(--color-error)] bg-transparent border-none shadow-none
              hover:bg-[var(--color-error)]/10 hover:text-[var(--color-error)]
              focus:bg-[var(--color-error)]/10 focus:text-[var(--color-error)] focus:outline-none
            "
          >
            {t("common.logout")}
          </Button>
        </div>
      </Dropdown>
    </div>
  );
}

export default React.memo(UserDropdownComponent);