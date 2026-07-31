import { useState, useRef } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { Link } from "react-router";
import { BellOff } from "lucide-react";
import NotificationList from "@/features/notification/components/NotificationList";
import { useNotifications } from "@/features/notification/hook/useNotifications";

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  return (
    <div
      ref={containerRef}
      className="
        relative
      "
    >
      <button
        onClick={toggleDropdown}
        aria-label="Toggle notifications"
        className="
          flex relative items-center justify-center
          size-11
          text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]
          bg-[var(--color-background)] hover:bg-[var(--color-surface-secondary)]
          rounded-xl
          border border-[var(--color-border)] hover:border-[var(--color-border-hover)]
          transition-all duration-200
          active:scale-95
        "
      >
        {unreadCount > 0 && (
          <span
            className="
              absolute top-2 right-2
              h-2.5 w-2.5
              bg-[var(--color-error)]
              rounded-full ring-2 ring-[var(--color-background)]
            "
          >
            <span
              className="
                absolute inset-0
                bg-[var(--color-error)]
                rounded-full
                animate-ping opacity-70
              "
            />
          </span>
        )}
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
          className="
            fill-current
          "
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.75 2.29248C10.75 1.87827 10.4143 1.54248 10 1.54248C9.58583 1.54248 9.25004 1.87827 9.25004 2.29248V2.83613C6.08266 3.20733 3.62504 5.9004 3.62504 9.16748V14.4591H3.33337C2.91916 14.4591 2.58337 14.7949 2.58337 15.2091C2.58337 15.6234 2.91916 15.9591 3.33337 15.9591H4.37504H15.625H16.6667C17.0809 15.9591 17.4167 15.6234 17.4167 15.2091C17.4167 14.7949 17.0809 14.4591 16.6667 14.4591H16.375V9.16748C16.375 5.9004 13.9174 3.20733 10.75 2.83613V2.29248ZM14.875 14.4591V9.16748C14.875 6.47509 12.6924 4.29248 10 4.29248C7.30765 4.29248 5.12504 6.47509 5.12504 9.16748V14.4591H14.875ZM8.00004 17.7085C8.00004 18.1228 8.33583 18.4585 8.75004 18.4585H11.25C11.6643 18.4585 12 18.1228 12 17.7085C12 17.2943 11.6643 16.9585 11.25 16.9585H8.75004C8.33583 16.9585 8.00004 17.2943 8.00004 17.7085Z"
            fill="currentColor"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        triggerRef={containerRef}
        className="
          flex flex-col
          max-h-[70vh] max-w-[350px] w-[calc(100vw-2rem)] sm:w-[361px]
          p-3
        "
      >
        <div
          className="
            flex items-center justify-between
            pb-4
            border-b border-[var(--color-border)]
          "
        >
          <div>
            <h3
              className="
                text-base text-[var(--color-text-primary)] font-semibold
              "
            >
              الإشعارات
            </h3>

            <p
              className="
                mt-0.5
                text-sm text-[var(--color-text-muted)]
              "
            >
              لديك {unreadCount} إشعارات غير مقروءة
            </p>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="
                  text-xs text-[var(--color-primary)] hover:underline font-medium
                "
              >
                تحديد الكل مقروء
              </button>
            )}

            <button
              onClick={closeDropdown}
              className="
                p-2
                text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]
                hover:bg-[var(--color-surface-secondary)]
                rounded-lg
              "
            >
              ✕
            </button>
          </div>
        </div>

        {notifications.length > 0 ? (
          <NotificationList
            notifications={notifications}
            onRead={markAsRead}
          />
        ) : (
          <div
            className="
              flex flex-col items-center justify-center
              py-12
              text-center
            "
          >
            <BellOff className="text-[var(--color-text-muted)] size-8" />

            <h4
              className="
                mt-3
                font-medium text-[var(--color-text-primary)]
              "
            >
              لا توجد إشعارات
            </h4>

            <p
              className="
                mt-1
                text-sm text-[var(--color-text-muted)]
              "
            >
              أنت على اطلاع بكل جديد.
            </p>
          </div>
        )}

        <Link
          to="/"
          onClick={closeDropdown}
          className="
            w-full
            mt-3 px-5 py-2.5
            text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]
            font-medium text-center
            bg-[var(--color-background)] hover:bg-[var(--color-surface-secondary)]
            rounded-xl border border-[var(--color-border)]
            transition-colors block
          "
        >
          عرض كل الإشعارات
        </Link>
      </Dropdown>
    </div>
  );
}