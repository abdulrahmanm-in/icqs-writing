"use client";

import { createContext, useContext, useRef, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);
  const themeRef = useRef<Theme>("light");

  useEffect(() => {
    const getInitialTheme = (): Theme => {
      const stored = localStorage.getItem("theme") as Theme | null;
      if (stored) {
        return stored;
      }
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      return prefersDark ? "dark" : "light";
    };

    const initialTheme = getInitialTheme();
    themeRef.current = initialTheme;
    document.documentElement.className = initialTheme;
    
    // Use callback to batch updates
    Promise.resolve().then(() => {
      setThemeState(initialTheme);
      setMounted(true);
    });
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    themeRef.current = newTheme;
    document.documentElement.className = newTheme;
    localStorage.setItem("theme", newTheme);
  };

  // Prevent flash on initial load
  if (!mounted) {
    return <>{children}</>;
  }

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    // Return a default theme during SSR/build time
    return { theme: "light" as const, setTheme: () => {} };
  }
  return context;
}
