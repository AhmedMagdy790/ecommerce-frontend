import AuthLayout from "@/app/layouts/AuthLayout";
import LoginPage from "@/pages/Auth/LoginPage";

export const authRoutes = {
  path: "/auth",
  element: <AuthLayout />,
  children: [
    { path: "login", element: <LoginPage /> },
    // { path: "register", element: <RegisterPage /> },

          // {
          //   path:"register",
          //   element:<RegisterPage/>
          // },
    
    
          // {
          //   path:"forgot-password",
          //   element:<ForgotPasswordPage/>
          // },
    
    
          // {
          //   path:"reset-password/:token",
          //   element:<ResetPasswordPage/>
          // },
  ],
};