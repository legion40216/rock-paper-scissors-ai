import { THEMES } from "@/themes/registry";
import { useTheme } from "@/themes/use-theme";

/**
 * A segmented control built on native radio inputs: arrow-key navigation, a
 * single tab stop and screen-reader semantics come from the browser. It reads
 * only semantic tokens, so it looks right under every theme.
 */
export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className="mx-auto flex gap-1 rounded-lg border-2 border-border p-1"
    >
      {THEMES.map(({ id, label }) => (
        <label key={id} className="relative cursor-pointer">
          <input
            type="radio"
            name="theme"
            value={id}
            checked={theme === id}
            onChange={() => setTheme(id)}
            className="peer sr-only"
          />
          <span className="block rounded-md px-3 py-1.5 text-sm whitespace-nowrap text-foreground/80 transition-colors peer-checked:bg-primary peer-checked:text-primary-foreground peer-focus-visible:ring-[3px] peer-focus-visible:ring-ring motion-safe:hover:text-foreground peer-checked:motion-safe:hover:text-primary-foreground">
            {label}
          </span>
        </label>
      ))}
    </div>
  );
}
