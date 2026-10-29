import type { ReactNode } from "react";

export interface AuthFormHeaderProps {
  title: ReactNode;
  subtitle: ReactNode;
  eyebrow?: ReactNode;
  align?: "start" | "center";
}

export const AuthFormHeader = ({
  title,
  subtitle,
  eyebrow,
  align = "start",
}: AuthFormHeaderProps) => {
  return (
    <header
      className={[
        "mb-8",
        align === "center" ? "text-center" : "text-start",
      ].join(" ")}
    >
      {eyebrow && (
        <div className="mb-4">
          <span className="inline-flex rounded-full bg-primary-soft px-3 py-1.5 text-xs font-semibold text-primary">
            {eyebrow}
          </span>
        </div>
      )}

      <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
        {title}
      </h1>

      <p className="mt-3 text-sm leading-7 text-text-secondary">
        {subtitle}
      </p>
    </header>
  );
};