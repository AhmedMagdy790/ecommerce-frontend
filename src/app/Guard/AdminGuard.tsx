// src/components/AdminGuard.tsx

import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/features/auth/model/store/useAuthStore";
import { isAdmin } from "@/features/auth/utils/authHelpers";

export const AdminGuard = () => {
  const user = useAuthStore((state) => state.user);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const location = useLocation();


  if (!isInitialized) {
    return null;
  }

  if (!user) {
    return (
      <Navigate
        to="/auth/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // 🟢 استخدام دالة الـ Helper بوضوح واحترافية
  if (!isAdmin(user)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};