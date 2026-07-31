import { DropdownItem } from "@/shared/components/dashboard/ui/dropdown/DropdownItem";
import type { NotificationType } from "../types";



interface NotificationItemProps {
  notification: NotificationType;
  onRead?: (id: string | number) => void;
}

export default function NotificationItem({ notification, onRead }: NotificationItemProps) {
  const handleClick = () => {
    if (onRead && !notification.isRead) {
      onRead(notification.id);
    }
  };

  return (
    <li>
      <DropdownItem
        onClick={handleClick}
        className={`
          flex p-3 rounded-xl transition-colors gap-3
          hover:bg-[var(--color-surface-secondary)]
          ${!notification.isRead ? 'bg-[var(--color-surface-secondary)]/50' : ''}
        `}
      >
        <div
          className="
            flex items-center justify-center
            h-10 w-10
            text-[var(--color-primary)]
            bg-[var(--color-primary)]/10
            rounded-full
            shrink-0
          "
        >
          🔔
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm text-[var(--color-text-primary)]">
            {notification.senderName && (
              <span className="font-semibold">{notification.senderName} </span>
            )}
            {notification.message}
          </p>

          <p className="mt-1 text-xs text-[var(--color-text-muted)]">
            {notification.time}
          </p>
        </div>

        {!notification.isRead && (
          <span className="self-center h-2 w-2 rounded-full bg-[var(--color-primary)] shrink-0" />
        )}
      </DropdownItem>
    </li>
  );
}