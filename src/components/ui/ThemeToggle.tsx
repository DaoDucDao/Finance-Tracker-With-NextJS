"use client";

import { useTheme } from "@/hooks/useTheme";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="relative flex h-8 w-14 items-center rounded-full border border-zinc-700 bg-zinc-800 px-1 transition-colors hover:border-zinc-600"
    >
      <span
        className={`flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br text-xs shadow transition-transform duration-300 ${
          isDark
            ? "translate-x-0 from-indigo-500 to-purple-600"
            : "translate-x-6 from-amber-300 to-orange-400"
        }`}
      >
        {isDark ? "🌙" : "☀️"}
      </span>
    </button>
  );
}
