export interface NotificationItem {
  id: string | number;
  title?: string;
  message: string;
  senderName?: string;
  time: string;
  isRead: boolean;
  type?: 'order' | 'system' | 'user' | 'alert';
  link?: string;
}

export interface NotificationType {
  id: string | number;
  title?: string;
  message: string;
  senderName?: string;
  time: string;
  isRead: boolean;
  type?: 'order' | 'system' | 'user' | 'alert';
  link?: string;
}