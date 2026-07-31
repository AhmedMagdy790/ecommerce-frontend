import type { NotificationItem } from "../types";
import NotificationItemComponent from "./NotificationItem";


interface NotificationListProps {
  notifications: NotificationItem[];
  onRead?: (id: string | number) => void;
}

export default function NotificationList({ notifications, onRead }: NotificationListProps) {
  if (notifications.length === 0) {
    return null;
  }

  return (
    <ul
      className="
        flex-1 overflow-y-auto
        space-y-1 py-1 pr-1
        custom-scrollbar
      "
    >
      {notifications.map((notification) => (
        <NotificationItemComponent
          key={notification.id}
          notification={notification}
          onRead={onRead}
        />
      ))}
    </ul>
  );
}