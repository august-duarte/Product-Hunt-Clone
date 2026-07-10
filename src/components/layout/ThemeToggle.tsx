"use client";

import { useTheme } from "@/hooks/theme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-gray-300 bg-white text-base text-gray-900 hover:bg-gray-50"
    >
      {isDark ? "☀" : "☾"}
    </button>
  );
}
