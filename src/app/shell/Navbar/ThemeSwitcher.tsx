import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useLang } from "@/shared/context/LanguageContext";

export default function ThemeSwitcher() {
  const { resolvedTheme, toggleTheme } = useTheme();
  const { lang } = useLang();

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      title={
        isDark
          ? lang === "ar"
            ? "التحويل إلى الوضع الفاتح"
            : "Switch to light mode"
          : lang === "ar"
          ? "التحويل إلى الوضع الداكن"
          : "Switch to dark mode"
      }
      className="inline-flex items-center justify-center transition-all duration-fast hover:scale-105 active:scale-95 group"
      style={{
        height: "40px",
        width: "40px",
        borderRadius: "var(--radius-lg)",
        backgroundColor: "var(--color-surface-secondary)",
        border: "1px solid var(--color-border)",
        color: "var(--color-text-primary)",
      }}
    >
      {isDark ? (
        <Sun 
          size={18} 
          strokeWidth={2.2} 
          className="transition-transform duration-normal group-hover:rotate-45" 
          style={{ color: "var(--amber-500)" }} 
        />
      ) : (
        <Moon 
          size={18} 
          strokeWidth={2.2} 
          className="transition-transform duration-normal group-hover:-rotate-12" 
          style={{ color: "var(--color-primary)" }} 
        />
      )}
    </button>
  );
}