// NotificationProvider.tsx
import type { NotificationType } from "@/features/notification/types";
import {
  createContext,
  useEffect,
  useState,
  useContext,
  type ReactNode,
} from "react";

interface NotificationContextType {
  notifications: NotificationType[];
  unreadCount: number;
  markAsRead: (id: string | number) => void;
  markAllAsRead: () => void;
}

export const NotificationContext = createContext<NotificationContextType | null>(null);

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  useEffect(() => {
    // @ts-ignore
    if (typeof Echo !== "undefined") {
      // @ts-ignore
      Echo.private("admin.orders").listen(".order.created", (e: any) => {
        const order = e;
        const displayId = order?.order_number || order?.id;

        const newNotification: NotificationType = {
          id: order.id,
          title: `طلب جديد #${displayId}`,
          message: `تم إنشاء طلب جديد برقم #${displayId}`,
          time: "الآن",
          isRead: false,
          type: "order",
        };

        setNotifications((prev) => [newNotification, ...prev]);
      });
    }
  }, []);

  const markAsRead = (id: string | number) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, isRead: true }))
    );
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}