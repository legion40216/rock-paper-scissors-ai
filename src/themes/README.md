# Themes

A theme is a set of CSS variable values. Components never contain theme values;
they read variables, so a theme can be added, swapped or deleted without touching
component code.

```
default.css   stock shadcn/ui + a default for every knob. Always loaded.
holiday.css   the warm, chunky brand look. Overrides only.
```

## Switching

```html
<html data-theme="holiday">   <!-- holiday -->
<html>                        <!-- stock shadcn -->
<html class="dark">           <!-- stock shadcn, dark palette -->
```

## What a theme can change

| Kind | Variables | Notes |
|---|---|---|
| Colours | `--background --foreground --card --primary --secondary --muted --accent --destructive --border --input --ring` (+ `-foreground` pairs) | Standard shadcn. Presets from tweakcn / shadcnblocks only set these. |
| Radius, font | `--radius`, `--font-sans` | `--font-sans` is a runtime variable, so a theme can swap it. |
| Button shape | `--btn-radius --btn-h --btn-px --btn-text --btn-weight --btn-case --btn-tracking --btn-border` | Our knobs, read by `ui/button.tsx`. |
| Page / assets | `--page-bg`, `--logo-filter` | Page background and logo treatment. |

Not themeable on purpose: the move colours (`--color-rock` etc. in `index.css`).
Rock is always red, so a theme can't change what a token means.

## Adding a theme

1. Copy `holiday.css` to `<name>.css` and change the selector to `:root[data-theme="<name>"]`.
2. Override only what differs. Anything omitted falls back to `default.css`.
3. `@import "./themes/<name>.css";` in `index.css`, then set `data-theme="<name>"`.
4. If it loads a font, `@import` it inside the theme file so deleting the file removes the font too.

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
