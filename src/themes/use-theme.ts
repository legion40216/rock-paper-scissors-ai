import { useCallback, useEffect, useState } from "react";

import { DEFAULT_THEME, STORAGE_KEY, THEMES, isThemeId, type ThemeId } from "./registry";

/**
 * The <html data-theme> attribute is the source of truth: index.html sets it
 * (and an inline script restores the saved choice) before React runs, so the
 * first render already matches what is on screen.
 */
function readTheme(): ThemeId {
  const current = document.documentElement.dataset.theme;
  return isThemeId(current) ? current : DEFAULT_THEME;
}

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeId>(readTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;

    const entry = THEMES.find((t) => t.id === theme);
    if (entry) {
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute("content", entry.color);
    }
  }, [theme]);

  const setTheme = useCallback((id: ThemeId) => {
    setThemeState(id);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      // Storage can be blocked (private windows). The theme still changes for this visit.
    }
  }, []);

  return { theme, setTheme };
}
