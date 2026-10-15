import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/model/store/useAuthStore";
import PageMeta from "@/shared/components/PageMeta";
import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginPage() {
    const navigate = useNavigate();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/admin", { replace: true });
        }
    }, [isAuthenticated, navigate]);

    return (
        <>
            <PageMeta title="Login" description="Login to your account" />
            <LoginForm />
        </>
    );
}