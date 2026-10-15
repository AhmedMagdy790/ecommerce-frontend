// src/features/notification/services/notificationMapper.ts


interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  senderName?: string;
  link: string;
  time: string;
  isRead: boolean;
}

interface OrderEvent {
  order: {
    id: string;
    customer_name: string;
    status: string;
  };
}

export function mapOrderCreated(event: OrderEvent): Notification {
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

export function mapOrderCancelled(event: OrderEvent): Notification {
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

export function mapOrderUpdated(event: OrderEvent): Notification {
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