// src/features/notification/services/notificationMapper.ts

import type { NotificationType as Notification } from "../../../types/types";

export function mapOrderCreated(event: any): Notification {
  return {
    id: crypto.randomUUID(),
    type: "order",
    title: "طلب جديد",
    message: `تم إنشاء الطلب #${event.order.id} بواسطة ${event.order.customer_name}`,
    senderName: event.order.customer_name,
    link: `/dashboard/orders/${event.order.id}`,
    time: "الآن",
    isRead: false,
  };
}

export function mapOrderCancelled(event: any): Notification {
  return {
    id: crypto.randomUUID(),
    type: "order",
    title: "تم إلغاء طلب",
    message: `تم إلغاء الطلب #${event.order.id}`,
    link: `/dashboard/orders/${event.order.id}`,
    time: "الآن",
    isRead: false,
  };
}

export function mapOrderUpdated(event: any): Notification {
  return {
    id: crypto.randomUUID(),
    type: "order",
    title: "تم تحديث الطلب",
    message: `تم تغيير حالة الطلب #${event.order.id} إلى ${event.order.status}`,
    link: `/dashboard/orders/${event.order.id}`,
    time: "الآن",
    isRead: false,
  };
}