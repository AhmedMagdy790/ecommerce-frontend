import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { User, Settings, LogOut, UserRound, LayoutDashboard } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/constants/navigation";
import { useLang } from "@/shared/context/LanguageContext";
import { Dropdown } from "@/shared/components/dashboard/ui/dropdown/Dropdown";
import { DropdownItem } from "@/shared/components/dashboard/ui/dropdown/DropdownItem";
import { useAuthPermissions } from "@/features/auth/hooks/useAuthPermissions";

export default function ProfileButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [failedAvatar, setFailedAvatar] = useState<string | null>(null);

  const { canAccessDashboard } = useAuthPermissions();

  const buttonRef = useRef<HTMLButtonElement>(null);

  const { user, isAuthenticated, logout } = useAuth();
  const { t } = useTranslation("common");
  const { lang, isRTL } = useLang();
  const navigate = useNavigate();

  const userName = typeof user?.name === "string" ? user.name : "";
  const avatar = user?.avatar;
  const avatarError = Boolean(avatar && failedAvatar === avatar);

  const fontFamily =
    lang === "ar" ? "var(--font-arabic)" : "var(--font-sans)";


  const closeDropdown = () => {
    setIsOpen(false);
  };

  const handleLogout = async () => {
    closeDropdown();

    try {
      await logout();
      navigate(ROUTES.LOGIN, { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (!isAuthenticated) {
    return (
      <Link
        to={ROUTES.LOGIN}
        dir={isRTL ? "rtl" : "ltr"}
        aria-label={t("auth.login")}
        className={[
          "inline-flex h-10 shrink-0 items-center justify-center",
          "rounded-control bg-primary px-5",
          "text-sm font-semibold text-text-inverse",
          "shadow-sm transition-colors",
          "hover:bg-primary-hover",
          "focus-visible:outline-2 focus-visible:outline-offset-2",
          "focus-visible:outline-primary",
          "active:bg-primary-active",
        ].join(" ")}
        style={{ fontFamily }}
      >
        {t("auth.login")}
      </Link>
    );
  }

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="relative flex h-full shrink-0 items-center"
    >
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen((previous) => !previous)}
        aria-label={
          userName
            ? t("welcome_user", { name: userName })
            : t("profile.account", "Account")
        }
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className={[
          "inline-flex size-10 shrink-0 items-center justify-center",
          "rounded-full border border-border",
          "bg-surface text-text-primary shadow-sm",
          "transition-colors duration-200",
          "hover:border-primary hover:bg-surface-hover",
          "focus-visible:outline-2 focus-visible:outline-offset-2",
          "focus-visible:outline-primary",
          "active:scale-95",
          isOpen ? "border-primary bg-surface-hover" : "",
        ].join(" ")}
      >
        {avatar && !avatarError ? (
          <img
            src={avatar}
            alt=""
            onError={() => setFailedAvatar(avatar)}
            className="size-7 shrink-0 rounded-full border border-border object-cover"
          />
        ) : (
          <span
            aria-hidden="true"
            className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-primary-hover text-text-inverse"
          >
            <UserRound size={18} aria-hidden="true" />
          </span>
        )}
      </button>

      <Dropdown
        isOpen={isOpen}
        marginBelow={18}
        onClose={closeDropdown}
        triggerRef={buttonRef}
        className="w-[260px] rounded-panel p-2"
      >
        <div className="mb-1 border-b border-border px-3 py-3">
          <p className="text-xs text-text-muted">
            {t("signed_in_as", "Signed in as")}
          </p>

          <p className="mt-0.5 truncate text-sm font-semibold text-text-primary">
            {userName || user?.email}
          </p>
        </div>

        <ul className="flex flex-col gap-1">
          <li>
            <DropdownItem
              onClick={() => {
                closeDropdown();
                navigate(ROUTES.SETTINGS);
              }}
            >
              <span
                aria-hidden="true"
                className="flex size-7 items-center justify-center rounded-control bg-primary/10 text-primary"
              >
                <User size={16} />
              </span>

              <span className="font-medium">
                {t("navigation.profile", "Profile")}
              </span>
            </DropdownItem>
          </li>

          {canAccessDashboard &&
            <li>
              <DropdownItem
                onClick={() => {
                  closeDropdown();
                  navigate(ROUTES.DASHBOARD);
                }}
              >
                <span
                  aria-hidden="true"
                  className="flex size-7 items-center justify-center rounded-control bg-primary/10 text-secondry"
                >
                  <LayoutDashboard size={16} />
                </span>

                <span className="font-medium">
                  {t("navigation.dashboard", "Dashboard")}
                </span>
              </DropdownItem>
            </li>
          }

          <li>
            <DropdownItem
              onClick={() => {
                closeDropdown();
                navigate(ROUTES.SETTINGS || "/settings");
              }}
            >
              <span
                aria-hidden="true"
                className="flex size-7 items-center justify-center rounded-control border border-border bg-surface-secondary text-text-muted"
              >
                <Settings size={16} />
              </span>

              <span className="font-medium">
                {t("profile.settings", "Settings")}
              </span>
            </DropdownItem>
          </li>

          <li
            aria-hidden="true"
            className="my-1 border-t border-border"
          />

          <li>
            <DropdownItem
              onClick={() => void handleLogout()}
              className="text-error hover:bg-error-bg"
            >
              <span
                aria-hidden="true"
                className="flex size-7 items-center justify-center rounded-control bg-error-bg/80 text-error/90"
              >
                <LogOut size={16} />
              </span>

              <span className="font-semibold">
                {t("auth.logout", "Logout")}
              </span>
            </DropdownItem>
          </li>
        </ul>
      </Dropdown>
    </div>
  );
}