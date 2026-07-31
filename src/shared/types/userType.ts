export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  avatar: string;
  role: 'admin' | 'user';
  joined_at: string;
  password?: string;
  created_at: string;
  updated_at: string;
}



/**
 * تمثيل دور المستخدم في النظام (Role-Based Access Control)
 */
export type UserRole = "admin" | "customer" | "vendor";

/**
 * حالة حساب المستخدم
 */
export type UserStatus = "active" | "suspended" | "pending_verification";

/**
 * هيكل بيانات العنوان (مفيد لعناوين التوصيل في متجر التجارة الإلكترونية)
 */
export interface Address {
  id: string | number;
  title?: string; // مثل: المنزل، العمل
  country: string;
  city: string;
  street: string;
  postalCode?: string;
  isDefault: boolean;
}

/**
 * الهيكل الأساسي لبيانات البروفايل (UserProfile Contract)
 */
export interface UserProfile {
  id: string | number;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  role: UserRole;
  status: UserStatus;
  emailVerifiedAt?: string | null;
  phoneVerifiedAt?: string | null;
  
  // بيانات إضافية قد يحتاجها نظام التجارة الإلكترونية
  addresses?: Address[];
  preferences?: {
    language: "ar" | "en";
    theme: "light" | "dark" | "system";
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };

  createdAt: string;
  updatedAt: string;
}