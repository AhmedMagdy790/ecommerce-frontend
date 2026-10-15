import React from "react";

interface AuthLoaderProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

export const AuthLoader: React.FC<AuthLoaderProps> = ({
  message = "جاري تحميل بيانات المستخدم...",
  size = "md",
}) => {
  const sizeClasses = {
    sm: "h-5 w-5 border-2",
    md: "h-8 w-8 border-4",
    lg: "h-12 w-12 border-4",
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-background)]">
      <div className="flex flex-col items-center gap-[var(--spacing-4)]">
        <div
          className={`animate-spin rounded-full border-[var(--color-primary)] border-t-transparent ${sizeClasses[size]}`}
        />

        {message && (
          <span className="text-[var(--text-sm)] text-[var(--color-text-secondary)] font-medium animate-pulse">
            {message}
          </span>
        )}
      </div>
    </div>
  );
};

export default AuthLoader;