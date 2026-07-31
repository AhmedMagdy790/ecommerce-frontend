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

export interface User {
  id: number | string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}