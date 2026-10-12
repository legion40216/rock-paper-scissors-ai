/**
 * The list of themes the app offers. Adding a theme = a CSS file in this folder,
 * an `@import` in index.css, and one entry here (see README.md).
 *
 * `color` is the page background, used for the mobile browser's address bar.
 */
export const THEMES = [
  { id: "default", label: "Default", color: "#ffffff" },
  { id: "frontend-mentor", label: "Frontend Mentor", color: "#141539" },
  { id: "holiday", label: "Holiday", color: "#f5e8dc" },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];

/**
 * Used when nothing valid is set. Keep it equal to the `data-theme` written on
 * <html> in index.html, which is what first-time visitors actually get.
 */
export const DEFAULT_THEME: ThemeId = "frontend-mentor";

/** Also read by the inline script in index.html, which applies the saved theme before first paint. */
export const STORAGE_KEY = "rps-theme";

export const isThemeId = (value: unknown): value is ThemeId =>
  THEMES.some((theme) => theme.id === value);
