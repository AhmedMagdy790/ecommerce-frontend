import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/hooks/useTheme";

export default function ThemeSwitcher() {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="
        inline-flex
        h-10
        w-10
        items-center
        justify-center
        rounded-lg
        text-text-primary
        transition-colors
        hover:bg-surface
        focus:outline-none
        focus:ring-2
        focus:ring-primary
      "
    >
      {resolvedTheme === "dark" ? (
        <Sun size={20} />
      ) : (
        <Moon size={20} />
      )}
    </button>
  );
}