"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { Theme } from "@/types";

const STORAGE_KEY = "finance-theme";
const THEME_EVENT = "finance-theme-change";

const applyTheme = (theme: Theme) => {
  const root = document.documentElement;

  root.classList.toggle("light", theme === "light");
  root.style.colorScheme = theme;
};

const getSnapshot = (): Theme =>
  (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? "dark";

const getServerSnapshot = (): Theme => "dark";

const subscribe = (callback: () => void) => {
  window.addEventListener(THEME_EVENT, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(THEME_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
};

const useTheme = () => {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setTheme = useCallback((next: Theme) => {
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
    // Notify every mounted instance (and this one) to re-read the snapshot.
    window.dispatchEvent(new Event(THEME_EVENT));
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(getSnapshot() === "dark" ? "light" : "dark");
  }, [setTheme]);

  return { theme, setTheme, toggleTheme };
};

export { useTheme };
