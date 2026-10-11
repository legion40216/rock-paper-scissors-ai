# Themes

A theme is a set of CSS variable values. Components never contain theme values;
they read variables, so a theme can be added, swapped or deleted without touching
component code. The app ships three and lets the player switch between them.

```
default.css          stock shadcn/ui + a default for every knob. Always loaded.
frontend-mentor.css  the look from the Frontend Mentor challenge (navy, white pills). Overrides only.
holiday.css          warm and chunky (cream page, green action, black outlines, hard shadow). Overrides only.
registry.ts          the list of themes the switcher offers, the storage key and the first-visit default
use-theme.ts         the hook behind the switcher: applies, saves and restores the choice
```

## How switching works

`<html data-theme="...">` selects a theme. The choice is saved in `localStorage`
(`rps-theme`) and an inline script in `index.html` restores it before first paint,
so there is no flash of the wrong theme. A missing or unknown value falls back to
`DEFAULT_THEME`. The switcher (`components/layout/theme-switcher.tsx`) is the only
UI that calls `setTheme`; remove it from `game.tsx` to ship a single fixed theme.

```html
<html data-theme="frontend-mentor">  <!-- navy challenge look -->
<html data-theme="holiday">          <!-- cream / green -->
<html data-theme="default">          <!-- stock shadcn (no theme file matches) -->
```

## What a theme can change

| Kind | Variables | Notes |
|---|---|---|
| Colours | `--background --foreground --card --primary --secondary --muted --accent --destructive --border --input --ring` (+ `-foreground` pairs) | Standard shadcn. Presets from tweakcn / shadcnblocks only set these. |
| Radius, font | `--radius`, `--font-sans` | `--font-sans` is a runtime variable, so a theme can swap it. |
| Button shape | `--btn-radius --btn-h --btn-px --btn-text --btn-weight --btn-case --btn-tracking --btn-border` | Our knobs, read by `ui/button.tsx`. |
| Button extras | `--btn-shadow` (outline buttons), `--pill-border`, `--pill-hover-fg` (the `pill` variant) | Stock defaults give plain shadcn behaviour. |
| Page / assets | `--page-bg`, `--logo-filter` | Page background and logo treatment. |

Not themeable on purpose: the move colours (`--color-rock` etc. in `index.css`).
Rock is always red, so a theme can't change what a token means.

## Adding a theme

1. Copy `holiday.css` to `<name>.css` and change the selector to `:root[data-theme="<name>"]`.
2. Override only what differs. Anything omitted falls back to `default.css`.
3. `@import "./themes/<name>.css";` in `index.css`.
4. Add `{ id, label, color }` to `THEMES` in `registry.ts` (`color` is the page background,
   used for the mobile address bar). The switcher shows it automatically.
5. If it loads a font, `@import` it inside the theme file so deleting the file removes the font
   too. The browser only downloads the font once the theme is actually used.

`themes.test.ts` fails if a theme file isn't registered or imported, isn't scoped to its
own attribute, or sets a variable `default.css` doesn't declare (a typo would otherwise do
nothing, silently).

## Using a downloaded preset (tweakcn, shadcnblocks, ...)

Presets write to `:root` and `.dark`, which would overwrite stock. Instead paste the
values into a new file and change the selector as in step 1. They won't define our
`--btn-*` knobs, which is fine: those fall back to `default.css`.

## Adding a knob

When a design needs a value no theme can currently change (say a button shadow):
1. Add the variable with its stock value to `default.css`.
2. Read it in the component: `shadow-(--btn-shadow)`.
3. Set it in the themes that differ.

Anything that changes a component's *structure* (an icon on the left, a different
layout) is not a knob. Make it a variant in the component (see `pill` in `button.tsx`).
