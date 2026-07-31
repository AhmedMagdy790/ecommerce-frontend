import { useTheme } from "@/app/providers/ThemeContext";
import { wait } from "@/shared/utils/helper";
import { MoonIcon, SunIcon } from "lucide-react";
import { useEffect } from "react";

export const ThemeToggleButton: React.FC =  () => {
  const { theme, toggleTheme } = useTheme();



  return (
  <button
    onClick={toggleTheme}
    aria-label="Toggle theme"
    title="Toggle theme"
    className="
      flex items-center justify-center
      size-11
      text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]
      bg-[var(--color-background)] hover:bg-[var(--color-surface-secondary)]
      rounded-xl
      border border-[var(--color-border)] hover:border-[var(--color-border-hover)]
      transition-all duration-200
      active:scale-95
    "
  >
     {theme === "dark" ? <SunIcon /> : <MoonIcon />}

      
    </button>
  );
};
