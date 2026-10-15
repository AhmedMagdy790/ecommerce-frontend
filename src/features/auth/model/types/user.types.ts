// src/features/auth/model/types/user.types. أو مسار ملف الـ Types لديك

export interface Role {
  id: number;
  name: string;
  guard_name?: string;
  created_at?: string;
  updated_at?: string;
  pivot?: {
    model_type: string;
    model_id: number;
    role_id: number;
  };
}

export interface Permission {
  id: number;
  name: string;
  guard_name?: string;
}

export interface Address {
  id: number | string;
  country?: { id: number; name: string };
  city?: { id: number; name: string };
  // أضف بقية حقول العنوان حسب قاعدة البيانات
}

export interface User {
  id: number | string;
  name: string;
  email: string;
  phone: string | null;
  avatar?: string | null; // 🟢 أضف هذا السطر هنا
  roles?: Role[];
  permissions?: Permission[]; 
  addresses?: Address[];
  email_verified_at?: string | null;
  created_at?: string; 
  updated_at?: string; 
  [key: string]: unknown;
}

export interface UserFilters extends Record<string, unknown> {
  search: string;
  role?: string;
}