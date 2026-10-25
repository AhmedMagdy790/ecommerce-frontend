
import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  type ReactNode,
  useContext,
} from "react";

import {
  ThemeContext,
  type Theme,
} from "@/shared/types/ThemeContext";

interface ThemeProviderProps {
  children: ReactNode;
}

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "system";

  const savedTheme = localStorage.getItem("theme");

  if (
    savedTheme === "light" ||
    savedTheme === "dark" ||
    savedTheme === "system"
  ) {
    return savedTheme;
  }

  return "system";
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [systemTheme, setSystemTheme] =
    useState<"light" | "dark">(getSystemTheme);
  const [isChangingTheme, setIsChangingTheme] = useState(false);

  const resolvedTheme =
    theme === "system" ? systemTheme : theme;

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)",
    );

    const handleChange = (event: MediaQueryListEvent) => {
      setSystemTheme(event.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", resolvedTheme);
  }, [theme, resolvedTheme]);

  const toggleTheme = useCallback(() => {
    if (isChangingTheme) return;

    setIsChangingTheme(true);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTheme((current) =>
          (current === "system" ? systemTheme : current) === "dark"
            ? "light"
            : "dark",
        );

        window.setTimeout(() => {
          setIsChangingTheme(false);
        }, 200);
      });
    });
  }, [isChangingTheme, systemTheme]);

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      isChangingTheme,
      setTheme,
      toggleTheme,
    }),
    [theme, resolvedTheme, isChangingTheme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}
