import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/model/store/useAuthStore";
import PageMeta from "@/shared/components/PageMeta";
import { RegisterForm } from "@/features/auth/components/RegisterForm";

export default function RegisterPage() {
    const navigate = useNavigate();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/admin", { replace: true });
        }
    }, [isAuthenticated, navigate]);

    return (
        <>
            <PageMeta title="Create Account" description="Register a new account" />
            <RegisterForm />
        </>
    );
}