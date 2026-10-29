import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/features/auth/model/store/useAuthStore";
import { isAdmin } from "@/features/auth/utils/authHelpers";
import FullScreenLoader from "@/shared/components/ui/loding/FullScreenLoader";

export const AdminGuard = () => {
    const user = useAuthStore((state) => state.user);
    const isInitialized = useAuthStore((state) => state.isInitialized);
    const location = useLocation();

    if (!isInitialized) {
        return <FullScreenLoader />;
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

    if (!isAdmin(user)) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};