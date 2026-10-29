import AuthLayout from "@/app/layouts/AuthLayout";
import LoginPage from "@/pages/Auth/LoginPage";
import RegisterPage from "@/pages/Auth/RegisterPage";
import ForgotPasswordPage from "@/pages/Auth/ForgotPasswordPage";

export const authRoutes = {
  path: "/auth",
  element: <AuthLayout />,
  children: [
    { path: "login", element: <LoginPage /> },
    { path: "register", element: <RegisterPage /> },
    { path: "forgot-password", element: <ForgotPasswordPage /> },
    // { path: "reset-password/:token", element: <ResetPasswordPage /> },
  ],
};